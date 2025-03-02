const DataBase = require("../DataBase");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Response = require("../../util/Response");
const Category = require("../../model/Category");

class CategoryController {

    static async list(req) {
        let offset = req.query.offset || 0;
        let limit = req.query.limit || 10;
        limit = Math.min(100, limit);
        //const connection = await db.getConnection();
        var {filter, filterValues } = this.getFilter(req);

        var sql = "SELECT id, name, parent_id FROM category WHERE 1=1 " ;
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
            return Response.error("Invalid request", ["Category not found"]);
        }
        let items = [];
        for (const row of rows) {
            let item = new Category(row);
            if(item['parent_id']){
                item['path'] = await this.getCategory(row['id']);
            } else {
                item['path'] = '';
            }

            items.push(item.toJson());
        }
        return Response.success("Category List", items, recordsTotal, recordsFiltered )
    }

    static getFilter(req){
        var filter = "";
        var filterValues = [];

        let { parent_id, name } = req.query.filter || {};

        if(name=='' || name==null ){
            parent_id = parent_id??0;
            if(parent_id!=null){
                filter += " AND parent_id = ?";
                filterValues = [...filterValues, `${parent_id}%`];
            }
        } else{
            filter += " AND name LIKE ?";
            filterValues = [...filterValues, `${name}%`];
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
    static async getCategory(id){
        //const connection = await db.getConnection();
        var sql = `WITH RECURSIVE CategoryTree AS (
            SELECT id, name, parent_id
            FROM category
            WHERE id = ?  
            UNION ALL
            SELECT c.id, c.name, c.parent_id
            FROM category c
            INNER JOIN CategoryTree ct ON c.id = ct.parent_id 
        )
        SELECT * FROM CategoryTree`;
        var filterValues = [id];
        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        if (rows.length === 0 ) {
            return id;
        }
        var names =[];
        for (const row of rows) {
            names.unshift(row['name']) ;
        }
        return  names.join('»');
    }
}
module.exports = CategoryController;