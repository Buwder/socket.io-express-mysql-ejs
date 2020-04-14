var uuid=require('node-uuid');
var ejs=require('ejs');
var ms=require('../util/mysqlUtil');
var sql=require('../util/sqlMapUtil').sql;
var chatData=require('./chat').chatData;

/*存储基本数据*/
exports.saveBaseData=function(param,callback){
    if(param.identity=='user'){
        ms.exc(ejs.render(sql.chatHandleSQL.userInfo,param),function(data){
            callback(data[0]);
        })
    }else{
        ms.exc(ejs.render(sql.chatHandleSQL.counselorInfo,param),function(data){
            callback(data[0]);
        })
    }
}
/*开始数据*/
exports.beginData=function(socketChatList,param,callback){
    var identity=socketChatList[param.ucId].identity;
    var own=socketChatList[param.ucId].ucData;
    var unown={};
    if(identity=='user'){
        ms.exc(ejs.render(sql.chatHandleSQL.AllCounselorInfo,param),function(data){
            for(var index in data){
                var dt=data[index];
                var online='N';
                if(socketChatList[dt.id]){
                    online='Y';
                }
                unown[dt.id]={ucData:dt,identity:'counselor',msgData:{},online:online};
            }
            var result={own:own,unown:unown,identity:identity};
            callback(result);
        })
    }else{
        for(var socketChatId in socketChatList){
            var val=socketChatList[socketChatId].ucData;
            var unownidentity=socketChatList[socketChatId].identity;
            if(val.product_id==own.product_id && unownidentity!=identity && val.id!=own.id){
                unown[socketChatId]={ucData:val,identity:unownidentity,msgData:{}};
            }
        }
        var result={own:own,unown:unown,identity:identity};
        callback(result);
    }
}
/*结束数据*/
exports.endData=function(socketChatList,param,callback){
    var own=socketChatList[param.ucId].ucData;
    var identity=socketChatList[param.ucId].identity;
    var unown={};

    for(var socketChat in socketChatList){
        var val=socketChatList[socketChat].ucData;
        var unownidentity=socketChatList[socketChat].identity;
        if(val.product_id==own.product_id && unownidentity!=identity && val.id!=own.id){
            unown[socketChat]={ucData:val,identity:unownidentity};
        }
    }

    var result={own:own,unown:unown,identity:identity};
    callback(result);
}
/*保存发送的消息到数据库*/
exports.saveSendMsgToDB=function(data){
    var param={};
    param['id']=uuid.v1().replace(/-/g,'');
    param['consultRecordId']=data.consultRecordId;
    param['msg_text']=data.sendMsgText;
    param['timeStamp']=data.timeStamp;
    param['send_people_id']=data.ownId;
    if(data.ownIdentity=='user'){
        param['user_id']=data.ownId;
        param['counselor_id']=data.unownId;
    }else{
        param['counselor_id']=data.ownId;
        param['user_id']=data.unownId;
    }
    param['system_msg']='N';
    ms.exc(ejs.render(sql.chatHandleSQL.saveSendMsgToDB,param),function(result){})
}
/*保存系统消息到数据库*/
exports.saveSystemMsgToDB=function(data){
    var param={};
    param['id']=uuid.v1().replace(/-/g,'');
    param['consultRecordId']=data.consultRecordId;
    param['msg_text']=data.sendMsgText;
    param['timeStamp']=data.timeStamp;
    param['send_people_id']=data.ownId;
    param['user_id']=data.ownId;
    param['counselor_id']=data.unownId;
    param['system_msg']='Y';
    ms.exc(ejs.render(sql.chatHandleSQL.saveSendMsgToDB,param),function(result){})
}
/*保存向咨询师发起咨询事件到数据库*/
exports.saveUserRequestConsultationToDB=function(data){
    var param={};
    param['id']=data.consultRecordId;
    param['user_id']=data.ownId;
    param['counselor_id']=data.unownId;
    ms.exc(ejs.render(sql.chatHandleSQL.saveUserRequestConsultationToDB,param),function(result){

    })
}
/*得到咨询师设置的欢迎语*/
exports.findCounselorWelcomeWord=function(data,callback){
    var param={};
    param['counselor_id']=data.unownId;
    ms.exc(ejs.render(sql.chatHandleSQL.findCounselorWelcomeWord,param),function(result){
        callback(result);
    })
}
/*保存咨询结束信息到数据库*/
exports.saveCloseConsultationToDB=function(data){
    var param={};
    param['id']=data.consultRecordId;
    param['ownIdentity']=data.ownIdentity;
    if(param.ownIdentity=='user'){
        param['user_id']=data.ownId;
        param['end_people']=data.ownId;
        param['counselor_id']=data.unownId;
    }else{
        param['counselor_id']=data.ownId;
        param['end_people']=data.ownId;
        param['user_id']=data.unownId;
    }
    ms.exc(ejs.render(sql.chatHandleSQL.selectConsultRecord,param),function(selectResult){
        var beginAt=selectResult[0].begin_at;
        param['consult_time']=(new Date()).getTime()-beginAt.getTime();
        ms.exc(ejs.render(sql.chatHandleSQL.saveCloseConsultationToDB,param),function(result){})
    })
}
/*根据id查看在线状态*/
exports.findONlineById=function(id){
    var result=false;
    var data=chatData[id];
    if(data){
        result=true;
    }
    return result;
}