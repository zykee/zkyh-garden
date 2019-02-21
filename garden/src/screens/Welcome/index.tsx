import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Icon, Input, Button, Modal, message, Checkbox, Layout } from 'antd'
import * as antd from 'antd';
import './style.less'
import * as authService from '../../services/Auth'
import * as cookie from '../../common/Cookie'

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
    return (
        <Layout>welcome</Layout>
    )
  }
}
