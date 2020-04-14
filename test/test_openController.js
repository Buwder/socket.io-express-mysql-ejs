
var requestUtil=require('../util/requestUtil');

var host='http://192.168.0.101:5830';

var getLoginChat4Url=function(){
    var url=host+'/open/getLoginChat4Url';
    var form= {productKey:'123',userKey:'101',userName:'zhang01',age:'26',sex:'MALE',loginName:'zhang01',password:'123456'};
    requestUtil.doPost(url,form,function(data){
        console.info(data);
    });
}

var getAdminLoginChat4Url=function(){

    var url=host+'/open/getAdminLoginChat4Url';
    var form={productKey:'123',adminKey:'201',admin_name:'admin01',loginName:'admin01',password:'123456'};
    requestUtil.doPost(url,form,function(data){
        console.info(data);
    });
}

getLoginChat4Url();
getAdminLoginChat4Url();
