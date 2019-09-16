import { Application } from "pinus";

/**
 * 游戏玩法配置
 */
export interface MarySlotSet {
    SetId:number;
    Normal:[number[],number[],number[],number[],number[]]; // 正常游戏玩法配置
    Free:[number[],number[],number[],number[],number[]]; // 免费次数玩法配置
    Game:{
        Probs:number[];
        Reward:[
            number[],number[],number[],number[],number[],number[],number[],number[],
            number[],number[],number[],number[],number[],number[],number[],number[],
            number[],number[],number[],number[],number[],number[],
        ];
    }; // 小游戏玩法配置
    JackPot:{Reward:number[]};
}

/**
 * 开心水果机配置
 */
export interface MarySlotConfig {
    PlatformRatio:number; // 平台抽水比例
    HandselRatio:number; // 奖池抽水比例
    RoomRatio:number; // 房间税收
    Bet:number[]; // 下注值（单注）
    PullInterval:number; //
    IsRecordLog:number; //
    nFreeTime:number; //
    NoticeMulti:number //
    NoticeWord:string; //世界通知
    NoticeHandsel:string; //
    ControlLevel:{[level:string]:[number,number,number[],number[]]}; // 控制等级
    RoomControl:{Init:number,Level_Range:[number[],number[],number[],number[],number[]]}; // 房间控制
    StoreForUserNet:{InterveneTime:number,HighStore:number[],LowStore:number[]};
    Set_1:MarySlotSet;
    Set_2:MarySlotSet;
    Set_3:MarySlotSet;
}

export class Mary_Slot_Table {
    
    private static ROOM_LIST:Map<number,Mary_Slot_Table> = new Map<number,Mary_Slot_Table>();
    private static TABLE_ID:number = 0;

    private app: Application = null;
    private room_index:number = null;
    private room_config:MarySlotConfig = null;
    private table_id:number = null;

    public static createTable(app: Application,room_index:number) {
        return new Mary_Slot_Table(app,room_index);
    }

    constructor(app: Application,room_index:number) {
        this.app = app;
        this.room_index = room_index;
        this.room_config = app.get('HappyFruit_'+room_index);
        this.table_id = Mary_Slot_Table.TABLE_ID;
        Mary_Slot_Table.TABLE_ID ++;
        Mary_Slot_Table.ROOM_LIST[this.table_id] = this;
    }


}