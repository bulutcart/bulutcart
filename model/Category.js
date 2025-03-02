// models/Seller.js
const Base = require('./Base');
class Category extends Base {
    constructor(data) {
        const fields = ['id', 'name'];
        super(data, fields);
    }
    // Kullanıcıyı JSON formatında döndürme
    toJson() {
        return {
            id: this.id,
            name: this.name,
            parent_id: this.parent_id,
            path: this.path
        };
    }
}
module.exports = Category;

