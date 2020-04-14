
/*从时间戳中得到时、分数据*/
var timeStampFormatHoursMinutes=function(timeStamp){
    var date=new Date(timeStamp);
    var hour = date.getHours();
    var minute = date.getMinutes();

    hour = ((hour < 10) ? '0' : '') + hour;
    minute = ((minute < 10) ? '0' : '') + minute;

    return hour+":"+minute;
}