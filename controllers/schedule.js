var sch = require('node-schedule');

var ejs=require('ejs');
var ms=require('../util/mysqlUtil');
var dateUtil=require('../util/dateUtil');
var sql=require('../util/sqlMapUtil').sql;

/*跟新预约信息*/
var updateAppointment=function(){
    var param={};
    ms.exc(ejs.render(sql.scheduleSQL.updateAppointment,param),function(appointment){
        console.log(appointment)
        var affectedRows=appointment.affectedRows;
        var now=dateUtil.format_datetime(new Date(),false);
        console.log(now+" updateAppointment number is "+affectedRows);
    })
}

/*定时任务*/
exports.index=function(){
    console.log("schedule running ........");
    /*跟新预约信息6个占位符分别为秒、分、时、日、月、周几*/
    sch.scheduleJob('0 0 0 * * *',updateAppointment );
}