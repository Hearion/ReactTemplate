'use strict';
import { Tree, Input, Button } from "antd";
import React, { useState, useEffect } from "react";
import zhCN from 'antd/es/locale/zh_CN';
import { getFlatToTree, jsonToArray, tree2Array } from "../../utils/PrjUtils";
import { CloseCircleOutlined, CheckSquareOutlined } from '@ant-design/icons';
import LessPagination from "./LessPagination";

export const TreeClass = (props) => {
  const { Search } = Input;
  const [isHeight, setIsHeight] = useState(false);
  //左侧数据源
  const [dataProvider, setDataProvider] = useState(props.dataProvider);
  useEffect(() => {
    //所有节点
    let allExpande = [];
    for (let i = 0; i < props.dataProvider.length; i++) {
      allExpande.push(props.dataProvider[i].uuid)
    }
    setSarentUuid(props.dataProvider && props.dataProvider.length ? [props.dataProvider[0].uuid] : "")
    setSelectedKeys(props.selectedKeys ? [props.selectedKeys] : props.dataProvider && props.dataProvider.length ? [props.dataProvider[0].uuid] : "")
    setExpandedKeys(allExpande)
    setAllExpande(allExpande)
    setDataProvider(props.dataProvider)
    setIsHeight(props.isHeight ? props.isHeight : false)
    return () => {
    };
  }, [props.dataProvider]);
  useEffect(() => {
    setSelectedKeys(props.selectedKeys ? [props.selectedKeys] : props.dataProvider && props.dataProvider.length ? [props.dataProvider[0].uuid] : "")
  }, [props.selectedKeys])
  //（受控）展开指定的树节点
  const [expandedKeys, setExpandedKeys] = useState("");
  // 所有节点的uuid，用于展开最大节点
  const [selectedKeys, setSelectedKeys] = useState("");
  const [allExpande, setAllExpande] = useState("");
  //最大节点uuid，用于展开最大节点时对比
  const [parentUuid, setSarentUuid] = useState("");

  // 保存树搜索的检索到的所有key
  const [searchKey, setSearchKey] = useState([]);
  // 搜索时锁定的的位置
  const [searchPosition, setSearchPosition] = useState(0);
  // 上次搜索的值
  const [oldSearchValue, setOldSearchValue] = useState('');

  //左侧搜索内容
  const [searchValue, setSearchValue] = useState("");
  //	是否自动展开父节点
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // 列表数据
  const [pageData, setPageData] = useState([])
  const [serialNo,setSerialNo] = useState(1)
  //左侧搜索内容
  const onChange = value => {
    setSearchValue(value)
    setSerialNo(1)
    let newPageData = []
    if (Array.isArray(dataProvider) && dataProvider.length > 0) {
      dataProvider.map((item) => {
        let str = `(${item.code})${item.name}`
        if (str.indexOf(value) != -1) {
          let obj ={...item,children:""}
          newPageData.push(obj)
        }
      })
    }
    setPageData([...newPageData])
    if(Array.isArray(newPageData)&&newPageData.length>0){
      onSelect(newPageData[0].uuid, {node:{...newPageData[0]}})
    }
    // const { value } = e.target;
    // if (value === oldSearchValue) {
    //     if (searchKey[searchPosition] && searchKey[searchPosition].uuid) {
    //         onSelect([searchKey[searchPosition].uuid], {node: searchKey[searchPosition]})
    //     }
    //     if (searchPosition >= searchKey.length - 1) {
    //         setSearchPosition(0)
    //     } else {
    //         setSearchPosition(searchPosition + 1)
    //     }
    // } else {
    //     setSearchPosition(0)
    //     setOldSearchValue(value)
    //     let keys = []
    //     let newArr = []
    //     const expandedKeys = props.dataProvider.map(item => {
    //       // if(value == item.name){
    //       //   onSelect([item.uuid], {node: item})
    //       // }
    //         newArr.push(item)
    //         if (item.title.indexOf(value) > -1) {
    //             return getParentKey(item.key, props.dataProvider);
    //         }
    //         return null;
    //     }).filter((item, i, self) => item && self.indexOf(item) === i);
    //     newArr = jsonToArray([newArr[0]]);
    //     newArr.map(item => {
    //         if (item.title.indexOf(value) > -1) {
    //             keys.push(item)
    //             setSearchKey([...keys])
    //             if (keys[searchPosition] && keys[searchPosition].uuid) {
    //                 onSelect([keys[searchPosition].uuid],{node: keys[searchPosition]})
    //             }
    //             setSearchPosition(searchPosition + 1)
    //         }
    //     })

    //     if (keys[searchPosition] && keys[searchPosition].uuid) {
    //         onSelect([keys[searchPosition].uuid],{node: keys[searchPosition]})
    //     }
    //     setExpandedKeys(expandedKeys)
    //     setSearchValue(value)
    //     setAutoExpandParent(true)
    // }
  };


  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  //展开/收起节点时触发
  const onExpand = (expandedKeys, { expanded: bool, node }) => {
    //最大父节点展开全部节点
    if ({ expanded: bool }.expanded == true && { expanded: node }.expanded.uuid == parentUuid) {
      setExpandedKeys(allExpande)

    } else {
      setExpandedKeys(expandedKeys)
    }
    setAutoExpandParent(false)
  };

  const onSelect = (selectedKeys, e) => {
    setSelectedKeys(selectedKeys)
    props.onSelect(selectedKeys, e)

  }

  const columns= [
    {title:'名称',dataIndex:'data',key:'data',
      render:(text,record)=>
      <div title={`(${record.code})${record.name}`}>
        <span style={{cursor:'pointer',display:'inline-block',width:160,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',fontSize:14}} title={`${record.code}`}>{`(${record.code})`}</span>
        <br/>
        <span style={{cursor:'pointer',display:'inline-block',width:160,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',fontSize:14}} title={`${record.name}`}>{`${record.name}`}</span>
      </div>
      
    }
  ]
  return (
    <div style={{ width: "100%", display: "inline-block", height: '100%', overflow: 'auto' }}>
      <Search style={{ marginBottom: 8, width: props.buttonName ? 'calc(100% - 100px)' : '100%' }} placeholder="输入搜索关键词" onSearch={(e) => {
        onChange(e)
      }} onPressEnter={(event) => { onChange(event.target.value) }} />
      {props.buttonName ? <Button onClick={() => {
        props.onReturnButton()
      }} style={{ float: "right" }}>{props.buttonName}</Button> : null}
      {searchValue?
        <div style={{height:props.height ? props.height : window.innerHeight - 250}}>
          <LessPagination
            serialNo={true}
            columns={columns}
            rowClassNameSerialNo={serialNo}
            serialNoWidth={10}
            onRowClick={(row)=>{
              onSelect(row.uuid, {node:{...row}})
              setSerialNo(row.serialNo)
            }}
            dataProvider={pageData}
            pagination={false}
          />
        </div>
        :
        <Tree
          // style={{fontWeight:props.dataProvider.length>0&&props.dataProvider[0].parentId===0?"900":""}}
          // style={isHeight ? {maxHeight: 700,overflow: "auto"}:{maxHeight: 700,overflow: "auto",height:700}}
          showLine={{ showLeafIcon: false }}
          showIcon={false}
          onExpand={onExpand}
          defaultExpandAll={true}
          onSelect={onSelect}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          autoExpandParent={autoExpandParent}
          treeData={getFlatToTree(dataProvider)}
          height={props.height ? props.height : window.innerHeight - 200}
          titleRender={(nodeData) => {
            let isSearch = false;
            if (nodeData.code && searchValue != "" && nodeData.code.indexOf(searchValue) != -1) {
              isSearch = true
            }
            if (nodeData.name && searchValue != "" && nodeData.name.indexOf(searchValue) != -1) {
              isSearch = true
            }
            let beforeStr = "";
            let afterStr = "";
            if (isSearch) {
              let value = nodeData.code !== null ? ("(" + nodeData.code + ")" + nodeData.name) : nodeData.name;
              const index = value.indexOf(searchValue);
              beforeStr = value.substr(0, index);
              afterStr = value.substr(index + searchValue.length)
            }
            return (
              <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <div title={nodeData.code !== null ? ("(" + nodeData.code + ")" + nodeData.name) : nodeData.name}>
                  {isSearch ?
                    <span>
                      {beforeStr}
                      <span className="site-tree-search-value">{searchValue}</span>
                      {afterStr}
                    </span>
                    : nodeData.code !== null ? <span style={nodeData.parentId == "0" ? { fontWeight: 900 } : {}}>{("(" + nodeData.code + ")" + nodeData.name)}</span> : <span style={nodeData.parentId == "0" ? { fontWeight: 900 } : {}}>{nodeData.name}</span>}
                  {nodeData.typeEx == 4 && <span style={{ color: "#999" }}>{"（考试工种）"}</span>}
                </div>
              </div>
            )
          }}
        />
      }

    </div>
  )
};
