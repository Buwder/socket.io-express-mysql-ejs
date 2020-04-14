
/*过滤咨询师管理后台路径*/
exports.filterCheck=function(req,res,next){
    var isToLogin=req.baseUrl=='/coumg'?true:false;
    var isLogin=req.baseUrl=='/coumg/login'?true:false;
    var isOtherLogin=req.baseUrl=='/coumg/otherLogin'?true:false;

    var isUploadHead=req.baseUrl=='/coumg/uploadHead'?true:false;
    var isShowIMGdata=req.baseUrl=='/coumg/showIMGdata'?true:false;

    if(isToLogin || isLogin || isOtherLogin || isUploadHead || isShowIMGdata){
        next();
    }else{
        if(req.session.admin){
            next();
        }else{
            res.redirect('/coumg');
        }
    }
}