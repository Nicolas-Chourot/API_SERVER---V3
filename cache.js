const utilities = require('./utilities');
const serverVariables = require("./serverVariables");
let cache = [];

let CacheExpirationTime = serverVariables.get("main.cache.expirationTime");

class Cache {
   
    static add(url, content) {
        if (url != "") {
            cache.push({url, content, expireIn: utilities.nowInSeconds() + CacheExpirationTime});
            console.log("ADDED IN CACHE");
        }
    }
    static find(url) {
        try {
            if (url != "") {
                for(let endpoint of cache){
                    if (endpoint.url == url) {
                        // renew cache
                        endpoint.expireIn = utilities.nowInSeconds() + CacheExpirationTime;
                        console.log("RETREIVED FROM CACHE");
                        return endpoint.content;
                    }
                }
            }
        } catch(error) {
            console.log("cache error", error);
        }
        return null;
    }
    static clear(url) {
        if (url != "") {
            let indexToDelete = [];
            let index = 0;
            for(let endpoint of cache){
                if (endpoint.url.indexOf(url) > -1) indexToDelete.push(index);
                index ++;
            }
            utilities.deleteByIndex(cache, indexToDelete);
        }
    }
    static flushExpired() {
        let indexToDelete = [];
        let index = 0;
        let now = utilities.nowInSeconds();
        for(let endpoint of cache){
            if (endpoint.expireIn < now) {
                console.log("Cached ", endpoint.url + " expired");
                indexToDelete.push(index);
            }
            index ++;
        }
        utilities.deleteByIndex(cache, indexToDelete);
    }
}

// periodic cleaning of expired cached GET request
setInterval(Cache.flushExpired, CacheExpirationTime);
module.exports = Cache;