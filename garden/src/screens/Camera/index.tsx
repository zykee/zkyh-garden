import * as React from 'react'
import { RouteComponentProps, Route, Redirect, Switch } from 'react-router'
import { Table, Button, Row, Popover, Col, Icon, Form, Input, Modal, Pagination, Rate, message, Layout, Tree, Select } from 'antd'
import * as antd from 'antd';
import store from '../../Store'
import './style.less'
import * as Cameraapi from '../../services/Garden/Cameraapi'
import * as Classapi from '../../services/Garden/Classapi'
import * as Areaapi from '../../services/Garden/Areaapi'
import * as authService from '../../services/Auth'
import * as GardenApi from '../../services/Garden/GardenApi'
import { CameraInfo, MonitorAreaInfo, GardenRichInfo, UserInfo } from '../../interfaces/Model'
import { ColumnProps } from 'antd/lib/table'
import { AntTreeNode } from 'antd/lib/tree'
import { FormComponentProps } from 'antd/lib/form'
import * as cookie from '../../common/Cookie'
import { TreeNode } from 'antd/lib/tree-select';

const { Header, Footer, Sider, Content } = Layout;
const Option = Select.Option;
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const CameraCreateForm = Form.create()(
    class extends React.Component<any, any> {
        render() {
            const { visible, onCancel, onOk, form, camera } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="添加摄像头"
                    okText='添加'
                    onCancel={onCancel}
                    onOk={onOk}
                >
                    <Form layout="vertical">
                        <FormItem label="设备号">
                            {getFieldDecorator('deviceId', {
                                initialValue: `${camera.deviceId ? camera.deviceId : ''}`,
                                rules: [{ required: true }, { message: '不能为空' }],
                            })(
                                <Input type="text" />
                            )}
                        </FormItem>
                        <FormItem label="设备名称">
                            {getFieldDecorator('name', {
                                initialValue: `${camera.name}`,
                                rules: [{ required: true }, { message: '不能为空' }]
                            })(
                                <Input type="text" />
                            )}
                        </FormItem>
                        <FormItem label="取流url">
                            {getFieldDecorator('location', {
                                initialValue: `${camera.location}`,
                                rules: [{ required: true }, { message: '不能为空!' }],
                            })(
                                <Input type="text" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);
const AreaCreateForm = Form.create()(
    class extends React.Component<any, any> {
        render() {
            const { visible, onCancel, onOk, form, gardenName, classes } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="添加区域"
                    okText='添加'
                    onCancel={onCancel}
                    onOk={onOk}
                >
                    <Form layout="vertical">
                        <FormItem label="所属幼儿园">
                            <p>{gardenName}</p>
                        </FormItem>
                        <FormItem label="关联班级">
                            {getFieldDecorator('cid', {
                                rules: [{ required: true }, { message: '不能为空' }],
                                initialValue : "0"
                            })(
                                <Select style={{ width: 120 }}>
                                    <Option value="0" key="0">公共区域</Option>
                                    {
                                        classes.map((d:any)=>{
                                            return (<Option key={d.id}>{d.name}</Option>)
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="区域名称">
                            {getFieldDecorator('name', {
                                rules: [{ required: true }, { message: '不能为空' }]
                            })(
                                <Input type="text" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);


interface CState {
    checkedKeys: string[]
    expandedKeys: string[]
    autoExpandParent: boolean
    camerasInfo: CameraInfo[]
    areasInfo: MonitorAreaInfo[]
    selectedKeys: string[]
    selectedRowKeys: string[]
    addAreaAble: boolean
    user: UserInfo
    gardensInfo: GardenRichInfo[]
    data: any
    addCameraVisible: boolean
    areaVisible: boolean
    updateCameraVisible: boolean
    areaFormormRef: any
    addCameraFormormRef: any
    updateCameraFormormRef: any
    updateCameraId: number
    selectedNode: any
    classes: any
    gardenName: string
}

export default class extends React.Component<RouteComponentProps<any>, CState> {
    state: CState = {
        checkedKeys: [],
        expandedKeys: [],
        autoExpandParent: true,
        camerasInfo: [],
        areasInfo: [],
        selectedKeys: [],
        selectedRowKeys: [],
        addAreaAble: true,
        user: null,
        gardensInfo: null,
        data: [],
        addCameraVisible: false,
        areaVisible: false,
        updateCameraVisible: false,
        areaFormormRef: null,
        addCameraFormormRef: null,
        updateCameraFormormRef: null,
        updateCameraId:null,
        selectedNode:null,
        classes:[],
        gardenName:'所有摄像头'
    }
    onExpand = (expandedKeys: any[]) => {
        console.log('onExpand', expandedKeys);
        if (expandedKeys.length > 2) {
            expandedKeys.splice(1, 1);
        }
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });

    }

    onCheck = (checkedKeys: any) => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys: checkedKeys.checked });
    }
    onSelect = (selectedKeys: any[], e: any) => {
        console.log(selectedKeys)
        console.log(e.selectedNodes)
        if (selectedKeys.length > 0) {
            if (selectedKeys[0] === '0') {
                this.state.user.role==='admin'?this.listAdminCamera():this.listMasterCamera()
            } else {
                if (e.selectedNodes[0].props.isLeaf) {
                    this.setState({
                        addAreaAble: true
                    })
                    this.listByArea(this.getRealId(selectedKeys[0]))
                } else {
                    this.listClassesByGarden(this.getRealId(selectedKeys[0]))
                    Cameraapi.listByGarden(this.getRealId(selectedKeys[0]), 0, 0).then(d => {
                        if (d.stat === 'ok') {
                            this.setState({
                                camerasInfo: d.cameras
                            })
                        }
                    })
                    this.setState({
                        addAreaAble: false,
                        gardenName:e.selectedNodes[0].props.title
                    })
                }
            }
        }
        this.setState({ selectedKeys });
    }
    onLoadData = (node: AntTreeNode) => {
        return new Promise((resolve) => {
            console.log(node)
            setTimeout(() => {
                Areaapi.listByGarden(this.getRealId(node.props.eventKey), 0, 0).then(d => {
                    if (d.stat === 'ok') {
                        if (d.areas.length === 0) {
                            message.info('该园为空')
                        }
                        this.setState({
                            areasInfo: d.areas
                        })
                        this.insertChildren(this.getRealId(node.props.eventKey), d.areas)
                    }
                })
                resolve()
            }, 1000)
        });
    }
    setdata = (a: any[]) => {
        let tree: any = []
        a.forEach(d => {
            let e = { id: d.id, name: d.name }
            tree.push(e)
        })
        this.setState({
            data: tree
        })
    }
    insertChildren(key: number, areas: any) {
        this.setState(preState => {
            preState.data.forEach((e: any) => {
                if (e.id === key) {
                    e.children = areas
                }
            })
            return { data: preState.data }
        })
    }
    getRealId = (key: string) => {
        if (key === '0') return parseInt(key)
        key = key.split('-').pop()
        return parseInt(key)
    }
    handleUpdateCameraClick = (id:number) => {
        this.setState({
            updateCameraVisible: true,
            updateCameraId:id
        })
    }
    handleAddCameraClick = () => {
        this.setState({
            addCameraVisible: true
        })
    }
    handleDeleteCamerasClick = () => {
        let ids:number[] = []
        this.state.selectedRowKeys.forEach(d=>{
            ids.push(parseInt(d))
        })
        this.deleteCameras(ids)
    }
    handleAddAreaClick = () => {
        this.setState({
            areaVisible: true
        })
    }
    handleDeleteAreaClick = () => {
        let ids:number[] = []
        this.state.checkedKeys.forEach(d=>{
            ids.push(this.getRealId(d))
        })
        this.deleteAreas(ids)
    }
    handleCancel = () => {
        this.setState({
            areaVisible: false,
            addCameraVisible: false,
            updateCameraVisible: false
        })
    }
    handleAddCameraOk = () => {
        const form = this.state.addCameraFormormRef.props.form;
        form.validateFields((err: any, values: Object) => {
            if (err) {
                console.log('添加摄像头出错啦！');
                return;
            }
            console.log('Received values of form: ', values);
            this.addCamera(this.getRealId(this.state.checkedKeys[0]),values);
            form.resetFields();
            this.setState({ addCameraVisible: false });
        });
    }
    handleUpdateCameraOk = () => {
        const form = this.state.updateCameraFormormRef.props.form;
        form.validateFields((err: any, values: Object) => {
            if (err) {
                console.log('修改摄像头出错啦！');
                return;
            }
            console.log('Received values of form: ', values);
            this.updateCamera(this.state.updateCameraId,values);
            form.resetFields();
            this.setState({ updateCameraVisible: false });
        });
    }
    handleAddAreaOk = () => {
        const form = this.state.areaFormormRef.props.form;
        form.validateFields((err: any, values: Object) => {
            if (err) {
                console.log('添加区域出错啦！');
                return;
            }
            console.log('Received values of form: ', values);
            this.addArea(values);
            form.resetFields();
            this.setState({ areaVisible: false });
        });
    }
    formRefAddAera = (formRef: any) => {
        this.setState({
            areaFormormRef: formRef
        })
    }
    formRefAddCamera = (formRef: any) => {
        this.setState({
            addCameraFormormRef: formRef
        })
    }
    formRefUpdateCamera = (formRef: any) => {
        this.setState({
            updateCameraFormormRef: formRef
        })
    }
    // table
    onSelectChange = (selectedRowKeys: any) => {
        console.log(selectedRowKeys);
        this.setState({ selectedRowKeys: selectedRowKeys });
    }
    columns: ColumnProps<CameraInfo>[] = [
        {
            title: '设备号',
            dataIndex: 'deviceId',
        }, {
            title: '设备名称',
            dataIndex: 'name',
        }, {
            title: '监控区域',
            dataIndex: 'areaName',
        }, {
            title: '状态',
            render: (text, record) => (
                <Col>{record.status ? '开启' : '维修中'}</Col>
            )
        }, {
            title: '设置',
            render: (text, record) => (
                <Col>
                    <Popover placement="left" content={this.content(record)}>
                        <Icon type="setting" />
                    </Popover>
                </Col>
            )
        }
    ];
    content = (r: CameraInfo) => {
        return (
            <div className="button-lists">
                <Button onClick={() => this.enableCamera(r.id,r.status)}>
                    修改状态
                </Button>
                <Button onClick={() => this.handleUpdateCameraClick(r.id)}>
                    修改摄像头
                </Button>
                {this.renderCameraModal(this.formRefUpdateCamera, this.state.updateCameraVisible, this.handleUpdateCameraOk, r.deviceId, r.name, r.location)}
                <Button onClick={() => this.deleteCameras([r.id])}>
                    删除
                </Button>
            </div>
        )
    }

    render() {
        let { areasInfo, selectedRowKeys, gardensInfo, user } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <Layout className='camera-style'>
                <Sider className="sider-tree">
                    <Button
                        type="primary"
                        onClick={this.handleAddAreaClick}
                        disabled={this.state.user && this.state.user.role === 'admin' && this.state.addAreaAble}
                    >
                        添加区域
                    </Button>
                    <Button
                        type="danger"
                        onClick={this.handleDeleteAreaClick}
                        disabled={this.state.checkedKeys.length <= 0}
                    >
                        删除区域
                    </Button>
                    <Tree
                        checkable
                        checkStrictly={true}
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        selectedKeys={this.state.selectedKeys}
                        loadData={this.onLoadData}
                    >
                        <TreeNode title='所有区域' key='0' disableCheckbox>
                            {this.treeRender(this.state.data)}
                        </TreeNode>
                    </Tree>
                    {this.renderAreaModal()}
                </Sider>
                <Content>
                    <Button
                        type="primary"
                        onClick={this.handleAddCameraClick}
                        disabled={this.state.checkedKeys.length !== 1}
                    >
                        添加摄像头
                    </Button>
                    <Button
                        type="danger"
                        onClick={this.handleDeleteCamerasClick}
                        disabled={this.state.selectedRowKeys.length <= 0}
                    >
                        删除摄像头
                    </Button>
                    <Table
                        rowSelection={rowSelection}
                        columns={this.columns}
                        rowKey={(record) => { return record.id.toString() }}  //设置uniquekey
                        dataSource={this.state.camerasInfo}
                        pagination={{
                            showTotal: total => <span>共{total}条</span>
                        }}
                    />
                    {this.renderCameraModal(this.formRefAddCamera, this.state.addCameraVisible, this.handleAddCameraOk, null, '', '')}
                </Content>
            </Layout>
        )
    }

    treeRender(data: any[], head: string = '0-0'): any {
        return data.map((item) => {
            if (item.children) {
                return <TreeNode title={item.name} key={head + '-' + item.id.toString()} disableCheckbox>
                    {this.treeRender(item.children, head + '-' + head)}
                </TreeNode>
            }
            if (item.cameras || this.state.user.role != 'admin') {
                return <TreeNode title={item.name} key={head + '-' + item.id.toString()} isLeaf={true}></TreeNode>
            }
            return <TreeNode title={item.name} key={head + '-' + item.id.toString()} disableCheckbox></TreeNode>
        })
    }

    renderCameraModal = ( formRef: any, visible: boolean, okFunc: any, cameraDeviceId: number, cameraName: string, cameraLocation: string) => {
        let camera = {
            'deviceId': cameraDeviceId,
            'name': cameraName,
            'location': cameraLocation
        }
        return (
            <CameraCreateForm
                wrappedComponentRef={formRef}
                visible={visible}
                onCancel={this.handleCancel}
                onOk={okFunc}
                camera={camera}
            ></CameraCreateForm>
        )
    }

    renderAreaModal = () => {
        return (
            <AreaCreateForm
                wrappedComponentRef={this.formRefAddAera}
                visible={this.state.areaVisible}
                onCancel={this.handleCancel}
                onOk={this.handleAddAreaOk}
                gardenName={this.state.gardenName}
                classes={this.state.classes}
            ></AreaCreateForm>
        )
    }

    addCamera = (maId:number,values:any)=>{
        let { deviceId,location,name } = values
        try{
            Cameraapi.add(maId,deviceId,name,location).then(d=>{
                if(d.stat === 'ok'){
                    message.success('添加成功')
                    this.listByArea(maId)
                }else{
                    throw d.stat
                }
            })
        }catch(error){
            Modal.error({
                title: '提示',
                content: error
            })
        }
    }

    updateCamera = (cId:number,values:any) =>{
        let { deviceId,location,name } = values
        try{
            Cameraapi.modify(cId,deviceId,name,location).then(d=>{
                if(d.stat === 'ok'){
                    message.success('修改成功')
                    let index = this.state.camerasInfo.findIndex((e:any)=>{
                        return e.id === cId
                    })
                    this.setState(preState=>{
                        preState.camerasInfo[index] = d.info
                        return {camerasInfo:preState.camerasInfo}
                    })
                }else{
                    throw d.stat
                }
            })
        }catch(error){
            Modal.error({
                title: '提示',
                content: error
            })
        }
    }

    addArea = (values:any) =>{
        if(this.state.user.role==='admin'){
            Areaapi.addToGarden(this.getRealId(this.state.selectedKeys[0]),values.name,parseInt(values.cid)).then(d=>{
                if(d.stat === 'ok'){
                    message.success('添加区域成功')
                    this.setState(preState=>{
                        preState.data.forEach((e:any)=>{
                            if(e.id===this.getRealId(this.state.selectedKeys[0])){
                                if(!e.children){
                                    e.children = []
                                }
                                e.children.push(d.info)
                            }
                        })
                        return {data:preState.data}
                    })
                }
            })
        }else{
            Areaapi.add(values.name,parseInt(values.cid)).then(d=>{
                if(d.stat==='ok'){
                    message.success('添加区域成功')
                    this.setState(preState=>{
                        let node = { id: d.info.id, name: d.info.name }
                        preState.data.push(node)
                        return {data:preState.data}
                    })
                }
            })
        }
        
    }

    deleteAreas = (ids:number[]) => {
        try{
            Areaapi.deleteArea(ids).then(d=>{
                if(d.stat === 'ok'){
                    message.success('删除成功')
                    this.setState(preState=>{                        
                        if(this.state.user.role === 'admin'){
                            ids.forEach(id=>{
                                for(let i = 0;i<preState.data.length;i++){
                                    if(preState.data[i].children){
                                        let index = preState.data[i].children.findIndex((e:any)=>{
                                            return e.id === id
                                        })
                                        if(index>=0){
                                            preState.data[i].children.splice(index,1)
                                            break
                                        }
                                    }
                                }
                            })
                        }else{
                            ids.forEach(id=>{
                                let index = preState.data.findIndex((e:any)=>{
                                    return e.id === id
                                })
                                preState.data.splice(index,1)
                            })
                        }
                        return { 
                            camerasInfo: preState.data,
                            checkedKeys: []
                        }
                    })
                }else{
                    throw d.stat
                }
            })
        }catch(error){
            Modal.error({
                title: '提示',
                content: error
            })
        }
    }

    deleteCameras = (ids:number[]) => {
        try{
            Cameraapi.deleteCamera(ids).then(d=>{
                if(d.stat === 'ok'){
                    message.success('删除成功')
                    this.setState(preState=>{
                        ids.forEach(id=>{
                            let index = preState.camerasInfo.findIndex((e:any)=>{
                                return e.id === id
                            })
                            preState.camerasInfo.splice(index,1)
                        })
                        return { 
                            camerasInfo: preState.camerasInfo,
                            selectedRowKeys: []
                        }
                    })
                }else{
                    throw d.stat
                }
            })
        }catch(error){
            Modal.error({
                title: '提示',
                content: error
            })
        }
    }

    enableCamera = (id:number,status:number) => {
        try{
            Cameraapi.enable(id,status?false:true).then(d=>{
                if(d.stat === 'ok'){
                    message.success('修改状态成功')
                    let index = this.state.camerasInfo.findIndex((e:any)=>{
                        return e.id === id
                    })
                    this.setState(preState=>{
                        preState.camerasInfo[index].status = status?0:1
                        return {camerasInfo:preState.camerasInfo}
                    })
                }else{
                    throw d.stat
                }
            })
        }catch(error){
            Modal.error({
                title: '提示',
                content: error
            })
        }
    }

    listAdminCamera = () => {
        try {
            Cameraapi.listAll(0, 0).then(d => {
                if (d.stat === 'ok') {
                    this.setState({
                        camerasInfo: d.cameras
                    })
                } else {
                    throw d.stat
                }
            })
        } catch (error) {
            Modal.error({
                title: '提示',
                content: error
            })
        }
    }

    listGarden = () => {
        try {
            GardenApi.list(0, 0).then(d => {
                if (d.stat === 'ok') {
                    message.success('garden加载成功')
                    this.setState({
                        gardensInfo: d.gardens
                    })
                    this.setdata(d.gardens)
                    console.log(this.state.gardensInfo)
                } else {
                    throw d.stat
                }
            })
        } catch (error) {
            Modal.error({
                title: '提示',
                content: error
            })
        }
    }

    listMasterCamera = () => {
        try {
            Cameraapi.list(0, 0).then(d => {
                console.log(d)
                if (d.stat === 'ok') {
                    this.setState({
                        camerasInfo: d.cameras
                    })
                } else {
                    throw d.stat
                }
            })
        } catch (error) {
            Modal.error({
                title: '提示',
                content: error
            })
        }
    }

    listMasterArea = () => {
        try {
            Areaapi.list(0, 0).then(d => {
                console.log(d)
                if (d.stat === 'ok') {
                    this.setState({
                        areasInfo: d.areas
                    })
                    this.setdata(d.areas)
                } else {
                    throw d.stat
                }
            })
        } catch (error) {
            Modal.error({
                title: '提示',
                content: error
            })
        }
    }

    listByArea = (maid:number) => {
        Cameraapi.listByArea(maid, 0, 0).then(d => {
            if (d.stat === 'ok') {
                this.setState({
                    camerasInfo: d.cameras
                })
            }
        })
    }

    listClassesByGarden = (gid:number) =>{
        Classapi.listByGarden(gid,0,0).then(d=>{
            if(d.stat === 'ok'){
                this.setState({
                    classes:d.classes
                })
            }
        })
    }

    listClasses = () =>{
        Classapi.list(0,0).then(d=>{
            if(d.stat === 'ok'){
                this.setState({
                    classes:d.classes
                })
            }
        })
    }

    componentWillMount() {
        authService.check().then(d => {
            if (d.stat !== 'ok') {
                this.props.history.push('/login');
            } else {
                this.setState({
                    user: d.info
                })
                console.log(d.info)
                if (d.info.role === 'admin') {
                    this.listAdminCamera()
                    this.listGarden()
                } else {
                    this.listMasterArea()
                    this.listMasterCamera()
                    this.listClasses()
                }
            }
        });
    }
}