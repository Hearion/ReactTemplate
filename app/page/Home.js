import React, {useState, useEffect} from "react";
import {Link, withRouter} from "react-router-dom";
import {Layout, Menu, Spin, Modal, Form, Input, Button} from "antd";
import {LogoutOutlined, KeyOutlined, UserOutlined, LockOutlined} from "@ant-design/icons";
import IndexRouter from "../routers/IndexRouter";
import {connect} from "dva";
import Color from "../themes/Colors";
import Colors from "../themes/Colors";
import {confirmYes, notificationFun} from "../utils/MessageUtil";
import RouterData from "../constants/RouterData";
import {getDocumentTitle} from "../constants/ReleaseOrgan";
import {createAction} from "../utils/CommonUtils";
import {aesFunContent} from "../utils/PrjUtils";
import {switchUseCase} from "../constants/SessionStorageData";
import {createFromIconfontCN} from "@ant-design/icons";

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
const Home = ({history, spinning, dispatch}) => {

    useEffect(() => {
        //监听浏览器关闭
        onCloseBrowser()

    }, []);
    const onUnload = (evt) => {
        dispatch(createAction("app/logout")());
    };
    const onCloseBrowser = () => {
        var _beforeUnload_time = 0,

            _gap_time = 0

        // onunload 发生于当用户离开页面时发生的事件(通过点击一个连接，提交表单，关闭浏览器窗口等等。刷新也会触发) 刷新和关闭浏览器时先触发onbeforeunload再触发onunload   刷新时两次触发的间隔普遍在60毫秒以上 关闭时触发间隔大约在在0-4之间

        window.onunload = function () {
            _gap_time = new Date().getTime() - _beforeUnload_time

            // 当两次事件发生时间戳小于4时,才触发关闭浏览器要执行的事件

            if (_gap_time <= 4) {
                // window.localStorage.setItem('test', _gap_time)
                onUnload()
            }

        }

        // onbeforeunload 事件在即将离开当前页面（刷新或关闭）时触发。

        window.onbeforeunload = function () {
            _beforeUnload_time = new Date().getTime()

        }

    }
    const menu = sessionStorage.getItem("menus") ? JSON.parse(sessionStorage.getItem("menus")) : [];
    const [menued, setMenued] = useState(sessionStorage.getItem("menuKey") ? sessionStorage.getItem("menuKey") : menu.length ? 0 : -1);
    //是否展示子系统
    const [showSubsystem, setShowSubsystem] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    let keys = "";
    let openKeys = "";

    //获取菜单
    if (menu.length && !sessionStorage.getItem("selectedKeys") && !sessionStorage.getItem("selectItemData")) {
        const firstSubMenu = menu[0].menuDtoList && menu[0].menuDtoList[0];

        if (firstSubMenu) {
            keys = firstSubMenu.code;
            sessionStorage.setItem("selectItemData", JSON.stringify(firstSubMenu));
            sessionStorage.setItem("selectedKeys", keys);

            if (firstSubMenu.canAddChild && firstSubMenu.menuDtoList && firstSubMenu.menuDtoList.length) {
                openKeys = firstSubMenu.code;
                keys = firstSubMenu.menuDtoList[0].code;
                sessionStorage.setItem("selectItemData", JSON.stringify(firstSubMenu.menuDtoList[0]));
                sessionStorage.setItem("selectedKeys", keys);
            }
        }
    } else if (sessionStorage.getItem("selectedKeys")) {
        keys = sessionStorage.getItem("selectedKeys");
    }

    //选中的菜单
    const [selectedKeys, setSelectedKeys] = useState(keys);
    //展开的菜单
    const [selectedOpenKeys, setSelectedOpenKeys] = useState(openKeys);

    const onSubsystem = (item, index) => {
        setMenued(index); // 切换菜单的下标
        sessionStorage.setItem("menuKey", index); // 将当前二级菜单存起来

        const firstSubMenu = menu[parseInt(index)].menuDtoList && menu[parseInt(index)].menuDtoList[0];

        if (firstSubMenu) {
            setSelectedKeys(firstSubMenu.code);
            sessionStorage.setItem("selectItemData", JSON.stringify(firstSubMenu));
            sessionStorage.setItem("selectedKeys", firstSubMenu.code);
            history.push(firstSubMenu.code);

            const secondSubMenu = firstSubMenu.menuDtoList && firstSubMenu.menuDtoList[0];

            if (secondSubMenu) {
                setSelectedOpenKeys(firstSubMenu.code);
                setSelectedKeys(secondSubMenu.code);
                sessionStorage.setItem("selectItemData", JSON.stringify(secondSubMenu));
                sessionStorage.setItem("selectedKeys", secondSubMenu.code);
                history.push(secondSubMenu.code);
            }
        } else {
            setSelectedKeys(item.code);
            sessionStorage.setItem('selectItemData', JSON.stringify(item));
            sessionStorage.setItem("selectedKeys", item.code);
            history.push(item.code);
        }
    };

    //修改密码
    const handleOk = (values) => {
        if (values.newTwoPass != values.newPass) {
            notificationFun("新密码与确认密码不一致")
        } else {
            dispatch(createAction("user/modifyUserPass")({
                oldPass: aesFunContent(values.oldPass), newPass: aesFunContent(values.newPass), success: () => {
                    setPasswordVisible(false);
                }
            }));
        }
    }
    const layout = {
        labelCol: {
            span: 6,
        }, wrapperCol: {
            span: 16,
        },
    };
    const tailLayout = {
        wrapperCol: {
            span: 24,
        },
    };
    const IconFont = createFromIconfontCN({
        scriptUrl: '../dist/fonts/iconfont.js',
    });
    return (<Layout className="minWidthAuto">
        <Header className={"header"} style={{
            width: '100%', position: 'relative', top: 0, zIndex: 999, background: '#222632'
        }}>
            <div style={{float: "left", marginLeft: 20}}>
                <div style={{display: "flex", alignItems: 'center'}}>
                    <img style={{width: 50, height: 50}} src={require('../assets/img/logo.png')} alt=""/>
                    <div style={{
                        marginLeft: 20,
                        fontWeight: 600,
                        fontSize: 18,
                        color: Colors.whiteFsColor
                    }}>{getDocumentTitle()}</div>
                </div>
            </div>
            <div style={{float: "right", marginRight: 20}}>
                    <span style={{
                        color: Colors.whiteFsColor,
                        fontWeight: 600,
                        padding: 10,
                        fontSize: 20
                    }}>{sessionStorage.getItem("userName")}</span>
                <img onClick={() => {
                    setPasswordVisible(true)
                }} style={{width: 20, position: "relative", top: -2, marginRight: 10, cursor: "pointer"}}
                     title={"修改密码"} src={require("../assets/img/password.png")}/>

                <LogoutOutlined onClick={() => {
                    confirmYes("请确认是否注销？", () => {
                        dispatch(createAction("app/logout")());
                    })
                }} title={"注销"} style={{
                    cursor: "pointer", color: Colors.whiteFsColor
                }}/>
            </div>
        </Header>
        <div className="nav-box">
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[menued]} style={{height: '100%'}}>
                {menu.map((item, index) => {
                    return (<Menu.Item onClick={() => {
                        onSubsystem(item, index)
                    }} key={index} icon={<i className={"icon icon-" + item.code}></i>}>{item.name}</Menu.Item>)
                })}
            </Menu>

        </div>
        <Content>
            <Layout className="site-layout-background"
                    style={{minHeight: "100%", position: 'relative', background: 'white'}}>
                <Sider className="site-layout-background im-scrollbar sidebar-menu" width={159}
                       style={{overflowY: "auto", position: 'absolute', top: '0', zIndex: 990, height: '100%'}}>
                    {!showSubsystem && <Menu
                        mode="inline"
                        selectedKeys={[selectedKeys]}
                        openKeys={[selectedOpenKeys]}
                        style={{marginTop: 20}}
                        onOpenChange={(openKeys) => {
                            setSelectedOpenKeys(openKeys[openKeys.length - 1])
                        }}
                        onClick={(item, key, keyPath, domEvent) => {
                            setSelectedKeys(item.key);
                            sessionStorage.setItem("selectedKeys", item.key)
                        }}
                    >
                        {menu.length && menu[parseInt(menued)].menuDtoList && menu[parseInt(menued)].menuDtoList.map((item) => {
                            return (item.canAddChild ?
                                <SubMenu icon={<i className={"parentIcon icon icon-menu_" + item.code}></i>}
                                         className="ant-menus" key={item.code} title={item.name}>
                                    {item.menuDtoList && item.menuDtoList.map((child) => (<Menu.Item onClick={() => {
                                        sessionStorage.setItem('selectItemData', JSON.stringify(item))
                                    }} key={child.code} elementnames={child.elementNames}>
                                        <Link to={child.code}>{child.name}</Link>
                                    </Menu.Item>))}
                                </SubMenu> : <Menu.Item icon={<i className={"icon icon-menu_" + item.code}></i>}
                                                        onClick={() => {
                                                            sessionStorage.setItem('selectItemData', JSON.stringify(item))
                                                        }} key={item.code}>

                                    <Link to={item.code}>{item.name}</Link>
                                </Menu.Item>)
                        })}
                    </Menu>}
                </Sider>
                <Content className={"flex1 box"} style={{
                    padding: '20px',
                    minHeight: 280,
                    backgroundColor: Colors.whiteBgColor,
                    marginLeft: 160,
                    height: window.innerHeight - 130,
                    width: window.innerWidth - 160,
                    overflow: 'auto'
                }}>
                    <Spin tip="加载中..." spinning={spinning}>
                        <IndexRouter/>
                    </Spin>
                </Content>
            </Layout>
        </Content>
        <Modal title="修改密码" open={passwordVisible} footer={null} onCancel={() => {
            setPasswordVisible(false)
        }}>
            <Form
                {...layout}
                onFinish={handleOk}
            >
                <Form.Item
                    label="原密码"
                    name="oldPass"
                    rules={[{
                        required: true, message: '请输入原密码',
                    },]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    label="新密码"
                    name="newPass"
                    rules={[{
                        required: true, message: '请输入新密码',
                    },]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    label="确认密码"
                    name="newTwoPass"
                    rules={[{
                        required: true, message: '请输入确认密码',
                    },]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <div style={{textAlign: "center", width: "100%"}}><Button type="primary" htmlType="submit">
                        保存
                    </Button></div>
                </Form.Item>
            </Form>
        </Modal>
    </Layout>)
};

const mapStateToProps = ({app, loading}) => {
    return {menuData: app.menuData, spinning: loading.global}
};

export default withRouter(connect(mapStateToProps)(Home));
