import * as React from 'react'
import { RouteComponentProps} from 'react-router-dom'

import { Layout,Button,Table,Modal } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import './style.less'

const { Header, Footer, Sider, Content } = Layout;

var token = localStorage.getItem('token')

interface State {
  visible:boolean
  total: number
  title: string
  pageIndex: number
  pageSize: number
  rolename:string
  roleadmit:string
 
}


export default class extends React.Component<RouteComponentProps<any>> {
  
  state: State =
    {
      visible: false,
      total: 0,
      title: null,
      pageIndex: 1,
      pageSize: 15,
      rolename:"",
      roleadmit:""
    }
 
  render() {
    const columns:ColumnProps<any>[]= [{
      title: '编号',
      dataIndex: 'id',
      align: "center",
      render: (text:any, record: any, index: number) => { return index + 1 }
    },{
      title: '角色名称',
      dataIndex:'rname',
      align:"center"
    }
    , {
      title: '角色描述',
      dataIndex:'rdescribe',
      align: 'center'
    }, {
      title: '角色权限',
      dataIndex:'rprivilege',
      align: 'center',
      render: (text:string,record:any) => (
        <div>
          <a  onClick={()=>this.showPrivilege(record)}>查看详情</a>

        </div>
      )
    }, {
      title: '成员列表',  
      dataIndex:'rlist',   
      align: 'center',
      render: (text:any, record:any) => (
        <div>       
          <a onClick={this.viewList.bind(this,record.dataIndex)}>查看列表</a>
        </div>
      )
    }
  ];   
    const data = [{
      key: '1',
      rname: '超级管理员',
      rdescribe: '超级管理员拥有产品内所有权限',
      dataIndex: 'admin'
     
    }, {
      key: '2',
      rname: '幼儿管理员',
      rdescribe: '幼儿园管理员有管理自己幼儿园的权限', 
       dataIndex: 'master'
     
    },{
      key: '3',
      rname: '教师',
      rdescribe: '教师可以观看直播录播上传照片权限',  
      dataIndex: 'teacher'
      
    },{
      key: '4',
      rname: '家长主账号',
      rdescribe: '家长可以观看直播录播相册接受公告添加子账号权限',
      dataIndex:'parent'
    },{
      key: '5',
      rname: '家长子账号',
      rdescribe: '家长可以观看直播录播相册接受公告权限', 
      dataIndex:'family'
    }];
    
   
    return (
      <Layout className='admin-style'>
        <Content>
          <div className="content">
        <Table columns={columns} dataSource={data} pagination={false} />
          {this.renderModals()}
          </div>
        </Content>
    </Layout>   
    )
  }

  /**
   * 显示弹窗
   */
 
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  }


  handleCancel = () => {
    this.setState({ visible: false });
  }

  renderModals(){
    return (
      <Modal
      title="角色权限"
      visible={this.state.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      footer={[
        <Button key="back" onClick={this.handleCancel}>确定</Button>,
        <Button key="cancel" onClick={this.handleCancel}>取消</Button>
        
      ]}
      >
      <p>角色名称:{this.state.rolename}</p>
      <p>角色权限:{this.state.roleadmit}</p>
      <p>公告:查看</p>
      <p>相册:查看 上传 删除下载</p>
      <p>直播：查看</p>   
      </Modal>
    )}

showPrivilege=(record:any)=>{
  this.setState({visible:true})
  this.setState({rolename:record.rname})
  this.setState({roleadmit:record.rdescribe})
}
  viewList=(id: any)=> {
    // this.props.history.push(`${this.props.match.url}/List/$/${id}`)
    // console.log(id)
    this.props.history.push(`${this.props.match.url}/List/${id}`)
  }
}

