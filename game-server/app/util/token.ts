/**
 * Created by andy on 2018-07-04.
 * QQ 188888888
 * Mobile 15888888888
 */
import {md5, encode, decode} from './encrypt';
import {base64, unbase64} from './tool';

let setting = {
    "key": "fatcat_2017",
    "iv": "1234567891234567",
    "token_key": "~PinZheng@Ninghai"
};

/**
 * 构建Token
 * @param uid
 * @param name
 * @param avatar
 * @returns {*}
 * @constructor
 */
export function NewToken(uid, {name, avatar}) {
    let token = md5(setting.token_key + uid);
    let str = uid + '#' + token + '#' + Date.now() + '#' + "name";
    return base64(encode(setting.key, setting.iv, str));
}

/**
 * 验证Token
 * @param uid
 * @param token
 * @returns {{ok: boolean}}
 * @constructor
 */
export function VerifyToken(uid, token) {
    let result = {ok: false};
    try {
        let str = decode(setting.key, setting.iv, unbase64(token));
        let args = str.split('#');
        result.ok = args[0] == uid && md5(setting.token_key + uid) == args[1];
        // result.name = args[3];
        // result.avatar = args[4];
        return result;
    } catch (ex) {
        return result;
    }
}

export function AnalysisToken(token) {
    let result = {ok: false, uid: -1};
    try {
        let str = decode(setting.key, setting.iv, unbase64(token));
        let args = str.split('#');
        result.uid = ~~args[0];
        result.ok = true;
        return result;
    } catch (ex) {
        return result;
    }
}
