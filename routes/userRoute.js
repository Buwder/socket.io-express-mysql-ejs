
var user=require('../controllers/userController');

/*用户路径*/
exports.route=function(app){
    /*进入登录页*/
    app.get('/user',user.toLogin);
    /*登出*/
    app.get('/user/loginOut',user.loginOut);
    /*用户登录*/
    app.post('/user/login',user.login);
    /*用户从其他平台登录*/
    app.get('/user/otherLogin',user.otherLogin);
    /*用户主页*/
    app.get('/user/consultant_list',user.consultant_list);
    /*咨询师资料*/
    app.get('/user/cou_infor',user.cou_infor);
    /*咨询记录*/
    app.get('/user/consult_record',user.consult_record);
    /*咨询记录详情*/
    app.get('/user/one_consult_record',user.one_consult_record);
    /*预约页面*/
    app.get('/user/make_appointment',user.make_appointment);
    /*预约*/
    app.post('/user/appointment',user.appointment);
    /*我的预约*/
    app.get('/user/my_appointment',user.my_appointment);
    /*进入给咨询师留言界面*/
    app.get('/user/message',user.message);
    /*提交留言*/
    app.post('/user/submit_message',user.submitMessage);
    /*留言记录*/
    app.get('/user/message_list',user.messageList);
}
