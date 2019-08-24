
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
