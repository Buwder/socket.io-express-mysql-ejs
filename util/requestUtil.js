
var request=require('request');

exports.doGet=function(url,callback){
    request(url, function (error, response, body) {
        callback(body);
    })
}

exports.doPost= function (url,form,callback) {
    request.post({url:url, form: form}, function(err,httpResponse,body){
        callback(body);
    })
}