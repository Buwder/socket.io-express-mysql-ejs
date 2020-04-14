var uuid=require('node-uuid');
var ejs=require('ejs');
var ms=require('../util/mysqlUtil');
var sql=require('../util/sqlMapUtil').sql;


/*得到其他平台的免登录地址（用户）*/
exports.getLoginChat4Url=function(req,res,next){
    var uid=uuid.v1().replace(/-/g,'');
    var postParam=req.body;
    postParam['user_url_param']=uid;
    postParam['user_url_param_time_stamp']=(new Date()).getTime();
/*校验产品合法性*/
    ms.exc(ejs.render(sql.openSQL.authProduct,postParam),function(authProduct){
	 if(authProduct.length>0){
            postParam['productId']=authProduct[0].id;
            /*校验用户合法性*/
            ms.exc(ejs.render(sql.openSQL.authUserInfo,postParam),function(authUser){
                if(authUser.length>0){
                    /*跟新用户基本信息*/
                    postParam['userId']=authUser[0].id;
                    ms.exc(ejs.render(sql.openSQL.updateUserInfo,postParam),function(data){
                        ms.exc(ejs.render(sql.openSQL.updateUserUrlParam,postParam),function(data){
                            var result={code:0};
                            result['msg']='success';
                            result['user_url_param']=uid;
                            res.send(result);
                        });
                    });
                }else{
                    /*插入用户信息*/
                    postParam['userId']=uid;
                    ms.exc(ejs.render(sql.openSQL.insertUserInfo,postParam),function(data){
                        var affectedRows=data.affectedRows;
                        if(affectedRows>0){
                            ms.exc(ejs.render(sql.openSQL.updateUserUrlParam,postParam),function(data){
                                var result={code:0};
                                result['msg']='success';
                                result['user_url_param']=uid;
                                res.send(result);
                            });
                        }else{
                            var result={code:1};
                            result['msg']='fail';
                            res.send(result);
                        }
                    })
                }
            })
        }else{
            var result={code:1};
            result['msg']='fail';
            res.send(result);
        }
    })
}
/*得到其他平台的免登录地址（管理员）*/
exports.getAdminLoginChat4Url=function(req,res,next){
    var uid=uuid.v1().replace(/-/g,'');
    var postParam=req.body;
    postParam['admin_url_param']=uid;
    postParam['admin_url_param_time_stamp']=(new Date()).getTime();
    /*校验产品合法性*/
    ms.exc(ejs.render(sql.openSQL.authProduct,postParam),function(authProduct){
        if(authProduct.length>0) {
            postParam['productId'] = authProduct[0].id;
            /*校验用户合法性*/
            ms.exc(ejs.render(sql.openSQL.authAdminInfo,postParam),function(authAdmin){
                if(authAdmin.length>0){
                    /*跟新管理员基本信息*/
                    postParam['adminId']=authAdmin[0].id;
                    ms.exc(ejs.render(sql.openSQL.updateAdminInfo,postParam),function(data) {
                        ms.exc(ejs.render(sql.openSQL.updateAdminUrlParam, postParam), function (data) {
                            var result = {code: 0};
                            result['msg'] = 'success';
                            result['admin_url_param'] = uid;
                            res.send(result);
                        })
                    })
                }else{
                    /*插入管理员信息*/
                    postParam['adminId']=uid;
                    ms.exc(ejs.render(sql.openSQL.insertAdminInfo,postParam),function(data){
                        var affectedRows=data.affectedRows;
                        if(affectedRows>0){
                            ms.exc(ejs.render(sql.openSQL.updateAdminUrlParam,postParam),function(data){
                                var result={code:0};
                                result['msg']='success';
                                result['admin_url_param']=uid;
                                res.send(result);
                            })
                        }else{
                            var result={code:1};
                            result['msg']='fail';
                            res.send(result);
                        }
                    })
                }
            })
        }else{
            var result={code:1};
            result['msg']='fail';
            res.send(result);
        }
    })
}
exports.getCoumgList = function(req,res,next){
    var parm = req.query;
	ms.exc(ejs.render(sql.openSQL.getCoumgList,parm),function(data){
		var result = {};
		if(data.length > 0){
			result.code = 0;
			result.coumglist = data;
		}else if(data.length == 0){
			result.code = 1;
            result.msg='暂无管理员';
		}else{
			result.code = -1;
			result.msg = 'file';
		}
		res.send(result);
	})
}
exports.inHosinfo = function (req,res,next) {
    var parm = req.query;
    var result = {};
    parm.product_name = decodeURI(parm.product_name);
    ms.exc(ejs.render(sql.openSQL.productinfo,parm),function (data) {
        if(data.length > 0){
            result.code = 1;
            result.msg = "机构已存在!";
            res.send(result);
        }else{
            ms.exc(ejs.render(sql.openSQL.inHosinfo,parm),function (data) {
                if(data.affectedRows>0){
                    result.code = 0;
                    result.msg = "开通成功!";
                }else{
                    result.code = -1;
                    result.msg = "操作失败!";
                }
                res.send(result);
            })
        }
    })
}
