/**
 * Created by andy on 2018-07-04.
 * QQ 188888888
 * Mobile 15888888888
 */
let crypto = require("crypto");

export function md5(origin) {
    let data = crypto.createHash('md5');
    data.update(origin);
    return data.digest('hex');
}

export function sha1(origin) {
    let data = crypto.createHash('sha1');
    data.update(origin);
    return data.digest('hex');
}

export function encode(key, iv, data) {
    let cryptKey = crypto.createHash('sha256').update(key).digest();
    let encipher = crypto.createCipheriv('aes-256-cbc', cryptKey, iv);
    return encipher.update(data, 'utf8', 'base64') + encipher.final('base64');
}

export function decode(key, iv, data) {
    let cryptKey = crypto.createHash('sha256').update(key).digest();
    let decipher = crypto.createDecipheriv('aes-256-cbc', cryptKey, iv);
    return decipher.update(data, 'base64', 'utf8') + decipher.final('utf8');
}
