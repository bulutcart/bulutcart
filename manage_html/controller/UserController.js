const ejs = require('ejs');
const path = require('path');
const MiddleWare = require('../../util/MiddleWare');
const Hattat = require('../Hattat');

class UserController {
    static home(req, res) {
        var bulut = {
            current_route: '',
            page_title: 'Profilim',
            user_endpoint: MiddleWare.getEndpoint('user')
        };
        return res.render('user/home', {bulut: bulut});
    }
    static async _userList(user_type, req, res) {
        const templatePath = path.join(__dirname, '../views/user/' + user_type + '/' + user_type + '-list.ejs');
        var bulut = {
            current_route: user_type,
            page_title: user_type,
            data_table: Hattat.generateTable({ajaxUrl: MiddleWare.getEndpoint('user') + user_type + '/list', render: user_type+'Render', rowCallback: user_type+'RowCallback', cols: {name:'Name', email:'Email'} }),
            user_endpoint: MiddleWare.getEndpoint('user')
        };
        return res.render(templatePath, {bulut: bulut});
    }
    static async customerList(req, res) {
        return this._userList('customer', req, res);
    }
    static async managerList(req, res) {
        return this._userList('manager', req, res);
    }
    static async sellerList(req, res) {
        return this._userList('seller', req, res);
    }

    static async _userEdit(user_type, parts, req, res) {
        const templatePath = path.join(__dirname, '../views/user/'+user_type+'/');
        var bulut = {
            current_route: user_type,
            page_title: 'Profilim',
            user_endpoint: MiddleWare.getEndpoint('user'),
            current_user_id: req.params.user_id,
        };
        for (const key in parts) {
            if (parts.hasOwnProperty(key)) {
                bulut[key] = await ejs.renderFile(templatePath + parts[key], {});
            }
        }
        return res.render(templatePath + user_type+'-edit.ejs', {bulut: bulut});
    }
    static async customerEdit(req, res) {
        const parts = {
            tab_address: 'customer-edit-address.ejs',
            tab_document: 'customer-edit-document.ejs',
            tab_overview: 'customer-edit-overview.ejs',
            tab_profile: 'customer-edit-profile.ejs',
            tab_security: 'customer-edit-security.ejs',
            tab_store: 'customer-edit-store.ejs',
        }
        return this._userEdit('customer', parts, req, res);
    }
    static async sellerEdit(req, res) {
        const parts = {
            tab_address: 'seller-edit-address.ejs',
            tab_document: 'seller-edit-document.ejs',
            tab_overview: 'seller-edit-overview.ejs',
            tab_profile: 'seller-edit-profile.ejs',
            tab_security: 'seller-edit-security.ejs',
            tab_store: 'seller-edit-store.ejs',
        }
        return this._userEdit('seller', parts, req, res);
    }
    static async managerEdit(req, res) {
        const parts = {
            tab_address: 'manager-edit-address.ejs',
            tab_document: 'manager-edit-document.ejs',
            tab_overview: 'manager-edit-overview.ejs',
            tab_profile: 'manager-edit-profile.ejs',
            tab_security: 'manager-edit-security.ejs',
            tab_store: 'manager-edit-store.ejs',
        }
        return this._userEdit('manager', parts, req, res);
    }
}
module.exports = UserController;
