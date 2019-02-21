import './assets/less/public.less'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppComponent from './screens/App'

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }
}

ReactDOM.render(<AppComponent />, document.getElementById('app'))