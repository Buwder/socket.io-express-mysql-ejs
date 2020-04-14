/*用户*/
/*ws-socket*/
var socket = io.connect(chatIp);
/*储存聊天数据*/
var socketChatData={};

window.onunload = disConnect;//监听浏览器关闭时
function disConnect(){
    socket.disconnect();
}
/*向咨询师发起咨询*/
var userRequestConsultation=function(data){
    socket.emit('userRequestConsultation', data);
}
/*开始数据*/
socket.on('beginData', function (data) {
    socketChatData=data;
    beginNow();
});
/*掉线了*/
socket.on('disconnect', function () {
    dealWithOffline();
});
/*咨询师设置的欢迎语*/
socket.on('counselorWelcomeWord', function (data) {
    dealWithCounselorWelcomeWord(data);
});
/*发送消息*/
var sendMsgSocket=function(data){
    socket.emit('sendMsg', data);
}
/*接收消息*/
socket.on('receiveMsg', function (data) {
    receiveMsg(data);
});
/*结束咨询*/
var closeConsultationSocket=function(data){
    socket.emit("closeConsultation",data);
}
/*收到结束通知*/
socket.on('closeConsultation', function (data) {
    closeConsultationNotice(data);
});