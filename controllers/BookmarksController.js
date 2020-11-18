const Repository = require('../models/Repository');
const Bookmark = require('../models/bookmark');
const CollectionFilter = require('../models/collectionFilter');
const { decomposePath } = require('../utilities');

module.exports = 
class BookmarksController extends require('./Controller') {
    constructor(req, res){
        super(req, res, false /* needAuthorization */);
        this.bookmarksRepository = new Repository('Bookmarks', true /* cached */);
    }
    error(params, message){
        params["error"] = message;
        this.response.JSON(params);
        return false;
    }
    queryStringParamsList(){
        let content = "<div style=font-family:arial>";
        content += "<h4>List of parameters in query strings:</h4>";
        content += "<h4>? sort=key <br> return all bookmarks sorted by key values (Id, Name, Category, Url)";
        content += "<h4>? sort=key,desc <br> return all bookmarks sorted by descending key values";        
        content += "<h4>? key=value <br> return the bookmark with key value = value";
        content += "<h4>? key=value* <br> return the bookmark with key value that start with value";
        content += "<h4>? key=*value* <br> return the bookmark with key value that contains value";        
        content += "<h4>? key=*value <br> return the bookmark with key value end with value";
        content += "<h4>page?limit=int&offset=int <br> return limit bookmarks of page offset";
        content += "</div>";
        return content;
    }
    queryStringHelp() {
        // expose all the possible query strings
        this.res.writeHead(200, {'content-type':'text/html'});
        this.res.end(this.queryStringParamsList());
    }
  
    resolveUserName(bookmark){
        let users = new Repository('Users');
        let user = users.get(bookmark.UserId);
        let username = "unknown";
        if (user !== null)
            username = user.Name;
        let bookmarkWithUsername = {...bookmark};
        bookmarkWithUsername["Username"] = username;
        return bookmarkWithUsername;
    }

    resolveUserNames(bookmarks){
        let users = new Repository('Users');
        let bookmarksWithUsername = bookmarks.map(bookmark => ({...bookmark}));
        for(let bookmark of bookmarksWithUsername) {
            let user = users.get(bookmark.UserId);
            let username = "unknown";
            if (user !== null)
                username = user.Name;
            bookmark["Username"] = username;
        };
        return bookmarksWithUsername;
    }

    head() {
        console.log(this.bookmarksRepository.ETag);
        this.response.JSON(null, this.bookmarksRepository.ETag);
    }
    // GET: api/bookmarks
    // GET: api/bookmarks?sort=key&key=value....
    // GET: api/bookmarks/{id}
    get(id){
        let params = this.getQueryStringParams(); 
        // if we have no parameter, expose the list of possible query strings
        if (params === null) {
            if(!isNaN(id)) {
                this.response.JSON(this.resolveUserName(this.bookmarksRepository.get(id)));
            }
            else  
                this.response.JSON(this.resolveUserNames(this.bookmarksRepository.getAll()), this.bookmarksRepository.ETag);
        }
        else {
            if (Object.keys(params).length === 0) {
                this.queryStringHelp();
            } else {
                let collectionFilter= new CollectionFilter(this.resolveUserNames(this.bookmarksRepository.getAll()), params);
                this.response.JSON(collectionFilter.get(), this.bookmarksRepository.ETag);
            }
        }
    }
    // POST: api/bookmarks body payload[{"Id": ..., "Name": "...", "Url": "...", "Category": "...", "UserId": ...}]
    post(bookmark){  
        if (this.requestActionAuthorized()) {
            // validate bookmark before insertion
            if (Bookmark.valid(bookmark)) {
                // avoid duplicate names
                if (this.bookmarksRepository.findByField('Name', bookmark.Name) !== null){
                    this.response.conflict();
                } else {
                    let newBookmark = this.bookmarksRepository.add(bookmark);
                    if (newBookmark)
                        this.response.created(newBookmark);
                    else
                        this.response.internalError();
                }
            } else 
                this.response.unprocessable();
        } else 
            this.response.unAuthorized();
    }
    // PUT: api/bookmarks body payload[{"Id":..., "Name": "...", "Url": "...", "Category": "...", "UserId": ..}]
    put(bookmark){
        if (this.requestActionAuthorized()) {
            // validate bookmark before updating
            if (Bookmark.valid(bookmark)) {
                let foundBookmark = this.bookmarksRepository.findByField('Name', bookmark.Name);
                if (foundBookmark != null){
                    if (foundBookmark.Id != bookmark.Id) {
                        this.response.conflict();
                        return;
                    }
                }
                if (this.bookmarksRepository.update(bookmark))
                    this.response.ok();
                else 
                    this.response.notFound();
            } else 
                this.response.unprocessable();
        } else 
        this.response.unAuthorized();
    }
    // DELETE: api/bookmarks/{id}
    remove(id){
        if (this.requestActionAuthorized()) {
            if (this.bookmarksRepository.remove(id))
                this.response.accepted();
            else
                this.response.notFound();
            } else 
        this.response.unAuthorized();
    }
}