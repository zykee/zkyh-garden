import * as React from 'react'
import { RouteComponentProps, Route, Redirect, Switch } from 'react-router'
import { Table, Button, Upload, Popover, Col, Icon, Form, Input, Modal, Radio, Rate, message, Layout ,Tree } from 'antd'
import * as antd from 'antd';
import './style.less'
import * as gardenClasses from '../../../services/Garden/Classapi'
import { StudentInfo, ClassShortInfo } from '../../../interfaces/Model'
import { ColumnProps } from 'antd/lib/table'
import { FormComponentProps } from 'antd/lib/form'
import * as cookie from '../../../common/Cookie'
import mount from 'mount-react'
import { Record } from 'immutable';

interface IState {
  classes:ClassShortInfo[]
  selectedRowKeys: string[]
  Student:StudentInfo[]
  total: number
  title: string
  pageIndex: number
  pageSize: number
  visible: boolean
  visibleEdit:boolean
  visibleMove:boolean
  visibleSettingMove:boolean
  searchContent: string
  middleVisible:boolean
  visibleMiddle:boolean
  id:number
  addVisible:boolean
  searchText:string
  checkedKeys:string[]
  okText:string
  modifyVisible: boolean
  picVisible:boolean
  formRefAddMember:any
  formRefModifyMember:any
  sid:number
  avater:string
}

const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item
const RadioGroup = Radio.Group;

const CollectionCreateForm = Form.create()(
  class extends React.Component<any, any> {
    render(){
      const {form , visible,onCancel,onOk,data,title,okText} = this.props;
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
              <FormItem label="姓名">
                {getFieldDecorator('name', {
                    initialValue:`${data.name}`,
                    rules: [{ required: true},{ message: '不能为空' }],
                })(
                  <Input type="text" style={{display:"inline-block"}}/>
                )}
              </FormItem>
              <FormItem label="性别">
                {getFieldDecorator('gender',{
                      initialValue:`${data.gender}`,
                      rules:[{ required: true},{message:'不能为空'}]
                    })(
                    <RadioGroup style={{textAlign:"left",display:"inline-block"}}>
                    <Radio value="1">男</Radio>
                    <Radio value="0">女</Radio>
                    </RadioGroup>
                )}
              </FormItem>
              <FormItem label="年龄">
                {getFieldDecorator('age',{
                  initialValue:`${data.age}`,
                      rules:[{ required: true},{message:'不能为空'}]
                    })(
                    <Input type="text"/>
                )}
              </FormItem>
              <FormItem label="家长姓名">
                {getFieldDecorator('parentName', {
                  initialValue:`${data.parentName}`,
                  rules: [{ required: true}, {message: '不能为空' }],
                })(
                  <Input type="text"/>
                )}
              </FormItem>
              <FormItem label="亲属关系">
                {getFieldDecorator('relation', {
                  initialValue:`${data.relation}`,
                  rules: [{ required: true}, {message: '不能为空' }],
                })(
                  <Input type="text"/>
                )}
              </FormItem>
              <FormItem label="家长手机号">
                {getFieldDecorator('parentPhone', {
                  initialValue:`${data.parentPhone}`,
                  rules: [{ required: true}, {message: '不能为空' }],
                })(
                  <Input type="text"/>
                )}
              </FormItem>
              <FormItem label="上传照片">
              {getFieldDecorator('avatar', {
                  initialValue:''
                })(
                  <Upload>
                      <Button>选择文件</Button>
                  </Upload>
                )}
              </FormItem>
            </Form>
          </Modal>
        );
      }
    });
    const PictureCreateForm = Form.create()(
      class extends React.Component<any, any> {
        render(){
          const { visible, onCancel, onOk, avater } = this.props;
          // console.log('picVisible'+visible);
          return (
            <Modal
              visible={visible}
              title= "查看照片"
              okText="确定"
              onCancel={onCancel}
              onOk={onOk}
              className="picModel"
            >
              <Form layout="vertical">
                  <FormItem className="PicAvater">
                      
                  </FormItem>
              </Form>
            </Modal>
            )
        }
      }
    )
