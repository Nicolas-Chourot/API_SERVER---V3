////This function return the endpoints list in html
exports.list = (res) => {
    function EnumerateEndpoints(controllerFile){
        let endpoints = "";
        // get the controller class       
        let Controller = require('./controllers/' + controllerFile);
        // make instance on controller class
        let controller = new Controller(null, null);
        // get all the owned properties of controller class prototype
        let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(controller));
        // get the model name
        let resourceName = controllerFile.replace('sController.js','').toLowerCase();
        // pluralize model name
        let resourceNamePluralized = resourceName + 's';
        let resclass = null;
        try {
            // make instance of model
            resclass = new require("./models/" + resourceName);
            endpoints += "<h3>Resource " + resourceName + ": ";
            // stringnify the model instance
            endpoints += JSON.stringify(new resclass()).replace(/""/g,'"..."').replace(/,/g,', ') + '</h3>';
        } catch (error) {
            // no model associated with controller
            // must be an endpoint working with query strings
        } 
        // if we have a get method, expose GET: /api/ModelsController and GET: /api/ModelsController/id endpoints
        if (methods.indexOf('get') > -1){
            endpoints += "<h4>GET : /api/" + resourceNamePluralized + "</h4>";
        } else {
            // this controller is not used for API services
            // to do : find a better way for Web API controller filtering
            return "";
        }
        // if we have a queryStringList method, expose list of params usage
        if (methods.indexOf('queryStringParamsList') > -1){
            try {
                 endpoints += controller["queryStringParamsList"]();
            } catch(error) { 
                // to do
                console.log(error);
            };
        }
        // if we have a post method, expose POST: /api/ModelsController endpoint
        if (methods.indexOf('post') > -1){
            endpoints += "<h4>POST : /api/" + resourceNamePluralized + "</h4>"; 
        }
        // if we have a put method, expose PUT: /api/ModelsController/id endpoint
        if (methods.indexOf('put') > -1){
            endpoints += "<h4>PUT : /api/" + resourceNamePluralized + "/id</h4>";
        }
        // if we have a remove method, expose DELETE: /api/ModelsController/id endpoint
        if (methods.indexOf('remove') > -1){
            endpoints += "<h4>DELETE : /api/" + resourceNamePluralized + "/id</h4>";
        }
        return endpoints + "<hr>";
    }

    let content = "<div style=font-family:arial>";
    content += "<h1>WEB API ENDPOINTS</h1><hr>";
    const path = require('path');
    const fs = require('fs');
    // construct controller directoty path
    const directoryPath = path.join(__dirname, "controllers");
    // get list of directories with in controller directoty
    fs.readdir(directoryPath, function(err, files) {
        if (err) {
          console.log("No endpoints");
        } else {
            // for each directory in controller directoty
            files.forEach(function(file) {
                // if not Controller base class
                if (file != 'Controller.js') {
                    // expose all endpoints
                    content += EnumerateEndpoints(file);
                }
            });
            res.writeHead(200, {'content-type':'text/html'});
            res.end(content) + "</div>";
        }
    });
}