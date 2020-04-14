
/*数字向上取整*/
exports.ceil=function(float){
    var temp=parseInt(float)
    var point=float%1;
    if(point>0){
        temp+=1;
    }
    return temp;
}