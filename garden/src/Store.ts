import { createStore, AnyAction, combineReducers } from 'redux'
import * as model from './interfaces/Model'

interface StoreType {
  menuOpenKeys:string[]
  menuSelectedKeys:string[]
  user:model.UserInfo
  token:string
}


// 合并reducer  一般是分开写 然后何在rootreducer中 再将rootreducer传进createStore中
let reducer = combineReducers<StoreType>({
  menuOpenKeys(state: string[] = [], action: AnyAction): string[] {
    switch (action.type) {
      case 'menuOpenKeys.set':
        return action.menuOpenKeys
      default:
        return state
        // 修改状态树
    }
  },
  menuSelectedKeys(state: string[] = [], action: AnyAction): string[] {
    switch (action.type) {
      case 'menuSelectedKeys.set':
        return action.menuSelectedKeys
      default:
        return state
    }
  },
  user(state: model.UserInfo = null, action: AnyAction): model.UserInfo {
    switch (action.type) {
      case 'user.set':
        return action.user
      default:
        return state
    }
  },
  token(state: string = null, action: AnyAction): string {
    switch (action.type) {
      case 'token.set':
        return action.token
      default:
        return state
    }
  }
});

export default createStore<StoreType>(reducer);