// models/Seller.js
const Base = require('./Base');
class Attribute extends Base {
    constructor(data) {
        const fields = ['id', 'name', 'image'];
        super(data, fields);
    }
    // Kullanıcıyı JSON formatında döndürme
    toJson() {
        return {
            id: this.id,
            name: this.name,
            image: this.image,
            attribute_value_count: this.attribute_value_count
        };
    }
}
module.exports = Attribute;

