## 开发说明

- example是一个示例工程，演示了一个常规的增删改查功能模块的开发，供研究学习
- 使用VS Code打开example目录进行开发
- 源代码位于src目录
- 前后端完全分离，服务端只提供HTTP API，前端通过Ajax与服务端进行通信
- 工程自带了一个模拟数据的API服务端，在example目录执行如下命令启动
  ```
  npm run api
  ```
- 启动前端的HTTP调试服务，在example目录执行如下命令
  ```
  npm run serve
  ```
  启动成功之后，打开浏览器，访问http://127.0.0.1:4001/
- 启动开发构建，在example目录执行如下命令
  ```
  npm start
  ```
  启动之后，会监控本地代码的变化，自动构建
- 构建生产环境版本，，在example目录执行如下命令
  ```
  npm run prod
  ```
  构建之后的文件位于dist目录
- server.conf用于配置前端的HTTP调试服务，配置格式与nginx类似