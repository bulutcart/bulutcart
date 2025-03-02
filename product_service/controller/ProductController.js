const DataBase = require("../DataBase");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Response = require("../../util/Response");
const Product = require("../../model/Product");

class ProductController {

    static async list(req) {
        let offset = req.query.offset || 0;
        let limit = req.query.limit || 10;
        limit = Math.min(100, limit);
        //const connection = await db.getConnection();
        var {filter, filterValues, } = this.getFilter(req);
        var sql = "SELECT id, name, image, category_id, brand_id, seller_id   FROM product WHERE 1=1 " ;
        const recordsTotal = await this.recordsTotal(sql, filterValues);
        sql +=  filter;
        const recordsFiltered = await this.recordsFiltered(sql, filterValues);
        const { id, name } = req.query.filter || {};
        if(name){
            sql += " ORDER BY CASE WHEN name LIKE ? THEN 1 ELSE 2 END, name ASC" ;
            filterValues = [...filterValues, `${name}%`];
        }
        sql += " LIMIT " + offset + ", " + limit;

        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        if (rows.length === 0 ) {
            return Response.error("Invalid request", ["Product not found"]);
        }
        let items = [];
        for (const row of rows) {
            let item = new Product(row);
            item['category'] = await this.getCategory(row['category_id']);
            item['brand'] = await this.getBrand(row['brand_id']);
            item['seller'] = await this.getSeller(row['seller_id']);
            item['variants'] = await this.getProductVariants(row['id']);
            item['attributes'] = {};
            items.push(item.toJson());
        }
        return Response.success("Product List", items, recordsTotal, recordsFiltered )
    }

    static getFilter(req){
        var filter = "";
        var filterValues = [];
        if(req.query.filter){
            const { id, name } = req.query.filter || {};
            if(id){
                filter += " AND id LIKE ?";
                filterValues = [...filterValues, `${id}%`];
            }
            if(name){
                filter += " AND name LIKE ?";
                filterValues = [...filterValues, `%${name}%`];
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
    static async getBrand(id){
        //const connection = await db.getConnection();
        var sql = "SELECT * FROM brand WHERE id=? " ;
        var filterValues = [id];
        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        if (rows.length === 0 ) {
            return id;
        }
        return  rows[0]['name'];
    }
    static async getSeller(id){
        //const connection = await db.getConnection();
        var sql = "SELECT * FROM seller WHERE id=? " ;
        var filterValues = [id];
        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        if (rows.length === 0 ) {
            return id;
        }
        return  rows[0]['name'];
    }
    static async getProductVariants(product_id){
        //const connection = await db.getConnection();
        var sql = "SELECT PV.*, A.name as variant , AV.name as variant_value FROM `product_variant` PV INNER JOIN `attribute` A ON A.id = PV.variant_attribute_id INNER JOIN `attribute_value` AV ON AV.id = PV.variant_attribute_value_id WHERE `product_id`=?" ;
        var filterValues = [product_id];
        const [rows] = await DataBase.execute(sql, filterValues);
        //connection.release();
        if (rows.length === 0 ) {
            return {};
        }
        var items = {};
        for (const row of rows) {
            if(!items[row.variant]){
                items[row.variant] = {};
            }
            row['attrinutes'] = {};
            items[row.variant][row.variant_value] = row;
        }
        return  items;
    }
}
module.exports = ProductController;