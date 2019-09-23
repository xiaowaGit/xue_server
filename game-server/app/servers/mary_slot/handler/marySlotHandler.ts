import { Application, FrontendSession, BackendSession } from 'pinus';
import { Mary_Slot_Table } from '../base/table';

export default function (app: Application) {
    return new marySlotHandler(app);
}

export class marySlotHandler {
    constructor(private app: Application) {

    }

    /**
     * 进入游戏
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @return {*}
     */
    async entry(msg: {room_index:number}, session: BackendSession) {
        let uid:number = ~~session.uid;
        let table:Mary_Slot_Table = Mary_Slot_Table.findTable(uid);
        if (table) {
            return {code:500,data:"你已经在房间中."}
        }
        let room_index:number = ~~msg.room_index;
        if (room_index < 1 || room_index > 4) return {code:501,data:"room_index参数错误."}
        table = Mary_Slot_Table.createTable(this.app,room_index);
        return await table.enter_game(uid);
    }

    /**
     * 离开游戏
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @return {*}
     */
    async leave(msg: any, session: BackendSession) {
        let uid:number = ~~session.uid;
        let table:Mary_Slot_Table = Mary_Slot_Table.findTable(uid);
        if (table) {
            return await table.leave_game(uid);
        }
        return {code:500,data:"你已经不在游戏中."};
    }

    
    /**
     * 摇奖
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @return {*}
     */
    async put_bet(msg: {bet:number}, session: BackendSession) {
        let uid:number = ~~session.uid;
        let bet:number = ~~msg.bet;
        let table:Mary_Slot_Table = Mary_Slot_Table.findTable(uid);
        if (!table) {
            return {code:500,data:"你已经不在房间中."}
        }
        return await table.put_bet(bet);
    }

    
    /**
     * 小玛丽摇奖
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @return {*}
     */
    async small_put_bet(msg:any, session: BackendSession) {
        let uid:number = ~~session.uid;
        let table:Mary_Slot_Table = Mary_Slot_Table.findTable(uid);
        if (!table) {
            return {code:500,data:"你已经不在房间中."}
        }
        return await table.small_put_bet();
    }
}