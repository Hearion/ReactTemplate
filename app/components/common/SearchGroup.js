'use strict';
import React, {useState, useEffect} from "react";
import {Input, Select} from "antd";
import {notificationFun} from "../../utils/MessageUtil";

const InputGroup = Input.Group;
const Search = Input.Search;
const Option = Select.Option;
export const SearchGroup = (props) => {
    const [childName, setChildName] = useState(props.childName);
    useEffect(() => {
        setChildName(props.childName);
    }, [props.childName]);
    return (
        <InputGroup compact style={{width:props.width?props.width:"100%",marginLeft:props.left?props.left:'0px'}}>
            <Select placeholder="请选择" value={props.childType ? props.childType : null} onChange={(value) => props.onSelectValue(value)}>
                {
                    props.searchList && props.searchList.map((item, index) =>
                        <Option key={index} value={item.value}>{item.text}</Option>
                    )
                }
            </Select>
            <Search className="search" placeholder="输入搜索关键字" style={{width: 300}} value={childName}
                    onChange={(e) => {
                        setChildName(e.target.value)
                        if (props.isChange) {
                            props.onSearchValue(e.target.value, true)
                        }
                    }}
                    onSearch={(value) => {
                        if (props.childType !== "") {
                            props.onSearchValue(value, false)
                        } else {
                            return notificationFun("请先选择筛选类型");
                        }
                    }}/>
        </InputGroup>
    );
};
