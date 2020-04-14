
var open=require('../controllers/openController');

/*开放路径*/
exports.route=function(app){
    //得到其他平台的免登录地址（用户）
    app.post('/open/getLoginChat4Url',open.getLoginChat4Url);
    //得到其他平台的免登录地址（管理员）
    app.post('/open/getAdminLoginChat4Url',open.getAdminLoginChat4Url);
    //提供给pem咨询师查询接口
    app.get('/open/getCoumgList',open.getCoumgList);
    //录入医院信息
    app.get('/open/inHosinfo',open.inHosinfo);
}