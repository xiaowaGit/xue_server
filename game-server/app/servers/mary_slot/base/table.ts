import { Application } from "pinus";
import { make_slot_reward } from "./make";

let xmcommon = require('xmcommon');
let utils = xmcommon.utils;
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
    private null_reward_num: number;
    private small_game_num: number;
    private free_game_num: number;

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
        this.null_reward_num = 0; // 连续空奖次数
        this.small_game_num = 0; // 小游戏剩余次数
        this.free_game_num = 0; // 免费转次数
        this.init_pool();
    }

    /**
     *  初始化奖池
     */
    async init_pool() {
        let REDIS_HSETNX = global['REDIS_HSETNX'];
        let Init = this.room_config.RoomControl.Init;
        await utils.WaitFunctionEx(REDIS_HSETNX, 'Mary_Slot', 'room_pool', Init);
    }

    /**
     *  下注摇奖
     */
    async put_bet(bet:number) {
        let REDIS_HGET = global['REDIS_HGET'];
        let room_pool = await utils.WaitFunctionEx(REDIS_HGET, 'Mary_Slot', 'room_pool');
        if(room_pool[0] != null) return {code:403};
        room_pool = ~~room_pool[1] || 0;
        let reward = make_slot_reward(room_pool,this.room_config);
        return reward;
    }
}