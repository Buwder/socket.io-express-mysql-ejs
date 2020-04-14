/*加密，解密*/
var crypto = require('crypto');

var algs = ['des','blowfish','aes-256-cbc','cast','des3','idea','rc2','rc4','seed'];
var algorithm=algs[0];

//加密
exports.cipher=function(key, buf, cb){
    var encrypted = "";
    var cip = crypto.createCipher(algorithm, key);
    encrypted += cip.update(buf, 'binary', 'hex');
    encrypted += cip.final('hex');
    cb(encrypted);
}

//解密
exports.decipher=function(key, encrypted, cb){
    var decrypted = "";
    var decipher = crypto.createDecipher(algorithm, key);
    decrypted += decipher.update(encrypted, 'hex', 'binary');
    decrypted += decipher.final('binary');
    cb(decrypted);
}

