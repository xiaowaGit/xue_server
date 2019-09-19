import { MarySlotConfig } from "./table";

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
    [],
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
        if(element == Image.Image_Wild) {
            num ++;
        }else if (element != element_type && element_type != Image.Image_Null) {
            break;
        }else if (element != element_type && element_type == Image.Image_Null) {
            element_type = element;
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
 * 检查中奖情况
 * @param ret 
 */
function check_make_ret(ret:[number[],number[],number[],number[],number[]]) {
    let small_game_num:number = check_wild(ret);
}







/**
 * 生成水果机奖励
 */
export function make_slot_reward(room_pool:number,room_config:MarySlotConfig) {

}