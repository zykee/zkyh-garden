import * as React from 'react'
import { Layout,Button,Table,Input,Select,Row,Col,Modal,Collapse,message} from 'antd';
import './style.less'
import { array } from 'prop-types';
import * as gardenClasses from '../../services/Garden/Classapi'
import { UserInfo } from '../../interfaces/Model'
import { ColumnProps } from 'antd/lib/table'

interface IState{
    loading: boolean,
    visible: boolean,
    cid:number,
    teacherData:UserInfo[]
  }
  

export default class extends React.Component<any,IState>{
      state:IState={
        visible:true,
        loading:false,
        cid:null,
        teacherData:[]
        }
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
      handleDeleteTeacher = (tid:number)=>{
        try{
          gardenClasses.deleteTeacher(this.state.cid,tid).then(d=>{
            if(d.stat==='ok'){
              let index = this.state.teacherData.findIndex(e=>{
                return e.id===tid
              })
              this.setState((preState)=>{
                let newData = preState.teacherData.splice(index,1)
                return {teacherData:preState.teacherData}
              })
              message.success('删除成功')
              // this.getTeachers()
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
    
     
    render(){
        const { id } = this.props
        this.state.cid = id

        // console.log(this.state.cid);
        return (
          <Modal
          title="老师列表"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>确定</Button>,
            <Button key="cancel" onClick={this.handleCancel}>取消</Button>
          ]}
        >
        {/* table列出老师信息 */}
        <Table 
          columns={this.columns} 
          dataSource={this.state.teacherData} 
          rowKey={(record)=>{return record.id.toString()}}
          size="middle" />   
        </Modal>
        )
    }

    columns: ColumnProps<UserInfo>[] =[{
      title: '姓名',
      key: 'id',
      dataIndex: 'nickName',
    }, {
      title: '电话',
      dataIndex: 'phone',
    }, {
      title: '操作',
      render:(text,record)=>{
        console.log(record)
        return (
          <Col><a onClick={()=>this.handleDeleteTeacher(record.id)}>删除</a></Col>
        )
      }
    }];

    close(){
        this.setState({
            visible:false
        })
    }

  callback(key:any) {
    //   console.log(key);
    }

  async getTeachers(){
      // console.log(this.state.cid)
      try{
        const result = await gardenClasses.listTeachers(this.state.cid)
        // console.log(result)
        if(result.stat==='ok'){
          this.setState({
            teacherData:result.teachers
          })
          console.log(this.state.teacherData)
        }else{
          console.log(result)
          throw result.stat
        }
      }catch(error){
        Modal.error({
          title:'提示',
          content:error
        })
      }
    }
    componentDidMount() {
      this.getTeachers()
    }

    componentWillMount(){
     
       
    }
}

