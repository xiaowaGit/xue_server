import { Application } from "pinus";
import { make_slot_reward, Ret, Small_Ret, make_small_slot_reward } from "./make";
import { getConnection, Connection } from "typeorm";
import { User_MOG } from "../../../entity/User_MOG";
import { GlobalChannelServiceStatus } from "pinus-global-channel-status";
import { GAME_TYPE } from "../../../util/enum";
import { inGame } from "../../../util/tool";
import { utils } from 'xmcommon'

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
    private small_game_reward_num: number;
    private xue_game: Connection; // 用户数据库连接
    private user: User_MOG;
    private globalChannelStatus: GlobalChannelServiceStatus;

    public static findTable(uid:number) { // 发现某个用户 所在的房间
        let table:Mary_Slot_Table = null;
        Mary_Slot_Table.ROOM_LIST.forEach((value,key,map)=>{
            if (value.user && value.user.uid == uid) table = value;
        });
        return table;
    }

    public static createTable(app: Application,room_index:number) {
        return new Mary_Slot_Table(app,room_index);
    }

    constructor(app: Application,room_index:number) {
        this.app = app;
        this.room_index = room_index;
        this.room_config = app.get('HappyFruit_'+room_index);
        this.table_id = Mary_Slot_Table.TABLE_ID;
        Mary_Slot_Table.TABLE_ID ++;
        Mary_Slot_Table.ROOM_LIST.set(this.table_id,this);
        this.null_reward_num = 0; // 连续空奖次数
        this.small_game_num = 0; // 小游戏剩余次数
        this.free_game_num = 0; // 免费转次数

        this.small_game_reward_num = 0; // 本次小游戏中奖次数
        
        const globalChannelStatus: GlobalChannelServiceStatus = this.app.get(GlobalChannelServiceStatus.PLUGIN_NAME);
        this.globalChannelStatus = globalChannelStatus;
        
    }

    /**
     *  初始化奖池
     */
    async init_pool() {
        let REDIS_HSETNX = global['REDIS_HSETNX'];
        let Init = this.room_config.RoomControl.Init;
        await utils.WaitFunctionEx(REDIS_HSETNX, 'Mary_Slot', 'room_pool', Init);
        const xue_game = getConnection('xue_game');
        this.xue_game = xue_game;
    }

    /**
     *  下注摇奖
     */
    async put_bet(bet:number) {
        if (this.user == null) return {code:402,data:"用户未进入房间."};
        let is_free:boolean = false;
        let one_bet:number = bet / 9;
        if (this.room_config.Bet.indexOf(one_bet) == -1) return {code:403,data:"压注格式错误."}

        let REDIS_HGET = global['REDIS_HGET'];
        let REDIS_HINCRBY = global['REDIS_HINCRBY'];
        if (this.free_game_num > 0) {
            this.free_game_num --;
            is_free = true;
            one_bet = this.room_config.Bet[0];
        }else{
            is_free = false;
            this.user.coin -= bet;
            let room_water:number = Math.ceil(bet * this.room_config.RoomRatio / 10000);
            let handsel_water:number = Math.ceil(bet * this.room_config.HandselRatio / 10000);
            let add_pool:number = bet - room_water - handsel_water;
            await utils.WaitFunctionEx(REDIS_HINCRBY, 'Mary_Slot', 'room_water', room_water);
            await utils.WaitFunctionEx(REDIS_HINCRBY, 'Mary_Slot', 'handsel_pool', handsel_water);
            await utils.WaitFunctionEx(REDIS_HINCRBY, 'Mary_Slot', 'room_pool', add_pool);
        }
        let room_pool:any = await utils.WaitFunctionEx(REDIS_HGET, 'Mary_Slot', 'room_pool');
        if(room_pool[0] != null) return {code:404,data:"奖池读取错误."};
        room_pool = ~~room_pool[1] || 0;
        let handsel_pool:any = await utils.WaitFunctionEx(REDIS_HGET, 'Mary_Slot', 'handsel_pool');
        if(handsel_pool[0] != null) return {code:405,data:"奖池读取错误."};
        handsel_pool = ~~handsel_pool[1] || 0;
        let reward:Ret = make_slot_reward(room_pool,handsel_pool,one_bet,this.room_config,is_free,this.null_reward_num);
        ///_____ 结算中奖金额TODO:-----> 结算完成
        if (reward.is_reward) {
            this.null_reward_num = 0;
        }else{
            this.null_reward_num ++;
        }
        this.small_game_num += reward.small_game_num;
        this.free_game_num += reward.free_game_num;
        this.small_game_reward_num = 0;
        this.user.coin += reward.total_reward;
        await utils.WaitFunctionEx(REDIS_HINCRBY, 'Mary_Slot', 'handsel_pool', -1*reward.pool_reward);
        await utils.WaitFunctionEx(REDIS_HINCRBY, 'Mary_Slot', 'room_pool', -1*reward.line_reward);
        await this.xue_game.manager.save(this.user);

        ///// 发送给 客户端 综合数据
        reward.small_game_num = this.small_game_num;
        reward.free_game_num = this.free_game_num;
        reward["current_coin"] = this.user.coin;
        reward["handsel_pool"] = handsel_pool-reward.pool_reward;
        return reward;
    }

    
    /**
     *  下注摇奖
     */
    async small_put_bet() {
        if (this.user == null) return {code:402,data:"用户未进入房间."};
        let one_bet:number = this.room_config.Bet[0];
        if (this.small_game_num <= 0) return {code:403,data:"小游戏次数不足."};
        
        let REDIS_HGET = global['REDIS_HGET'];
        let REDIS_HINCRBY = global['REDIS_HINCRBY'];
        let room_pool:any = await utils.WaitFunctionEx(REDIS_HGET, 'Mary_Slot', 'room_pool');
        if(room_pool[0] != null) return {code:404,data:"奖池读取错误."};
        room_pool = ~~room_pool[1] || 0;
        let reward:Small_Ret = make_small_slot_reward(room_pool,one_bet,this.room_config,this.small_game_reward_num);
        if (reward.is_next) {
            this.small_game_num --;
            this.small_game_reward_num = 0;
        }else if (reward.multiple != 0) {
            this.small_game_reward_num ++;
        }
        this.user.coin += reward.total_reward;
        await utils.WaitFunctionEx(REDIS_HINCRBY, 'Mary_Slot', 'room_pool', -1*reward.total_reward);
        await this.xue_game.manager.save(this.user);

        ///// 发送给 客户端 综合数据
        reward["small_game_num"] = this.small_game_num;
        reward["current_coin"] = this.user.coin;
        return reward;
    }
    /**
     * 玩家进入游戏
     * @param uid 
     */
    async enter_game(uid:number) {
        await this.init_pool();
        let user = await this.xue_game.manager.findOne(User_MOG,{uid});
        if (user == null) {
            return {code:403,data:'玩家不存在.'};
        }
        let in_game = await inGame(""+uid,this.globalChannelStatus)
        if (in_game) {
            return {code:404,data:'你已经在其他游戏中，不能进入此游戏.'};
        }
        this.user = user;
        let sids:string[] = await this.globalChannelStatus.getSidsByUid(""+uid);
        let sid:string = sids[0];
        await this.globalChannelStatus.add(""+uid,sid,GAME_TYPE.MARY_SLOT);

        //// ____T: 测试通道 代码
        await this.globalChannelStatus.pushMessageByChannelName('connector','onNotice',{msg:"欢迎:"+uid+" 进入游戏"},GAME_TYPE.MARY_SLOT);
        // await this.globalChannelStatus.pushMessageByUids([""+uid],'onNotice',{msg:"欢迎进入开心水果机"});
        return {code:0};
    }

    
    /**
     * 玩家离开游戏
     * @param uid 
     */
    async leave_game(uid:number) {
        if(this.user && this.user.uid == uid) {
            this.user = null;
            Mary_Slot_Table.ROOM_LIST.delete(this.table_id);
            let sids:string[] = await this.globalChannelStatus.getSidsByUid(""+uid);
            let sid:string = sids[0];
            await this.globalChannelStatus.leave(""+uid,sid,GAME_TYPE.MARY_SLOT);
            return {code:0};
        }else{
            return {code:404,data:"你不在该房间中"};
        }
    }
}