import * as React from 'react'
import { Route, HashRouter as Router, Switch, Redirect } from 'react-router-dom'
import { LocaleProvider } from 'antd'
// 类似于 react-redux  提供者 将 store 提供给app的子组件
import zhCN from 'antd/lib/locale-provider/zh_CN'

import LoginScreen from '../Login'
import HomeScreen from '../Home'

export default class extends React.Component {
  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <Router>
          <Switch>
            <Redirect from="/" exact to="/login" />
            <Redirect from="/home" exact to="/home/garden" />
            <Route path="/login" component={LoginScreen} />
            <Route path="/home" component={HomeScreen} />
          </Switch>
        </Router>
      </LocaleProvider>
    )
  }
}
