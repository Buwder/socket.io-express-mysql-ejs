var uuid=require('node-uuid');
var math=require('../util/mathUtil');
var ejs=require('ejs');
var otherConfig=require('../configFiles/config').otherConfig;
var ms=require('../util/mysqlUtil');
var sql=require('../util/sqlMapUtil').sql;
var dateUtil=require('../util/dateUtil');
var findONlineById=require('../chatControllers/chatHandle').findONlineById;

var loginOutConfig=require('../configFiles/config').loginOutConfig;

/*进入登录页*/
exports.toLogin=function(req,res,next){
    if(loginOutConfig.user!=''){
        res.redirect(loginOutConfig.user);
    }else{
        res.render('user/login',{});
    }
}
/*登出*/
exports.loginOut=function(req,res,next){
    /*放入session*/
    delete(req.session.user);
    res.redirect('/user');
}
/*用户登录*/
exports.login=function(req,res,next){
    var postParam=req.body;
    ms.exc(ejs.render(sql.userSQL.userInfoSelf,postParam),function(userInfo){
        var result={code:1};
        if(userInfo.length>0){
            /*放入session*/
            req.session.user={
                userId:userInfo[0].id,
                userName:userInfo[0].user_name,
                productId:userInfo[0].product_id
            };
            result['code']=0;
            result['msg']='success';
            res.send(result);
        }else{
            result['code'] = 1;
            result['msg'] = 'fail';
            res.send(result);
        }
    })
}
/*用户从其他平台登录*/
exports.otherLogin=function(req,res,next){
    var queryParam=req.query;
    ms.exc(ejs.render(sql.userSQL.userInfo,queryParam),function(userInfo){
        if(userInfo.length>0){
            var dd=(new Date()).getTime()-userInfo[0].user_url_param_time_stamp;
            if(dd<1000*60*30){
                /*放入session*/
                req.session.user={
                    userId:userInfo[0].id,
                    userName:userInfo[0].user_name,
                    productId:userInfo[0].product_id
                };
                res.redirect('/user/consultant_list');
            }else{
                res.redirect('/user');
            }
        }else{
            res.redirect('/user');
        }
    })
}
/*进入主页*/
exports.consultant_list=function(req,res,next){
    var result={};
    var user=req.session.user;
    var param={productId:user.productId,userId:user.userId};
    var date=new Date();
    //咨询师信息
    ms.exc(ejs.render(sql.userSQL.counselorInfoList,param),function(counselorInfoList){
        for(var index in counselorInfoList){
            counselorInfoList[index].count=counselorInfoList[index].count?counselorInfoList[index].count:0;
            //判断咨询师是否在线true或false
            counselorInfoList[index].online=findONlineById(counselorInfoList[index].id);
            //处理预约日期
            //counselorInfoList[index].appointment_date=dateUtil.format_datetime_day(counselorInfoList[index].appointment_date);
            // var value=counselorInfoList[index].appointment_date.split("-");
            // if(!(value[0]==date.getFullYear() || value[1]==(date.getMonth()+1) || value[2]==date.getDate()) && counselorInfoList[index].online){
            //     counselorInfoList[index].online=false;
            // }
        }
        result['counselorInfoList']=counselorInfoList;
        res.render('user/consultant_list',result);
    })
}
/*咨询师资料*/
exports.cou_infor=function(req,res,next){
    var result={};
    var queryParam=req.query;
    ms.exc(ejs.render(sql.userSQL.couInfor,queryParam),function(couInfor){
        result['couInfor']=couInfor[0];
        res.render('user/cou_infor',result);
    })
}
/*咨询记录*/
exports.consult_record=function(req,res,next){
    var result={};
    var user=req.session.user;
    var queryParam=req.query;
    var curentpage=parseInt(queryParam.curentpage?queryParam.curentpage:0);
    var pagesize=10;
    var param={userId:user.userId,pagesize:pagesize};
    ms.exc(ejs.render(sql.userSQL.consultRecordCount,param),function(consultRecordCount){
        var pageNumber=math.ceil(consultRecordCount[0].count/pagesize);
        curentpage=curentpage>=pageNumber?pageNumber-1:curentpage;
        curentpage=curentpage<0?0:curentpage;
        param['startLine']=curentpage*pagesize;
        ms.exc(ejs.render(sql.userSQL.consultRecord,param),function(data){
            for(var index in data){
                data[index].begin_at=dateUtil.format_datetime(data[index].begin_at,false);
                data[index].end_at=dateUtil.format_datetime(data[index].end_at,false);
                data[index].consult_time=dateUtil.consultTimeFormatToMinutes(data[index].consult_time);
            }
            result['recordList']=data;
            result['page']={curentpage:curentpage,pagesize:pagesize,pageNumber:pageNumber};
            res.render('user/consult_record',result);
        })
    })
}
/*咨询记录详情*/
exports.one_consult_record=function(req,res,next){
    var result={};
    var user=req.session.user;
    var queryParam=req.query;
    var param={consultRecordId:queryParam.consultRecordId};
    ms.exc(ejs.render(sql.userSQL.oneConsultRecord,param),function(consultRecord){
        for(var index in consultRecord){
            consultRecord[index].create_at=dateUtil.format_datetime(consultRecord[index].create_at,false);
        }
        result["consultRecord"]=consultRecord;
        res.render('user/one_consult_record',result);
    })
}
/*预约页面*/
exports.make_appointment=function(req,res,next){
    var result={};
    var user=req.session.user;
    var queryParam=req.query;
    var param={counselorId:queryParam.id,userId:user.userId};
    ms.exc(ejs.render(sql.userSQL.counselorAppointmentInfo,param),function(appointmentInfo){
        appointmentInfo=appointmentInfo[0];
        appointmentInfo.count=appointmentInfo.count?appointmentInfo.count:0;
        result["appointmentInfo"]=appointmentInfo;
        res.render('user/make_appointment',result);
    })
}
/*预约*/
exports.appointment=function(req,res,next){
    var result={};
    var user=req.session.user;
    var postParam=req.body;
    var uid=uuid.v1().replace(/-/g,'');
    var param={counselorId:postParam.counselorId,userId:user.userId,uid:uid,appointmentDate:postParam.appointmentDate};
    ms.exc(ejs.render(sql.userSQL.appointment,param),function(appointment){
        var affectedRows=appointment.affectedRows;
        if(affectedRows>0) {
            result['code'] = 0;
            result['msg'] = 'success';
        }else{
            result['code'] = 1;
            result['msg'] = 'fail';
        }
        res.send(result);
    })
}
/*我的预约*/
exports.my_appointment=function(req,res,next){
    var result={};
    var user=req.session.user;
    var queryParam=req.query;
    var curentpage=parseInt(queryParam.curentpage?queryParam.curentpage:0);
    var pagesize=10;
    var param={userId:user.userId,pagesize:pagesize};
    ms.exc(ejs.render(sql.userSQL.myAppointmentCount,param),function(myAppointmentCount){
        var pageNumber=math.ceil(myAppointmentCount[0].count/pagesize);
        curentpage=curentpage>=pageNumber?pageNumber-1:curentpage;
        curentpage=curentpage<0?0:curentpage;
        param['startLine']=curentpage*pagesize;
        ms.exc(ejs.render(sql.userSQL.myAppointmentList,param),function(myAppointmentList){
            for(var index in myAppointmentList){
                myAppointmentList[index].create_at=dateUtil.format_datetime(myAppointmentList[index].create_at,false);
                if(myAppointmentList[index].overdue=='N'){
                    myAppointmentList[index].modify_at='';
                }else{
                    myAppointmentList[index].modify_at=dateUtil.format_datetime(myAppointmentList[index].modify_at,false);
                }
                myAppointmentList[index].appointment_date=dateUtil.format_datetime_day(myAppointmentList[index].appointment_date);
            }
            result['myAppointmentList']=myAppointmentList;
            result['page']={curentpage:curentpage,pagesize:pagesize,pageNumber:pageNumber};
            res.render('user/my_appointment',result);
        })
    })
}
/*进入给咨询师留言界面*/
exports.message=function(req,res,next){
    var result={};
    var user=req.session.user;
    var queryParam=req.query;
    var curentpage=parseInt(queryParam.curentpage?queryParam.curentpage:0);
    var pagesize=10;
    var param={userId:user.userId,counselorId:queryParam.counselorId,pagesize:pagesize};
    ms.exc(ejs.render(sql.userSQL.messageCount,param),function(messageCount){
        var pageNumber=math.ceil(messageCount[0].count/pagesize);
        curentpage=curentpage>=pageNumber?pageNumber-1:curentpage;
        curentpage=curentpage<0?0:curentpage;
        param['startLine']=curentpage*pagesize;
        ms.exc(ejs.render(sql.userSQL.messageList,param),function(messageList){
            for(var index in messageList){
                messageList[index].msg_user_create_at=dateUtil.format_datetime(messageList[index].msg_user_create_at,false);
                messageList[index].msg_counselor_create_at=dateUtil.format_datetime(messageList[index].msg_counselor_create_at,false);
            }
            result['counselorId']=queryParam.counselorId;
            result['messageList']=messageList;
            result['page']={curentpage:curentpage,pagesize:pagesize,pageNumber:pageNumber};
            res.render('user/message',result);
        })
    })
}
/*提交留言*/
exports.submitMessage=function(req,res,next){
    var result={};
    var user=req.session.user;
    var postParam=req.body;
    var uid=uuid.v1().replace(/-/g,'');
    var param={counselorId:postParam.counselorId,userId:user.userId,uid:uid,message_text:postParam.message_text};
    ms.exc(ejs.render(sql.userSQL.submitMessage,param),function(submitMessage){
        res.send(result);
    })
}
/*留言记录*/
exports.messageList=function(req,res,next){
    var result={};
    var user=req.session.user;
    var queryParam=req.query;
    var curentpage=parseInt(queryParam.curentpage?queryParam.curentpage:0);
    var pagesize=10;
    var param={userId:user.userId,pagesize:pagesize};
    ms.exc(ejs.render(sql.userSQL.messageUserCount,param),function(messageCount){
        var pageNumber=math.ceil(messageCount[0].count/pagesize);
        curentpage=curentpage>=pageNumber?pageNumber-1:curentpage;
        curentpage=curentpage<0?0:curentpage;
        param['startLine']=curentpage*pagesize;
        ms.exc(ejs.render(sql.userSQL.messageUserList,param),function(messageList){
            for(var index in messageList){
                messageList[index].msg_user_create_at=dateUtil.format_datetime(messageList[index].msg_user_create_at,false);
                messageList[index].msg_counselor_create_at=dateUtil.format_datetime(messageList[index].msg_counselor_create_at,false);
            }
            result['messageList']=messageList;
            result['page']={curentpage:curentpage,pagesize:pagesize,pageNumber:pageNumber};
            res.render('user/message_list',result);
        })
    })
}