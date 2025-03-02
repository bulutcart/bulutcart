// models/Seller.js
const Base = require('./Base');
class Product extends Base {
    constructor(data) {
        const fields = ['id', 'name', 'image', 'category_id', 'brand_id', 'description'];
        super(data, fields);
    }
    // Kullanıcıyı JSON formatında döndürme
    toJson() {
        return {
            id: this.id,
            name: this.name,
            image: this.image,
            description:this.description,
            category_id: this.category_id,
            category: this.category,
            brand_id: this.brand_id,
            brand: this.brand,
            seller_id: this.seller_id,
            seller: this.seller,
            variants: this.variants,
            attributes: this.attributes
        };
    }
}
module.exports = Product;

