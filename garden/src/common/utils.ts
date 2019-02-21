import moment from 'moment'

export function formatDateTime(milliseconds:number){
    return moment(milliseconds).format("YYYY-MM-DD HH:mm:ss");
}

export function encodeJson(o:object){
    return window.btoa(JSON.stringify(o));
}

export function decodeJson(s:string){
    return JSON.parse(window.atob(s));
}