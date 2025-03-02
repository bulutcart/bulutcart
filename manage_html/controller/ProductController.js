const ejs = require('ejs');
const path = require('path');
const MiddleWare = require('../../util/MiddleWare');
const Hattat = require('../Hattat');

class ProductController {
    static profile(req, res) {
        var bulut = {
            current_route: 'seller',
            page_title: 'Profilim',
            user_endpoint: MiddleWare.getEndpoint('user')
        };
        return res.render('user/profile', {bulut: bulut});
    }
    static async productEdit(req, res) {
        const templatePath = path.join(__dirname, '../views/product/');
        var bulut = {
            current_route: 'product',
            page_title: 'Ürün Özellikleri',
            product_endpoint: MiddleWare.getEndpoint('product'),
            current_product_id: req.params.product_id,
        };
        const parts = {
            tab_attributes: 'product-edit-attributes.ejs',
            tab_description: 'product-edit-description.ejs',
            tab_information: 'product-edit-information.ejs',
            tab_inventory: 'product-edit-inventory.ejs',
            tab_media: 'product-edit-media.ejs',
            tab_organize: 'product-edit-organize.ejs',
            tab_variants: 'product-edit-variants.ejs',
        }
        for (const key in parts) {
            if (parts.hasOwnProperty(key)) {
                bulut[key] = await ejs.renderFile(templatePath + parts[key], {});
            }
        }
        return res.render(templatePath +'product-edit.ejs', {bulut: bulut});
    }
    static async productList( req, res) {
        const templatePath = path.join(__dirname, '../views/product/product-list.ejs');
        var bulut = {
            current_route: 'product',
            page_title: 'Ürünler',
            data_table: Hattat.generateTable({ajaxUrl: MiddleWare.getEndpoint('product') +  'product/list', render:'productRender', rowCallback: 'productRowCallback', cols: {name:'Name', category:'Kategori', brand:'Marka', seller:'Mağaza'} }),
            user_endpoint: MiddleWare.getEndpoint('product')
        };
        return res.render(templatePath, {bulut: bulut});
    }
    static async brandEdit(req, res) {
        const templatePath = path.join(__dirname, '../views/product/brand/');
        var bulut = {
            current_route: 'brand',
            page_title: 'Marka Özellikleri',
            product_endpoint: MiddleWare.getEndpoint('product'),
            current_brand_id: req.params.brand_id,
        };
        return res.render(templatePath +'brand-edit.ejs', {bulut: bulut});
    }
    static async brandList( req, res) {
        const templatePath = path.join(__dirname, '../views/product/brand/brand-list.ejs');
        var bulut = {
            current_route: 'brand',
            page_title: 'Markalar',
            data_table: Hattat.generateTable({ajaxUrl: MiddleWare.getEndpoint('product') +  'product/brand', render:'brandRender', rowCallback: 'brandRowCallback', cols: {name:'Name'} }),
            user_endpoint: MiddleWare.getEndpoint('product')
        };
        return res.render(templatePath, {bulut: bulut});
    }
    static async categoryEdit(req, res) {
        const templatePath = path.join(__dirname, '../views/product/category/');
        var bulut = {
            current_route: 'category',
            page_title: 'Kategori Özellikleri',
            product_endpoint: MiddleWare.getEndpoint('product'),
            current_category_id: req.params.category_id,
        };
        return res.render(templatePath +'category-edit.ejs', {bulut: bulut});
    }
    static async categoryList( req, res) {
        const templatePath = path.join(__dirname, '../views/product/category/category-list.ejs');
        var bulut = {
            current_route: 'category',
            page_title: 'Kategoriler',
            data_table: Hattat.generateTable({ajaxUrl: MiddleWare.getEndpoint('product') +  'product/category', render:'categoryRender', rowCallback: 'categoryRowCallback', cols: {name:'Name'} }),
            user_endpoint: MiddleWare.getEndpoint('product')
        };
        return res.render(templatePath, {bulut: bulut});
    }
    static async attributeEdit(req, res) {
        const templatePath = path.join(__dirname, '../views/product/attribute/');
        var bulut = {
            current_route: 'attribute',
            page_title: 'Kategori Özellikleri',
            product_endpoint: MiddleWare.getEndpoint('product'),
            current_attribute_id: req.params.attribute_id,
        };
        return res.render(templatePath +'attribute-edit.ejs', {bulut: bulut});
    }
    static async attributeList( req, res) {
        const templatePath = path.join(__dirname, '../views/product/attribute/attribute-list.ejs');
        var bulut = {
            current_route: 'attribute',
            page_title: 'Ürün Özellikleri',
            data_table: Hattat.generateTable({ajaxUrl: MiddleWare.getEndpoint('product') +  'product/attribute', render:'attributeRender', rowCallback: 'attributeRowCallback', cols: {name:'Name'} }),
            user_endpoint: MiddleWare.getEndpoint('product')
        };
        return res.render(templatePath, {bulut: bulut});
    }
}
module.exports = ProductController;
