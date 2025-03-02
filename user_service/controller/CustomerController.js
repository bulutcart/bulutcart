const DataBase = require("../DataBase");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Response = require("../../util/Response");
const Customer = require("../../model/Customer");
const Address = require("../../model/Address");

class CustomerController {
    static async getToken(req) {
        const { email, password } = req.body;
        if (!email || !password) {
            return Response.error("Invalid credentials", ["Email or password is empty"]);
        }
        const [rows] = await DataBase.execute("SELECT * FROM customer WHERE email = ?", [email]);
        if (rows.length === 0 ) {
            return Response.error("Invalid credentials", ["Account not found"]);
        }
        if (!(await bcrypt.compare(password, rows[0].password))) {
            return Response.error("Invalid credentials", ["Email or password is incorrect"]);
        }
        const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
        const token = jwt.sign({ id: rows[0].id, email: rows[0].email, access: "customer" }, SECRET_KEY, { expiresIn: "1h" });
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
        return await this.aProfile(req.user.id);
    }
    static async anyProfile(id) {

        //const connection = await db.getConnection();
        const [rows] = await DataBase.execute("SELECT * FROM customer WHERE id = ?", [id]);
        //connection.release();
        if (rows.length === 0 ) {
            return Response.error("Invalid request", ["Account not found"]);
        }
        const user = new Customer(rows[0]);
        user['addresses'] = await this.getAdresses(user['id']);

        return Response.success("Profile", user.toJson(), )
    }
    static async list(req) {
        let offset = req.query.offset || 0;
        let limit = req.query.limit || 10;
        limit = Math.min(100, limit);
        //const connection = await db.getConnection();
        var {filter, filterValues, } = this.getFilter(req);
        var sql = "SELECT * FROM customer WHERE 1=1 " ;
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
            let user = new Customer(row);
            users.push(user.toJson());
        });
        return Response.success("Customer List", users, recordsTotal, recordsFiltered )
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
        var sql = "SELECT * FROM customer_address WHERE user_id=? " ;
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
}
module.exports = CustomerController;