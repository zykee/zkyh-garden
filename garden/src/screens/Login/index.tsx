import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Icon, Input, Button, Modal, message, Checkbox } from 'antd'
import * as antd from 'antd';
import './style.less'
import * as authService from '../../services/Auth'
import * as cookie from '../../common/Cookie'
import * as _ from '../../common/utils'

interface IState {
  account: string
  password: string
  checked: boolean
}

export default class extends React.Component<RouteComponentProps<any>, IState> {
  loading: boolean = false
  form: any = null
  state: IState = {
    account: '',
    password: '',
    checked: false
  }

  render() {
    return (<div>
      <antd.Form className="login-box">
        <Form.Item className="login-form-title">
          系统登录
         </Form.Item>
        <Form.Item>
          <Input
            prefix={<Icon type="user" />}
            placeholder="请输入账号"
            value={this.state.account}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              this.setState({
                account: event.target.value.trim()
              })
            }}
          />
        </Form.Item>
        <Form.Item>
          <Input
            type="password"
            prefix={<Icon type="lock" />}
            placeholder="请输入密码"
            value={this.state.password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              this.setState({
                password: event.target.value.trim()
              })
            }}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox checked={this.state.checked} onChange={this.onRememberChange}>记住密码</Checkbox>
          <Button type="primary" htmlType="submit" className="login-form-button" onClick={() => this.login()}>登录</Button>
        </Form.Item>
      </antd.Form>
    </div>
    )
  }

  get disabled(): boolean {
    return (
      this.loading === true ||
      this.state.password === '' ||
      this.state.account === ''
    )
  }

  onRememberChange = () => {
    this.setState({
      checked: !this.state.checked
    })
  }
  //登录
  async login() {

    if (!this.state.checked) {
      cookie.remove('_ID_MK');
    }
    
    if (this.loading === true) {
      return
    }

    this.loading = true
    let ret = await authService.login(this.state.account, this.state.password);
    if (ret.stat === 'ok') {
      cookie.put('_ID_MK', _.encodeJson(this.state), 365);
      this.props.history.push('/home')
      message.success('登录成功')
    } else {
      Modal.error({
        title: '提示',
        content: ret.message || ret.stat
      })
    }
    this.loading = false
  }

  encode(v:string){

  }

  componentDidMount() {

    var value = cookie.get('_ID_MK');
    if (value && value.trim()) {
      var info = _.decodeJson(value.trim());
      this.setState({
        account: info.account,
        password: info.password,
        checked: info.checked
      });
    }
  }
}
