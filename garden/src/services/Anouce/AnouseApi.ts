import * as ajax from '../../common/Http'

import {
    AddAnouceResponse,
    DetailAnouceResponse,
    ListAnouceResponse,
    ModifyAnouceResponse,
    ReplyAnouceResponse,
    BaseResponse
} from '../../interfaces/Response'

/** 
 * BaseUrl = "/api/anouce"
*/ 

export function list(pi:number,ps:number){
    return ajax.post<ListAnouceResponse>('/api/anouce/list',{
        pi,ps
    })
}

export function add(title:string,content:string){
    return ajax.post<AddAnouceResponse>('/api/anouce/add',{
        title,content
    })
}

export function reply(aid:number){
    return ajax.post<ReplyAnouceResponse>('/api/anouce/reply',{
        aid
    })
}

export function modify(aid:number,title:string,content:string){
    return ajax.post<ModifyAnouceResponse>('/api/anouce/modify',{
        aid,title,content
    })
}

export function detail(aid:number){
    return ajax.post<DetailAnouceResponse>('/api/anouce/detail',{
        aid
    })
}

export function delteAnouce(aids:number[]){
    return ajax.post<BaseResponse>('/api/anouce/delete',{
        aids
    })
}