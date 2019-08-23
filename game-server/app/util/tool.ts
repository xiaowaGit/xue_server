
export function get_random_int(min:number,max:number) {
    if (max <= min) return Math.floor(max);
    let c:number = max - min;
    c = Math.random() * c;
    return Math.floor(min + c);
}
