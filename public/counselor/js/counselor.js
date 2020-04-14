/*咨询师*/

/*异常中断检查session*/
var checkSession=function(){
    $.ajax({
        async: false,
        url:'/counselor/checkSession',
        type:'post',
        dataType:'json',
        success:function(data){
            if(!data){
                location.href='/counselor';
            }
        },
        error:function(){
            location.href='/counselor';
        }
    });
}
/*掉线了*/
var dealWithOffline=function(){
    checkSession();
}
/*显示用户列表*/
var userList=function(){
    $("#menu_record").removeClass('mune-active');
    $("#menu_user").addClass('mune-active');
    $('#user-list').empty();
    $('#chat-panel-user').empty();
    beginUserList(socketChatData.unown);
}
/*显示用户列表*/
var beginUserList=function(unown){
   unown={unown:unown};
    $("#user-list-tmpl").tmpl(unown).appendTo($('#user-list'));
    /*置顶*/
    unown=unown.unown;
    for(var index in unown){
        if(unown[index].chatStatus){
            $("#user_list_"+unown[index].ucData.id).prependTo($("#user-list"));
            /*消息数*/
            var notice_number=0;
            for(var msg in socketChatData.unown[index].msgData){
                if(!socketChatData.unown[index].msgData[msg].haveRead && socketChatData.unown[index].msgData[msg].type!='send'){
                    notice_number++;
                }
            }
            if(notice_number>0){
                $("#notice_number_"+index).text(notice_number);
            }
        }
    }
}
/*改变用户列表*/
var changeUserList=function(unown,type){
    if($("#menu_user[class='mune-active']").length<1){
        return;
    }
    if(type=='add' && !($("#user_list_"+unown.ucData.id).length>0)){
        $("#change-user-list-tmpl").tmpl(unown).appendTo($('#user-list'));
    }
    if(type=='delete' && $("#user_list_"+unown.ucData.id)){
        $("#user_list_"+unown.ucData.id).remove();
        $("#chat_head_"+unown.ucData.id).remove();
        $("#chat_index_"+unown.ucData.id).remove();
        $("#chat_enter_"+unown.ucData.id).remove();
    }
}
/*显示聊天面板*/
var chatPanel=function(unownId){
    var notice_number=$("#notice_number_"+unownId).text('');

    $("[id^=user_list_]").each(function(){
        $(this).removeClass("msg-active");
    });
    $("#user_list_"+unownId).addClass("msg-active");
/*渲染聊天窗口*/
    var own=socketChatData.own;
    var unown=socketChatData.unown[unownId];
    var json={own:own,unown:unown};
    $('#chat-panel-user').empty();
    $("#chat-panel-user-tmpl").tmpl(json).appendTo($('#chat-panel-user'));
/**/
    if(unown.chatStatus!='undefined' &&  unown.chatStatus==true){
        $("#send_msg_text_"+unownId).attr('contenteditable','true');
        $("#closeConsultation_endBtn_"+unownId).css("display","block");
    }
/*渲染本地已有聊天信息*/
    for(var msg in unown.msgData){
        socketChatData.unown[unownId].msgData[msg].haveRead=true;
        json=unown.msgData[msg];
        if(json.type=='send'){
            $("#send-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg-'+unownId));
        }else if(json.type=='receive'){
            $("#receive-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg-'+unownId));
        }else{
            $("#system-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg-'+unownId));
        }
        /*聊天记录显示区域自动向上滚动*/
        chatIndexScrollTop(unownId);
    }
}
/*咨询师响应咨询*/
var userResponseConsultation=function(data){
    var unownId=data.unownId;
    var timeStamp=(new Date()).getTime();
    data['timeStampFormat']=timeStampFormatHoursMinutes(timeStamp);
    socketChatData.unown[unownId].msgData[timeStamp]=data;
    $("#notice_number_"+unownId).text(1);
    socketChatData.unown[unownId].consultRecordId=data.consultRecordId;

    socketChatData.unown[data.unownId].chatStatus=true;

    var json=data;
    $("#system-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg-'+unownId));
    /*提示*/
    hint(json.systemMsgText);
    /*修改列表咨询状态*/
    $("#notice_word_"+data.unownId).text("咨询中...");
    /*置顶*/
    $("#user_list_"+data.unownId).prependTo($("#user-list"));
    /*聊天记录显示区域自动向上滚动*/
    chatIndexScrollTop(unownId);
}
/*结束咨询*/
var closeConsultation=function(ownId,unownId){
    $("#user_list_"+unownId).removeClass("msg-active");
    $('#chat-panel-user').empty();
    socketChatData.unown[unownId].chatStatus=false;
    var consultRecordId=socketChatData.unown[unownId].consultRecordId;
    closeConsultationSocket({ownId:ownId,unownId:unownId,consultRecordId:consultRecordId,ownIdentity:'counselor',timeStamp:(new Date()).getTime()});
    /*修改列表咨询状态*/
    $("#notice_word_"+unownId).text("");
}
/*收到结束通知*/
var closeConsultationNotice=function(data){
    var unownId=data.unownId;
    socketChatData.unown[unownId].consultRecordId='';
    socketChatData.unown[unownId].chatStatus=false;

    /*保存消息到本地*/
    var timeStamp=(new Date()).getTime();
    data['timeStampFormat']=timeStampFormatHoursMinutes(timeStamp);
    socketChatData.unown[unownId].msgData[timeStamp]=data;
    var json=data;
    $("#system-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg-'+unownId));
    /*提示*/
    hint(json.systemMsgText);
    /*修改列表咨询状态*/
    $("#notice_word_"+data.unownId).text("");
    /*聊天记录显示区域自动向上滚动*/
    chatIndexScrollTop(unownId);

    $("#closeConsultation_endBtn_"+unownId).css("display","none");
    $("#send_msg_text_"+unownId).attr('contenteditable','false');
    $("#send_msg_text_"+unownId).empty();
    $("#chat_panel_status_"+data.unownId).text("未被咨询");
}
/*发送聊天消息*/
var sendMsg=function(ownId,unownId){
    var sendMsgText=$("#send_msg_text_"+unownId).html();
    if(sendMsgText==''){
        return;
    }
    sendMsgText=sendMsgText.replace(/<(?!img|br)[^>]+>/g,'');

    var consultRecordId=socketChatData.unown[unownId].consultRecordId;
    var data= {type:'send',ownIdentity:'counselor',ownId:ownId,unownId:unownId,sendMsgText:sendMsgText,consultRecordId:consultRecordId};
    var timeStamp=(new Date()).getTime();
    data['timeStamp']=timeStamp;
    sendMsgSocket(data);
    $("#send_msg_text_"+unownId).empty();
    /*保存消息到本地*/
    socketChatData.unown[unownId].msgData[timeStamp]=data;
    var json=data;
    json['timeStampFormat']=timeStampFormatHoursMinutes(timeStamp);
    $("#send-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg-'+unownId));
    /*聊天记录显示区域自动向上滚动*/
    chatIndexScrollTop(unownId);
}
/*接收聊天消息展示*/
var receiveMsg=function(data){
    /*保存消息到本地*/
    var timeStamp=(new Date()).getTime();
    data['timeStampFormat']=timeStampFormatHoursMinutes(timeStamp);
    socketChatData.unown[data.unownId].msgData[timeStamp]=data;
/*消息数*/
    var notice_number=0;
    for(var msg in socketChatData.unown[data.unownId].msgData){
        if(!socketChatData.unown[data.unownId].msgData[msg].haveRead){
            notice_number++;
        }
    }

    if(!($("#chat_panel_status_"+data.unownId).length>0)){
        $("#notice_number_"+data.unownId).text(notice_number);
    }else{
        $("#chat_panel_status_"+data.unownId).text("被咨询中");
    }
    socketChatData.unown[data.unownId].chatStatus=true;
    $("#send_msg_text_"+data.unownId).attr('contenteditable','true');
    $("#closeConsultation_endBtn_"+data.unownId).css("display","block");

    var json=data;
    $("#receive-msg-tmpl").tmpl(json).appendTo($('#send-receive-msg-'+data.unownId));
    /*提示*/
    hint(json.receiveMsgText);
    /*聊天记录显示区域自动向上滚动*/
    chatIndexScrollTop(data.unownId);
}
/*展示自己的信息，咨询师*/
var showOwnInfo=function(){
    return;
    var json=socketChatData.own;
    $("#counselor-info-tmpl").tmpl(json).appendTo($('body'));
}
/*关闭自己的信息，咨询师*/
var closeOwnInfo=function(){
    $("#own_info").remove();
    $("#own_info_bg").remove();
}
/*展示对方的信息，用户*/
var showUnownInfo=function(unownId){
    var json=socketChatData.unown[unownId].ucData;
    $("#user-info-tmpl").tmpl(json).appendTo($('body'));
}
/*关闭对方的信息，用户*/
var closeUnownInfo=function(){
    $("#unown_info").remove();
    $("#unown_info_bg").remove();
}

/*聊天记录显示区域自动向上滚动*/
var chatIndexScrollTop=function(unownId){
    $('#chat_index_'+unownId)[0].scrollTop=$('#chat_index_'+unownId)[0].scrollHeight;
}

/*显示expression-icon exp-face*/
var showExpFace=function(unownId){
    if(socketChatData.unown[unownId].chatStatus=='undefined' || socketChatData.unown[unownId].chatStatus!=true){
        return;
    }
    var display=$("#expression_layer_"+unownId).css('display');
    if(display=='none'){
        $("#expression_layer_"+unownId).show();
    }else{
        $("#expression_layer_"+unownId).hide();
    }
}
/*expression-icon exp-face*/
var selectExpFace=function(unownId,expBrow){
    var brow='<img class="expression-span '+expBrow+'" src="/util/images/spacer.gif">';
    $("#send_msg_text_"+unownId).append(brow);
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
        $("[id^=send_msg_btn_]")[0].click();
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
    $("#menu_user").addClass("mune-active");

    /*点击id=''之外的区域给id=''区域增加一个1*/
    $(document).click(function(event){
        var id=$(event.target).parent().parent().attr('id');
        var reg=new RegExp("^expression_layer_[0-9a-f]+$")
        if(!reg.test(id)){
            $("[id^=expression_layer_]").hide();
        }
    });
});
