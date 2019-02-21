import * as React from 'react'
import { RouteComponentProps, Route, Redirect, Switch } from 'react-router'
import { Table, Button, Row, Popover, Col, Icon, Form, Input, Modal, Pagination, Rate, message, Layout } from 'antd'
import * as antd from 'antd';
import './style.less'
import * as gardenClasses from '../../../services/Garden/Classapi'
import { ClassShortInfo } from '../../../interfaces/Model'
import { UserInfo } from '../../../interfaces/Model'
import { ColumnProps } from 'antd/lib/table'
import TeacherListComponent from '../../../components/TeacherListComponent'
import mount from 'mount-react'
import {check} from '../../../services/Auth'

interface IState {
  selectedRowKeys: string[]
  classInfo:ClassShortInfo[]
  teacherInfo:UserInfo[]
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
  formRefAddClass:any
  formRefModifyClass:any
  formRefAddTeacher:any
  userCheck:any
}

const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item
const CollectionCreateForm = Form.create()(
  class extends React.Component<any, any> {
    render(){
    const { visible, onCancel, onOk, form, title, okText, klass, middleVisible,name } = this.props;
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
              <FormItem label={name}>
                {getFieldDecorator('nameValue', {
                  initialValue:`${klass.name}`,
                    rules: [{ required: true},{ message: '请输入班级名称' }],
                })(
                  <Input type="text"/>
                )}
              </FormItem>
              {middleVisible?(<FormItem label="负责老师">
                    {getFieldDecorator('teacherNameValue',{
                      initialValue:`${klass.major.nickName}`,
                      rules:[{message:'请输入负责人姓名'}]
                    })(
                    <Input type="text"/>
                    )}
                  </FormItem>):null
              }
              <FormItem label="负责人电话">
                {getFieldDecorator('teacherPhone', {
                  initialValue:`${klass.major.phone}`,
                  rules: [{ required: true}, {message: '请输入负责人电话!' }],
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
    classInfo:[],
    teacherInfo:[],
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
    formRefAddClass : '',
    formRefModifyClass : '',
    formRefAddTeacher:'',
    userCheck:null
  }
  onSelectChange=(selectedRowKeys: string[]) => {
    console.log(selectedRowKeys);
    this.setState({ selectedRowKeys });
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
  showModelEditClass=(cid:number)=>{
    // console.log(id);
    this.setState({
      title:"修改班级",
      name:'班级名称',
      okText:"修改",
      visibleEdit:true,
      middleVisible:true,
      id:cid
    })
    
  }
  handleModify=()=>{    
    const form = this.state.formRefModifyClass.props.form;
    form.validateFields((err:any, values:Object) => {
      if (err) {
        console.log('出错啦！！'+err+':');
        return;
      }
      console.log('Received values of form: ', values);
      this.modifyClass(this.state.id,values);
      form.resetFields();
      this.setState({ visibleEdit: false });
    }); 
  }
  handleOk = () => {
    const form = this.state.formRefAddClass.props.form;
    form.validateFields((err:any, values:Object) => {
      if (err) {
        console.log(err)
        return;
      }
      console.log('Received values of form: ', values);
      this.addClasses(values);
      this.setState({ visible: false });
      form.resetFields();
    });
  }
  handleAddTeacher = () =>{
    const form = this.state.formRefAddTeacher.props.form;
    form.validateFields((err:any, values:Object) => {
      if (err) {
        console.log('添加老师出错啦！');
        return;
      }
      console.log('Received values of form: ', values);
      this.addTeacher(this.state.id,values);
      form.resetFields();
      this.setState({ visibleTeacher: false });
    });
  }
  handleCancel = () => {
    // console.log('Clicked cancel button');
    this.setState({
      visibleTeacher: false,
      visibleEdit:false,
      visible: false
    });
  }
 
  handlePopoverClick=(i:number)=>{
    console.log(i)
    this.deleteClasses([i])
  }
  middleNotVisible=(cid:number)=>{
    this.setState({
      title:"增加老师",
      okText:"确定",
      name:'代课老师',
      visibleTeacher:true,
      middleVisible:false,
      id:cid
    })
  }

  saveFormRefAddClass=(formRef:any)=>{
    this.setState({
      formRefAddClass:formRef
    })
  }

  saveFormRefModifyClass=(formRef:any)=>{
    this.setState({
      formRefModifyClass:formRef
    })
  }

  saveFormRefAddTeacher=(formRef:any)=>{
    this.setState({
      formRefAddTeacher:formRef
    })
  }
  renderModals(visible:boolean,onOk:any,saveFormRef:any,name:string,nickName:string,phone:string){
    const klass= {'name':name,major:{
      'nickName':nickName,
      'phone':phone
    }};
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
                name={this.state.name}
              />
    )
  }
  lookTeacherList(i:any){
    // console.log(i.major.id)
    let unmount = mount(
      <TeacherListComponent 
      id={i.id}
      />
    )
  }
  classManage=(i:number)=>{
    // console.log('ok!');
    this.props.history.push(`/home/garden/classmanage/${i}`)
  }
  content(i:ClassShortInfo){
    // console.log(i)
    return (
    <div className="button-Popover">
      <Button onClick={()=>this.classManage(i.id)}>成员管理</Button>
      <Button onClick={()=>this.showModelEditClass(i.id)}>修改班级</Button>
          {this.renderModals(this.state.visibleEdit,this.handleModify,this.saveFormRefModifyClass,i.name,i.major.nickName,i.major.phone)}
      <Button onClick={()=>this.middleNotVisible(i.id)}>增加老师</Button>
     
      <Button onClick={()=>this.handlePopoverClick(i.id)}>删除班级</Button>
    </div>
  )} 
  returnButton=()=>{
    return (
          <Button
            type="primary"
            onClick={()=>this.props.history.goBack()}
        >返回</Button>
    )}
 
  render() {
    const { visible, selectedRowKeys } = this.state;
    // const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const maskClosable = true;
    const hasSelected = selectedRowKeys.length > 0; 
    return (
        <Layout className='garden-style'>
          <Header className='header'>
            <div>
              {this.state.userCheck==="admin"?this.returnButton():null}
              <Button
                  type="primary"
                  onClick={this.showModalAddClass}
              >添加班级</Button>
              <Button
                  type="danger"
                  // style={{backgroundColor:'red'}}
                  onClick={this.handleDelete}
                  disabled={!hasSelected}
              >删除班级</Button>
            </div>
          </Header>
          <Content className='content'>
            <Table
              rowSelection={rowSelection}
              columns={this.columns}
              rowKey={(record) => { return record.id.toString() }}  //设置uniquekey
              dataSource={this.state.classInfo}
              pagination={{
                showTotal: total => <span>共{total}条</span>
              }}
            />
               {this.renderModals(this.state.visible,this.handleOk,this.saveFormRefAddClass,'','','')}
               {this.renderModals(this.state.visibleTeacher,this.handleAddTeacher,this.saveFormRefAddTeacher,'','','')}
          </Content>
        </Layout>
    )
  }
  columns: ColumnProps<ClassShortInfo>[] = [{
    title: '编号',
    key: 'id',
    dataIndex:'id',
    align: 'center',
  }, {
    title: '班级名称',
    dataIndex: 'name',
    align: 'center'
  }, {
    title: '负责老师',
    align: 'center',
    render: (text, record) => (
      <Col>{record.major.nickName}</Col>
    )
  }, {
    title: '负责人电话',
    align: 'center',
    render:(text,record)=>(
      <Col>{record.major.phone}</Col>
    )
  }, {
    title: '代课老师',
    align: 'center',
    render: (text, record) => (
      <Col ><a onClick={()=>this.lookTeacherList(record)}>查看老师</a>{}</Col>
    )
  }, {
    title: '班级人数',
    align: 'center',
    render: (text, record) => (
      <Col >{record.studentsCount}</Col>
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
  checkUser=()=>{
    check().then(d=>{
      this.setState({
        userCheck:d.info.role
      },()=>{this.getData()})
    })
  }
   getData(){
    try{
      let todo = null
      todo = this.state.userCheck==="admin"?gardenClasses.listByGarden(parseInt(this.props.match.params.id),0,0):gardenClasses.list(0,0)
      todo.then(result=>{
        if(result.stat==='ok'){
          // console.log(result)
          message.success('成功获取数据')
          this.setState({
            classInfo:result.classes          
          })
        }else{
          // console.log(result)
          message.error('获取数据失败')
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
  
  handleDelete=()=>{
    let keys = this.state.selectedRowKeys;
    console.log(typeof(keys[0]),keys) 
    let newkeys = keys.map((e)=>{
      return parseInt(e);
    })
    this.deleteClasses(newkeys)
    this.setState({
      selectedRowKeys:[]
    })
  }

   deleteClasses(a:number[]){
    // console.log(a)
    try{
     gardenClasses.deleteClasses(a).then(result=>{
        if(result.stat==='ok'){
          this.getData()
          message.success('成功删除数据')
        }else{
          message.error('删除数据失败')
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

  addClasses(a:any){
    let {nameValue,teacherNameValue,teacherPhone} = a;
    console.log(a);
    try{
      gardenClasses.add(nameValue,teacherNameValue,teacherPhone).then(result=>{
        if(result.stat==='ok'){
          this.setState((prevState:IState)=>{
            return {classInfo:[...prevState.classInfo,result.info]}
          })
          message.success('成功添加班级')
        }else{
          message.error('添加班级失败')
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

  modifyClass(cid:number,a:any){
    let {nameValue,teacherNameValue,teacherPhone} = a;
    try{
      gardenClasses.modify(cid,nameValue,teacherNameValue,teacherPhone).then(result=>{
        if(result.stat==='ok'){
          this.getData()
          message.success('成功修改班级')
        }else{
          message.error('修改班级失败')
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
  addTeacher(cid:any,a:any){
    let {nameValue,teacherPhone} = a;
    try{
      gardenClasses.addTeacher(cid,nameValue,teacherPhone).then(result=>{
        if(result.stat==='ok'){
          this.setState((prevState:IState)=>{
            return {teacherInfo:[...prevState.teacherInfo,result.info]}
          })
          message.success('成功增加老师')
        }else{
          message.error('增加老师失败')
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

  componentDidMount() {
    // console.log(this.state.userCheck)
    this.checkUser()
    
  }
}
