class CdnController {
    static async upload(req, res){
        const provider = require('./cdn/BulutCdn');
        return await provider.upload(req, res);
    }
}
module.exports = CdnController;