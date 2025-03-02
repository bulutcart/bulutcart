class Base {
    fields = [];
    constructor(data, fields) {
        this.fields = fields;
        for (let key in data) {
            this[key] = data[key];
        }
    }
    get(key) {
        if (this.hasOwnProperty(key)) {
            return this[key];
        }
    }
    set(key, value) {
        if (this.hasOwnProperty(key)) {
            this[key] = value;
        }
    }
    fill(data) {
        for (let key in data) {
            if (this.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
}
module.exports = Base;
