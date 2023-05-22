'use strict';
import React, { useState, useEffect } from "react";
import { TreeClass } from "../../components/common/Tree"
import { connect } from "dva";
import { TitleColor } from "../../components/common/TitleColor"
import Colors from "../../themes/Colors";
import { Row, Col, Button, Modal, Form, Input, Select, Dropdown, Menu, Space } from "antd";
import { confirmLeftDelect, notificationWarningFun, confirmYes } from "../../utils/MessageUtil";
import { createAction } from "../../utils/CommonUtils";
import Pagination from "../../components/common/Pagination";
import {
    phoneReg,
    NoChineseReg
} from "../../utils/PrjUtils";
import { isWk } from "../../constants/ReleaseOrgan"

const UserPage = ({ dispatch, users }) => {
    const [organData, setOrganData] = useState([]);//机构
    const [visible, setVisible] = useState(false);//弹框
    const [isAdd, setIsAdd] = useState(false);//是否增加
    const [serialNo, setSerialNo] = useState(1);
    const [organId, setOrganId] = useState("");//机构id
    const [isValidFilter, setIsValidFilter] = useState("");//状态
    const [pageNo, setPageNo] = useState(1);//页数
    const [pageSize, setPageSize] = useState(10);//条数
    const [pageData, setPageData] = useState({});//分页数据源
    const [formData, setFormData] = useState({});//当前修改的数据源


    useEffect(() => {
        // dispatch(createAction("organ/mapDictCodes")());
        dispatch(createAction("organ/getOrganListByHierarchy")({
            success: (data) => {
                if (data.length > 0) {
                    setOrganId(data[0].id);
                    onQueryUserPage(data[0].id, isValidFilter, pageNo, pageSize);
                }

                setOrganData(data)
            }
        }));

    }, []);
    const onQueryUserPage = (organId, status, pageNo, pageSize) => {
        dispatch(createAction("user/queryUserPage")({
            organId: organId,
            status: status,
            pageNo: pageNo,
            pageSize: pageSize,
            success: (data) => {
                setPageData(data)
            }
        }));
    }
    const onCreate = (values) => {
        values.organId = organId;
        if (!isAdd) {
            values.id = formData.id;
            values.uuid = formData.uuid;
        }
        dispatch(createAction("user/saveUser")({
            data: values,
            success: () => {
                setVisible(false);
                onQueryUserPage(organId, isValidFilter, pageNo, pageSize);
            }
        }));
    };
    //树形结构选中
    const onTreeSelect = (selectedKeys, e) => {
        setOrganId(e.node.id);
        onQueryUserPage(e.node.id, isValidFilter, pageNo, pageSize);
    }

    //编辑
    const onEdit = (record) => {
        dispatch(createAction("user/getRoleListByAddUser")());
        setFormData(record)
        setIsAdd(false)
        setVisible(true)
    };

    //删除
    const onDelete = (record) => {
        confirmLeftDelect("请确认是否删除？", () => {
            dispatch(createAction("user/delUser")({
                userId: record.id,
                success: () => {
                    onQueryUserPage(organId, isValidFilter, pageNo, pageSize);
                }
            }))
        })
    }

    //职业更多选择
    const onMenuClick = (e, record) => {
        if (e.key == "启用") {
            confirmYes("请确认是否启用？", () => {
                dispatch(createAction("user/setUserStatus")({
                    userId: record.id,
                    status: 1,
                    success: () => {
                        onQueryUserPage(organId, isValidFilter, pageNo, pageSize);
                    }
                }))
            })
        } else if (e.key == "停用") {
            confirmYes("请确认是否停用？", () => {
                dispatch(createAction("user/setUserStatus")({
                    userId: record.id,
                    status: 2,
                    success: () => {
                        onQueryUserPage(organId, isValidFilter, pageNo, pageSize);
                    }
                }))
            })
        }
    };

    //分页
    const onPageChange = (page, filter) => {
        let status = filter.status && filter.status.length ? filter.status[0] : "";
        setIsValidFilter(status)
        setPageNo(page.current)
        setPageSize(page.pageSize)
        onQueryUserPage(organId, status, page.current, page.pageSize)
    }
    const columns = [
        { title: '姓名', dataIndex: 'nickName', key: "nickName" },
        { title: '登录名', dataIndex: 'loginAccount', key: "loginAccount" },
        { title: '用户角色', dataIndex: 'roleName', key: "roleName" },
        { title: '所属机构', dataIndex: 'organName', key: "organName" },
        { title: '创建者', dataIndex: 'creatorName', key: "creatorName" },
        {
            title: '状态', dataIndex: 'status', key: "status",width:80, className: "tableAlignCenter", filterMultiple: false, filters: [{ text: "启用", value: 1 }, { text: "停用", value: 2 }, { text: "锁定", value: 3 }],
            render: (text, record, index) =>
                <div className={record.status == 1 ? "circular-0" : record.status == 2 ? "circular-2" : "circular-1"}>{record.status == 1 ? "启用" : record.status == 2 ? "停用" : "锁定"}</div>

        },
        {
            title: '操作', dataIndex: 'operation', key: 'operation', width: 150, className: "tableAlignCenter",
            render: (text, record, index) =>
                <Space size={15}>
                    <span className="editTextColor" onClick={() => onEdit(record)}>编辑</span>

                    <span className="editTextColor" onClick={() => onDelete(record)}>删除</span>

                    <Dropdown placement="bottomCenter" overlay={
                        <Menu onClick={(e) => onMenuClick(e, record)}>
                            <Menu.Item key="启用">启用</Menu.Item>
                            <Menu.Item key="停用">停用</Menu.Item>

                        </Menu>
                    } trigger={['click']}>
                        <a className="editTextColor">更多</a>
                    </Dropdown>
                </Space>
        }
    ];
    return (
        <Row className={"flex1 box"}>
            <Col flex="300px">
                <div className="treeTitle">
                    <TitleColor titleName={"机构目录"} />
                </div>
                <div className="treeDiv">
                    <TreeClass onSelect={onTreeSelect} dataProvider={organData} />
                </div>
            </Col>
            <Col style={{ paddingLeft: 20, flex: "1 1" }} >
                <div className="title">
                    <TitleColor titleName={"用户信息"} />
                    <div style={{ float: "right" }}>
                        <Button icon={<i className="icon icon-a-button_newlyadded IconFont"></i>} disabled={organId == ""} onClick={() => {
                            dispatch(createAction("user/getRoleListByAddUser")());
                            setVisible(true)
                            setIsAdd(true)
                        }} type="primary">增加</Button>
                    </div>
                </div>
                <div style={{ marginTop: 20, maxHeight: document.body.offsetHeight - 180, overflow: 'auto' }}>
                    <Pagination serialNo={true} columns={columns} dataProvider={pageData} pagination={true} onChange={(page, filter) => { onPageChange(page, filter) }} rowClassNameSerialNo={serialNo}
                        onRowClick={(record) => setSerialNo(record.serialNo)} />

                </div>
            </Col>
            {visible &&
                <CollectionCreateForm
                    visible={visible}
                    onCreate={onCreate}
                    formData={isAdd ? {} : formData}
                    isAdd={isAdd}
                    users={users}
                    onCancel={() => {
                        setVisible(false);
                    }}
                />}
        </Row>
    )
}
const CollectionCreateForm = ({ visible, onCreate, onCancel, formData, isAdd, users }) => {
    const formItemLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 14,
        },
    };
    const [form] = Form.useForm();
    const formList = [
        { name: "姓名", dataIndex: "nickName", required: true, message: "请输入姓名", pattern: null },
        { name: "手机号", dataIndex: "phone", required: isWk ? true : false, message: "请输入手机号", pattern: phoneReg },
        { name: "登录名", dataIndex: "loginAccount", required: true, message: "请输入有效账号", pattern: NoChineseReg },
        { name: "密码", dataIndex: "password", required: isAdd ? true : false, message: "请输入密码", pattern: null },
        { name: "角色", dataIndex: "roleId", required: true, message: "请选择角色", pattern: null },
        { name: "确认密码", dataIndex: "passwordAgain", required: isAdd ? true : false, message: "请输入确认密码", pattern: null },
    ];
    return (
        <Modal
            open={visible}
            title={isAdd ? "增加用户" : "编辑用户"}
            okText="确认"
            cancelText="取消"
            onCancel={onCancel}
            width={600}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        if (values.passw != values.passwAgain) {
                            notificationWarningFun("两次密码不一致")
                        } else {
                            // form.resetFields();
                            delete values.passwordAgain;
                            onCreate(values);
                        }

                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                {...formItemLayout}
            >
                <Row>
                    {formList.map((item) => (
                        item.dataIndex == "roleId" ?
                            <Col span={12}>
                                <Form.Item
                                    name={item.dataIndex}
                                    initialValue={formData[item.dataIndex] ? formData[item.dataIndex].toString() : ""}
                                    label={item.name}
                                    rules={[
                                        {
                                            required: item.required,
                                            message: item.message,
                                            pattern: item.pattern
                                        },
                                    ]}
                                >
                                    <Select>
                                        {users.roles && users.roles.map((item) => (
                                            <Option value={item.id.toString()}>{item.name}</Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            :
                            <Col span={12}>
                                <Form.Item
                                    name={item.dataIndex}
                                    initialValue={formData[item.dataIndex] ? formData[item.dataIndex] : ""}
                                    label={item.name}
                                    rules={[
                                        {
                                            required: item.required,
                                            message: item.message,
                                            pattern: item.pattern
                                        },
                                    ]}
                                >
                                    <Input autoComplete="new-password" type={item.dataIndex == "password" || item.dataIndex == "passwordAgain" ? "password" : "text"} />
                                </Form.Item>
                            </Col>
                    ))}
                </Row>
            </Form>
        </Modal>
    );
};
const mapStateToProps = ({ user }) => {
    return { users: user }
};

export default connect(mapStateToProps)(UserPage);
