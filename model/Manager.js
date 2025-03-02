// models/Seller.js
const Base = require('./Base');
class Manager extends Base {
    constructor(data) {
        const fields = ['id', 'name', 'email', 'telephone', 'status', 'password'];
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
            status:this.status,
            image:this.image,
            role:"manager"
        };
    }
}
module.exports = Manager;

