const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cors = require("cors");
const express = require("express");
const Response = require('../util/Response');
const MiddleWare = require('../util/MiddleWare');
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);

const middleWare = new MiddleWare(jwt);

app.use(express.json());
app.use(cors());
app.get("/", middleWare.isPublic, async (req, res) => {
    // Bağlantı Test Etme
    res.json(Response.success({}, "User Server is Online!"));
});
server.on('connection', (socket) => {
    socket.setTimeout(5000); // 5 saniye sonra bağlantıyı kapat
});

app.post("/customer/register",  middleWare.isPublic, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const CustomerController = require('./controller/CustomerController');
        const response = await CustomerController.register(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.post("/customer/login",  middleWare.isPublic, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const CustomerController = require('./controller/CustomerController');
        const response = await CustomerController.getToken(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/customer/profile/:user_id",  middleWare.isManager, async (req, res) => {
    // Kullanıcı düzenleme
    try {
        const CustomerController = require('./controller/CustomerController');
        const response = await CustomerController.anyProfile(req.params.user_id);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/customer/profile",  middleWare.isSeller, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const CustomerController = require('./controller/CustomerController');
        const response = await CustomerController.thisProfile(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/customer/list",  middleWare.isManager, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const CustomerController = require('./controller/CustomerController');
        const response = await CustomerController.list(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.post("/manager/login",  middleWare.isPublic, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const ManagerController = require('./controller/ManagerController');
        const response = await ManagerController.getToken(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/manager/list",  middleWare.isManager, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const ManagerController = require('./controller/ManagerController');
        const response = await ManagerController.list(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/manager/profile",  middleWare.isManager, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const ManagerController = require('./controller/ManagerController');
        const response = await ManagerController.thisProfile(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/manager/profile/:user_id",  middleWare.isManager, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const ManagerController = require('./controller/ManagerController');
        const response = await ManagerController.anyProfile(req.params.user_id);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.put("/manager/profile/:user_id",  middleWare.isManager, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const ManagerController = require('./controller/ManagerController');
        const response = await ManagerController.saveProfile(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.post("/seller/login",  middleWare.isPublic, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const SellerController = require('./controller/SellerController');
        const response = await SellerController.getToken(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/seller/profile",  middleWare.isSeller, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const SellerController = require('./controller/SellerController');
        const response = await SellerController.profile(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/seller/profile/:user_id",  middleWare.isManager, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const SellerController = require('./controller/SellerController');
        const response = await SellerController.anyProfile(req.params.user_id);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.put("/seller/profile/:user_id",  middleWare.isManager, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const SellerController = require('./controller/SellerController');
        const response = await SellerController.saveProfile(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.post("/seller/register",  middleWare.isSeller, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const SellerController = require('./controller/SellerController');
        const response = await SellerController.register(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});
app.get("/seller/list",  middleWare.isManager, async (req, res) => {
    // Kullanıcı Listesi
    try {
        const SellerController = require('./controller/SellerController');
        const response = await SellerController.list(req);
        res.json(response);
    } catch (error) {
        res.json(  Response.error("Genel Hata", [error.message]));
    }
});

const PORT = process.env.USER_PORT ;
if(PORT){
    app.listen(PORT, () => console.log(`User Server running on port ${PORT} http://localhost:${PORT}/user`)); 
} else{
    console.log("can not find USER_PORT in .env file");
}

