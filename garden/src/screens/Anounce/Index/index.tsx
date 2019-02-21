import React from 'react'
import { Button, Col, Table ,Modal ,message ,Tooltip } from 'antd'
import './style.less'
import { RouteComponentProps } from 'react-router'
import * as AnounceApi from '../../../services/Anouce/AnouseApi'
import { AnouceInfo } from '../../../interfaces/Model'
import * as utils from '../../../common/utils'
import { ColumnProps } from 'antd/lib/table'

interface State{
  visible: boolean
  pageindex:number
  pagesize:number
  total:number
  anounceInfo:AnouceInfo[]
}

export default class extends React.Component<RouteComponentProps<any>>{
  state:State = {
      visible: true,
      pageindex:1,
      pagesize:10,
      total:0,
      anounceInfo:[]
  }

  onSend=()=>{
    this.props.history.push(`/home/anounce/send`)
  }

  render(){
    // let ctime = utils.formatDateTime(dat);
    const columns:ColumnProps<AnouceInfo>[] = [
      {
        title: '编号',
        dataIndex: 'id',
        render: (text:any) => <a href="javascript:;" style={{color:"#000"}}>{text}</a>,
      }, 
      {
        title: '公告标题',
        dataIndex: 'title',
      }, 
      {
        title: '公告内容',
        dataIndex: 'content',
        render:(text,record)=>(
          <Col><Tooltip title={record.content} >{
            record.content
          }</Tooltip></Col> 
        )
      },
      {
        title: '发布时间',
        dataIndex: 'date',
        render:(text,record)=>{
          return (<Col>{utils.formatDateTime(record.ctime)}</Col>)
        }
      },
      {
        title: '操作',
        dataIndex: 'tags',
        render: (text:any, record:any) => (
          <span>
            <a onClick={()=>this.viewPrivilege(record.id)}>撤销</a>
          </span>
        ),
      }
    ];
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys:any, selectedRows:any) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record:any) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <div className='anounce-item'>
        <Button type="primary" 
        className="anounce-button" 
        size="large" 
        onClick={() => this.onSend()}
        >发布公告</Button>  
          
        <Table  className="anounce-table" 
          rowSelection={rowSelection}
          rowKey = {(record) => { return record.id.toString() }}
          columns={columns} 
          dataSource={this.state.anounceInfo} 
          bordered   
          pagination={{
              showTotal: total => <span>共{total}条</span>
          }} 
        />
    </div>
    )
  }

  listAnouce(pi:number=0,ps:number=0){
    try{
      AnounceApi.list(pi,ps).then(d=>{
        if(d.stat==='ok'){
          this.setState({
            anounceInfo:d.anouces
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

  viewPrivilege(i:number) {
    try{
      AnounceApi.delteAnouce([i]).then(d=>{
        if(d.stat==='ok'){
          message.success('撤销成功')
          let index = this.state.anounceInfo.findIndex(e=>{
            return i === e.id
          })
          this.setState((preState:State)=>{
            preState.anounceInfo.splice(index,1)
            return {anounceInfo:preState.anounceInfo}
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
  componentWillMount(){
    this.listAnouce()
  }
}

