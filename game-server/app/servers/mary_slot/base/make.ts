import { MarySlotConfig, MarySlotSet } from "./table";
import { random_arr, del_element_by_arr } from "../../../util/tool";

//水果 代号
enum Image {
    Image_Null = 0,     //无效
    Image_Banana,       //香蕉
    Image_Watermelon,   //西瓜
    Image_Mango,        //芒果
    Image_Grape,        //葡萄
    Image_Pineapple,    //菠萝
    Image_Bell,         //铃铛
    Image_Cherry,       //樱桃
    Image_Bar,          //Bar
    Image_Bonus,        //Bonus免费旋转
    Image_Seven,        //七 奖也
    Image_Wild,         //Wild
    Image_Max,
}

// 水果倍数
let Image_Multiple = [
    [0,0,0,0,0,0],
    [0,0,1,3,10,75],  // 香蕉 倍数
    [0,0,0,3,10,85],  // 西瓜 倍数
    [0,0,0,15,40,250],  // 芒果 倍数
    [0,0,0,25,50,400],  // 葡萄 倍数
    [0,0,0,30,70,550],  // 菠萝 倍数
    [0,0,0,35,80,650],  // 铃铛 倍数
    [0,0,0,45,100,800],  // 樱桃 倍数
    [0,0,0,75,175,1250],  // Bar 倍数
    [0,0,0,25,50,400],  // bouns 倍数
    [0,0,0,100,200,1750],  // scatter 倍数
    [0,0,0,0,0,0],  // Wild 倍数
];

/// 小玛丽游戏 水果倍数
let Small_Image_Multiple = [
    0,  // 炸弹,不中奖
    20, // 香蕉
    200,// 西瓜
    70, // 芒果
    100,// 葡萄
    5,  // 菠萝
    0,  // 铃铛
    50, // 樱桃
    0,  // bar
    10, // Bouns 橘子
    0,  // 7
    0,  // wild
];

/// 小玛丽游戏 水果列表
let Small_Image = [
    Image.Image_Null,         //炸弹
    Image.Image_Banana,       //香蕉
    Image.Image_Watermelon,   //西瓜
    Image.Image_Mango,        //芒果
    Image.Image_Grape,        //葡萄
    Image.Image_Pineapple,    //菠萝
    Image.Image_Cherry,       //樱桃
    Image.Image_Bonus,        //Bonus橘子
];

/**
 * 线类型 声明 长度5
 */
export interface Line {
    [index:number]:number[];
}

/**
 * 输入 数据 声明 长度5
 */
export interface DataInput {
    [index:number]:number[];
}

/**
 * 返回 数据 声明 长度5
 */
export interface DataRet {
    [index:number]:number[];
}

export interface Ret {
    ret: [number[], number[], number[], number[], number[]];
    small_game_num: number;
    line_multiple: number[];
    free_game_num: number;
    pool_multiple: number;
    is_reward: boolean;
    line_reward: number;
    pool_reward: number;
    total_reward: number;
}

/// 线集合
let line_gather = [
    [[0,0],[1,0],[2,0],[3,0],[4,0]], // line 1
    [[0,1],[1,1],[2,1],[3,1],[4,1]], // line 2
    [[0,2],[1,2],[2,2],[3,2],[4,2]], // line 3

    [[0,0],[1,1],[2,2],[3,1],[4,0]], // line 4
    [[0,2],[1,1],[2,0],[3,1],[4,2]], // line 5

    [[0,0],[1,0],[2,1],[3,2],[4,2]], // line 6
    [[0,2],[1,2],[2,1],[3,0],[4,0]], // line 7

    [[0,1],[1,0],[2,1],[3,2],[4,1]], // line 8
    [[0,1],[1,2],[2,1],[3,0],[4,1]], // line 9
];

/**
 * @param data 随机数组
 * @returns {*} ret 结果图形
 * 列随机
 */
function row_make(data:[number[],number[],number[],number[],number[]]) {
    let ret:[number[],number[],number[],number[],number[]] = [[],[],[],[],[]];
    for (let index = 0; index < data.length; index++) {
        const arr:number[] = data[index];
        let rnd:number = Math.floor(Math.random() * arr.length);
        ret[index].push(arr[rnd]);
        ret[index].push(arr[rnd+1 % arr.length]);
        ret[index].push(arr[rnd+2 % arr.length]);
    }
    return ret;
}


