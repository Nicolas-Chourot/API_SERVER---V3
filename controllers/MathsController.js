
module.exports = 
class MathsController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
    }

    error(params, message){
        params["error"] = message;
        this.response.JSON(params);
        return false;
    }

    result(params, value){
        if (value === Infinity) value = "Infinity";
        if (isNaN(value)) value = "NaN";
        params["value"] = value;
        this.response.JSON(params);
    }
    
    checkParams(params){
        if ('op' in params) {
            switch (params.op){
                case ' ': // add operation
                case '.': // add operation               
                case '-': // substract operation
                case '*': // multiply operation
                case '/': // divide operation
                case '%': // modulo operation
                    let x = 0;
                    let y = 0;
                    if ('x' in params) {
                        x = parseFloat(params.x);
                        if (!isNaN(x)) {
                            if ('y' in params) {
                                y = parseFloat(params.y);
                                if (!isNaN(y)) {
                                    if (Object.keys(params).length > 3) {
                                        return this.error(params, "too many parameters");
                                    }
                                } else {
                                    return this.error(params, "'y' parameter is not a number");
                                }
                            } else {
                                return this.error(params, "'y' parameter is missing");
                            }
                        } else {
                            return this.error(params, "'x' parameter is not a number");
                        }
                    } else {
                        return this.error(params, "'x' parameter is missing");
                    }
                    params.x = x;
                    params.y = y;
                    break;
                case '!': // factorial operation
                case 'p': // is prime number operation
                case 'n': // find nth prime number operation
                    let n= 0;
                    if ('n' in params){
                        n = parseInt(params.n);
                        if (!isNaN(n)) {
                            if (n > 0) {
                                if (Object.keys(params).length > 2) {
                                    return this.error(params, "too many parameters");
                                }
                            } else {
                                return this.error(params, "'n' parameter must be a integer > 0");
                            }
                        } else {
                            return this.error(params, "'n' parameter is not a integer");
                        }
                    } else {
                        return this.error(params, "'n' parameter is missing");
                    }
                    params.n = n;
                    break;
                default:
                    return this.error(params, "unknown operation");
            }
        } else {
            return this.error(params, "'op' parameter is missing");
        }
        // all parameters are ok
        return true;
    }
   
    doOperation(params){
        const maths = require('../maths');
        switch (params.op){
            case ' ': // add operation
            case '.': // add operation
                params.op = '+';
                this.result(params, maths.add(params.x, params.y));
                break;              
            case '-': // substract operation
                this.result(params, maths.sub(params.x, params.y));
                break;
            case '*': // multiply operation
                this.result(params, maths.mul(params.x, params.y));
                break;
            case '/': // divide operation
                this.result(params, maths.div(params.x, params.y));
                break;
            case '%': // modulo operation
                this.result(params, maths.mod(params.x, params.y));
                break;
            case '!': // factorial operation
                this.result(params, maths.factorial(params.n));
                break;
            case 'p': // is prime number operation
                this.result(params, maths.isPrime(params.n));
                break;
            case 'n': // find the nth prime number operation
                this.result(params, maths.findPrime(params.n));
                break; 
        }
    }

    queryStringParamsList() {
        // expose all the possible query strings
        let content = "<div style=font-family:arial>";
        content += "<h4>List of possible parameters in query strings:</h4>";
        content += "<h4>? op = + & x = number & y = number <br>return {\"op\":\"+\", \"x\":number, \"y\":number, \"value\": x + y} </h4>";
        content += "<h4>? op = - & x = number & y = number <br>return {\"op\":\"-\", \"x\":number, \"y\":number, \"value\": x - y} </h4>";
        content += "<h4>? op = * & x = number & y = number <br>return {\"op\":\"*\", \"x\":number, \"y\":number, \"value\": x * y} </h4>";
        content += "<h4>? op = / & x = number & y = number <br>return {\"op\":\"/\", \"x\":number, \"y\":number, \"value\": x / y} </h4>";
        content += "<h4>? op = % & x = number & y = number <br>return {\"op\":\"%\", \"x\":number, \"y\":number, \"value\": x % y} </h4>";
        content += "<h4>? op = ! & n = integer <br>return {\"op\":\"%\",\"n\":integer, \"value\": n!} </h4>";
        content += "<h4>? op = p & n = integer <br>return {\"op\":\"p\",\"n\":integer, \"value\": true if n is a prime number} </h4>";
        content += "<h4>? op = n & n = integer <br>return {\"op\":\"n\",\"n\":integer, \"value\": nth prime number} </h4>"; 
        content += "</div>"
        return content;
    }
    queryStringHelp() {
        
        this.res.writeHead(200, {'content-type':'text/html'});
        this.res.end(this.queryStringParamsList());
    }
    
    get(){
        let params = this.getQueryStringParams();
        // if we have no parameter, expose the list of possible query strings
        if (params === null) {
            this.response.badRequest();
        }
        if (Object.keys(params).length === 0) {
           this.queryStringHelp();
        } else {
            if (this.checkParams(params)) {
                this.doOperation(params);
            }
        }
    }
}