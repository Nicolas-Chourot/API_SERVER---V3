module.exports = 
class Course{
    constructor(title, code)
    {
        this.Id = 0;
        this.Title = title !== undefined ? title : "";
        this.Code = code !== undefined ? code : "";
    }
}