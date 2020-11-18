const utilities = require('../utilities');

module.exports = 
class collectionFilter{
    constructor(collection, filterParams) {
        this.collection = collection;
        this.sortFields = [];
        this.searchKeys = [];
        this.filteredCollection = [];
        this.limit = 0;
        this.offset = 0;
        let instance = this;
        Object.keys(filterParams).forEach(function(paramName) {
            let paramValue = filterParams[paramName];
            console.log(paramName, paramValue);
            switch (paramName) {
                case "sort": instance.setSortFields(paramValue); break;
                case "limit": instance.limit = paramValue;  break;
                case "offset": instance.offset = paramValue; break;
                default: instance.addSearchKey(paramName, paramValue);
            }
        });
    }

    makeSortField(fieldName) {
        let parts = fieldName.split(',');
        let sortField = "";
        let ascending = true;
        if (parts.length > 0)
            sortField = utilities.capitalizeFirstLetter(parts[0].toLowerCase());
        if (parts.length > 1) {
            if (parts[1].toLowerCase().includes('desc')) {
                ascending = false;
            }
        }
        return {    name: sortField, 
                    ascending: ascending
                };
    }

    setSortFields(fieldNames){
        if (Array.isArray(fieldNames)) {
            for(let fieldName of fieldNames) {
                this.sortFields.push(this.makeSortField(fieldName));
            }
        } else 
            this.sortFields.push(this.makeSortField(fieldNames));
    }
   
    addSearchKey(keyName, value){
        let name = utilities.capitalizeFirstLetter(keyName.toLowerCase());
        this.searchKeys.push({name: name, value: value});
    }
    valueMatch(value, searchValue){
        return new RegExp('^' + searchValue.toLowerCase().replace(/\*/g, '.*') + '$').test(value.toLowerCase());
    }
    itemMatch(item){
        for(let key of this.searchKeys) {
            if (key.name in item){
                if (!this.valueMatch(item[key.name], key.value))
                    return false;
            } else
                return false;
        }
        return true;
    }
    findByKeys() {
        if (this.searchKeys.length > 0)
        {
            this.filteredCollection = [];
            for(let item of this.collection){
                if (this.itemMatch(item))
                    this.filteredCollection.push(item);
            }
        } else 
            this.filteredCollection = this.collection;
    }
    compareNum(x, y){
        if (x === y) return 0;
        else if ( x < y) return -1;
        return 1;
    }
    innerCompare(x, y) {
        if ((typeof x) === 'string')
            return x.localeCompare(y);
        else 
            return this.compareNum(x, y);
    }
    compare(itemX, itemY){
        let fieldIndex = 0;
        let max = this.sortFields.length;
        do {
                let result = 0;
                if (this.sortFields[fieldIndex].ascending)
                    result = this.innerCompare(itemX[this.sortFields[fieldIndex].name], itemY[this.sortFields[fieldIndex].name]);
                else
                    result = this.innerCompare(itemY[this.sortFields[fieldIndex].name], itemX[this.sortFields[fieldIndex].name]);
                if (result == 0)
                    fieldIndex ++;
                else
                    return result;
        } while (fieldIndex < max);
        return 0;
    }
    sort() {
        this.filteredCollection.sort((a, b) => this.compare(a, b));
    }
    getPage(collection){
        if (this.limit != 0){
            let page = [];
            let objectsListLength = collection.length;
            for(let i = this.offset * this.limit; i < (this.offset + 1) * this.limit; i++) {
                if (i < objectsListLength) {
                    page.push(collection[i]);
                }
            }
            return page;
        }
        return collection;
    }
    get() {
        this.findByKeys();
        if (this.sortFields.length > 0)
            this.sort();
        return this.getPage(this.filteredCollection);
    }
}