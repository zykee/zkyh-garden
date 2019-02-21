import * as React from 'react'
import { Layout, Menu, Icon, Button, Breadcrumb, message, Modal, Row, Col } from 'antd'
import { ClickParam } from 'antd/lib/menu'
import { RouteComponentProps, Route, Redirect, Switch } from 'react-router'
import { Unsubscribe } from 'redux'
import store from '../../Store'
import './style.less'
import * as cookie from '../../common/Cookie'
import * as authService from '../../services/Auth'
import { UserInfo } from '../../interfaces/Model'
import {AdminMenus,MasterMenus} from './menus';
import routes from './routes'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

interface IProps {

}

interface IState {
  user: UserInfo
  collapsed: boolean
  menuSelectedKeys: string[]
  menuOpenKeys:string[]
  title: string
  menus:any
}

function XBreadcrumb(props: any) {
  return (
    <span style={{ margin: '16px 5px', color:'#999' }}>
      <span style={{ marginLeft:'10px'}}>{props.root}</span>
      {props.sub && (<span><span style={{ margin:'0px 5px'}}>></span>{props.sub}</span>)}
    </span>
  );
}

export default class extends React.Component<RouteComponentProps<IProps>, IState> {
  unsub: Unsubscribe
  
  state: IState = {
    collapsed: false,
    user: null,
    menuSelectedKeys: ['camera', 'list'],
    menuOpenKeys:['camera'],
    title: 'origin title',
    menus:[]
  }

  render() {
    const {menus} = this.state
    return (
      <Layout className='frame-layout'>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div 
            className="frame-logo" 
            onClick={() => this.go('/home/welcome')}
          >
            {!this.state.collapsed && "幼儿园管理后台"}
          </div>
          <Menu
            mode="inline"
            theme="dark"
            openKeys={this.state.menuOpenKeys}
            selectedKeys={this.state.menuSelectedKeys}
            onOpenChange={this.onOpenChange}
            onClick={this.onMenuClicked}
          >
            {
              menus.map((m:any) => {
                if(m.subs){
                  return (<SubMenu 
                    key={m.key} 
                    title={
                      <span><Icon type={m.icon} /><span>{m.name}</span></span>
                    }>
                      {m.subs && m.subs.map((s:any) => 
                        (<Menu.Item key={s.key}>{s.name}</Menu.Item>)
                      )}
                  </SubMenu>)
                }else{
                  return (<Menu.Item key={m.key}>
                    <span><Icon type={m.icon} /><span>{m.name}</span></span>
                  </Menu.Item>)
                }
              })
            }
          </Menu>
        </Sider>
        <Layout>
          <Header className="frame-header" >
            <Row gutter={24}>
              <Col span={18}>
              <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.onToggleCollapse}
                />
                <Switch>
                {menus.map((m:any) => {
                  if(m.subs){
                    return m.subs.map((s:any) => (
                      <Route 
                        key={s.key} 
                        path={`${s.path}`} 
                        component={() => (
                          <XBreadcrumb root={m.name} sub={s.name} />
                        )}
                        />
                    ))
                  }else{
                    return (
                      <Route 
                        key={m.key} 
                        path={`${m.path}`} 
                        component={() => (
                          <XBreadcrumb root={m.name} />
                        )} 
                      />
                    )
                  }
                })}
                {routes.map((r, i) => (
                  <Route 
                    key={i} 
                    path={`${r.path}`} 
                    component={() => (
                      <XBreadcrumb root={r.name} />
                    )} 
                  />
                ))}
                </Switch>
              </Col>
              <Col 
                span={6} 
                style={{ textAlign: 'right' }}
              >
                <span>{this.userName}</span>
                <Button 
                  className="btn-logout" 
                  onClick={() => this.logout()}>
                  退出
                </Button>
              </Col>
            </Row>
          </Header>
          <Content style={{ margin: '0' }}>
            <Switch>
              {menus.map((m:any) => {
                if(m.subs) {
                  return m.subs.map((s:any) => (
                    <Route 
                      key={s.key} 
                      path={`${s.path}`} 
                      component={s.component} 
                    />
                  ))
                }else{
                  return (
                    <Route 
                    exact
                      key={m.key} 
                      path={`${m.path}`} 
                      component={m.component} 
                    />
                  )
                }
              })}
              {routes.map((r, i) => (
                <Route exact
                  key={i} 
                  path={`${r.path}`} 
                  component={r.component} 
                />
              ))}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }

  get userName(){
    return this.state.user ? this.state.user.nickName : '管理员';
  }

  onToggleCollapse = () => {
    this.setState({ collapsed:!this.state.collapsed });
  }

  onOpenChange = (openKeys: string[]) => {
    this.setState({
      menuOpenKeys:openKeys
    })
    cookie.put('mokv', JSON.stringify(openKeys), 1);
  }

  onMenuClicked = (args: ClickParam) => {
    var selectedKeys = args.keyPath.reverse();
    this.setState({
      menuSelectedKeys:selectedKeys
    })
    cookie.put('mskv', JSON.stringify(selectedKeys), 1);
    var path = selectedKeys.join('/');
    this.go(`/home/${path}`);
  }

  go(path: string) {
    if (path && location.hash !== `#${path}`) {
      try {
        this.props.history.push(path)
      } catch (error) { }
    }
  }

  logout() {
    authService.logout()
    this.props.history.push('/login')
    message.success('注销成功')
  }

  componentWillMount() {
    var mokv = cookie.get('mokv');
    var mksv = cookie.get('mskv');
    let openKeys = mokv ? JSON.parse(mokv) : this.state.menuOpenKeys;
    let selectedKeys = mksv ? JSON.parse(mksv) : this.state.menuSelectedKeys;
    this.setState({
      menuOpenKeys:openKeys,
      menuSelectedKeys:selectedKeys
    })
    authService.check().then(d=>{
      if(d.stat !== 'ok'){
        this.props.history.push('/login');        
      }else{
        this.setState({
          user:d.info,
          menus:d.info.role==='admin'?AdminMenus:MasterMenus
        })
        console.log(d.info)
      }
    });
  }

  // componentWillUnmount() {
  //   this.unsub()
  // }
}
