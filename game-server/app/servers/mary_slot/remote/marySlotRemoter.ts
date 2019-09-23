import {Application, RemoterClass, FrontendSession, BackendSession} from 'pinus';
import { Mary_Slot_Table } from '../base/table';

export default function (app: Application) {
    return new MarySlotRemoter(app);
}

// UserRpc的命名空间自动合并
declare global {
    interface UserRpc {
        mary_slot: {
            // 一次性定义一个类自动合并到UserRpc中
            marySlotRemoter: RemoterClass<FrontendSession | BackendSession, MarySlotRemoter>;
        };
    }
}


export class MarySlotRemoter {
    constructor(private app: Application) {

    }

    /**
     * 下线
     * @param uid
     */
    public async outLine(uid:string) {
        ////TODO: ---- > 下线 退出房间
        let table:Mary_Slot_Table = Mary_Slot_Table.findTable(~~uid);
        if (table) {
            await table.leave_game(~~uid);
        }
        return true;
    }

}