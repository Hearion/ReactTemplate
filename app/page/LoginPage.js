'use strict';
import React, {useEffect, useState} from "react";
import {connect} from "dva";
import {Button, Input, Modal, Row, Col} from "antd";
import {
    EyeTwoTone, EyeInvisibleOutlined
} from "../../node_modules/@ant-design/icons/lib/index";
import {createAction} from "../utils/CommonUtils";
import {notificationFun} from "../utils/MessageUtil";
import RouterData from "../constants/RouterData";
import {aesFunContent} from "../utils/PrjUtils";
import {getDocumentTitle} from "../constants/ReleaseOrgan";

let times
let loginBgImage = require('../assets/img/login/login.png')
const LoginPage = ({dispatch, history, loading, isExpert}) => {
    const [loginName, setLoginName] = useState("");
    const [password, setPassword] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loginData, setLoginData] = useState({})
    const [verificationData, setVerificationData] = useState({})
    const [countdownTime, setCountdownTime] = useState('')
    const [isRecord, setIsRecord] = useState(false)
    const [pageArr, setPageArr] = useState([])
    useEffect(() => {
        if (window.location.href.indexOf('bjupi') !== -1) {
            setIsRecord(true)
        }
    }, [])
    const onInit = () => {
        dispatch(createAction("app/init")());
    };

    // 登录
    const onLogin = () => {
        if (loading) {
            return;
        }

        if (!loginName) {
            notificationFun("请输入用户名。");
            return;
        }

        if (!password) {
            notificationFun("请输入密码。");
            return;
        }
        dispatch(createAction("app/login")({
            loginAccountJson:
                JSON.stringify({
                    loginAccount: aesFunContent(loginName),
                    pwdAccount: aesFunContent(password)
                }),
            success: (userData) => {
                dispatch(createAction("app/getPermissionMenu")({
                    success: (data) => {
                        if (data.length) {
                            const firstMenu = data[0];

                            if (firstMenu.canAddChild && firstMenu.menuDtoList.length) {
                                sessionStorage.setItem("menuKey", 0);

                                const firstSubMenu = firstMenu.menuDtoList[0];

                                if (firstSubMenu.canAddChild && firstSubMenu.menuDtoList.length) {
                                    sessionStorage.setItem('selectItemData', JSON.stringify(firstSubMenu.menuDtoList[0]));
                                    sessionStorage.setItem("selectedKeys", firstSubMenu.menuDtoList[0].code);
                                    sessionStorage.setItem("openKey", firstSubMenu.code);
                                    history.push(firstSubMenu.menuDtoList[0].code);
                                } else {
                                    sessionStorage.setItem('selectItemData', JSON.stringify(firstSubMenu));
                                    sessionStorage.setItem("selectedKeys", firstSubMenu.code);
                                    history.push(firstSubMenu.code);
                                }
                            } else {
                                sessionStorage.setItem('selectItemData', JSON.stringify(firstMenu));
                                sessionStorage.setItem("selectedKeys", firstMenu.code);
                                history.push(firstMenu.code);
                            }
                        }
                    }
                }));
                sessionStorage.setItem('userName', userData.nickName)
                sessionStorage.setItem('loginName', loginName)
                sessionStorage.setItem("isExpert", "3")
            }
        }));
    };

    // 获取验证码
    const onVerification = (verification) => {
        times()
        dispatch(createAction("app/verification")({
            verification: verification, success: (data) => {
                setVerificationData(data)
            }
        }));
    }

    // 验证验证码
    const onCheck = () => {
        dispatch(createAction("app/check")({
            uuid: verificationData.uuid,
            phone: verificationData.phone,
            code: verificationData.code,
            success: (data) => {
                dispatch(createAction("app/getPermissionMenu")({
                    success: () => {
                        sessionStorage.setItem('userName', data.nickName)
                        history.push(RouterData.middlePage);//跳转中间页
                    }
                }));
            }
        }));
    }

    //生成计时器
    times = () => {
        let time = countdownTime == 0 ? 120 : countdownTime;
        var inv = setInterval(() => {
            time--
            setCountdownTime(time);
            if (time == 0) {
                clearInterval(inv)
            }
        }, 1000)
    }
    return (
        <div style={{width: "100%"}}>
            <div className="page-login" style={{padding: 0}}>
                <div style={{display: 'flex', flex: 1}}>
                    <div
                        className="login-cont"
                        style={{
                            padding: 0,
                            alignItems: 'center',
                            backgroundImage: "url(" + loginBgImage + ")",
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '100% 100%'
                        }}
                    >
                        {/*<div style={{width: 384, height: 90, marginTop: '26%'}}>慧明慧行</div>*/}
                        <img style={{width: 256, height: 90, marginTop: '26%'}} src={require('../assets/img/login/text.png')} alt={''}/>
                    </div>
                    <div className="login" style={{position: 'relative'}}>
                        <div className="login-bd">
                            <div className="login-tit"><strong>欢迎登录</strong></div>
                            <div className="login-subtit">登录账户以开始工作</div>
                            <div className="login-form">
                                <div className="login-item">
                                    <Input
                                        placeholder="点击输入用户名称"
                                        size="large"
                                        value={loginName}
                                        style={{height: 64}}
                                        onPressEnter={() => onLogin()}
                                        onChange={(e) => {
                                            setLoginName(e.target.value.trim())
                                        }}
                                    />
                                </div>
                                <Input.Password
                                    placeholder="点击输入密码"
                                    size="large"
                                    className="password-input"
                                    iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                                    onChange={(e) => {
                                        setPassword(e.target.value.trim())
                                    }}
                                    onPressEnter={() => onLogin()}
                                />

                                <div className="login-btn">
                                    <Button loading={loading} type="primary" block
                                            onClick={() => onLogin()}>登录</Button>
                                </div>
                                <div className="login-item">
                                    <div className="login-text text-center">
                                        {/* {isExpert||isZsy||isCommon?null:<a onClick={()=>{setIsLogin(false),setIsRegister(true)}}>还没有账号，去<span className="text-underline">注册</span></a>} */}
                                    </div>
                                </div>
                                {/* 短信验证 */}
                                {isModalVisible && <Modal
                                    open={isModalVisible}
                                    maskClosable={false}
                                    style={{borderRadius: 20}}
                                    centered
                                    footer={null}
                                    onCancel={() => {
                                        setIsModalVisible(false)
                                    }}
                                >
                                    <Row style={{padding: 13, borderRadius: 20}}>
                                        <Col span={24}>
                                            <span style={{fontSize: 22, color: '#4a79e9'}}>短信验证</span>
                                        </Col>
                                        <Col span={24} style={{marginTop: 12}}>
                                                    <span style={{
                                                        fontSize: 16, color: '#a3a3a3'
                                                    }}>验证码已发送到您的手机：{loginData.phone ? loginData.phone : '(暂无)'}，请查收！</span>
                                        </Col>
                                        <Col span={countdownTime === 0 ? 19 : 16}
                                             style={{marginTop: 90, height: 35}}>
                                            <Input style={{fontSize: 16, paddingLeft: 0}} placeholder="验证码"
                                                   bordered={false} onChange={(e) => {
                                                setVerificationData({
                                                    ...verificationData, code: e.target.value,
                                                })

                                            }}></Input>
                                        </Col>
                                        {countdownTime === 0 ? <Col span={5} style={{marginTop: 90}}>
                            <span style={{fontSize: 16, color: '#4a79e9'}} onClick={() => {
                                onVerification(loginData.verification)
                            }}>获取验证码</span>
                                        </Col> : <Col span={8} style={{marginTop: 90}}>
                                                        <span style={{
                                                            fontSize: 16, color: '#4a79e9'
                                                        }}>请{countdownTime}后获取验证码</span>
                                        </Col>}

                                        <div style={{
                                            width: '100%', height: 1, backgroundColor: '#dbdbdb'
                                        }}></div>
                                        {verificationData.msg && <Col span={24} style={{marginTop: 12}}>
                                                        <span style={{
                                                            fontSize: 16, color: '#fb6260'
                                                        }}>{verificationData.msg}</span>
                                        </Col>}

                                        <Col span={24} style={{marginTop: 15}}>
                                            <Button type="primary" style={{width: '100%', height: 35}}
                                                    onClick={() => {
                                                        onCheck()
                                                    }}>登录</Button>
                                        </Col>
                                    </Row>
                                </Modal>}
                            </div>
                        </div>
                    </div>
                </div>
                {isRecord && <div style={{position: 'absolute', bottom: 10}}>
                    <a href="https://beian.miit.gov.cn/#/Integrated/index">京ICP备14007737号</a>
                </div>}

            </div>
            <div style={{width: 10, height: 5, position: "absolute", top: 0, left: 0, cursor: "pointer"}}
                 onClick={() => onInit()}/>
        </div>

    )
};

const mapStateToProps = ({loading}) => {
    return {loading: loading.global}
};

export default connect(mapStateToProps)(LoginPage);