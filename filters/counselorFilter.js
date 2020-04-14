
/*过滤咨询师路径*/
exports.filterCheck=function(req,res,next){
    var isToLogin=req.baseUrl=='/counselor'?true:false;
    var isLogin=req.baseUrl=='/counselor/login'?true:false;

    if(isToLogin || isLogin){
        next();
    }else{
        if(req.session.counselor){
            next();
        }else{
            res.redirect('/counselor');
        }
    }
}