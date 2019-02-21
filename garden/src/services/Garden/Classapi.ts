import * as ajax from '../../common/Http'
import {
    BaseResponse,
    ListByGardenResponse,
    ListResponse,
    AddByGardenResponse,
    AddResponse,
    ModifyResponse,
    ListTeachersResponse,
    AddTeacherResponse,
    ListStudentsResponse,
    SearchStudentsResponse,
    AddStudentResponse,
    ModifyStudentResponse
} from "../../interfaces/Response"

/**
 * BaseUrl = "/api/garden/class"
 */ 

//  仅系统管理员可用
export function listByGarden(gid:number,pi:number ,ps:number ){
    return ajax.post<ListByGardenResponse>('/api/garden/class/listByGarden',{
        gid,pi,ps
    })
}

export function list(pi:number,ps:number){
    return ajax.post<ListResponse>('/api/garden/class/list',{
        pi,ps
    })
}

//  仅系统管理员可用
export function addByGarden(gid:number,name:string,teacherName:string,teacherPhone:string){
    return ajax.post<AddByGardenResponse>('/api/garden/class/addByGarden',{
        gid,name,teacherName,teacherPhone
    })
}

// 幼儿园管理员可用
export function add(name:string,teacherName:string,teacherPhone:string){
    return ajax.post<AddResponse>('/api/garden/class/add',{
        name,teacherName,teacherPhone
    })
}

// 系统管理员&&幼儿园管理员可用
export function modify(cid:number,name:string,teacherName:string,teacherPhone:string){
    return ajax.post<ModifyResponse>('/api/garden/class/modify',{
        cid,name,teacherName,teacherPhone
    })
}

// 仅系统管理员和幼儿园管理源可以访问
/**
* 原api文档为delete方法
* delete为关键字
* 改为deleteClasses
*/ 
export function deleteClasses(cids:number[]){
    return ajax.post<BaseResponse>('/api/garden/class/delete',{
        cids
    })
}

// 系统，班级管理员可用
export function listTeachers(cid:number){
    return ajax.post<ListTeachersResponse>('/api/garden/class/listTeachers',{
        cid
    })
}

// 系统，班级管理员可用
export function addTeacher(cid:number,name:string,phone:string){
    return ajax.post<AddTeacherResponse>('/api/garden/class/addTeacher',{
        cid,name,phone
    })
}

// 系统，班级管理员可用
export function deleteTeacher(cid:number,tid:number){
    return ajax.post<BaseResponse>('/api/garden/class/deleteTeacher',{
        cid,tid
    })
}

// 系统，班级管理员可用
export function listStudents(cid:number,pi:number,ps:number){
    return ajax.post<ListStudentsResponse>('/api/garden/class/listStudents',{
        cid,pi,ps
    })
}

// 系统，班级管理员可用
export function serachStudents(cid:number,name:string,pi:number,ps:number){
    return ajax.post<SearchStudentsResponse>('/api/garden/class/searchStudents',{
        cid,pi,ps,name
    })
}

// 系统，班级管理员可用
export function addStudent(cid:number,name:string,gender:number,age:number,avatar:string,parentName:string,parentPhone:string,relation:string){
    return ajax.post<AddStudentResponse>('/api/garden/class/addStudent',{
        cid,name,gender,age,avatar,parentName,parentPhone,relation
    })
}

// 系统，班级管理员可用
export function modifyStudent(sid:number,name:string,gender:number,age:number,avatar:string,parentName:string,parentPhone:string,relation:string){
    return ajax.post<ModifyStudentResponse>('/api/garden/class/modifyStudent',{
        sid,name,gender,age,avatar,parentName,parentPhone,relation
    })
}

// 系统，班级管理员可用
export function deleteStudents(sids:number[]){
    return ajax.post<BaseResponse>('/api/garden/class/deleteStudents',{
        sids
    })
}

// 系统，班级管理员可用
export function moveStudents(sids:number[],toClass:number){
    return ajax.post<BaseResponse>('/api/garden/class/moveStudents',{
        sids,toClass
    })
}