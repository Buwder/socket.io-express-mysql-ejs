
/*过滤咨询师路径*/
exports.filterCheck=function(req,res,next){
    if(req.session.counselor){
        next();
    }else{
        res.redirect('/counselor');
    }
}