
var openRoute=require('./openRoute');
var userRoute=require('./userRoute');
var userChatRoute=require('./userChatRoute');
var counselorRoute=require('./counselorRoute');
var counselorWorkRoute=require('./counselorWorkRoute');
var coumgRoute=require('./coumgRoute');

module.exports=function(app){
    /*开放路径*/
    openRoute.route(app);
    /*用户路径*/
    userRoute.route(app);
    userChatRoute.route(app);
    /*咨询师路径*/
    counselorRoute.route(app);
    counselorWorkRoute.route(app);
    /*咨询师管理后台路径*/
    coumgRoute.route(app);
}