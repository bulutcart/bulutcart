const MiddleWare = require("../../util/MiddleWare");

class LoginController {
    static login(req, res){
        const MiddleWare = require('../../util/MiddleWare');
        var bulut = {
            current_route: 'seller',
            user_endpoint: MiddleWare.getEndpoint('user')
        };
        return res.render('login/index', {bulut:bulut});
    }
    static logout(req, res){
        res.clearCookie("bulutToken");
        var bulut = {
            user_endpoint: MiddleWare.getEndpoint('user')
        };
        return res.render('login/index', {bulut:bulut});
    }
}
module.exports = LoginController;