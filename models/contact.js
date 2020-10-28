module.exports = 
class Contact{
    constructor(name, email, phone)
    {
        this.Id = 0;
        this.Name = name !== undefined ? name : "";
        this.Email = email !== undefined ? email : "";
        this.Phone = phone !== undefined ? phone : "";
    }
}