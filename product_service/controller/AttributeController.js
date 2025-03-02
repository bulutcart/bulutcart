const DataBase = require("../DataBase");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Response = require("../../util/Response");
const Attribute = require("../../model/Attribute");

class AttributeController {

    static async list(req) {
        let offset = req.query.offset || 0;
        let limit = req.query.limit || 10;
        limit = Math.min(100, limit);
        //const connection = await db.getConnection();
        var {filter, filterValues, } = this.getFilter(req);
        var sql = "SELECT id, name, image FROM attribute WHERE 1=1 " ;
        const recordsTotal = await this.recordsTotal(sql, filterValues);
        sql +=  filter;
        const recordsFiltered = await this.recordsFiltered(sql, filterValues);
        const { id, name } = req.query.filter || {};
        if(name!=''){
            sql += " ORDER BY CASE WHEN name LIKE ? THEN 1 ELSE 2 END, name ASC" ;
            filterValues = [...filterValues, `${name}%`];
        }
        sql += " LIMIT " + offset + ", " + limit;

        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        if (rows.length === 0 ) {
            return Response.error("Invalid request", ["Attribute not found"]);
        }
        let items = [];
        for (const row of rows) {
            let item = new Attribute(row);
            item['attribute_value_count'] = await this.attributeValueCount(row['id']);
            items.push(item.toJson());
        }
        return Response.success("Attribute List", items, recordsTotal, recordsFiltered )
    }

    static getFilter(req){
        var filter = "";
        var filterValues = [];
        if(req.query.filter){
            const { name } = req.query.filter || {};
            if(name){
                filter += " AND name LIKE ?";
                filterValues = [...filterValues, `${name}%`];
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
    static async attributeValueCount( attribute_id ){
        const sql = "SELECT COUNT(*) AS count FROM attribute_value WHERE attribute_id  = ?";
        //const connection = await db.getConnection();
        var filterValues = [attribute_id];
        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        return rows[0].count;
    }

}
module.exports = AttributeController;