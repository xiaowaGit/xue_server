import { VerifyToken } from "./token";

export function get_random_int(min:number,max:number) {
    if (max <= min) return Math.floor(max);
    let c:number = max - min;
    c = Math.random() * c;
    return Math.floor(min + c);
}


export function base64(str) {
    return new Buffer(str).toString('base64');
}

export function unbase64(str) {
    return new Buffer(str, 'base64').toString();
}

export function s_http(code:number,data:any,res:any) {
    res.send(JSON.stringify({code,data}));
}

/**
 * 校验token
 * @param req 
 */
export function is_enable_token(req:any) {
    let {uid,token} = req.body;
    if (!uid || !token) return false;
    let {ok} = VerifyToken(uid, token);
    return ok;
}