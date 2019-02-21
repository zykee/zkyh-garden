import * as ajax from '../../common/Http'

import {
    AddGardenResponse,
    ListGardenResponse,
    ModifyGardenResponse,
    BaseResponse,
} from '../../interfaces/Response'

/**
 * BaseUrl = "/api/garden"
 * */ 

//  admin
export function list(pi:number,ps:number){
    return ajax.post<ListGardenResponse>('/api/garden/list',{
        pi,ps
    })
}

// admin
export function add(name:string,masterName:string,masterPhone:string,masterAccount:string,masterPassword:string){
    return ajax.post<AddGardenResponse>('/api/garden/add',{
        name,masterName,masterPhone,masterAccount,masterPassword
    })
}

// admin
export function modify(gid:number,name:string,masterName:string,masterPhone:string,masterAccount:string,masterPassword:string){
    return ajax.post<ModifyGardenResponse>('/api/garden/add',{
        gid,name,masterName,masterPhone,masterAccount,masterPassword
    })
}

// admin
export function deleteGarden(gid:number){
    return ajax.post<BaseResponse>('/api/garden/add',{
        gid,name
    })
}