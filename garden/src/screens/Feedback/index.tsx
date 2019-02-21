import * as React from 'react'
import { RouteComponentProps, Route, Redirect, Switch } from 'react-router'
import { Table, Button, Row,Menu,Dropdown, Col, Icon, Form, Modal, Pagination, Rate, message, Layout } from 'antd'
import * as antd from 'antd';
import './style.less'
import * as feedback from '../../services/Feedback/FeedbackApi'
import { FeedbackInfo } from '../../interfaces/Model'
import { ColumnProps } from 'antd/lib/table'
import { FormComponentProps } from 'antd/lib/form'
import * as cookie from '../../common/Cookie'
import store from '../../Store'

interface IState {
  selectedRowKeys: string[]
  feedbacks: FeedbackInfo[] 
  total: number
  name:string
  title: string
  pageIndex: number
  pageSize: number
  visible: boolean
  okText: string
  id: number
  currentFeedbackInfo:any
  visibleDetail:boolean
}

const { Header, Content } = Layout;
const FormItem = Form.Item

export default class extends React.Component<RouteComponentProps<any>, IState> {
  loading: boolean = false
  form: any = null
  hasSelected: boolean = true

  state: IState = {
    selectedRowKeys: [],
    feedbacks: [],
    total: 0,
    pageIndex: 1,
    pageSize: 8,
    visible: false,
    title: '',
    okText: '',
    id: null,
    name:'',
    currentFeedbackInfo:null,
    visibleDetail:false
  }
  onSelectChange = (selectedRowKeys: string[]) => {
    console.log(selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  content(i: FeedbackInfo) {
    return (
      <div className="button-feedback">
          <Button onClick={()=>this.onMenuDetailClicked(i)}>
              查看信息
          </Button>
          <Button onClick={()=>this.onMenuClicked(i)}>
              删除
          </Button>
    </div>
    )
  }
  renderModals=(record:FeedbackInfo)=>(
    <Modal
      title={`${record.author.nickName}详情`}
      visible={this.state.visibleDetail}
      onOk={this.onFeedbackInfoModelCancel}
      onCancel={this.onFeedbackInfoModelCancel}
    >        
      <p>{record.author.nickName}</p>
      <p>{record.ctime}</p>
      <p>{record.content}</p>
    </Modal>
  )

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Layout className='feedback-style' >
        <Header className='header'>
        <div className="headerName"><h2>意见反馈列表</h2></div>
        </Header>
        <Content>
          <Table
            rowSelection={rowSelection}
            columns={this.columns}
            rowKey={(i) => { return i.id.toString() }}  //设置uniquekey
            dataSource={this.state.feedbacks}
            pagination={false}
          />
          <Pagination
            style={{ marginTop: 30 }}
            showTotal={total => `共 ${total} 条 `}
            onChange={this.onPageChange}
            total={this.state.total}
          />
          {this.state.currentFeedbackInfo?this.renderModals(this.state.currentFeedbackInfo):null}
        </Content>
        
      </Layout>
    )
  }
  // get modelFeedbackInfoTitle(){
  //   return this.state.currentFeedbackInfo ? this.state.currentFeedbackInfo.author.nickName + "的详情" : 'Info'
  // }
  // onFeedbackInfoModelOK = ()=>{
  //   this.setState({
  //     showFeedbackInfoModel:false
  //   })
  // }

  onFeedbackInfoModelCancel = ()=>{
    console.log(1111)
    this.setState({
      currentFeedbackInfo:null,
      visibleDetail:false
    })
  }
  onMenuDetailClicked=(i:FeedbackInfo)=>{
    this.setState({
      currentFeedbackInfo:i,
      visibleDetail:true
    })
  }
  columns: ColumnProps<FeedbackInfo>[] = [{
    title: '编号',
    key: 'id',
    dataIndex: 'id',
    align: 'center',
  }, {
    title: '用户名称',
    dataIndex: 'name',
    align: 'center',
    render:(text,record)=>(
      <Col>{record.author.nickName}</Col>
    )
  }, {
    title: '联系电话',
    align: 'center',
    render: (text, record) => (
      <Col>{record.author.phone}</Col>
    )
  }, {
    title: '反馈时间',
    align: 'center',
    render: (text, record) => (
      <Col>{record.ctime}</Col>
    )
  }, {
    title: '反馈内容',
    align: 'center',
    render: (text, record) => (
      <Col >{record.content}</Col>
    )
  }, {
    title: '操作',
    align: 'center',
    render: (text:string, record:FeedbackInfo) => {   
      return (
        <Dropdown overlay={this.content(record)}>
          <Icon style={{ fontSize: 20 }} type="setting" />
        </Dropdown>
      )
    }
  }]

  async getData() {
    this.loadData()
      
    try {
      feedback.list(0, 0).then(result=>{
        if (result.stat === 'ok') {
          console.log(result)
          this.setState({
            feedbacks: result.feedbacks
          })
        } else {
          console.log(result)
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

  async onMenuDeleteClicked(a: number[]) {
    try {
      let result = await feedback.deleteFeedback(a)
      if (result.stat === 'ok') {
        this.getData()
        console.log(result)
      } else {
        throw result.stat
      }
    } catch (error) {
      Modal.error({
        title: '提示',
        content: error
      })
    }
  }
  onMenuClicked=(record:FeedbackInfo)=>{
    Modal.confirm({
      title: '警告',
      content: '确定删除' + record.author.nickName + "这条反馈吗？",
      okText: '确认',
      cancelText: '取消',
      onOk:()=>{
        setTimeout(()=>{
          this.onMenuDeleteClicked([record.id])
          message.info("已经删除")
        }, 1000)
      }
    });
  }
  onPageChange=(page:number)=>{
    this.setState({
      pageIndex:page
    }, ()=>{
      this.loadData();
    })
  }
  loadData(){
    try{
      feedback.list(this.state.pageIndex, 10).then(d=>{
        if(d.stat == 'ok'){
          this.setState({
            feedbacks:d.feedbacks,
            total:d.total
          })
          message.info("success");
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
  componentWillMount(){
    this.getData()
  }
}