export default class extends React.Component<RouteComponentProps<any>, IState> {
  formRef : any = ''
  loading: boolean = false
  form: any = null
  hasSelected:boolean = true
  state: IState = {
    classes:[],
    selectedRowKeys: [],
    Student:[],
    total: 0,
    pageIndex: 1,
    pageSize: 8,
    visible: false,
    visibleEdit:false,
    visibleMiddle:false,
    visibleMove:false,
    visibleSettingMove:false,
    searchContent: '',
    title: '',
    okText: '',
    id:parseInt(this.props.match.params.id),
    addVisible:false,
    searchText:'',
    checkedKeys:[],
    modifyVisible:false,
    picVisible:false,
    formRefAddMember:'',
    formRefModifyMember:'',
    sid:null,
    avater:'',
    middleVisible:false
  }
  uploadProps = {
    action:'http://tc.taoke93.com/upload/form',
    onChange(info:any){
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  }
  onSelectChange=(selectedRowKeys: string[]) => {
    console.log(selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  handleMoveClick=()=>{
    this.setState({
      visibleMove:true
    })
  }

  moveStudents=(sids:number[])=>{
    let newCheck = parseInt(this.state.checkedKeys[0])
    try{
      gardenClasses.moveStudents(sids,newCheck).then(d=>{
        if(d.stat==='ok'){
          this.getData()
          message.success('移动成功')
        }else{
          throw d.stat
        }
      })
    }catch(error){
      Modal.error({
        title:'提示',
        content:error
      })
    }
  }

  handleChangeSearch=(e:any)=>{
    this.setState({
      searchText:e.target.value
    })
  }
  searchStudent=()=>{
    try{
      gardenClasses.serachStudents(this.state.id,this.state.searchText,0,0).then(d=>{
        if(d.stat==='ok'){
          this.setState({
            Student:d.students
          })
        }else{
          throw d.stat
        }
      })
    }catch(error){
      Modal.error({
        title:'提示',
        content:error
      })
    }
  }
  handleOk=()=>{
    this.setState({
      picVisible:false,
    })
  }
  picModel=(avater:any)=>{
    this.setState({
      picVisible:true,
      avater:avater
    })
  }
  handleMoveOk = () => {
    let newSid = this.state.selectedRowKeys.map(item=>{
      return parseInt(item)
    })
    this.moveStudents(newSid)
    this.handleMoveCancel()
  }
  // 设置按钮中的move响应事件
  handleSettingMoveClick = ()=>{
    this.setState({
      visibleSettingMove:true
    })
  }
  handleSettingMove = (i:any)=>{
    this.moveStudents([i.id])
    this.handleMoveCancel()
  }
  handleMoveCancel = () =>{
    this.setState({
      visibleMove:false,
      visibleSettingMove:false
    })
  }
  onCheck = (checkedKeys:any) =>{
    this.setState({
      checkedKeys:[checkedKeys.pop()]
    })
  }
  saveFormRefAddMember=(formRef:any)=>{
    this.setState({
      formRefAddMember:formRef
    })
  }

  saveFormRefModifyMember=(formRef:any)=>{
    this.setState({
      formRefModifyMember:formRef
    })
  }
  showModalAddMember = () =>{
   this.setState({
      addVisible:true,
      title:"添加成员",
      okText:"添加"
   })
  }
  onCancel=()=>{
    this.setState({
      addVisible:false,
      modifyVisible:false,
      picVisible:false, 
    })
  }
  onAddMemberOk=()=>{
    const form = this.state.formRefAddMember.props.form;
    form.validateFields((err:any, values:Object) => {
      if (err) {
        console.log(err)
        return;
      }
      console.log('Received values of form: ', values);
      this.addMember(this.state.id,values);
      this.setState({   addVisible:false  });
      form.resetFields();
    });
  }
  ondeleteMember=()=>{
    let keys = this.state.selectedRowKeys;
    console.log(typeof(keys[0]),keys) 
    let newkeys = keys.map((e)=>{
      return parseInt(e);
    })
    this.deleteMember(newkeys)
    this.setState({
      selectedRowKeys:[]
    })
  }

  listClass=()=>{
    try{
      gardenClasses.list(0,0).then(d=>{
        if(d.stat==='ok'){
          this.setState({
            classes:d.classes
          })
        }
      })
    }catch(error){
      Modal.error({
        title:'提示',
        content:error
      })
    }
  }

  deleteMember=(a:number[])=>{
    try{
      gardenClasses.deleteStudents(a).then(result=>{
            if(result.stat==='ok'){
            this.getData()
            message.success('删除成功')
            console.log(result)
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
  renderMoveModals(onOk:any,visible:boolean){
    return (
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={onOk}
        onCancel={this.handleMoveCancel}
      >
        <Tree
          checkable
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
        >
          <Tree.TreeNode title={'所有班级'} disabled>
            {this.renderTreeNodes(this.state.classes)}
          </Tree.TreeNode>
      </Tree>
      </Modal>
    )
  }
  renderTreeNodes=(classes:ClassShortInfo[])=>{
    return classes.map(item=>(
      <Tree.TreeNode title={item.name} key={item.id.toString()}></Tree.TreeNode>
    ))
  }
  // renderModals(){
  //   return (
  //     <CollectionCreateForm
  //       wrappedComponentRef={(form:any)=>this.formRef=form}
  //       visible={this.state.addVisible}
  //       onCancel={this.onAddMemberCancel}
  //       onOk={this.onAddMemberOk}
  //       />
  //     )
  //   }
  showModalModifyMember=(sid:number)=>{
    this.setState({
      title:"修改成员",
      okText:"修改",
      modifyVisible:true,
      sid:sid,
   })
  }
  onModifyMemberOk=()=>{
    const form = this.state.formRefModifyMember.props.form;
    form.validateFields((err:any, values:Object) => {
      if (err) {
        console.log('出错啦！！'+err+':'+values);
        return;
      }
      console.log('Received values of form: ', values);
      this.modifyStudent(this.state.sid,values);
      form.resetFields();
      this.setState({ modifyVisible: false });
    }); 
  }
  modifyStudent=(sid:number,a:any)=>{
    let { name,gender,age,avatar,parentName,relation,parentPhone} = a
    gender = parseInt(gender)
    age = parseInt(age)
    try{
      gardenClasses.modifyStudent(sid,name,gender,age,avatar,parentName,parentPhone,relation).then(result=>{
        if(result.stat==='ok'){
          this.getData()
          message.success('修改成功！')
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
  renderModals(visible:any,saveFormRef:any,onCancel:any,onOk:any,sid:any,name:any,gender:any,age:any,parentName:any,relation:any,parentPhone:any){
    const data={
      'sid':sid,
      'name':name,
      'gender':gender,
      'age':age,
      'parentName':parentName,
      'relation':relation,
      'parentPhone':parentPhone
    }
    return (
      <CollectionCreateForm
                wrappedComponentRef={saveFormRef}
                title={this.state.title}
                okText={this.state.okText}
                visible={visible}
                onCancel={onCancel}
                onOk={onOk}
                data={data}
      />
    )
  }
  renderPicModel(visible:boolean,onCancel:any,onOk:any,avater:string){
    // console.log('查看照片2')
    return (
        <PictureCreateForm
                visible={visible}
                avater={avater}
                onCancel={onCancel}
                onOk={onOk}
        />
    )
  }
  content(i:StudentInfo){
    // console.log(i)
    return (
    <div className="button-setting">
      <Button onClick={()=>this.showModalModifyMember(i.id)}>修改</Button>
      {this.renderModals(this.state.modifyVisible,this.saveFormRefModifyMember,this.onCancel,this.onModifyMemberOk,i.id,i.name,i.gender,i.age,i.parent.nickName,i.relation,i.parent.phone)}
      <Upload {...this.uploadProps}>
        <Button>上传照片</Button>
      </Upload>
      <Button onClick={this.handleSettingMoveClick}>移动</Button>
      {this.renderMoveModals(()=>this.handleSettingMove(i),this.state.visibleSettingMove)}
      <Button
        onClick={()=>this.deleteMember([i.id])}
        >删除</Button>
    </div>
  )}

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const maskClosable = true;
    const hasSelected = selectedRowKeys.length > 0; 
    return (
        <Layout className='garden-style' >
          <Header className='header'>
            <div className='button-list'>
              <Button
                  type="primary"
                  onClick={()=>this.props.history.goBack()}
              >返回班级列表</Button>
              <Button
                  type="primary"
                  onClick={this.showModalAddMember}
              >添加成员</Button>
              {this.renderModals(this.state.addVisible,this.saveFormRefAddMember,this.onCancel,this.onAddMemberOk,null,'','','','','','')}
              <Button
                  type="danger"
                  disabled={!hasSelected}
                  onClick={this.ondeleteMember}
              >删除成员</Button>
              <Button
                  type="primary"
                //   disabled={!hasSelected}
              >导出成员</Button>
              <Button
                  type="primary"
                  disabled={this.state.selectedRowKeys.length===0}
                  onClick={this.handleMoveClick}
              >移动成员</Button>
              {this.renderMoveModals(this.handleMoveOk,this.state.visibleMove)}
              <Input placeholder="请输入学生姓名" className="input-name" value={this.state.searchText} onChange={this.handleChangeSearch}/>
              <Button
                  type="primary"
                  disabled={this.state.searchText.trim()===''}
                  onClick={this.searchStudent}
              >搜索</Button>
            </div>
          </Header>
          <Content className='content'>
            <Table
              rowSelection={rowSelection}
              columns={this.columns}
              rowKey={(record) => { return record.id.toString() }}  //设置uniquekey
              dataSource={this.state.Student}
              pagination={{
                showTotal: total => <span>共{total}条</span>
              }}
            />
          </Content>
        </Layout>
    )
  }
  columns: ColumnProps<StudentInfo>[] = [{
    title: '编号',
    key: 'id',
    dataIndex:'id',
    align: 'center',
  }, {
    title: '姓名',
    dataIndex: 'name',
    align: 'center'
  }, {
    title: '性别',
    dataIndex: 'gender',
    align: 'center'
  }, {
    title: '年龄',
    dataIndex:'age',
    align: 'center',
  }, {
    title: '家长姓名',
    dataIndex:'parent.nickName',
    align: 'center'
  }, {
    title: '亲属关系',
    dataIndex:'relation',
    align: 'center',
  }, {
    title: '联系方式',
    dataIndex:'parent.phone',
    align: 'center',
  }, {
    title: '照片',
    dataIndex:'avatar',
    align: 'center',
    render:(text,record)=>(
      <Col>
      <a onClick={()=>this.picModel(record.avatar)}>查看照片</a>
      {this.renderPicModel(this.state.picVisible,this.onCancel,this.handleOk,this.state.avater)}
      </Col>
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
 
  getData(){
    let id = this.props.match.params.id
    console.log(id);
    id = parseInt(id);
    try{
      gardenClasses.listStudents(id,0,0).then(d=>{
        if(d.stat==='ok'){
          console.log(d)
          this.setState({
              Student:d.students
          })
          console.log(this.state.Student)
        }else{
          console.log(d)
          throw d.stat
        }
      })
    }catch(error){
      Modal.error({
        title:'提示',
        content:error
      })
    }
  }
  addMember(cid:any,a:any){
    let {name,gender,age,avatar,parentName,parentPhone,relation} = a
    try{
      gardenClasses.addStudent(parseInt(cid),name,parseInt(gender),parseInt(age),avatar,parentName,parentPhone,relation).then(result=>{
          if(result.stat==='ok'){
            this.setState((prevState:IState)=>{
              return {Student:[...prevState.Student,result.info]}
            })
            message.success('添加成功')
          }else{
            // console.log('添加失败！'+cid+''+name+''+gender+''+age+''+avatar+''+parentName+''+parentPhone+''+relation)
            throw result.stat
          }
        }
      )
    }catch(error){
      Modal.error({
        title:'提示',
        content:error
      })
    }
  }
  componentDidMount() {
   this.getData()
   this.listClass()
  }
}