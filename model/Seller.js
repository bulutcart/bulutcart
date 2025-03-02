// models/Seller.js
const Base = require('./Base');
class Seller extends Base {
    constructor(data) {
        const fields = ['id', 'name', 'email', 'password'];
        super(data, fields);
    }
    
    // Şifre kontrolü
    checkPassword(password) {
        return this.password === password;
    }

    // Kullanıcıyı JSON formatında döndürme
    toJson() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            telephone:this.telephone,
            addresses: this.addresses || [],
            status: this.status,
            image:this.image,
            store:this.store||{},
            order_count:99,
            order_total:'999.888,50',
            documents: this.documents || [],
            store_name: this.store? this.store.name : '',
        };
    }
}
module.exports = Seller;

