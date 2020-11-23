function makeToken(text){
    const crypto = require('crypto'); 
    const algorithm = 'aes-256-cbc'; 
    const key = crypto.randomBytes(32); 
    const iv = crypto.randomBytes(16);
     
    function encrypt(text) { 
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(text); 
        encrypted = Buffer.concat([encrypted, cipher.final()]); 
        return {    iv: iv.toString('hex'),  
                    encryptedData: encrypted.toString('hex') 
               }; 
    } 
    return encrypt(text).encryptedData; 
}
const utilities = require('./utilities');
const serverVariables = require("./serverVariables");
const Repository = require('./models/Repository');
let repository = new Repository('Tokens');

let tokenLifeDuration = serverVariables.get("main.token.lifeDuration");

class TokenManager{
    static create(email) {
        let token = {   Id: 0, 
                        Access_token: makeToken(email), 
                        Expires_in: utilities.nowInSeconds() + tokenLifeDuration
                    };
        repository.add(token);
        return token;
    }
    static cleanTokens() {
        let tokens = repository.getAll();
        let now = utilities.nowInSeconds();
        let index = 0;
        let indexToDelete = [];
        for(let token of tokens) {
            if (token.Expires_in < now) {
                console.log("Access token " + token.Access_token + " expired");
                indexToDelete.push(index);
            }
            index ++;
        }
        repository.removeByIndex(indexToDelete);
    }
    static find(access_token) {
        let token = repository.findByField('Access_token', access_token);
        if (token != null){
            // renew expiration date
            token.Expires_in = utilities.nowInSeconds() + tokenLifeDuration;
            repository.update(token);
            return token;
        }
        return null;
    }
    static requestAuthorized(req){
        if (req.headers["authorization"] != undefined) {
            // Extract bearer token from head of the http request
            let token = req.headers["authorization"].replace('Bearer ','');
            return (this.find(token) != null);
        }
        return false;
    }
}

// periodic cleaning of expired tokens
setInterval(TokenManager.cleanTokens, tokenLifeDuration * 1000);
module.exports = TokenManager;