var path = require('path');
var fs = require('fs');
var parseString = require('xml2js').parseString;
var ejs=require('ejs');

var sqlMapConfig=require('../configFiles/sqlMapConfig');

var sql={};

/*sql对象*/
exports.sql=sql;

/*初始化sql*/
/*注意：xml文件中<%%>和{%%}的关系*/
exports.initSQL=function(){
    console.log("initSQL running ........");

    var xmlp=sqlMapConfig.mapConfig;
    for(var i in xmlp){
        var p=path.normalize(path.resolve()+"/"+xmlp[i])

        var xname=path.basename(p,'.xml');
        var xml=fs.readFileSync(p,'utf-8');

        parseString(xml,function (err, result){
            var sqlObj=result.sql;
            for(var sname in sqlObj){
                sqlObj[sname]=sqlObj[sname][0].replace(/{%/g,"<%").replace(/%}/g,"%>");
            }
            sql[xname]=sqlObj;
        });
    }
}