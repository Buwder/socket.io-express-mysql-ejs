
var ski= require('socket.io');
var chatHandle= require('./chatHandle');

var socketChatList={};
exports.chatData=socketChatList;

exports.chat=function(server){
    io = ski.listen(server);
    io.on('connection', function (socket) {
        /*得到参数*/
        var param=socket.handshake.query;
        /*存储基本数据*/
        chatHandle.saveBaseData(param,function(data){
            socketChatList[param.ucId]={sk:socket,ucData:data,identity:param.identity};
            /*开始数据*/
            chatHandle.beginData(socketChatList,param,function(result){
                socket.emit('beginData', result);
                /*通知相关用户本人上线了*/
                for(var un in result.unown){
                    if(socketChatList[un]){
                        var sk=socketChatList[un].sk;
                        if(param.identity=='user'){
                            /*只给对应的咨询师通知上线*/
                            if(param.counselorId==un){
                                sk.emit('onlineNotice',{ucData:data,identity:param.identity,msgData:{}});
                            }
                        }else{
                            sk.emit('onlineNotice',{ucData:data,identity:param.identity,msgData:{},online:'Y'});
                        }
                    }
                }
            });
        });
        /*释放*/
        socket.on('disconnect', function () {
            /*结束数据*/
            chatHandle.endData(socketChatList,param,function(result){
                /*通知相关用户本人下线了*/
                for(var un in result.unown){
                    var sk=socketChatList[un].sk;
                    sk.emit('offlineNotice',{ucData:socketChatList[param.ucId].ucData,identity:param.identity});
                }
                /*删除本会话*/
                delete socketChatList[param.ucId];
            });
        });
        /*相互发送消息*/
        socket.on('sendMsg', function (data) {
            var ownId=data.ownId;
            var unownId=data.unownId;
            var sendMsgText=data.sendMsgText;
            /*保存发送的消息到数据库*/
            chatHandle.saveSendMsgToDB(data);
            var sk=socketChatList[unownId].sk;
            /*发送*/
            sk.emit('receiveMsg',{type:'receive',ownId:unownId,unownId:ownId,receiveMsgText:sendMsgText});
        });
        /*向咨询师发起咨询*/
        socket.on('userRequestConsultation', function (data) {
            var ownId=data.ownId;
            var unownId=data.unownId;
            var consultRecordId=data.consultRecordId;
            var sk=socketChatList[unownId].sk;
            var user_name=socketChatList[ownId].ucData.user_name;
            var systemMsgText=user_name+'请求向您咨询';
            /*保存向咨询师发起咨询事件到数据库*/
            chatHandle.saveUserRequestConsultationToDB(data);
            /*保存系统消息到数据库*/
            data['sendMsgText']=systemMsgText;
            chatHandle.saveSystemMsgToDB(data);
            sk.emit('userResponseConsultation',{type:'system',ownId:unownId,unownId:ownId,systemMsgText:systemMsgText,consultRecordId:consultRecordId});
            /*得到咨询师设置的欢迎语*/
            chatHandle.findCounselorWelcomeWord(data,function(welcomeWordObj){
                sk=socketChatList[ownId].sk;
                systemMsgText=welcomeWordObj[0].welcome_word;
                data['sendMsgText']=systemMsgText;
                data['ownId']=unownId;
                data['unownId']=ownId;
                chatHandle.saveSystemMsgToDB(data);
                sk.emit('counselorWelcomeWord',{type:'system',ownId:ownId,unownId:unownId,systemMsgText:systemMsgText,consultRecordId:consultRecordId});
            });
        });
        /*结束咨询*/
        socket.on("closeConsultation",function(data){
            var ownId=data.ownId;
            var unownId=data.unownId;
            var consultRecordId=data.consultRecordId;
            /*保存咨询结束信息到数据库*/
            chatHandle.saveCloseConsultationToDB(data);
            var name='';
            if(param.identity=='user'){
                name=socketChatList[ownId].ucData.user_name;
            }else{
                name=socketChatList[ownId].ucData.counselor_name;
            }
            var systemMsgText=name+'结束了本次咨询';
            data['sendMsgText']=systemMsgText;
            chatHandle.saveSystemMsgToDB(data);
            var sk=socketChatList[unownId].sk;
            sk.emit('closeConsultation',{type:'system',ownId:unownId,unownId:ownId,systemMsgText:systemMsgText,consultRecordId:consultRecordId});
        })
    });
}