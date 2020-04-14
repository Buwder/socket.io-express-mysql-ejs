var uuid=require('node-uuid');
var math=require('../util/mathUtil');
var ejs=require('ejs');
var otherConfig=require('../configFiles/config').otherConfig;
var ms=require('../util/mysqlUtil');
var sql=require('../util/sqlMapUtil').sql;
var dateUtil=require('../util/dateUtil');
var findONlineById=require('../chatControllers/chatHandle').findONlineById;

var loginOutConfig=require('../configFiles/config').loginOutConfig;

/*登录页面*/
exports.toLogin=function(req,res,next){
    if(loginOutConfig.coumg!=''){
        res.redirect(loginOutConfig.coumg);
    }else{
        res.render('coumg/login',{});
    }
}
/*登录（其他平台）*/
exports.otherLogin=function(req,res,next){
    var queryParam=req.query;
    ms.exc(ejs.render(sql.coumgSQL.adminOtherInfo,queryParam),function(adminInfo){
        var result={code:1};
        if(adminInfo.length>0){
            //var dd=(new Date()).getTime()-adminInfo[0].admin_url_param_time_stamp;
            //if(dd<1000*60*30) {
                /*放入session*/
                req.session.admin={
                    adminId:adminInfo[0].id,
                    adminName:adminInfo[0].admin_name,
                    productId:adminInfo[0].product_id
                };
                res.redirect('/coumg/counselor');
            // }else{
            //     res.redirect('/coumg');
            // }
        }else {
            res.redirect('/coumg');
        }
    })
}
/*登录*/
exports.login=function(req,res,next){
    var postParam=req.body;
    var param={loginName:postParam.loginName,password:postParam.password};
    ms.exc(ejs.render(sql.coumgSQL.adminInfo,param),function(adminInfo){
        var result={code:1};
        if(adminInfo.length>0){
            /*放入session*/
            req.session.admin={
                adminId:adminInfo[0].id,
                adminName:adminInfo[0].admin_name,
                productId:adminInfo[0].product_id
            };
            result['code']=0;
            result['msg']='success';
            res.send(result);
        }else {
            result['code'] = 1;
            result['msg'] = 'fail';
            res.send(result);
        }
    })
}
/*登出*/
exports.loginOut=function(req,res,next){
    delete req.session.admin;
    res.redirect('/coumg');
}
/*咨询师登录页面*/
exports.counselor=function(req,res,next){
    var result={};
    var queryParam=req.query;
    var curentpage=parseInt(queryParam.curentpage?queryParam.curentpage:0);
    var pagesize=10;
    var admin=req.session.admin;
    result['admin']=admin;
/*查询出咨询师*/
    var param={product_id:admin.productId,pagesize:pagesize};
    ms.exc(ejs.render(sql.coumgSQL.counselorListCout,param),function(counselorListCout){
        var pageNumber=math.ceil(counselorListCout[0].count/pagesize);
        curentpage=curentpage>=pageNumber?pageNumber-1:curentpage;
        curentpage=curentpage<0?0:curentpage;
        param['startLine']=curentpage*pagesize;
        ms.exc(ejs.render(sql.coumgSQL.counselorList,param),function(counselorList){
            for(var index in counselorList){
                var online=findONlineById(counselorList[index].id);
                counselorList[index].online=online;
            }
            result['counselorList']=counselorList;
            result['page']={curentpage:curentpage,pagesize:pagesize,pageNumber:pageNumber};
            res.render('coumg/counselor',result);
        })
    })
}
/*进入创建咨询师界面*/
exports.toCreateCounselor=function(req,res,next){
    var result={};
    var admin=req.session.admin;
    result['admin']=admin;
    result['otherConfig']=otherConfig;
    res.render('coumg/createCounselor',result);
}
/*图片上传*/
exports.uploadHead=function(req,res,next){
    var fileInfo = req.file;
    var imgData=fileInfo.buffer.toString('base64');
    var uid=uuid.v1().replace(/-/g,'');
    var param={id:uid,imgData:imgData};
    ms.exc(ejs.render(sql.coumgSQL.insertIMGData,param),function(data){
        var result={code:0,head_img_id:uid};
        res.send(result);
    })
}
/*展示图片*/
exports.showIMGdata=function(req,res,next){
    var queryParam=req.query;
    var param={imgId:queryParam.imgId};
    var result;
    ms.exc(ejs.render(sql.coumgSQL.showIMGdata,param),function(data){
        if(data.length>0 && data[0].img_data){
            result=new Buffer(data[0].img_data, 'base64');
        }
        res.send(result);
    })
}
/*创建咨询师*/
exports.createCounselor=function(req,res,next){
    var postParam=req.body;
    var uid=uuid.v1().replace(/-/g,'');
    var admin=req.session.admin;
    var param={
        id:uid,
        product_id:admin.productId,
        login_name:postParam.login_name,
        password:postParam.password,
        counselor_name:postParam.counselor_name,
        welcome_word:postParam.welcome_word,
        age:postParam.age,
        sex:postParam.sex,
        brief_introduction:postParam.brief_introduction,
        head_img_id:postParam.head_img_id
    };
    ms.exc(ejs.render(sql.coumgSQL.insertCounselor,param),function(data){
        var result={code:1};
        if(data.affectedRows>0){
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
/*进入修改咨询师界面*/
exports.toModifyCounselor=function(req,res,next){
    var result={};
    var queryParam=req.query;
    var admin=req.session.admin;
    result['admin']=admin;
    result['otherConfig']=otherConfig;
    var param={counselorId:queryParam.counselorId};
    ms.exc(ejs.render(sql.coumgSQL.counselorInfo,param),function(counselorInfo){
        result['counselorInfo']=counselorInfo[0];
        res.render('coumg/modifyCounselor',result);
    })
}
/*修改咨询师*/
exports.modifyCounselor=function(req,res,next){
    var postParam=req.body;
    var param={
        id:postParam.id,
        login_name:postParam.login_name,
        password:postParam.password,
        counselor_name:postParam.counselor_name,
        welcome_word:postParam.welcome_word,
        age:postParam.age,
        sex:postParam.sex,
        brief_introduction:postParam.brief_introduction,
        head_img_id:postParam.head_img_id
    }
    ms.exc(ejs.render(sql.coumgSQL.updateCounselor,param),function(data){
        var result={code:1};
        if(data.affectedRows>0){
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
/*删除咨询师*/
exports.rmCounselor=function(req,res,next){
    var postParam=req.body;
    var param={id:postParam.id}
    ms.exc(ejs.render(sql.coumgSQL.rmCounselor,param),function(data){
        res.send({});
    })
}
/*咨询记录列表*/
exports.recordList=function(req,res,next){
    var result={};
    var queryParam=req.query;
    var curentpage=parseInt(queryParam.curentpage?queryParam.curentpage:0);
    var pagesize=10;
    var admin=req.session.admin;
    result['admin']=admin;
    /*查询出咨询师*/
    var param={counselorId:queryParam.counselorId,pagesize:pagesize};
    ms.exc(ejs.render(sql.coumgSQL.recordrListCout,param),function(recordrListCout){
        var pageNumber=math.ceil(recordrListCout[0].count/pagesize);
        curentpage=curentpage>=pageNumber?pageNumber-1:curentpage;
        curentpage=curentpage<0?0:curentpage;
        param['startLine']=curentpage*pagesize;
        ms.exc(ejs.render(sql.coumgSQL.recordList,param),function(recordList){
            for(var index in recordList){
                recordList[index].begin_at=dateUtil.format_datetime(recordList[index].begin_at,false);
                recordList[index].consult_time=dateUtil.consultTimeFormatToMinutes(recordList[index].consult_time);
            }
            result['recordList']=recordList;
            result['page']={curentpage:curentpage,pagesize:pagesize,pageNumber:pageNumber};
            ms.exc(ejs.render(sql.coumgSQL.counselorInfo,param),function(counselorInfo){
                result['counselorInfo']=counselorInfo[0];
                res.render('coumg/recordList',result);
            })
        })
    })
}
/*咨询记录详情*/
exports.recordDetail=function(req,res,next){
    var result={};
    var queryParam=req.query;
    var admin=req.session.admin;
    result['admin']=admin;
    var param={consultRecordId:queryParam.consultRecordId,counselorId:queryParam.counselorId};
    ms.exc(ejs.render(sql.coumgSQL.recordDetail,param),function(recordDetail){
        for(var index in recordDetail){
            recordDetail[index].create_at=dateUtil.format_datetime(recordDetail[index].create_at,false);
        }
        result['recordDetail']=recordDetail;
        ms.exc(ejs.render(sql.coumgSQL.counselorInfo,param),function(counselorInfo){
            result['counselorInfo']=counselorInfo[0];
            res.render('coumg/recordDetail',result);
        })
    })
}