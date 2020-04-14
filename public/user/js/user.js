/*用户*/
var sUserAgent = navigator.userAgent.toLowerCase();
var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
var bIsMidp = sUserAgent.match(/midp/i) == "midp";
var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
var bIsAndroid = sUserAgent.match(/android/i) == "android";
var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

/*异常中断检查session*/
var checkSession=function(){
    $.ajax({
        async: false,
        url:'/user/chat/checkSession',
        type:'post',
        dataType:'json',
        success:function(data){
            if(!data){
                location.href='/user';
            }
        },
        error:function(){
            location.href='/user';
        }
    });
}
/*掉线了*/
var dealWithOffline=function(){
    checkSession();
}
/*发起咨询*/
var beginNow=function(){
    /*向咨询师发起咨询*/
    var own=socketChatData.own;
    var unown=socketChatData.unown[counselorId];

    var consultRecordId=uuid.v1().replace(/-/g,'');
    $("#consultRecordId").attr('value',consultRecordId);
    var data={ownId:own.id,unownId:counselorId,consultRecordId:consultRecordId,timeStamp:(new Date()).getTime()};

    userRequestConsultation(data);
}
/*处理咨询师设置的欢迎语*/
var dealWithCounselorWelcomeWord=function(data){
    /*保存消息到本地*/
    var timeStamp=(new Date()).getTime();
    data['timeStampFormat']=timeStampFormatHoursMinutes(timeStamp);
    socketChatData.unown[data.unownId].msgData[timeStamp]=data;
    var json=data;
    $("#system-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg'));
    /*提示*/
    hint(json.systemMsgText);
    /*聊天记录显示区域自动向上滚动*/
    $("#chat_index")[0].scrollTop=$("#chat_index")[0].scrollHeight;
}
/*发送聊天消息*/
var sendMsg=function(ownId){
    var sendMsgText=$("#send_msg_text").html();
    if(sendMsgText==''){
        return;
    }
    sendMsgText=sendMsgText.replace(/<(?!img|br)[^>]+>/g,'');

    var consultRecordId=$("#consultRecordId").attr('value');
    var data= {type:'send',ownIdentity:'user',ownId:ownId,unownId:counselorId,sendMsgText:sendMsgText,consultRecordId:consultRecordId};
    var timeStamp=(new Date()).getTime();
    data['timeStamp']=timeStamp;
    sendMsgSocket(data);
    $("#send_msg_text").empty();
    /*保存消息到本地*/
    socketChatData.unown[counselorId].msgData[timeStamp]=data;
    var json=data;
    json['timeStampFormat']=timeStampFormatHoursMinutes(timeStamp);
    $("#send-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg'));
    /*聊天记录显示区域自动向上滚动*/
    $("#chat_index")[0].scrollTop=$("#chat_index")[0].scrollHeight;
}
/*接收聊天消息展示*/
var receiveMsg=function(data){
    /*保存消息到本地*/
    var timeStamp=(new Date()).getTime();
    data['timeStampFormat']=timeStampFormatHoursMinutes(timeStamp);
    socketChatData.unown[data.unownId].msgData[timeStamp]=data;
    var json=data;
    json['ucData']=socketChatData.unown[data.unownId].ucData;
    $("#receive-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg'));
    /*提示*/
    hint(json.receiveMsgText);
    /*聊天记录显示区域自动向上滚动*/
    $("#chat_index")[0].scrollTop=$("#chat_index")[0].scrollHeight;
}
/*结束咨询*/
var closeConsultation=function(ownId){
    var consultRecordId=$("#consultRecordId").attr('value');
    if(consultRecordId){
        closeConsultationSocket({ownId:ownId,unownId:counselorId,consultRecordId:consultRecordId,ownIdentity:'user',timeStamp:(new Date()).getTime()});
    }
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        window.history.go(-1);
    } else {
        window.close();
    }

    window.close();
}
/*收到结束通知*/
var closeConsultationNotice=function(data){
    var unownId=data.unownId;
    $("#consultRecordId").attr('value','');

    /*保存消息到本地*/
    var timeStamp=(new Date()).getTime();
    data['timeStampFormat']=timeStampFormatHoursMinutes(timeStamp);
    socketChatData.unown[unownId].msgData[timeStamp]=data;
    var json=data;
    $("#system-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg'));
    /*提示*/
    hint(json.systemMsgText);
    /*聊天记录显示区域自动向上滚动*/
    $("#chat_index")[0].scrollTop=$("#chat_index")[0].scrollHeight;

    $("#send_msg_text").attr('contenteditable','false');
    $("#send_msg_text").empty();
    $("#send-btn").attr("href","javascript:void(0);");
    $("#smile-icon").attr("href","javascript:void(0);");
}

/*表情面板*/
var smileIcon=function(){
    var display=$("#expression_layer").css("display");
    if(display=="none"){
        $("#expression_layer").show();
    }else{
        $("#expression_layer").hide();
    }
}
/*选择表情*/
var selectExpFace=function(expBrow){
    var brow='<img class="expression-span '+expBrow+'" src="/util/images/spacer.gif">';
    $("#send_msg_text").append(brow);
}
var send_msg_text_keyup=function(obj){
    var evt = window.event;
    if(evt.keyCode==13){
        $(obj).empty();
    }
}
document.onkeydown = function(evt){
    var evt = window.event?window.event:evt;
    if(evt.keyCode==13){
        $("#send-btn")[0].click();
    }
}


/*判断本窗口是否被激活*/
var focusedOnWindow=true;
window.addEventListener('focus', function() {
    focusedOnWindow=true;
});
window.addEventListener('blur', function() {
    focusedOnWindow=false;
});
/*提示*/
function hint(data){
    if (window.Notification && !focusedOnWindow){
        var auem=document.getElementById("auem");
        auem.volume=0.6;
        auem.play();
        setTimeout(function () {
            auem.pause();
        }, 3000);
        var msg=data;
        msg=msg.replace(/<img[^>]+>/g,'[表情]');
        msg=msg.replace(/<\/?[^>]+>/g, '');
        var notification = new Notification('中盛凯新',{body:msg});
        Notification.requestPermission();
        notification.onshow=function() {
            setTimeout(function () {
                notification.close();
            }, 3000);
        }
    }
}


/*开始就执行的*/
$(function(){
    /*点击id=''之外的区域给id=''区域增加一个1*/
    $(document).click(function(event){
        var id=$(event.target).parent().parent().attr('id');
        var reg=new RegExp("expression_layer")
        if(!reg.test(id)){
            $("#expression_layer").hide();
        }
    });
});