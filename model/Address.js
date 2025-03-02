// models/Seller.js
const Base = require('./Base');
class Address extends Base {
    constructor(data) {
        const fields = ['id', 'name', 'country', 'city', 'district', 'address', 'post_code', 'is_default'];
        super(data, fields);
    }
    // Kullanıcıyı JSON formatında döndürme
    toJson() {
        return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            country: this.country,
            city: this.city,
            district: this.district,
            addresses: this.addresses,
            post_code: this.post_code,
            is_default: this.is_default,
        };
    }
}

module.exports = Address;

