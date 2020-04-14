
// 格式化日期
exports.format_datetime = function (date, friendly){
    if (!date){
        return "";
    };
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (friendly) {
        var now = new Date();
        var mseconds = -(date.getTime() - now.getTime());
        var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
        if (mseconds < time_std[3]) {
            if (mseconds > 0 && mseconds < time_std[1]) {
                return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
            }
            if (mseconds > time_std[1] && mseconds < time_std[2]) {
                return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
            }
            if (mseconds > time_std[2]) {
                return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
            }
        }
    }

    hour = ((hour < 10) ? '0' : '') + hour;
    minute = ((minute < 10) ? '0' : '') + minute;
    second = ((second < 10) ? '0': '') + second;

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
};
// 格式化日期,到日
exports.format_datetime_day = function (date){
    if (!date){
        return "";
    };
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return year + '-' + month + '-' + day ;
};
/*把时长转换成分秒数据*/
exports.consultTimeFormatToMinutes=function(consultTime){
    var second = consultTime/1000;
    var minute=second/60;

    minute=parseInt(minute);
    second=parseInt(second)-minute*60;

    minute = ((minute < 10) ? '0' : '') + minute;
    second = ((second < 10) ? '0': '') + second;

    return minute+':'+second;
}