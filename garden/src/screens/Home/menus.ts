import GardenScreen from '../Garden'; 
import AdminScreen from '../Admin';
import AnounceScreen from '../Anounce/Index';
import CameraScreen from '../Camera'
import GardenClass from '../Garden/Class'
import FeedbackScreen from '../Feedback';

interface IMenu {
    key: string
    name: string
    component?: any
    icon?: string
    path?: string
    subs?: IMenu[]
}
  
export const AdminMenus: IMenu[] = [
    { name: '幼儿园管理', key: 'garden', path: "/home/garden", icon: "switcher", component:GardenScreen}, 
    { name: '摄像头管理', key: 'camera',path:"/home/camera", icon: "video-camera",component: CameraScreen },
    {
      name: '系统设置', key: 'feedback', icon: "switcher",subs: [
        { name: '意见反馈', key: 'list', path: "/home/feedback/list", component: FeedbackScreen }
      ]
    },
    { name: '角色权限', key: 'rolePermission', path: "/home/rolePermission", icon: "switcher", component:AdminScreen}
  ]

  export const MasterMenus: IMenu[] = [
    { name: '班级管理', key: 'garden', path: "/home/garden", icon: "switcher", component:GardenClass}, 
    { name: '摄像头管理', key: 'camera',path:"/home/camera", icon: "video-camera",component: CameraScreen }, 
    { name:'公告管理',key:'anounce', path:"/home/anounce", icon:"edit", component:AnounceScreen}
  ]



  // export menus;
