const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cors = require("cors");
const express = require("express");
const Response = require('../util/Response');
const MiddleWare = require('../util/MiddleWare');
const jwt = require("jsonwebtoken");
const app = express();
const middleWare = new MiddleWare(jwt);

app.use(express.json());
app.use(cors());
app.get("/", middleWare.isPublic, async (req, res) => {
    // Bağlantı Test Etme
    res.json(Response.success({}, "Product Server is Online!"));
});
server.on('connection', (socket) => {
    socket.setTimeout(5000); // 5 saniye sonra bağlantıyı kapat
});

app.get("/product/list",  middleWare.isPublic, async (req, res) => {
    // ürün Listesi
    try {
        const ProductController = require('./controller/ProductController');
        const response = await ProductController.list(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/product/brand",  middleWare.isPublic, async (req, res) => {
    // ürün Listesi
    try {
        const BrandController = require('./controller/BrandController');
        const response = await BrandController.list(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/product/category",  middleWare.isPublic, async (req, res) => {
    // ürün Listesi
    try {
        const CategoryController = require('./controller/CategoryController');
        const response = await CategoryController.list(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/product/attribute",  middleWare.isPublic, async (req, res) => {
    // ürün Listesi
    try {
        const AttributeController = require('./controller/AttributeController');
        const response = await AttributeController.list(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});

const PORT = process.env.PRODUCT_PORT;
if(PORT){
    app.listen(PORT, () => console.log(`Product Server running on port ${PORT} http://localhost:${PORT}/product/list`)); 
} else{
    console.log("can not find PRODUCT_PORT in .env file");
}