/**
 * 图形随机
 */
function map_make(data:[number[],number[],number[],number[],number[]]) {
    let ret:[number[],number[],number[],number[],number[]] = [[],[],[],[],[]];
    for (let index = 0; index < data.length; index++) {
        const arr:number[] = data[index];
        let rnd:number = Math.floor(Math.random() * arr.length);
        ret[index].push(arr[rnd]);
        rnd = Math.floor(Math.random() * arr.length);
        ret[index].push(arr[rnd]);
        rnd = Math.floor(Math.random() * arr.length);
        ret[index].push(arr[rnd]);
    }
    return ret;
}

/**
 * 检查 这条线上 开始的元素
 * @param ret 
 * @param line 
 * @requires {number} 返回 倍数
 */
function check_line_element(ret:DataRet,line:Line):number {
    let element_type:Image = Image.Image_Null;
    let num = 0;
    for (let index = 0; index < 5; index++) {
        const pot = line[index];
        let element = ret[pot[0]][pot[1]];
        if(element == Image.Image_Wild && element_type != Image.Image_Bonus && element_type != Image.Image_Seven) {
            num ++;
        }else if(element == Image.Image_Wild && (element_type == Image.Image_Bonus || element_type == Image.Image_Seven)) {
            break;
        }else if (element != element_type && element_type != Image.Image_Null) {
            break;
        }else if (element != element_type && element_type == Image.Image_Null) {
            element_type = element;
            if (element_type == Image.Image_Bonus || element_type == Image.Image_Seven)num = 0;
        }else if (element == element_type) {
            num ++;
        }
    }
    return Image_Multiple[element_type][num];
}

/**
 * 检查 这条线上 连续的元素
 * @param ret 
 * @param line 
 * @param element
 */
function check_line_continuity(ret:DataRet,line:Line,element:Image) {
    let num:number = 0;
    let e_num:number = 0;
    for (let index = 0; index < 5; index++) {
        const pot = line[index];
        let e = ret[pot[0]][pot[1]];
        if (e == element) {
            num ++;
        }else if (e != element && num != 0) {
            e_num = Math.max(num,e_num);
            num = 0;
        }
    }
    e_num = Math.max(num,e_num);
    return e_num;
}

/**
 * 检查wild
 * @param ret 
 * @returns {*} 返回 小玛丽游戏 次数
 */
function check_wild(ret:DataRet):number {
    let small_game_num = 0;
    for (let index = 0; index < line_gather.length; index++) {
        const line:Line = line_gather[index];
        let num:number = check_line_continuity(ret,line,Image.Image_Wild);
        small_game_num += num == 3 ? 1 : 0;
        small_game_num += num == 4 ? 2 : 0;
        small_game_num += num == 5 ? 3 : 0;
    }
    return small_game_num;
}

/**
 * 检查line 
 * @param ret 
 * @returns {*} 返回 line 倍数
 */
function check_line_multiple(ret:DataRet):number[] {
    let line_multiple:number[] = [];
    for (let index = 0; index < line_gather.length; index++) {
        const line:Line = line_gather[index];
        let multiple:number = check_line_element(ret,line);
        line_multiple.push(multiple);
    }
    return line_multiple;
}

/**
 * 检查列上是否有该元素
 * @param row 
 */
function check_row_find_element(row:number[],element_type:Image):boolean {
    for (let index = 0; index < row.length; index++) {
        const element = row[index];
        if (element == element_type) return true;
    }
    return false;
}

/**
 * 检查bonus
 * @param ret 
 * @returns {*} 返回 免费游戏 次数
 */
