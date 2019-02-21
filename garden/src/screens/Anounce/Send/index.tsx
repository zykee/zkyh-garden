import React from 'react'
import { Button, Form ,Input ,Modal ,message ,Tooltip } from 'antd'
import './style.less'
import { RouteComponentProps } from 'react-router'
import * as AnounceApi from '../../../services/Anouce/AnouseApi'
import { AnouceInfo } from '../../../interfaces/Model'
import * as utils from '../../../common/utils'
import { ColumnProps } from 'antd/lib/table'

interface State{
    visible:boolean
}
const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
    class extends React.Component<any, any> {
        render() {
            const { form,addAnounce } = this.props;
            const { getFieldDecorator } = form;
            const { TextArea } = Input;
            return (
                <Form className="send-form">
                        <FormItem label="公告标题">
                            <div className="title"> 
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: '请输入公告标题' }],
                                })(
                                    <Input size="large"  style={{ width: "1250px" }}/> 
                                )}
                             </div>
                        </FormItem>
                        <FormItem label="公告内容">
                            <div className="content">
                                {getFieldDecorator('content',{
                                    rules:[{required: true, message:'请输入公告内容'}]
                                })(
                                    <TextArea rows={20} className="anounce-send" style={{ width: '1250px' }}/>
                                )}
                            </div>
                        </FormItem>
                        <FormItem>
                            <Button onClick={addAnounce} type="primary" htmlType="submit" className="send-button" style={{ marginBottom: 16 }}>发送</Button>
                        </FormItem>
                </Form>
            )
        }
    }
)
export default class extends React.Component<RouteComponentProps<any>>{
    state = {
        visible: true,
    }
    formRef : any = ''
    addAnounce = (v:any)=>{
        let {title,content} = v
        try{
            AnounceApi.add(title,content).then(d=>{
              if(d.stat==='ok'){
                message.success('撤销成功')
                this.props.history.goBack()
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
    handleAddAnouncce = () => {
        const form = this.formRef.props.form;
        form.validateFields((err:any, values:Object) => {
          if (err) {
            console.log(err)
            return;
          }
          console.log('Received values of form: ', values);
          this.addAnounce(values)
          this.setState({ visible: false });
          form.resetFields();
        });
      }
    render(){    
        return (
              <div className='anounce-form'>
                    <Button type="primary" 
                        className="return-button" 
                        size="large" 
                        style={{ marginBottom: 16 }}
                        onClick={()=>this.props.history.goBack()}
                        >返回公告列表</Button>
                    <CollectionCreateForm
                        wrappedComponentRef={(form:any)=>this.formRef=form}
                        addAnounce = {this.handleAddAnouncce}
                        visible={this.state.visible}
                    />
              </div>
             
        )
    }
}