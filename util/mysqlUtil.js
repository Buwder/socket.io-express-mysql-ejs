
var mysql=require('mysql');
var mysqlConfig=require('../configFiles/config').mysqlConfig;

//mysql数据库连接池使用
var msPool=mysql.createPool({
    host:mysqlConfig.host,
    user:mysqlConfig.user,
    password:mysqlConfig.password,
    database:mysqlConfig.database,
    port:mysqlConfig.port
});

exports.exc=function(sql,callback){
    msPool.getConnection(function(error, connection) {
        if (error) {
            console.log(error);
            throw error;
        }
        connection.query(sql,function(err,data){
            if(err){
                console.log(err);
                throw err;
            }else{
                callback(data);
            }
        });
        connection.release();
    });
}