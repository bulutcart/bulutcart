// models/Seller.js
const Base = require('./Base');
class Brand extends Base {
    constructor(data) {
        const fields = ['id', 'name', 'image', 'description'];
        super(data, fields);
    }
    // Kullanıcıyı JSON formatında döndürme
    toJson() {
        return {
            id: this.id,
            name: this.name,
            image: this.image
        };
    }
}
module.exports = Brand;

