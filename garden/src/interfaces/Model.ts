

/**
 * 该管理员账号信息
 */
export interface UserInfo {
  /** 用户ID */
  id: number
  /** 账号 */
  account?:string
  email?:string
  phone: string
  nickName?:string
  avatar?:string
  gender?:number
  role?:string
  status?:number
  ctime?:number
  password?:string
}

export interface Navigation{
  openKeys:string[]
  selectKeys:string[]
}

export interface SessionInfo{
  id:number
  token:string
}


export interface ClassShortInfo{
  id:number
  major:UserInfo
  name:string
  ctime:number
  studentsCount:number
}

export interface StudentInfo{
  id:number
  relation:string
  parent:UserInfo
  name:string
  age:number
  gender:number
  avatar:string
  ctime:number
}

export interface CameraInfo{
  id:number
  deviceId:number
  name:string
  location:string
  ctime:number
  status:number
  areaId:number
  areaName:string
}

export interface MonitorAreaInfo{
  id:number
  cameras:CameraInfo[]
  major:string
  name:string
  ctime:string
}

export interface AnouceInfo{
  id:number
  author:UserInfo
  title:string
  content:string
  ctime:number
}

export interface FeedbackInfo{
  id:number
  author:UserInfo
  content:string
  ctime:number
}

export interface GardenRichInfo{
  id:number
  name:string
  master:UserRichInfo
  ctime:number
}

export interface UserRichInfo extends UserInfo{
  password:string
}