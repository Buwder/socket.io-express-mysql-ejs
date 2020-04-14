var uuid=require('node-uuid');
var ejs=require('ejs');
var otherConfig=require('../configFiles/config').otherConfig;
var ms=require('../util/mysqlUtil');
var sql=require('../util/sqlMapUtil').sql;
var dateUtil=require('../util/dateUtil');
var findONlineById=require('../chatControllers/chatHandle').findONlineById;

/*进入聊天页面*/
exports.chat=function(req,res,next){
    var result={};
    var queryParam=req.query;
    var user=req.session.user;
    var param={counselorId:queryParam.counselorId,userId:user.userId};
    result['user']=user;
    result['otherConfig']=otherConfig;
    //做必要校验
    //判断咨询师是否在线true或false
    var online=findONlineById(param.counselorId);
    //处理预约日期
    ms.exc(ejs.render(sql.userChatSQL.appointmentInfo,param),function(appointmentInfo){
        if(appointmentInfo.length>0){
            appointmentInfo=appointmentInfo[0];
            appointmentInfo.appointment_date=dateUtil.format_datetime_day(appointmentInfo.appointment_date);
            var value=appointmentInfo.appointment_date.split("-");
            var date=new Date();
            if(!(value[0]==date.getFullYear() || value[1]==(date.getMonth()+1) || value[2]==date.getDate()) && online){
                online=false;
            }
        }
        if(online){
            ms.exc(ejs.render(sql.userChatSQL.couInfor,queryParam),function(couInfor){
                result['couInfor']=couInfor[0];
                res.render('user/chat',result);
            })
        }
    })
}
/*异常中断检查session*/
exports.checkSession=function(req,res,next) {
    var result=true;
    var user=req.session.user;
    if(user){
        result=true;
    }else{
        result=false;
    }
    res.send(result);
}