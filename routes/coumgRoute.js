//文件上传支持
var multer  = require('multer');
var upload = multer({ storage: multer.memoryStorage() });

var coumg=require('../controllers/coumgController');

/*咨询师管理后台路径*/
exports.route=function(app){
    /*登录页面*/
    app.get('/coumg',coumg.toLogin);
    /*登录（其他平台）*/
    app.get('/coumg/otherLogin',coumg.otherLogin);
    /*登录*/
    app.post('/coumg/login',coumg.login);
    /*登出*/
    app.get('/coumg/loginOut',coumg.loginOut);
    /*咨询师管理后台主页*/
    app.get('/coumg/counselor',coumg.counselor);
    /*进入创建咨询师界面*/
    app.get('/coumg/toCreateCounselor',coumg.toCreateCounselor);
    /*图片上传*/
    app.post('/coumg/uploadHead',upload.single('img'),coumg.uploadHead);
    /*展示图片*/
    app.get('/coumg/showIMGdata',coumg.showIMGdata);
    /*创建咨询师*/
    app.post('/coumg/createCounselor',coumg.createCounselor);
    /*进入修改咨询师界面*/
    app.get('/coumg/toModifyCounselor',coumg.toModifyCounselor);
    /*修改咨询师*/
    app.post('/coumg/modifyCounselor',coumg.modifyCounselor);
    /*删除咨询师*/
    app.post('/coumg/rmCounselor',coumg.rmCounselor);
    /*咨询记录列表*/
    app.get('/coumg/recordList',coumg.recordList);
    /*咨询记录详情*/
    app.get('/coumg/recordDetail',coumg.recordDetail);
}