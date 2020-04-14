/*咨询师*/
/*ws-socket*/
var socket = io.connect(chatIp);
/*储存聊天数据*/
var socketChatData={};

window.onunload = disConnect;//监听浏览器关闭时
function disConnect(){
    socket.disconnect();
}
/*掉线了*/
socket.on('disconnect', function () {
    dealWithOffline();
});
/*开始数据*/
socket.on('beginData', function (data) {
    socketChatData=data;
    beginUserList(socketChatData.unown);
});
/*上线通知*/
socket.on('onlineNotice', function (data) {
    changeUserList(data,'add');
    socketChatData.unown[data.ucData.id]=data;
});
/*下线通知*/
socket.on('offlineNotice', function (data) {
    changeUserList(data,'delete');
    delete socketChatData.unown[data.ucData.id];
});
/*咨询师响应咨询*/
socket.on('userResponseConsultation',function(data){
    userResponseConsultation(data);
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
