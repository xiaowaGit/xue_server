
//水果 代号
enum Image {
    Image_Nul1 = 0,     //无效
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

/**
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


