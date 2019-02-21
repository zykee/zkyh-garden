import {
  UserInfo,
  SessionInfo,
  ClassShortInfo,
  StudentInfo,
  CameraInfo,
  MonitorAreaInfo,
  AnouceInfo,
  FeedbackInfo,
  GardenRichInfo,
  UserRichInfo
} from './Model'

export interface BaseResponse {
  stat: string
  message?: string
}

export interface LoginResponse extends BaseResponse {
  session:SessionInfo
  user:UserInfo
}

export interface CheckResponse extends BaseResponse {
  info:UserInfo
}

export interface ModifyUserResponse extends BaseResponse {
  info:UserInfo
}

export interface GetUserInfoResponse extends BaseResponse {
  info:UserInfo
}

export interface ListUsersByRoleResponse extends BaseResponse {
  users:UserInfo[]
  total:number
}

// # BaseUrl = "/api/anouce"
export interface ListAnouceResponse extends BaseResponse{
  anouces:AnouceInfo[]
  total:number
}

export interface AddAnouceResponse extends BaseResponse{
  anouce:AnouceInfo
}

export interface ReplyAnouceResponse extends BaseResponse{
  anouce:AnouceInfo
}

export interface ModifyAnouceResponse extends BaseResponse{
  anouce:AnouceInfo
}

export interface DetailAnouceResponse extends BaseResponse{
  anouce:AnouceInfo
}

// BaseUrl = "/api/garden/class"
export interface ListByGardenResponse extends BaseResponse{
  total:number
  classes:ClassShortInfo[]
}

export interface ListResponse extends BaseResponse{
  total:number
  classes:ClassShortInfo[]
}

export interface AddByGardenResponse extends BaseResponse{
  info:ClassShortInfo
}

export interface AddResponse extends BaseResponse{
  info:ClassShortInfo
}

export interface ModifyResponse extends BaseResponse{
  info:ClassShortInfo
}

export interface ListTeachersResponse extends BaseResponse{
  teachers:UserInfo[]
}

export interface AddTeacherResponse extends BaseResponse{
  info:UserInfo
}

export interface ListStudentsResponse extends BaseResponse{
  students:StudentInfo[]
  total:number
}

export interface SearchStudentsResponse extends BaseResponse{
  students:StudentInfo[]
  total:number
}

export interface AddStudentResponse extends BaseResponse{
  info:StudentInfo
}

export interface ModifyStudentResponse extends BaseResponse{
  info:StudentInfo
}

// BaseUrl = "/api/garden/area"
export interface ListByGardenAreaResponse extends BaseResponse{
  areas:MonitorAreaInfo[]
  total:number
}

export interface ListAreaResponse extends BaseResponse{
  areas:MonitorAreaInfo[]
  total:number
}

export interface AddAreaResponse extends BaseResponse{
  info:MonitorAreaInfo
}

export interface AddToGardenAreaResponse extends BaseResponse{
  info:MonitorAreaInfo
}

export interface ModifyAreaResponse extends BaseResponse{
  info:MonitorAreaInfo
}

// BaseUrl = "/api/garden/camera"
export interface ListAllCameraResponse extends BaseResponse{
  cameras:CameraInfo[]
  total:number
}

export interface ListCameraResponse extends BaseResponse{
  cameras:CameraInfo[]
  total:number
}

export interface ListByGardenCameraResponse extends BaseResponse{
  cameras:CameraInfo[]
  total:number
}

export interface ListByAreaCameraResponse extends BaseResponse{
  cameras:CameraInfo[]
  total:number
}

export interface AddCameraResponse extends BaseResponse{
  camera:CameraInfo
}

export interface ModifyCameraResponse extends BaseResponse{
  info:CameraInfo
}

// BaseUrl = "/api/feedback"
export interface ListFeedbackResponse extends BaseResponse{
  feedbacks:FeedbackInfo[]
  total:number
}

// BaseUrl = "/api/garden"

export interface ListGardenResponse extends BaseResponse{
  gardens:GardenRichInfo[]
  total:number
}

export interface AddGardenResponse extends BaseResponse{
  info:GardenRichInfo
}

export interface ModifyGardenResponse extends BaseResponse{
  info:GardenRichInfo
}

export interface GetMasterResponse extends BaseResponse{
  info:UserRichInfo
}

export interface SetMasterResponse extends BaseResponse{
  info:UserRichInfo
}