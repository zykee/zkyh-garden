import * as ajax from '../../common/Http'

import {
    ListAllCameraResponse,
    ListCameraResponse,
    ListByGardenCameraResponse,
    ListByAreaCameraResponse,
    AddCameraResponse,
    ModifyCameraResponse,
    BaseResponse
} from '../../interfaces/Response'

/**
 * BaseUrl = "/api/garden/Camera"
 */ 

// admin
export function listAll(pi:number,ps:number){
    return ajax.post<ListAllCameraResponse>('/api/garden/camera/listAll',{
        pi,ps
    })
}

// garden master
export function list(pi:number,ps:number){
    return ajax.post<ListCameraResponse>('/api/garden/camera/list',{
        pi,ps
    })
}

// admin
export function listByGarden(gid:number,pi:number,ps:number){
    return ajax.post<ListByGardenCameraResponse>('/api/garden/camera/listByGarden',{
        gid,pi,ps
    })
}

export function listByArea(maId:number,pi:number,ps:number){
    return ajax.post<ListByAreaCameraResponse>('/api/garden/camera/listByArea',{
        maId,pi,ps
    })
}

export function add(maId:number,deviceId:string,name:string,location:string){
    return ajax.post<AddCameraResponse>('/api/garden/camera/add',{
        maId,deviceId,name,location
    })
}

export function modify(cid:number,deviceId:number,name:string,location:string){
    return ajax.post<ModifyCameraResponse>('/api/garden/camera/modify',{
        cid,deviceId,name,location
    })
}

export function deleteCamera(cids:number[]){
    return ajax.post<BaseResponse>('/api/garden/camera/delete',{
        cids
    })
}

export function enable(cid:number,enabled:boolean){
    return ajax.post<BaseResponse>('/api/garden/camera/enable',{
        cid,enabled
    })
}