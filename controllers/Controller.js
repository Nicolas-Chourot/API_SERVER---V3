const Response = require('../response.js');
const utilities = require('../utilities');
const TokenManager = require('../tokenManager');
const queryStringParser = require('query-string');
/////////////////////////////////////////////////////////////////////
// Important note about controllers:
// You must respect pluralize convention: 
// For ressource name RessourName you have to name the controller
// RessourceNamesController that must inherit from Controller class
// in order to have proper routing from request to controller action
/////////////////////////////////////////////////////////////////////
module.exports = 
class Controller {
    constructor(req, res, needAuthorization = false) {
        if (req != null && res != null) {
            this.req = req;
            this.res = res;
            // if true, will require a valid bearer token from request header
            this.needAuthorization = needAuthorization;
            this.response = new Response(res, this.req.url);
        }
    }
    requestAuthorized() {
        if (this.needAuthorization) {
            return TokenManager.requestAuthorized(this.req);
        }
        return true;
    }
    requestActionAuthorized() {
        return TokenManager.requestAuthorized(this.req);
    }
    getQueryStringParams(){
        let queryString = utilities.getQueryString(this.req.url);
        if (queryString != undefined) {
            return queryStringParser.parse(queryString);
        }
        return null;
    }
    queryStringParamsList() { return "";}
    head(){
        this.response.notImplemented();
    }
    get(id){
        this.response.notImplemented();
    }  
    post(obj){  
        this.response.notImplemented();
    }
    put(obj){
        this.response.notImplemented();
    }
    patch(obj){
        this.response.notImplemented();
    }
    remove(id){
        this.response.notImplemented();
    }
}