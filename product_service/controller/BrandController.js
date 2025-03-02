const DataBase = require("../DataBase");

const Response = require("../../util/Response");
const Brand = require("../../model/Brand");

class BrandController {

    static async list(req) {
        let offset = req.query.offset || 0;
        let limit = req.query.limit || 10;
        limit = Math.min(100, limit);
        //const connection = await db.getConnection();
        var {filter, filterValues, } = this.getFilter(req);
        var sql = "SELECT id, name, image FROM brand WHERE 1=1 " ;
        const recordsTotal = await this.recordsTotal(sql, filterValues);
        sql +=  filter;
        const recordsFiltered = await this.recordsFiltered(sql, filterValues);
        const { id, name, email, telephone } = req.query.filter || {};
        if(name!=''){
            sql += " ORDER BY CASE WHEN name LIKE ? THEN 1 ELSE 2 END, name ASC" ;
            filterValues = [...filterValues, `${name}%`];
        }
        sql += " LIMIT " + offset + ", " + limit;

        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        if (rows.length === 0 ) {
            return Response.error("Invalid request", ["Brand not found"]);
        }
        let items = [];
        for (const row of rows) {
            let item = new Brand(row);
            items.push(item.toJson());
        }
        return Response.success("Brand List", items, recordsTotal, recordsFiltered )
    }

    static getFilter(req){
        var filter = "";
        var filterValues = [];
        if(req.query.filter){
            const { id, name } = req.query.filter;
            if(id){
                filter += " AND id LIKE ?";
                filterValues = [...filterValues, `${id}%`];
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
module.exports = BrandController;