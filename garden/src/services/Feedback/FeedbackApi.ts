import * as ajax from '../../common/Http'

import {
    ListFeedbackResponse,
    BaseResponse
} from '../../interfaces/Response'

export function list(pi:number,ps:number){
    return ajax.post<ListFeedbackResponse>('/api/feedback/list',{
        pi,ps
    })
}

export function deleteFeedback(fids:number[]){
    return ajax.post<BaseResponse>('/api/feedback/delete',{
        fids
    })
}