function check_bonus(ret:DataRet):number {
    let row_sign:number[] = [0,0,0,0,0];
    row_sign[0] = check_row_find_element(ret[0],Image.Image_Bonus) ? 1 : 0;
    row_sign[1] = check_row_find_element(ret[1],Image.Image_Bonus) ? 1 : 0;
    row_sign[2] = check_row_find_element(ret[2],Image.Image_Bonus) ? 1 : 0;
    row_sign[3] = check_row_find_element(ret[3],Image.Image_Bonus) ? 1 : 0;
    row_sign[4] = check_row_find_element(ret[4],Image.Image_Bonus) ? 1 : 0;
    let num:number = 0;
    let e_num:number = 0;
    for (let index = 0; index < 5; index++) {
        let e = row_sign[index];
        if (e == 1) {
            num ++;
        }else if (e != 1 && num != 0) {
            e_num = Math.max(num,e_num);
            num = 0;
        }
    }
    e_num = Math.max(num,e_num);

    let bouns_reward:number[] = [0,0,0,10,15,20];
    return bouns_reward[e_num];
}


/**
 * 检查777
 * @param ret 
 * @returns {*} 返回 奖池比例
 */
function check_scatter(ret:DataRet,JackPot_Reward:number[]):number {
    let pool_multiple = 0;
    let scatter_arr = [];
    for (let index = 0; index < line_gather.length; index++) {
        const line:Line = line_gather[index];
        let num:number = check_line_continuity(ret,line,Image.Image_Seven);
        scatter_arr.push(num);
    }
    let scatter_num:number = Math.max(...scatter_arr);
    let pool_reward:number[] = [0,0,0].concat(JackPot_Reward);
    pool_multiple = pool_reward[scatter_num];
    return pool_multiple;
}

/**
 * 检查中奖情况
 * @param ret 
 */
function check_make_ret(ret:[number[],number[],number[],number[],number[]],handsel_pool:number,one_bet:number,JackPot_Reward:number[]) {
    let small_game_num:number = check_wild(ret);
    let line_multiple:number[] = check_line_multiple(ret);
    let free_game_num:number = check_bonus(ret);
    let pool_multiple:number = check_scatter(ret,JackPot_Reward);
    let is_reward = false;
    if (small_game_num != 0) is_reward = true;
    if (free_game_num != 0) is_reward = true;
    if (pool_multiple != 0) is_reward = true;
    for (let index = 0; index < line_multiple.length; index++) {
        const element = line_multiple[index];
        if (element != 0) is_reward = true;
    }
    /// 计算 线奖励和大奖池奖励
    let line_reward:number = 0;
    for (let index = 0; index < line_multiple.length; index++) {
        const element = line_multiple[index];
        line_reward += one_bet * element;
    }
    let pool_reward:number = pool_multiple * handsel_pool;
    let total_reward:number = line_reward + pool_reward;
    let _ret:Ret = {ret,small_game_num,line_multiple,free_game_num,pool_multiple,is_reward,line_reward,pool_reward,total_reward};
    return _ret;
}






function sum(arr) {
    return eval(arr.join("+"));
};

/**
 * 生成水果机奖励
 */
export function make_slot_reward(room_pool:number,handsel_pool:number,one_bet:number,room_config:MarySlotConfig,is_free:boolean,null_reward_num:number) {

    ////  取出控制等级
    let control_level:string = '1';
    let Level_Range:number[][] = room_config.RoomControl.Level_Range;
    for (let index = 0; index < Level_Range.length; index++) {
        const level:number[] = Level_Range[index];
        if (room_pool >= level[1] && room_pool < level[2]) {
            control_level = "" + level[0];
            break;
        }
    }

    let control = room_config.ControlLevel[control_level];
    let set_id:number = 2;
    if (Math.random() * 100 < control[1]) set_id = control[0];

    let set_info:MarySlotSet = room_config["Set_" + set_id];
    let JackPot_Reward:number[] = set_info.JackPot.Reward;
    let data_input:DataInput = set_info.Normal;
    if (is_free) data_input = set_info.Free;

    let probability:number = null_reward_num >= control[2].length ? control[2][control[2].length-1] : control[2][null_reward_num];
    let is_reward:boolean = false;
    if (Math.random() * 100 < probability) is_reward = true;

    let big_reward_probability:number = control[3][0];
    let big_reward_limit:number = control[3][1];

    /// 随机函数 选择规则 待确认TODO:----> 图形随机
    let make:Function = map_make;

    let small_reward:Ret = null;
    for (let i = 0; i < 50; i++) {
        let ret:[number[],number[],number[],number[],number[]] = make(data_input);
        let out:Ret = check_make_ret(ret,handsel_pool,one_bet,JackPot_Reward);
        if (small_reward == null || small_reward.total_reward > out.total_reward) small_reward = out;
        if (is_reward && out.is_reward == false) continue;
        if (sum(out.line_multiple) > big_reward_limit) {
            if (Math.random() * 100 < big_reward_probability) continue;
        }
        if (out.line_reward > room_pool) continue;
        return out;
    }
    return small_reward;
}


