const Repository = require('../models/Repository');

module.exports = 
class ContactsController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
        this.contactsRepository = new Repository('Contacts');
    }
    // GET: api/contacts
    // GET: api/contacts/{id}
    get(id){
        if(!isNaN(id))
            this.response.JSON(this.contactsRepository.get(id));
        else
            this.response.JSON(this.contactsRepository.getAll());
    }
    // POST: api/contacts body payload[{"Id": 0, "Name": "...", "Email": "...", "Phone": "..."}]
    post(contact){  
        // todo : validate contact before insertion
        // todo : avoid duplicates
        let newContact = this.contactsRepository.add(contact);
        if (newContact)
            this.response.created(newContact);
        else
            this.response.internalError();
    }
    // PUT: api/contacts body payload[{"Id":..., "Name": "...", "Email": "...", "Phone": "..."}]
    put(contact){
        // todo : validate contact before updating
        if (this.contactsRepository.update(contact))
            this.response.ok();
        else 
            this.response.notFound();
    }
    // DELETE: api/contacts/{id}
    remove(id){
        if (this.contactsRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }
}