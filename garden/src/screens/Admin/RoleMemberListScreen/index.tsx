import * as React from 'react'
import { RouteComponentProps} from 'react-router-dom'

import { Layout, Button, Table, message, Modal, Icon, Popover, Pagination, Form, Input } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import './style.less'
import * as adminRoleList from '../../../services/Auth'
import { UserInfo } from '../../../interfaces/Model'
import mount from 'mount-react'


const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;

interface IState {
  total: number
  title: string
  pageIndex: number
  pageSize: number
  data: any[]
  forbid: boolean
  rolestatus: string
  page: number
  context: string
  visible: boolean
  userInfo: UserInfo[]
  id: number
  middleVisible: boolean
  visibleEdit: boolean
  okText: string
  formRefModifyClass: any
  RoleInfo: object
}

const CollectionCreateForm = Form.create()(
  class extends React.Component<any, any> {
    render() {
      const { visible, onCancel, onOk, form, title, okText, klass, middleVisible } = this.props;

      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={title}
          okText={okText}
          onCancel={onCancel}
          onOk={onOk}
        >
          <Form layout="vertical">
            <FormItem label="用户昵称">
              {getFieldDecorator('UserNickName', {
                initialValue: `${klass.nickName}`,
                rules: [{ message: '请输入用户昵称' }],
              })(
                <Input type="text" />
              )}
            </FormItem>
            {middleVisible ? (<FormItem label="账号">
              {getFieldDecorator('UserAccount', {
                initialValue: `${klass.account}`,
                rules: [{ message: '请输入账号' }]
              })(
                <Input type="text" />
              )}
            </FormItem>) : null
            }
            <FormItem label="密码">
              {getFieldDecorator('UserPassword', {
                initialValue: `${klass.password}`,
                rules: [{ message: '请输入密码' }],
              })(
                <Input type="text" />
              )}
            </FormItem>

          </Form>
        </Modal>
      );
    }
  });

export default class extends React.Component<RouteComponentProps<any>, IState> {
  state: IState = {
    total: 0,
    title: null,
    pageIndex: 1,
    pageSize: 5,
    data: [],
    forbid: true,
    rolestatus: "",
    page: 0,
    context: "",
    visible: false,
    userInfo: [],
    id: null,
    middleVisible: true,
    visibleEdit: false,
    okText: '',
    formRefModifyClass: '',
    RoleInfo: {
      'id': null,
      'account': "",
      'phone': "",
      'email': "",
      'password': "",
      'nickName': "",
      'avatar': "",
      'gender': null
    }
  }

