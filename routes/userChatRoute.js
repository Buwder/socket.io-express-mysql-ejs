
var userChat=require('../controllers/userChatController');

/*用户路径*/
exports.route=function(app){
    /*用户主页*/
    app.get('/user/chat/chat',userChat.chat);
    /*异常中断检查session*/
    app.post('/user/chat/checkSession',userChat.checkSession);
}
