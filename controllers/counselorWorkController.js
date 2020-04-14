var uuid=require('node-uuid');
var math=require('../util/mathUtil');
var ejs=require('ejs');
var otherConfig=require('../configFiles/config').otherConfig;
var ms=require('../util/mysqlUtil');
var sql=require('../util/sqlMapUtil').sql;
var dateUtil=require('../util/dateUtil');

/*咨询师咨询记录*/
exports.consultantRecord=function(req,res,next){
    var result={};
    var counselor=req.session.counselor;
    var queryParam=req.query;
    var curentpage=parseInt(queryParam.curentpage?queryParam.curentpage:0);
    var pagesize=10;
    var param={counselorId:counselor.counselorId,pagesize:pagesize};
    ms.exc(ejs.render(sql.counselorWorkSQL.counselorRecordListCount,param),function(counselorRecordListCount){
        var pageNumber=math.ceil(counselorRecordListCount[0].count/pagesize);
        curentpage=curentpage>=pageNumber?pageNumber-1:curentpage;
        curentpage=curentpage<0?0:curentpage;
        param['startLine']=curentpage*pagesize;
        ms.exc(ejs.render(sql.counselorWorkSQL.counselorRecordList,param),function(data){
            for(var index in data){
                data[index].begin_at=dateUtil.format_datetime(data[index].begin_at,false);
                data[index].end_at=dateUtil.format_datetime(data[index].end_at,false);
                data[index].consult_time=dateUtil.consultTimeFormatToMinutes(data[index].consult_time);
            }
            result['recordList']=data;
            result['page']={curentpage:curentpage,pagesize:pagesize,pageNumber:pageNumber};
            res.render('counselor/consultant_record',result);
        })
    })
}
exports.addbeiwang = function(req,res,next){
    var result={};
    var queryBody = req.body;
    ms.exc(ejs.render(sql.counselorWorkSQL.addbeiwang,queryBody),function (data) {
        if(data.changedRows > 0){
            result['code'] = 0;
            result['msg'] = 'success'
        }else{
            result['code'] = -1;
            result['msg'] = 'fail'
        }
        res.send(result);
    })
}
exports.selbeiwang = function(req,res,next){
    var result = {};
    var parm = req.query;
    ms.exc(ejs.render(sql.counselorWorkSQL.selbeiwang,parm),function (data) {
        if(data.length > 0){
            result['code'] = 0;
            result['msg'] = 'success';
            result['data'] = data[0];
        }else{
            result['code'] = -1;
            result['msg'] = 'fail'
        }
        res.send(result);
    })
}
/*一条咨询记录*/
exports.oneConsultantRecord=function(req,res,next) {
    var result={};
    var queryParam=req.query;
    var param={consultRecordId:queryParam.consultRecordId};
    ms.exc(ejs.render(sql.counselorWorkSQL.oneConsultantRecord,param),function(consultRecord){
        for(var index in consultRecord){
            consultRecord[index].create_at=dateUtil.format_datetime(consultRecord[index].create_at,false);
        }
        result['consultRecord']=consultRecord;
        res.render('counselor/one_consultant_record',result);
    })
}
/*一条咨询记录*/
exports.bookManage=function(req,res,next) {
    var result={};
    var counselor=req.session.counselor;
    result['counselorId']=counselor.counselorId;
    var queryParam=req.query;
    var curentpage=parseInt(queryParam.curentpage?queryParam.curentpage:0);
    var pagesize=10;
    var param={counselorId:counselor.counselorId,pagesize:pagesize};
    ms.exc(ejs.render(sql.counselorWorkSQL.bookManageListCount,param),function(bookManageListCount){
        var pageNumber=math.ceil(bookManageListCount[0].count/pagesize);
        curentpage=curentpage>=pageNumber?pageNumber-1:curentpage;
        curentpage=curentpage<0?0:curentpage;
        param['startLine']=curentpage*pagesize;
        ms.exc(ejs.render(sql.counselorWorkSQL.bookManageList,param),function(bookManageList){
            result['bookManageList']=bookManageList;
            result['page']={curentpage:curentpage,pagesize:pagesize,pageNumber:pageNumber};
            res.render('counselor/book_manage',result);
        })
    })
}
/*已设置预约信息*/
exports.findBookInfo=function(req,res,next) {
    var result={};
    var counselor=req.session.counselor;
    var param={counselorId:counselor.counselorId};
    ms.exc(ejs.render(sql.counselorWorkSQL.findBookInfo,param),function(findBookInfo){
        result['findBookInfo']=findBookInfo[0];
        res.send(result);
    })
}
/*修改预约信息设置*/
exports.updateBookInfo=function(req,res,next) {
    var result={};
    var counselor=req.session.counselor;
    var postParam=req.body;
    var param={counselorId:counselor.counselorId,work_time_interval:postParam.work_time_interval,appointment_max_num:postParam.appointment_max_num};
    ms.exc(ejs.render(sql.counselorWorkSQL.updateBookInfo,param),function(updateBookInfo){
        res.send(result);
    })
}
/*资料修改*/
exports.editInfor=function(req,res,next) {
    var result={};
    var counselor=req.session.counselor;
    var param={counselorId:counselor.counselorId};
    ms.exc(ejs.render(sql.counselorWorkSQL.counselorInfor,param),function(counselorInfor){
        result['counselorInfor']=counselorInfor[0];
        res.render('counselor/edit_infor',result);
    })
}
/*确认资料修改*/
exports.submitEditInfor=function(req,res,next) {
    var result={};
    var counselor=req.session.counselor;
    var postParam=req.body;
    var param={counselorId:counselor.counselorId,head_img_id:postParam.head_img_id,counselor_name:postParam.counselor_name,brief_introduction:postParam.brief_introduction};
    ms.exc(ejs.render(sql.counselorWorkSQL.updateEditInfor,param),function(updateEditInfor){
        res.send(result);
    })
}
/*进入留言界面*/
exports.message=function(req,res,next) {
    var result={};
    var counselor=req.session.counselor;
    var queryParam=req.query;
    var curentpage=parseInt(queryParam.curentpage?queryParam.curentpage:0);
    var pagesize=10;
    var param={counselorId:counselor.counselorId,pagesize:pagesize};
    ms.exc(ejs.render(sql.counselorWorkSQL.messageListCount,param),function(messageListCount){
        var pageNumber=math.ceil(messageListCount[0].count/pagesize);
        curentpage=curentpage>=pageNumber?pageNumber-1:curentpage;
        curentpage=curentpage<0?0:curentpage;
        param['startLine']=curentpage*pagesize;
        ms.exc(ejs.render(sql.counselorWorkSQL.messageList,param),function(messageList){
            for(var index in messageList){
                messageList[index].msg_user_create_at=dateUtil.format_datetime(messageList[index].msg_user_create_at,false);
                messageList[index].msg_counselor_create_at=dateUtil.format_datetime(messageList[index].msg_counselor_create_at,false);
            }
            result['messageList']=messageList;
            result['page']={curentpage:curentpage,pagesize:pagesize,pageNumber:pageNumber};
            res.render('counselor/message',result);
        })
    })
}
/*留言提交回复*/
exports.submitMessage=function(req,res,next) {
    var result={};
    var counselor=req.session.counselor;
    var postParam=req.body;
    var uid=uuid.v1().replace(/-/g,'');
    var param={uid:uid,userId:postParam.userId,counselorId:counselor.counselorId,msg_user_id:postParam.msg_user_id,message_text:postParam.message_text};
    ms.exc(ejs.render(sql.counselorWorkSQL.submitMessage,param),function(submitMessage){
        res.send(result);
    })
}