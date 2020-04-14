
var counselor=require('../controllers/counselorController');

/*咨询师路径*/
exports.route=function(app){
    /*咨询师登录页面*/
    app.get('/counselor',counselor.toLogin);
    /*咨询师登录*/
    app.post('/counselor/login',counselor.login);
    /*咨询师主页*/
    app.get('/counselor/home',counselor.home);
    /*异常中断检查session*/
    app.post('/counselor/checkSession',counselor.checkSession);
}
