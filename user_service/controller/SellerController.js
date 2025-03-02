const DataBase = require("../DataBase");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Response = require("../../util/Response");
const Seller = require("../../model/Seller");
const Address = require("../../model/Address");

class SellerController {
    static async getToken(req) {
        const { email, password } = req.body;
        if (!email || !password) {
            return Response.error("Invalid credentials", ["Email or password is empty"]);
        }
        //const connection = await db.getConnection();
        const [rows] = await DataBase.execute("SELECT * FROM seller WHERE email = ?", [email]);
        //connection.release();
        if (rows.length === 0 ) {
            return Response.error("Invalid credentials", ["Account not found"]);
        }
        if (!(await bcrypt.compare(password, rows[0].password))) {
            return Response.error("Invalid credentials", ["Email or password is incorrect"]);
        }
        const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
        const token = jwt.sign({ id: rows[0].id, email: rows[0].email, access: "seller" }, SECRET_KEY, { expiresIn: "1h" });
        return Response.success("Access granted", token, )
    }
    static async register(req) {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        //const connection = await db.getConnection();
        await DataBase.execute(
            "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );
        //connection.release();
        const user = { name:name, email:email}
        return Response.success( "User registered successfully", user)
    }
    static async thisProfile(req) {
        return await this.anyProfile(req.user.id);
    }
    static async saveProfile(req) {
        const { name, email, telephone, image, status } = req.body;
        /*if(req.params.user_id == req.user.id){
            if(req.body.status != req.user.status){
                var response = await this.anyProfile(req.params.user_id);
                response.message = "Kendi durumunuzu değiştiremezsiniz";
                return response;
            }
        }*/
        //const connection = await db.getConnection();
        const result = await DataBase.execute("UPDATE seller SET name=?, email=?, telephone=?, image=?, status=? WHERE id = ?", [name, email, telephone, image, status, req.params.user_id]);
        return this.anyProfile(req.params.user_id);
    }
    static async anyProfile(id) {
        console.log("anyProfile", id);
        //const connection = await db.getConnection();
        console.log("connection", id);
        const [rows] = await DataBase.execute("SELECT * FROM seller WHERE id = ?", [id]);
        //connection.release();
        if (rows.length === 0 ) {
            return Response.error("Invalid request", ["Kullanıcı Hesabı Bulunamadı"]);
        }
        const user = new Seller(rows[0]);
        user['addresses'] = await this.getAdresses(user['id']);
        user['store'] = await this.getStore(user['id']);
        user['documents'] = await this.getDocuments(user['id']);

        return Response.success("Kullanıcı bilgileri", user.toJson(), )
    }

    static async list(req) {
        let offset = req.query.offset || 0;
        let limit = req.query.limit || 10;
        limit = Math.min(100, limit);
        //const connection = await db.getConnection();
        var {filter, filterValues, } = this.getFilter(req);
        var sql = "SELECT * FROM seller WHERE 1=1 " ;
        const recordsTotal = await this.recordsTotal(sql, filterValues);
        sql +=  filter;
        const recordsFiltered = await this.recordsFiltered(sql, filterValues);
        sql += " LIMIT " + offset + ", " + limit;
        //console.log(sql);
        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        if (rows.length === 0 ) {
            return Response.error("Invalid request", ["Account not found"]);
        }
        let users = [];
        for (const row of rows) {
            let user = new Seller(row);
            user['store'] = await this.getStore(user['id']);
            users.push(user.toJson());
        }
        return Response.success("Seller List", users, recordsTotal, recordsFiltered )
    }

    static getFilter(req){
        var filter = "";
        var filterValues = [];
        if(req.query.filter){
            const { id, name, email, telephone } = req.query.filter;
            if(id){
                filter += " AND id LIKE ?";
                filterValues = [...filterValues, `${id}%`];
            }
            if(name){
                filter += " AND name LIKE ?";
                filterValues = [...filterValues, `${name}%`];
            }
            if(email){
                filter += " AND email LIKE ?";
                filterValues = [...filterValues, `${email}%`];
            }
        }
        return {filter:filter, filterValues:filterValues};
    }
    static async recordsTotal(sql, filterValues){
        sql = "SELECT COUNT(*) AS count FROM (" + sql + ") AS temp";
        //const connection = await db.getConnection();
        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        return rows[0].count;
    }
    static async recordsFiltered(sql, filterValues){
        sql = "SELECT COUNT(*) AS count FROM (" + sql + ") AS temp";
        //const connection = await db.getConnection();
        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        return rows[0].count;
    }
    static async getAdresses(user_id){
        //const connection = await db.getConnection();
        var sql = "SELECT * FROM seller_address WHERE user_id=? " ;
        var filterValues = [user_id];
        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        var addresses = [];
        if (rows.length === 0 ) {
            var  address = new Address([]);
            addresses.push(address.toJson());
        } else {
            for (const row of rows) {
                var  address = new Address(row);
                addresses.push(address.toJson())
            }
        }
        return  addresses;
    }
    static async getStore(user_id){
        //const connection = await db.getConnection();
        const [rows] = await DataBase.execute("SELECT * FROM seller_store WHERE seller_id = ?", [user_id]);
        //connection.release();
        if (rows.length === 0 ) {
            return null;
        }
        return rows[0];
    }
    static async saveStore(req) {
        const { name, description, image, status } = req.body;
        //const connection = await db.getConnection();
        const result = await DataBase.execute("UPDATE seller_store SET name=?, description=?, image=?, status=? WHERE seller_id = ?", [name, description, image, status, req.params.user_id]);
        return this.anyProfile(req.params.user_id);
    }
    static async getDocuments(user_id){
        var documents = [
            {code:'taxplate', id: 0, name : 'Vergi Levhası', url:''},
            {code:'contract', id: 0, name : 'Sözleşme', url:''},
            {code:'idcopy', id: 0, name : 'Kimlik Belgesi', url:''},
        ];

        //const connection = await db.getConnection();
        const [rows] = await DataBase.execute("SELECT * FROM seller_document WHERE seller_id = ?", [user_id]);

        if (rows.length === 0 ) {
            return documents;
        }

        for (const row of rows) {
            for (let index = 0; index < documents.length; index++) {
                if (documents[index].code === row.code) {
                    documents[index] = row;
                }
            }
        }
        //console.log(documents);
        return documents;
    }
}
module.exports = SellerController;