const DataBase = require("../DataBase");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Response = require("../../util/Response");
const Manager = require("../../model/Manager");
const Customer = require("../../model/Customer");

class ManagerController {
    static async getToken(req) {
        const { email, password } = req.body;
        if (!email || !password) {
            return Response.error("Invalid credentials", ["Email or password is empty"]);
        }
        //const connection = await db.getConnection();
        const [rows] = await DataBase.execute("SELECT * FROM manager WHERE email = ?", [email]);
        //connection.release();
        if (rows.length === 0 ) {
            return Response.error("Invalid credentials", ["Account not found"]);
        }
        if (!(await bcrypt.compare(password, rows[0].password))) {
            return Response.error("Invalid credentials", ["Email or password is incorrect"]);
        }
        const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
        var user = new Manager(rows[0]);

        const token = jwt.sign(user.toJson(), SECRET_KEY, { expiresIn: "1h" });
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
        if(req.params.user_id == req.user.id){
            if(req.body.status != req.user.status){
                var response = await this.anyProfile(req.params.user_id);
                response.message = "Kendi durumunuzu değiştiremezsiniz";
                return response;
            }
        }
       //const connection = await db.getConnection();
        const result = await DataBase.execute("UPDATE manager SET name=?, email=?, telephone=?, image=?, status=? WHERE id = ?", [name, email, telephone, image, status, req.params.user_id]);
        return this.anyProfile(req.params.user_id);
    }
    static async anyProfile(id) {
        //const connection = await db.getConnection();
        const [rows] = await DataBase.execute("SELECT * FROM manager WHERE id = ?", [id]);
        //connection.release();
        if (rows.length === 0 ) {
            return Response.error("Invalid request", ["Kullanıcı Hesabı Bulunamadı"]);
        }
        const user = new Manager(rows[0]);
        user['addresses'] = null;

        return Response.success("Kullanıcı bilgileri kaydedildi", user.toJson(), )
    }

    static async list(req) {
        let offset = req.query.offset || 0;
        let limit = req.query.limit || 10;
        limit = Math.min(100, limit);
        //const connection = await db.getConnection();
        var {filter, filterValues, } = this.getFilter(req);
        var sql = "SELECT * FROM manager WHERE 1=1 " ;
        const recordsTotal = await this.recordsTotal(sql, filterValues);
        sql +=  filter;
        const recordsFiltered = await this.recordsFiltered(sql, filterValues);
        sql += " LIMIT " + offset + ", " + limit;

        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        if (rows.length === 0 ) {
            return Response.error("Invalid request", ["Account not found"]);
        }
        let users = [];
        rows.forEach((row) => {
            let user = new Manager(row);
            users.push(user.toJson());
        });
        return Response.success("Manager List", users, recordsTotal, recordsFiltered )
    }
    static async all(req) {
        const connection = await this.db.getConnection();
        const [rows] = await DataBase.execute("SELECT * FROM user LIMIT 1");
        //connection.release();
        return rows;
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
}
module.exports = ManagerController;