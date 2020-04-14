var uuid=require('node-uuid');
var ejs=require('ejs');
var otherConfig=require('../configFiles/config').otherConfig;
var ms=require('../util/mysqlUtil');
var sql=require('../util/sqlMapUtil').sql;
var dateUtil=require('../util/dateUtil');

/*咨询师登录页面*/
exports.toLogin=function(req,res,next){
    var now=dateUtil.format_datetime(new Date()).substring(0,4);
    var result={now:now};
    res.render('counselor/login',result);
}
/*咨询师登录*/
exports.login=function(req,res,next){
    var postParam=req.body;
    ms.exc(ejs.render(sql.counselorSQL.counselorInfo,postParam),function(counselorInfo){
        var result={code:1};
        if(counselorInfo.length>0){
            /*放入session*/
            req.session.counselor={
                counselorId:counselorInfo[0].id,
                counselorName:counselorInfo[0].counselor_name
            };
            result['code']=0;
            result['msg']='success';
            res.send(result);
        }else{
            result['code']=1;
            result['msg']='fail';
            res.send(result);
        }
    })
}
/*咨询师主页*/
exports.home=function(req,res,next) {
    var counselor=req.session.counselor;
    if(!counselor){
        res.redirect('/counselor');
    }
    if(counselor.counselorName.length>2){
        counselor.counselorName=counselor.counselorName.substr(0,2)+"...";
    }
    res.render('counselor/home', {counselor:counselor,otherConfig:otherConfig});
}
/*异常中断检查session*/
exports.checkSession=function(req,res,next) {
    var result=true;
    var counselor=req.session.counselor;
    if(counselor){
        result=true;
    }else{
        result=false;
    }
    res.send(result);
}