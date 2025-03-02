class Response{
    static success(message, data, recordsTotal=null, recordsFiltered=null ){
        return this._message("success", message, data, [], recordsTotal, recordsFiltered);
    }
    static error(message, errors){
        return this._message("error", message, [], errors);
    }
    static _message(status, message, data, errors, recordsTotal=null, recordsFiltered=null){
        var response = {
            date: new Date(),
            version: process.env.VERSION || '1.0.0',
            status: status,
            message: message,
            data: data,
            errors: errors,
            recordsFiltered:recordsFiltered,
            recordsTotal:recordsTotal,
        }
        if(recordsFiltered!=null){
            response['recordsFiltered'] = recordsFiltered;
        }
        if(recordsTotal!=null){
            response['recordsTotal'] = recordsTotal;
        }
        return response
    }
}
module.exports = Response;