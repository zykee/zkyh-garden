import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Table, Button, Popover, Col, Icon, Form, Input, Modal, Pagination, message, Layout } from 'antd'
import './style.less'
import * as gardenApi from '../../services/Garden/GardenApi'
import { GardenRichInfo } from '../../interfaces/Model'
import { ColumnProps } from 'antd/lib/table'
interface IState {
  selectedRowKeys: string[]
  gardenInfo:GardenRichInfo[]
  total: number
  title: string
  pageIndex: number
  pageSize: number
  visible: boolean
  visibleEdit:boolean
  visibleTeacher:boolean
  searchContent: string
  okText:string
  middleVisible:boolean
  id:number
  name:string
  formRefAddGarden:any
  formRefModifyGarden:any
 
}

const { Header,  Content } = Layout;
const FormItem = Form.Item
const CollectionCreateForm = Form.create()(
  class extends React.Component<any, any> {
    render(){
        const { visible, onCancel, onOk, form, title, okText, klass } = this.props;
        const { getFieldDecorator } = form;
        return (
          <Modal
            visible={visible}
            title= {title}
            okText={okText}
            onCancel={onCancel}
            onOk={onOk}
          >
            <Form layout="vertical">
              <FormItem label={"幼儿园名称"}>
                {getFieldDecorator('name', {
                  initialValue:`${klass.name}`,
                    rules: [{ required: true},{ message: '不能为空' }],
                })(
                  <Input type="text"/>
                )}
              </FormItem>
              <FormItem label="园长姓名">
                    {getFieldDecorator('masterName',{
                      initialValue:`${klass.master.nickName}`,
                      rules:[{ required: true},{message:'不能为空'}]
                    })(
                    <Input type="text"/>
                    )}
              </FormItem>
              <FormItem label="园长手机号">
                {getFieldDecorator('masterPhone', {
                  initialValue:`${klass.master.phone}`,
                  rules: [{ required: true}, {message: '不能为空' }],
                })(
                  <Input type="text"/>
                )}
              </FormItem>
              <FormItem label="登录账号">
                {getFieldDecorator('masterAccount', {
                  initialValue:`${klass.master.account}`,
                  rules: [{ required: true}, {message: '不能为空' }],
                })(
                  <Input type="text"/>
                )}
              </FormItem>
              <FormItem label="登录密码">
                {getFieldDecorator('masterPassword', {
                  initialValue:`${klass.master.password}`,
                  rules: [{ required: true}, {message: '不能为空' }],
                })(
                  <Input type="text"/>
                )}
              </FormItem>
            </Form>
          </Modal>
        );
      }
    });

