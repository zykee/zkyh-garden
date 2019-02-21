import { 
  BaseResponse, 
  LoginResponse , 
  CheckResponse,
  ModifyUserResponse,
  GetUserInfoResponse,
  ListUsersByRoleResponse
} 
  from '../interfaces/Response'
  
import * as ajax from '../common/Http'
import * as cookie from '../common/Cookie'
import store from '../Store'

/**
* 用户登录
* @param account
* @param password
*/
export function login(account: string, password: string){
  return ajax.post<LoginResponse>('/api/admin/login', {
    account,
    password
  }).then(d=>{
    if(d.stat == 'ok'){
      // 发起action
      store.dispatch({
        type:"token.set",
        token:d.session.token
      })
      store.dispatch({
        type:"user.set",
        user:d.user
      })
      cookie.put('token', d.session.token, 14);
    }
    return d;
  });
}
/**
 * 校验登录
 */
export function check() {    
  return ajax.post<CheckResponse>('/api/admin/check', {}).then(d=>{
    if(d.stat == 'ok'){
      let token = cookie.get("token");
      store.dispatch({
        type:"token.set",
        token:token
      })
      store.dispatch({
        type:"user.set",
        user:d.info
      })
      cookie.put('token', token, 14);
    }
    return d;
  });
}
/**
 * 注销登录
 */
export function logout() {
  return ajax.post<BaseResponse>('/api/admin/logout', {}).then(d=>{
    if(d.stat == 'ok'){
      store.dispatch({
        type:"token.set",
        token:''
      })
      store.dispatch({
        type:"user.set",
        user:''
      })      
      cookie.remove('token');
    }
    return d;
  });
}

export function modifyUser(uid:number,account:string,phone:string,email:string,password:string,name:string,avatar:string,gender:number){
  return ajax.post<ModifyUserResponse>('/api/admin/modifyUser',{
    uid,account,phone,email,password,name,avatar,gender
  })
}

export function disableUsers(uids:number[]){
  return ajax.post<BaseResponse>('/api/admin/disableUsers',{
    uids
  })
}

export function enableUsers(uids:number[]){
  return ajax.post<BaseResponse>('/api/admin/enableUsers',{
    uids
  })
}

export function getUserInfo(uid:number){
  return ajax.post<GetUserInfoResponse>('/api/admin/getUserInfo',{
    uid
  })
}

export function listUsersByRole(role:string,pi:number,ps:number){
  return ajax.post<ListUsersByRoleResponse>('/api/admin/listUsersByRole',{
    role,pi,ps
  })
}
