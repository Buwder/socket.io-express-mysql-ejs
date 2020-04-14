
/*过滤用户路径*/
exports.filterCheck=function(req,res,next){
    var isToLogin=req.baseUrl=='/user'?true:false;
    var isLogin=req.baseUrl=='/user/login'?true:false;
    var isOtherLogin=req.baseUrl=='/user/otherLogin'?true:false;

    if(isToLogin || isLogin || isOtherLogin){
        next();
    }else{
        if(req.session.user){
            next();
        }else{
            res.redirect('/user');
        }
    }
}