export default class extends React.Component<RouteComponentProps<any>, IState> {
  loading: boolean = false
  form: any = null
  hasSelected:boolean = true
  state: IState = {
    selectedRowKeys: [],
    gardenInfo:[],
    total: 0,
    pageIndex: 1,
    pageSize: 8,
    visible: false,
    visibleEdit:false,
    visibleTeacher:false,
    searchContent: '',
    title: '',
    okText: '',
    middleVisible:true,
    id:null,
    name:'班级名称',
    formRefAddGarden : '',
    formRefModifyGarden : '',
  }
  onSelectChange=(selectedRowKeys: string[]) => {
    // console.log(selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  handleDelete=(a:any)=>{
    this.setState({
      selectedRowKeys:[]
    })
    this.deleteGarden(a)  
  }
  showModalAddClass=()=>{
    this.setState({
      title:"添加班级",
      name:'班级名称',
      okText:"保存",
      visible:true,
      middleVisible:true,
      id:null
    })
  }
  //点击修改幼儿园
  showModelEditGarden=(gid:number)=>{
    this.setState({
      title:"修改幼儿园",
      okText:"修改",
      visibleEdit:true,
      id:gid
    })
  }
  handleModify=()=>{    
    const form = this.state.formRefModifyGarden.props.form;
    form.validateFields((err:any, values:Object) => {
      if (err) {
        console.log('出错啦！！'+err+':');
        return;
      }
      console.log('Received values of form: ', values);
      this.modifyGarden(this.state.id,values);
      form.resetFields();
      this.setState({ visibleEdit: false });
    }); 
  }
  //确认增加班级
  handleOk = () => {
    const form = this.state.formRefAddGarden.props.form;
    form.validateFields((err:any, values:Object) => {
      if (err) {
        console.log(err)
        return;
      }
      console.log('Received values of form: ', values);
      this.addGarden(values);
      this.setState({ visible: false });
      form.resetFields();
    });
  }
  //取消
  handleCancel = () => {
    this.setState({
      visibleTeacher: false,
      visibleEdit:false,
      visible: false
    });
  }
  //删除幼儿园
  handlePopoverClick=(i:number)=>{
    console.log(i)
    this.deleteGarden(i)
  }
 //AddClass的formRef
  saveFormRefAddClass=(formRef:any)=>{
    this.setState({
      formRefAddGarden:formRef
    })
  }
  //ModifyClass的formRef
  saveFormRefModifyClass=(formRef:any)=>{
    this.setState({
      formRefModifyGarden:formRef
    })
  }
 //返回对话框
  renderModals(visible:boolean,onOk:any,saveFormRef:any,i:GardenRichInfo){
    let klass:any = {
              'name':'',
              master:{
                'nickName':'',
                'phone':'',
                'account':'',
                'password':''
              }
    };
    klass=i?{'name':i.name,
                  master:{
                  'nickName':i.master.nickName,
                  'phone':i.master.phone,
                  'account':i.master.account,
                  'password':i.master.password
              }}:klass;
    return (
      <CollectionCreateForm
                wrappedComponentRef={saveFormRef}
                visible={visible}
                title={this.state.title}
                okText={this.state.okText}
                onCancel={this.handleCancel}
                onOk={onOk}
                klass={klass}
              />
    )
  }
  //点击进入班级管理页面
  classCheck=(i:number)=>{
    this.props.history.push(`/home/garden/class/${i}`)
  }
  //返回设置的按钮组
  content(i:GardenRichInfo){
    return (
    <div className="button-Popover">
      <Button onClick={()=>this.showModelEditGarden(i.id)}>修改</Button>
          {this.renderModals(this.state.visibleEdit,this.handleModify,this.saveFormRefModifyClass,i)}
      <Button onClick={()=>this.handleDelete(i)}>删除</Button>
      <Button onClick={()=>this.classCheck(i.id)}>查看班级</Button>
    </div>
  )}
  //返回主页面
  render() {
    const { selectedRowKeys } = this.state;
    // const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const maskClosable = true;
    const hasSelected = selectedRowKeys.length > 0; 
    return (
        <Layout className='garden-style' >
          <Header className='header'>
            <div>
              <Button
                  type="primary"
                  onClick={this.showModalAddClass}
              >添加幼儿园</Button>
            </div>
          </Header>
          <Content className='content'>
            <Table
              rowSelection={rowSelection}
              columns={this.columns}
              rowKey={(record) => { return record.id.toString() }}  //设置uniquekey
              dataSource={this.state.gardenInfo}
              pagination={{
                showTotal: total => <span>共{total}条</span>
              }}
            />
             {this.renderModals(this.state.visible,this.handleOk,this.saveFormRefAddClass,null)}
          </Content>
        </Layout>
    )
  }
  columns: ColumnProps<GardenRichInfo>[] = [{
    title: '编号',
    key: 'id',
    dataIndex:'id',
    align: 'center',
  }, {
    title: '幼儿园名称',
    dataIndex: 'name',
    align: 'center',
    render: (text, record) => (
      <Col>{record.name}</Col>
    )
  }, {
    title: '园长姓名',
    dataIndex: 'master.nickName',
    align: 'center',
    render: (text, record) => (
      <Col>{record.master.nickName}</Col>
    )
  }, {
    title: '园长手机号',
    dataIndex: 'master.phone',
    align: 'center',
    render:(text,record)=>(
      <Col>{record.master.phone}</Col>
    )
  }, {
    title: '登录账号',
    dataIndex: 'master.account',
    align: 'center',
    render: (text, record) => (
      <Col >{record.master.account}</Col>
    )
  }, {
    title: '登录密码',
    dataIndex: 'master.password',
    align: 'center',
    render: (text, record) => (
      <Col >{record.master.password}</Col>
    )
  },{
    title: '设置',
    align: 'center',
    render: (text, record) => (
      <Col>
        <Popover placement="left" content={this.content(record)}>
          <Icon type="setting" /> 
        </Popover>
      </Col>
    )
  }]
  //获取数据
  getData(){
    try{
     gardenApi.list(0,0).then(result=>{
        console.log(result.gardens)
        if(result.stat==='ok'){
          console.log(result)
          this.setState({
            gardenInfo:result.gardens          
          })
        }else{
          console.log(result)
          throw result.stat
        }
     })
    }catch(error){
      Modal.error({
        title:'提示',
        content:error
      })
    }
  }
  //删除幼儿园
 deleteGarden=(a:any)=>{
    try{
      let id =parseInt(a.id)
      console.log(id)
      gardenApi.deleteGarden(id).then(result=>{
        if(result.stat==='ok'){
          this.getData()
          message.success('删除成功！')
        }else{
          message.success('删除失败！')
          throw result.stat
        }
      })
    }catch(error){
      Modal.error({
        title:'提示',
        content:error
      })
    }
  }
  //增加幼儿园
  addGarden(a:any){
    let {name,masterName,masterPhone,masterAccount,masterPassword} = a;
    console.log(a);
    try{
      gardenApi.add(name,masterName,masterPhone,masterAccount,masterPassword).then(result=>{
        if(result.stat==='ok'){
          this.setState((prevState:IState)=>{
            return {gardenInfo:[...prevState.gardenInfo,result.info]}
          })
          message.success('添加成功！')
        }else{
          message.success('添加失败！')
          throw result.stat
        }
      })      
    }catch(error){
      Modal.error({
        title:'提示',
        content:error
      })
    }  
  }
  //修改幼儿园
  modifyGarden(gid:number,a:any){
    // console.log(gid+' '+a);
    let {name,masterName,masterPhone,masterAccount,masterPassword} = a;
    try{
      gardenApi.modify(gid,name,masterName,masterPhone,masterAccount,masterPassword).then(result=>{
        if(result.stat==='ok'){
          this.getData()
        }else{
          throw result.stat
        }
      })      
    }catch(error){
      Modal.error({
        title:'提示',
        content:error
      })
    }  
  }
  //加载数据
  componentDidMount() {
    this.getData()
  }
}
