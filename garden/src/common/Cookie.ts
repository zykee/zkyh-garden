// 设置cookie
export function put(name: string, value: any, days: number) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    document.cookie = name + '=' + value + ';expires=' + date;
}

// 获取cookie
export function get(name: string) {
    var arr = document.cookie.replace(/\s/g, "").split(';');
    for (var i = 0; i < arr.length; i++) {
        var tempArr = arr[i].split('=');
        if (tempArr[0] == name) {
            return decodeURIComponent(tempArr[1]);
        }
    }
    return '';
}

// 删除cookie
export function remove(name: string) {
    put(name, '1', -1);
}

// 检查是否含有某cookie
export function has(name: string) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
}

// 获取全部的cookie列表
export function all() {
    var cookieArr = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < cookieArr.length; nIdx++) { cookieArr[nIdx] = decodeURIComponent(cookieArr[nIdx]); }
    return cookieArr;
}