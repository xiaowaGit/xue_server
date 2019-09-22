import { VerifyToken } from "./token";
import { GlobalChannelServiceStatus } from "pinus-global-channel-status";
import { GAME_TYPE } from "./enum";

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


export async function inGame(uid:string,globalChannelStatus: GlobalChannelServiceStatus) {
    let channel_arr = [GAME_TYPE.MARY_SLOT];
    let members = await globalChannelStatus.getMembersByChannelName("connector",channel_arr);
    /**
     * { connector_1:{ channelName1: [ 'uuid_21', 'uuid_12', 'uuid_24', 'uuid_27' ] },
                            connector_2: { channelName1: [ 'uuid_15', 'uuid_9', 'uuid_0', 'uuid_18' ] },
                            connector_3: { channelName1: [ 'uuid_6', 'uuid_3' ] }
    */
    for (const server_id in members) {
        if (members.hasOwnProperty(server_id)) {
            const element = members[server_id];
            for (const channel_name in element) {
                if (element.hasOwnProperty(channel_name)) {
                    const uids = element[channel_name];
                    if (uids.indexOf(uid) != -1) { ///// 在某个游戏中
                        return true;
                    }
                }
            }
        }
    }
    return false;
}