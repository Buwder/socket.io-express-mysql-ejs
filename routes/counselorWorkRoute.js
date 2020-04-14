
var counselorWork=require('../controllers/counselorWorkController');

/*咨询师路径*/
exports.route=function(app){
    /*咨询师咨询记录*/
    app.get('/counselor/work/consultant_record',counselorWork.consultantRecord);
    /*添加备忘录*/
    app.post('/counselor/work/addbeiwang',counselorWork.addbeiwang);

    app.get('/counselor/work/selbeiwang',counselorWork.selbeiwang);
    /*一条咨询记录*/
    app.get('/counselor/work/one_consultant_record',counselorWork.oneConsultantRecord);
    /*预约管理*/
    app.get('/counselor/work/book_manage',counselorWork.bookManage);
    /*已设置预约信息*/
    app.post('/counselor/work/find_book_info',counselorWork.findBookInfo);
    /*修改预约信息设置*/
    app.post('/counselor/work/update_book_info',counselorWork.updateBookInfo);
    /*资料修改*/
    app.get('/counselor/work/edit_infor',counselorWork.editInfor);
    /*确认资料修改*/
    app.post('/counselor/work/submit_edit_infor',counselorWork.submitEditInfor);
    /*进入留言界面*/
    app.get('/counselor/work/message',counselorWork.message);
    /*留言提交回复*/
    app.post('/counselor/work/submit_message',counselorWork.submitMessage);
}