/////////////////////////////////small_mary_game//////////////////////////////////

/**
 * 小玛丽游戏返回格式
 */
export interface Small_Ret {
    out_image:Image;
    in_images:Image[];
    multiple: number;
    is_reward: boolean;
    total_reward: number;
}

/**
 * 构建一个炸弹奖
 */
function make_null(one_bet:number) {
    let out_image:Image = Image.Image_Null;
    let small_image:Image[] = [...Small_Image];
    let in_images:Image[] = [];
    for (let i = 0; i < 4; i++) {
        let rnd:number = Math.floor(Math.random() * small_image.length);
        in_images.push(small_image[rnd]);
    }
    let small_ret:Small_Ret = {out_image,in_images,multiple:0,is_reward:true,total_reward:0};
    return small_ret;
}

/**
 * 构建一个0倍奖
 */
function make_0_reward(one_bet:number) {
    let out_image:Image;
    let small_image:Image[] = [...Small_Image];
    let in_images:Image[] = [];
    small_image = random_arr(small_image);
    out_image = small_image.pop();
    for (let i = 0; i < 4; i++) {
        let rnd:number = Math.floor(Math.random() * small_image.length);
        in_images.push(small_image[rnd]);
    }
    let small_ret:Small_Ret = {out_image,in_images,multiple:0,is_reward:false,total_reward:0};
    return small_ret;
}

/**
 * 构建一个5倍奖
 */
function make_5_reward(one_bet:number) {
    let out_image:Image = Image.Image_Pineapple;
    let small_image:Image[] = [...Small_Image];
    let in_images:Image[] = [];
    small_image = del_element_by_arr(small_image,out_image);
    for (let i = 0; i < 4; i++) {
        let rnd:number = Math.floor(Math.random() * small_image.length);
        in_images.push(small_image[rnd]);
    }
    let small_ret:Small_Ret = {out_image,in_images,multiple:5,is_reward:true,total_reward:one_bet*5};
    return small_ret;
}

/**
 * 构建一个10倍奖
 */
function make_10_reward(one_bet:number) {
    
}


/**
 * 构建一个20倍奖
 */
function make_20_reward(one_bet:number) {
    
}


/**
 * 构建一个25倍奖
 */
function make_25_reward(one_bet:number) {
    
}


/**
 * 构建一个30倍奖
 */
function make_30_reward(one_bet:number) {
    
}


/**
 * 构建一个40倍奖
 */
function make_40_reward(one_bet:number) {
    
}


/**
 * 构建一个50倍奖
 */
function make_50_reward(one_bet:number) {
    
}


/**
 * 构建一个70倍奖
 */
function make_70_reward(one_bet:number) {
    
}


/**
 * 构建一个90倍奖
 */
function make_90_reward(one_bet:number) {
    
}

/**
 * 生成小玛丽水果机奖励
 */
export function make_small_slot_reward(room_pool:number,one_bet:number,room_config:MarySlotConfig,small_game_reward_num:number) {
    
    ////  取出控制等级
    let control_level:string = '1';
    let Level_Range:number[][] = room_config.RoomControl.Level_Range;
    for (let index = 0; index < Level_Range.length; index++) {
        const level:number[] = Level_Range[index];
        if (room_pool >= level[1] && room_pool < level[2]) {
            control_level = "" + level[0];
            break;
        }
    }

    let control = room_config.ControlLevel[control_level];
    let set_id:number = 2;
    if (Math.random() * 100 < control[1]) set_id = control[0];

    let set_info:MarySlotSet = room_config["Set_" + set_id];

}