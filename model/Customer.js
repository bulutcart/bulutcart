// models/Seller.js
const Base = require('./Base');
class Customer extends Base {
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
            telephone:"",
            addresses: this.addresses || [],
            image:this.image,
            status: this.status,
        };
    }
}
module.exports = Customer;

