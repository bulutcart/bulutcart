const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const MiddleWare = require('../util/MiddleWare');
const jwt = require("jsonwebtoken");
const middleWare = new MiddleWare(jwt);
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Dosyaların kaydedileceği klasör
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Dosya adını değiştir
    }
});

const upload  = multer({ storage: storage });

const cookieParser = require("cookie-parser");
const express = require('express');

const app = express();

// EJS ayarları
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());
app.use((req, res, next) => {
    if (req.path === "/login") {
        return next(); // /login sayfasını atla
    }
    middleWare.hasValidToken(req, res, next);
});

// Ana sayfa route'u
app.get('/', (req, res) => {
    const UserController =  require("./controller/UserController");
    return UserController.home(req, res);
});

app.get('/login', (req, res) => {
    const LoginController =  require("./controller/LoginController");
    return LoginController.login(req, res);
});
app.get('/logout', (req, res) => {
    const LoginController =  require("./controller/LoginController");
    return LoginController.logout(req, res);
});

app.get('/home', (req, res) => {
    const UserController =  require("./controller/UserController");
    return UserController.home(req, res);
});

app.get('/seller', (req, res) => {
    const UserController =  require("./controller/UserController");
    return UserController.sellerList(req, res);
});
app.get('/seller/edit/:user_id', (req, res) => {
    const UserController =  require("./controller/UserController");
    return UserController.sellerEdit(req, res);
});
app.get('/customer', (req, res) => {
    const UserController =  require("./controller/UserController");
    return UserController.customerList(req, res);
});
app.get('/customer/edit/:user_id', (req, res) => {
    const UserController =  require("./controller/UserController");
    return UserController.customerEdit(req, res);
});
app.get('/manager', (req, res) => {
    const UserController =  require("./controller/UserController");
    return UserController.managerList(req, res);
});
app.get('/manager/edit/:user_id', (req, res) => {
    const UserController =  require("./controller/UserController");
    return UserController.managerEdit(req, res);
});
app.get('/product', (req, res) => {
    const ProductController =  require("./controller/ProductController");
    return ProductController.productList(req, res);
});
app.get('/product/edit/:product_id', (req, res) => {
    const ProductController =  require("./controller/ProductController");
    return ProductController.productEdit(req, res);
});
app.get('/brand', (req, res) => {
    const ProductController =  require("./controller/ProductController");
    return ProductController.brandList(req, res);
});
app.get('/brand/edit/:brand_id', (req, res) => {
    const ProductController =  require("./controller/ProductController");
    return ProductController.brandEdit(req, res);
});
app.get('/category', (req, res) => {
    const ProductController =  require("./controller/ProductController");
    return ProductController.categoryList(req, res);
});
app.get('/category/edit/:category_id', (req, res) => {
    const ProductController =  require("./controller/ProductController");
    return ProductController.categoryEdit(req, res);
});
app.get('/attribute', (req, res) => {
    const ProductController =  require("./controller/ProductController");
    return ProductController.attributeList(req, res);
});
app.get('/attribute/edit/:attribute_id', (req, res) => {
    const ProductController =  require("./controller/ProductController");
    return ProductController.attributeEdit(req, res);
});
app.post('/upload-file', upload.single('file'), (req, res) => {
    const CdnController =  require("./controller/CdnController");

    return CdnController.upload(req, res);
});

// Sunucuyu başlatma
const PORT = process.env.MANAGE_PORT;
if(PORT){
    app.listen(PORT, () => console.log(`Manage Server running on port ${PORT} http://localhost:${PORT}/login`));
} else{
    console.log("can not find MANAGE_PORT in .env file");
}