  columns: ColumnProps<UserInfo>[] = [{
    title: '编号',
    dataIndex: 'id',
    align: "center",
    render: (text: String, record: UserInfo, index: number) => { return index + 1 }
  }, {
    title: '用户昵称',
    dataIndex: 'nickName',
    align: "center"
  }, {
    title: '角色名称',
    dataIndex: 'role',
    align: "center"
  }
    , {
    title: '账号',
    dataIndex: 'account',
    align: 'center'
  }, {
    title: '性别',
    dataIndex: 'gender',
    align: 'center',
    render: (text: String, record: UserInfo) => {
      if (record.gender == 0) return "女"; else { return "男" }
    }
  }, {
    title: '手机号',
    dataIndex: 'phone',
    align: 'center',
  }, {
    title: '邮箱',
    dataIndex: 'email',
    align: 'center'
  }, {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    render: (text: string, record: UserInfo) => { if (record.status == 0) return "激活"; else return "禁用" }
  }, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    render: (text: String, record: UserInfo) => (
      <div>
        <Popover content={this.renderMenu(record)}>
          <Icon style={{ fontSize: 20 }} type="setting" />
        </Popover>
      </div>
    )
  }
  ];

  render() {
    return (
      <Layout className='admin-style'>
        <Content className="contentMain">
          <div className="contentStyle">
            <Button type="primary" onClick={()=>this.props.history.goBack()}>返回</Button>
              <Table columns={this.columns} dataSource={this.state.data}
                rowKey="id"
                pagination={{
                  showTotal: total => <span>共{total}条</span>
                }} />
           </div>
        </Content>
      </Layout>
    )
  }


  renderMenu(record: UserInfo) {
    //  console.log(record)
    return (
      <div>
        <div><a onClick={() => this.modifyUserInfo(record.id, record)}>修改</a></div>
        {this.renderModals(this.state.visible, this.handleModify, this.saveFormRefModifyClass, record)}
        <div><a onClick={() => this.chooseStatus(record)}>{record.status?"激活":"禁用"}</a></div>

      </div>
    )
  }

  chooseStatus = (record: UserInfo) => {
    if (record.status == 0) {
      adminRoleList.disableUsers([record.id]).then(d => {
        if (d.stat == 'ok') {
          message.info("禁用成功");
          this.listUsersByRole();
        }
        else {
          message.info(d.stat);
        }
      })
    }
    else{
      adminRoleList.enableUsers([record.id]).then(d=>{
        if (d.stat == 'ok') {
          message.info("激活成功");
          this.listUsersByRole();
        }
        else {
          message.info(d.stat);
        }
      })
    }

  }

  statusView(id: number) {
    this.setState({ rolestatus: this.state.forbid ? "禁止" : "允许" })
    // console.log(this.state.forbid+this.state.rolestatus)
    return this.state.rolestatus
  }

  modifyUserInfo = (cid: number, record: UserInfo) => {
    this.setState({
      title: "编辑",
      okText: "修改",
      visible: true,
      id: cid,
      RoleInfo: {
        'id': record.id,
        'account': record.account,
        'phone': record.phone,
        'email': record.email,
        'password': record.password,
        'nickName': record.nickName,
        'avatar': record.avatar,
        'gender': record.gender
      }
    })
  }

  handleOk = () => {
    this.setState({ visible: false });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  renderModals(visible: boolean, onOk: any, saveFormRef: any, record: UserInfo) {
    const klass = {
      'id': record.id,
      'account': record.account,
      'phone': record.phone,
      'email': record.email,
      'password': record.password,
      'nickName': record.nickName,
      'avatar': record.avatar,
      'gender': record.gender
    };
    // console.log(klass);

    return (
      <CollectionCreateForm
        wrappedComponentRef={saveFormRef}
        visible={visible}
        title={this.state.title}
        okText={this.state.okText}
        onCancel={this.handleCancel}
        onOk={onOk}
        klass={klass}
        middleVisible={this.state.middleVisible}
      />
    )
  }

  handleModify = () => {
    const form = this.state.formRefModifyClass.props.form;
    // console.log("test")
    form.validateFields((err: any, values: Object) => {
      if (err) {
        console.log('出错啦！！' + err + ':');
        return;
      }
      console.log('Received values of form: ', values);
      this.modifyClass(this.state.RoleInfo, values);
      form.resetFields();
      this.setState({ visible: false });
    });
  }

  saveFormRefModifyClass = (formRef: any) => {
    this.setState({
      formRefModifyClass: formRef
    })
  }


  async listUsersByRole() {
    try {
      const result = await adminRoleList.listUsersByRole(this.props.match.params.id, 0, 1)
      // console.log(result.users)
      if (result.stat === 'ok') {
        // console.log(result)
        this.setState({
          data: result.users
        })
      } else {
        // console.log(result)
        throw result.stat
      }
    } catch (error) {
      Modal.error({
        title: '提示',
        content: error
      })
    }
  }

  modifyClass(roleInfo: any, values: any) {
    // console.log(roleInfo);
    // console.log("a test")
    let { id, account, phone, email, password, nickName, avatar, gender } = roleInfo;
    let { UserNickName, UserAccount, UserPassword } = values
    try {
      adminRoleList.modifyUser(id, UserAccount, phone, email, UserPassword, UserNickName, avatar, gender).then(result => {
        if (result.stat === 'ok') {
          this.listUsersByRole()
        } else {
          throw result.stat
        }
      })
    } catch (error) {
      Modal.error({
        title: '提示',
        content: error
      })
    }
  }

  componentDidMount() {
    this.listUsersByRole()
  }

}