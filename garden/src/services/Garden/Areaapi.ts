import * as ajax from '../../common/Http'

import {
    AddAreaResponse,
    AddToGardenAreaResponse,
    ListAreaResponse,
    ListByGardenAreaResponse,
    ModifyAreaResponse,
    BaseResponse
} from '../../interfaces/Response'

/** 
 * BaseUrl = "/api/garden/area"
*/ 

// admin
export function listByGarden(gid:number,pi:number,ps:number){
    return ajax.post<ListByGardenAreaResponse>("/api/garden/area/listByGarden",{
        gid,pi,ps
    })
}

export function list(pi:number,ps:number){
    return ajax.post<ListAreaResponse>("/api/garden/area/list",{
       pi,ps
    })
}

// garden master
export function add(name:string,cid:number){
    return ajax.post<AddAreaResponse>("/api/garden/area/add",{
       name,cid
    })
}

// admin
export function addToGarden(gid:number,name:string,cid:number){
    return ajax.post<AddToGardenAreaResponse>("/api/garden/area/addToGarden",{
       gid,name,cid
    })
}

export function modify(maId:number,name:string,cid:number){
    return ajax.post<ModifyAreaResponse>("/api/garden/area/modify",{
       maId,name,cid
    })
}

export function deleteArea(maIds:number[]){
    return ajax.post<BaseResponse>("/api/garden/area/delete",{
       maIds
    })
}