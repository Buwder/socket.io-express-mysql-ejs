
var openFilter=require('./openFilter');
var userFilter=require('./userFilter');
var userChatFilter=require('./userChatFilter');
var counselorFilter=require('./counselorFilter');
var counselorWorkFilter=require('./counselorWorkFilter');
var coumgFilter=require('./coumgFilter');

/*过滤*/
module.exports=function(app){
    /*过滤开放路径*/
    app.use('/open/*',openFilter.filterCheck);
    /*过滤用户路径*/
    app.use('/user/*',userFilter.filterCheck);
    app.use('/user/chat/*',userChatFilter.filterCheck);
    /*过滤咨询师路径*/
    app.use('/counselor/*',counselorFilter.filterCheck);
    app.use('/counselor/work/*',counselorWorkFilter.filterCheck);
    /*过滤咨询师管理后台路径*/
    app.use('/coumg/*',coumgFilter.filterCheck);
}