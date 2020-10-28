const Repository = require('../models/Repository');

module.exports = 
class CoursesController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
        this.coursesRepository = new Repository('Courses');
    }
    get(id){
        if(!isNaN(id))
            this.response.JSON(this.coursesRepository.get(id));
        else
            this.response.JSON(this.coursesRepository.getAll());
    }
    post(course){  
        // todo : validate course before insertion
        // todo : avoid duplicates
        let newCourse = this.coursesRepository.add(course);
        if (newCourse) 
            this.response.created(newCourse);
         else 
            this.response.internalError();
    }
    put(course){
        // todo : validate course before updating
        if (this.coursesRepository.update(course))
            this.response.ok();
        else 
            this.response.notFound();
    }
    remove(id){
        if (this.coursesRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }
}