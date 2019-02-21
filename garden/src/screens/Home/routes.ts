import WelcomeScreen from '../Welcome'
import AnounceSendComponent from '../Anounce/Send'
import RoleMemberListScreen from '../Admin/RoleMemberListScreen'
import ClassManageScreen from '../Garden/ClassManage'
import GardenClass from '../Garden/Class'
interface IRouter {
    name?:any
    component?: any
    path?: string
}
  
const routes: IRouter[] = [
    { name: '欢迎', path: "/home/welcome", component: WelcomeScreen },
    { name: '公告发布', path: "/home/anounce/send", component:AnounceSendComponent},
    { name: '角色人员列表', path: "/home/rolePermission/list", component:RoleMemberListScreen },
    { name:'成员管理', path:"/home/garden/classmanage/:id",component:ClassManageScreen},
    { name: '角色人员列表', path: "/home/rolePermission/list/:id", component:RoleMemberListScreen },
    { name: '欢迎', path: "/home/garden/welcome", component: WelcomeScreen },
    { name: '班级管理', path: "/home/garden/class/:id", component:GardenClass},

]

export default routes;