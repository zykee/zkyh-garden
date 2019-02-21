import * as React from 'react'
import { Layout,Button,Table,Input,Select,Row,Col,Modal,Collapse,message} from 'antd';
import { ColumnProps } from 'antd/lib/table'
import './style.less'

let state= {
    loading: false,
    visible: false,
  }

export default class extends React.Component{
      state={
        visible:true

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
     
    render(){
        return (
          <Modal
          className="cancel"
          title="撤销公告"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button className="onsure" key="back" onClick={this.handleCancel}>确定</Button>,
            <Button className="oncancel" key="cancel" onClick={this.handleCancel}>取消</Button>
            
          ]}
        >
        {/* 此处以后用角色名称来匹配，数组显示 */}
        <p>确定撤销 text 吗？</p>

        
        </Modal>
        )
    }

    close(){
        this.setState({
            visible:false
        })
    }

    callback(key:any) {
 
    }

    

    componentWillMount(){
    
    }
}