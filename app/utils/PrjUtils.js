"use strict";
// import XLSX from "xlsx";
import saveAs from "../components/scriptJs/FileSaver";
import "../components/scriptJs/prototype";
import { aesFun } from "./aes";
import { array } from "prop-types";
import { Workbook } from 'exceljs';

// 加密
export const aesFunContent = (content) => {
  let aesContent = aesFun.Encrypt(content);
  aesContent = aesContent.split('+');
  aesContent = aesContent.join("[add]")
  return aesContent;
  // return content;
}

/** 数据递归
 * column 数据源
 * pId 父id
 * */
export const tree = (column, pId) => {
  const result = []
  column.forEach((c) => {
    const temp = { ...c }
    if (temp.parentId === pId) {
      temp.children = []
      temp.children = temp.children.concat(tree(column, temp.id))
      result.push(temp)
    }
    return null
  })
  return result
}
//拼装Tree数据
export const getFlatToTree = (datas) => {
  let Arr = [];
  let mapKey = {};
  for (let data of datas) {
    data.key = data.uuid;
    data.title = data.name;
    if (data.hasOwnProperty("id") && data.hasOwnProperty("parentId")) {
      if (data.parentId === null || !mapKey.hasOwnProperty(data.parentId)) {
        if (!Arr.find((value) => {
          if (value.uuid === data.uuid) {
            return true
          }
        })) {
          Arr.push(data);
        }

      } else {
        if (mapKey[data.parentId].children === null || !mapKey[data.parentId].children) {
          mapKey[data.parentId].children = [];
        }
        if (!mapKey[data.parentId].children.find((value) => {
          if (value.uuid === data.uuid) {
            return true
          }
        })) {
          mapKey[data.parentId].children.push(data);
        }
      }
      mapKey[data.id] = data;
    }
  }
  return Arr;
};
export const tree2Array = (treeObj, rootid) => {
  const temp = [];  // 设置临时数组，用来存放队列
  const out = [];    // 设置输出数组，用来存放要输出的一维数组
  temp.push(treeObj);
  // 首先把根元素存放入out中
  let pid = rootid;
  const obj = deepCopy(treeObj);
  obj.pid = pid;
  delete obj['children'];
  out.push(obj)
  // 对树对象进行广度优先的遍历
  while (temp.length > 0) {
    const first = temp.shift();
    const children = first.children;
    if (children && children.length > 0) {
      pid = first.id;
      const len = first.children.length;
      for (let i = 0; i < len; i++) {
        temp.push(children[i]);
        const obj = deepCopy(children[i]);
        obj.pid = pid;
        delete obj['children'];
        out.push(obj)
      }
    }
  }
  return out
}

const deepCopy = (obj) => {
  // 深度复制数组
  if (Object.prototype.toString.call(obj) === "[object Array]") {
    const object = [];
    for (let i = 0; i < obj.length; i++) {
      object.push(deepCopy(obj[i]))
    }
    return object
  }
  // 深度复制对象
  if (Object.prototype.toString.call(obj) === "[object Object]") {
    const object = {};
    for (let p in obj) {
      object[p] = obj[p]
    }
    return object
  }
}

export const jsonToArray = (nodes) => {
  var r = [];
  if (Array.isArray(nodes)) {
    for (var i = 0, l = nodes.length; i < l; i++) {
      r.push(nodes[i]); // 取每项数据放入一个新数组
      if (Array.isArray(nodes[i]["children"]) && nodes[i]["children"].length > 0)
        // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
        r = r.concat(jsonToArray(nodes[i]["children"]));
      delete nodes[i]["children"]
    }
  }
  return r;
}

//判断有效邮箱
export const validMailbox = (value) => {
  let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([\.]\w+)*/;
  return reg.test(value);
};

//获取集合中，对应的属性的值。其中property为空时，取值为对应value
export const getArrObjectByProperty = (arr, property, value) => {
  for (let data of arr) {
    if (property) {
      if (data[property] == value) {
        return data;
      }
    } else {
      if (data == value) {
        return data;
      }
    }
  }
  return null;
};

//判断15或者18位 只能数字和字母
export const creditCodeReg = /^([a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})$/;
//判断6 只能数字和字母
export const credit6CodeReg = /^[a-zA-Z0-9]{6}$/;
//判断4 只能数字和字母
export const credit4CodeReg = /^[a-zA-Z0-9]{4}$/;
//判断7 只能数字

export const credit7CodeReg = /^[0-9]{7}$/;

//正则正整数和零
export const positiveIntegerAndZeroReg = /^([0]|[1-9][0-9]*)$/

// export const NoChineseReg = /^[0-9a-zA-Z]+$/;
//禁用汉字
export const NoChineseReg = /^[^\u4e00-\u9fa5]+$/;
//正则11位数字第一位为1
export const phoneReg = /^1\d{10}$/;

//验证身份证有效
export const validCardId = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

//判断邮箱
export const validEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([\.]\w+)*/;

//判断邮编6位数字
export const validPostCode = /^[0-9]{6}$/;

//判断工种编码不超过14位数字
export const validOccuCode = /^[0-9-]{0,14}$/;


//验证身份证有效并且获得性别(sex)，出生日期(birthday)
export const validCardIdFun = (cardId) => {
  let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!reg.test(cardId))
    return false;

  if (cardId.length === 15)
    cardId = cardId.substr(0, 6) + "19" + cardId.substr(6, 9);
  let args = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += args[i] * parseInt(cardId.substring(i, i + 1));
  }
  sum = sum % 11;
  let args1 = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2", "x"];
  if (cardId.length == 17) {
    cardId = cardId + args1[sum];
  }
  // if (cardId.substring(17, 18).toLocaleUpperCase() == args1[sum]) {
  let birStr = cardId.substr(6, 4) + "-" + cardId.substr(10, 2) + "-" + cardId.substr(12, 2);
  let obj = new Object();
  obj.birthdayStr = birStr;
  let arr = birStr.split("-");
  obj.birthdayDate = new Date(arr[0], parseInt(arr[1]) - 1, arr[2]);
  obj.sexStr = Number(cardId.substr(16, 1)) % 2 === 0 ? "女" : "男";
  obj.sexCode = Number(cardId.substr(16, 1)) % 2 === 0 ? 2 : 1;

  obj.districtCode = cardId.substring(0, 6);
  return validDate(birStr) ? obj : false;
  // }
  return false;
};

//判断有效时间（年月日）
export const validDate = (value) => {
  let reg = /^(?:(?!0000)[0-9]{4}(\/|\-|\.)(?:(?:0[1-9]|[1-9]|1[0-2])\1(?:[1-9]|0[1-9]|1[0-9]|2[0-8])|(?:[13-9]|0[13-9]|1[0-2])\1(?:29|30)|(?:[13578]|0[13578]|1[02])(?:\1)31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)(\/|\-|\.)(?:02|2)(?:\2)29)$/;
  return reg.test(value);
};
//判断手机号
export const phoneFun = (value) => {
  let reg = /^1\d{10}$/;
  return reg.test(value);
};
//判断中文
export const chineseFun = (value) => {
  let reg = /^[^\u4e00-\u9fa5]+$/;
  return reg.test(value);
};
//令牌验证的健值
export const appKey = "appKey";

export const pageNo = 1;
export const pageSize = 10;

export const getBase64 = (img, callback) => {
  let reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

//判断html结构
export const htmlPatten = /\<p\>|\<\/p\>|\<span\>|\<\/span\>|\<br\/\>/g;
//判断图片
export const htmlImg = /\<img.+?>/g;
//验证图片的大小和格式
export const getVerifyImage = (file, callback, notificationFun, kb,compress) => {
  let Arr = ["image/png", "image/jpg", "image/jpeg", "image/bmp"];
  let suffixName = "";
  suffixName = file.type.slice(0, file.type.indexOf("/"));
  if (suffixName != "image") {
    return notificationFun("请上传图片");
  }
  if (Arr.indexOf(file.type) == -1) {
    return notificationFun("上传图片不可为“.gif”类型");
  }
  let isSize = file.size / 1024;
  if (isSize > kb) {
    if(compress){
      return notificationFun("图像压缩后仍大于" + kb + 'KB!请调整图片!');
    }else{
      return notificationFun("图像必须小于" + kb + 'KB!');
    }
  }
  getBase64(file, callback);
};
// 图片压缩
/**
 * @imgCompress     压缩图片
 * @file            文件
 * @pictureQuality  数值越小图片越小 图片越糊
 * @notificationFun 提示弹窗
 */
export const imgCompress = (file, pictureQuality, notificationFun) => {
  let Arr = ["image/png", "image/jpg", "image/jpeg", "image/bmp"];
  let suffixName = "";
  suffixName = file.type.slice(0, file.type.indexOf("/"));
  if (suffixName != "image") {
    return notificationFun("请上传图片");
  }
  if (Arr.indexOf(file.type) == -1) {
    return notificationFun("上传图片不可为“.gif”类型");
  }
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload=({
      target:{
        result:src
      }
    })=>{
      const image = new Image()
      image.onload = async() =>{
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')
        //原始图片宽度、高度
        let originImageWidth = image.width, originImageHeight = image.height;
        //默认最大尺度的尺寸限制在（1920 * 1080）
        let maxWidth = 1920, maxHeight = 1080, ratio = maxWidth / maxHeight;
        //目标尺寸
        let targetWidth = originImageWidth, targetHeight = originImageHeight;
        //当图片的宽度或者高度大于指定的最大宽度或者最大高度时,进行缩放图片
        if (originImageWidth > maxWidth || originImageHeight > maxHeight) {
          //超过最大宽高比例
          if ((originImageWidth / originImageHeight) > ratio) {
            //宽度取最大宽度值maxWidth,缩放高度
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originImageHeight / originImageWidth));
          } else {
            //高度取最大高度值maxHeight,缩放宽度
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originImageWidth / originImageHeight));
          }
        }
        canvas.width = targetWidth
        canvas.height = targetHeight
        context.clearRect(0, 0, targetWidth, targetHeight)
        context.drawImage(image, 0, 0, targetWidth, targetHeight) // 绘制 canvas
        // 图片的类型 "image/jpeg" 这里不可改成file.type 否则压缩不生效  下为文档地址
        // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL  
        const canvasURL = canvas.toDataURL('image/jpeg', pictureQuality)
        const buffer = atob(canvasURL.split(',')[1])
        let length = buffer.length
        const uint8Array = new Uint8Array(new ArrayBuffer(length))
        while (length--) {
          uint8Array[length] = buffer.charCodeAt(length)
        }
        let mimeType = canvasURL.split(',')[0].match(/:(.*?);/)[1];
        let newFileName = file.name.split(".")[0]+'.jpg'
        const miniFile = new File([uint8Array], newFileName, { type: mimeType || 'image/jpeg' });
        resolve(miniFile)
      }
      image.src = src
    }
    reader.readAsDataURL(file);
    // reader.onload = () => {
    //   const canvas = document.createElement('canvas');
    //   const img = document.createElement('img');
    //   img.src = reader.result;
    //   img.onload = () => {
    //     const ctx = canvas.getContext('2d');
    //     //原始图片宽度、高度
    //     let originImageWidth = img.width, originImageHeight = img.height;
    //     //默认最大尺度的尺寸限制在（1920 * 1080）
    //     let maxWidth = 1920, maxHeight = 1080, ratio = maxWidth / maxHeight;
    //     //目标尺寸
    //     let targetWidth = originImageWidth, targetHeight = originImageHeight;
    //     //当图片的宽度或者高度大于指定的最大宽度或者最大高度时,进行缩放图片
    //     if (originImageWidth > maxWidth || originImageHeight > maxHeight) {
    //       //超过最大宽高比例
    //       if ((originImageWidth / originImageHeight) > ratio) {
    //         //宽度取最大宽度值maxWidth,缩放高度
    //         targetWidth = maxWidth;
    //         targetHeight = Math.round(maxWidth * (originImageHeight / originImageWidth));
    //       } else {
    //         //高度取最大高度值maxHeight,缩放宽度
    //         targetHeight = maxHeight;
    //         targetWidth = Math.round(maxHeight * (originImageWidth / originImageHeight));
    //       }
    //     }
    //     // canvas对图片进行缩放
    //     canvas.width = targetWidth;
    //     canvas.height = targetHeight;
    //     // 清除画布
    //     ctx.clearRect(0, 0, targetWidth, targetHeight);
    //     // 绘制图片
    //     ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    //     // quality值越小,图像越模糊
    //     const imageDataURL = canvas.toDataURL(file.type || 'image/jpeg', pictureQuality);
    //     console.log(imageDataURL);
    //     // 去掉URL的头,并转换为byte
    //     const imageBytes = window.atob(imageDataURL.split(',')[1]);
    //     // 处理异常,将ascii码小于0的转换为大于0
    //     const arrayBuffer = new ArrayBuffer(imageBytes.length);
    //     const uint8Array = new Uint8Array(arrayBuffer);
    //     for (let i = 0; i < imageBytes.length; i++) {
    //       uint8Array[i] = imageBytes.charCodeAt(i);
    //     }
    //     let mimeType = imageDataURL.split(',')[0].match(/:(.*?);/)[1];
    //     let newFile = new File([uint8Array], file.name, { type: mimeType || 'image/jpeg' });
    //     resolve(newFile);
    //   }
    // }
  })
}
//判断是否是IE浏览器
export const isIE = () => {
  if (!!window.ActiveXObject || "ActiveXObject" in window)
    return true;
  else
    return false;
};

/**
 * alertFun:错误信息
 * file:文件
 * columns:execl表头
 * ruleFun：验证
 * completeFun:最后完成方法
 * */
export const importExecl = (alertFun, file, columns, ruleFun, completeFun, isOrder = true) => {
  if (!file) {
    return;
  }
  let isBase64 = isIE();
  let reader = new FileReader();
  reader.onload = (e) => {
    let wb = null;//读取完成的数据
    let data = e.target.result;
    if (isBase64) {
      wb = XLSX.read(btoa(fixdata(data)), {//手动转化
        type: 'base64'
      });
    } else {
      wb = XLSX.read(data, {
        type: 'binary'
      });
    }
    let sheetValue = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]], {
      FS: '\t',
      RS: String.fromCharCode(29),
      blankrows: false
    });
    let errorMsg = handleImportExcelData(sheetValue, columns, ruleFun, completeFun, isOrder);
    errorMsg ? alertFun(errorMsg) : null;
  };
  isBase64 ? reader.readAsArrayBuffer(file) : reader.readAsBinaryString(file);
};

export const fixdata = (data) => { //文件流转BinaryString
  let o = "",
    l = 0,
    w = 10240;
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
};

/**
 * pasteData:需要导入的Excel数据
 * column:标准列
 * ruleFun:处理的逻辑方法，进行判断
 * isOrder:打乱表头顺序导入，还是不打乱。默认是按照标准列顺序（true）导入
 * completeFun:最后完成方法
 * */
 const handleImportExcelData = (pasteData, column, ruleFun, completeFun, isOrder) => {
  if (!pasteData)
    return "Excel中没有导入的数据";
  if (!column)
    return null;
  // pasteData= pasteData.substring(0,pasteData.lastIndexOf(String.fromCharCode(29)));
  let results = pasteData.split(String.fromCharCode(29));
  let columnCopy = [];//当表头为动态的情况下，column的0坐标为空
  if (!(results && results.length >= 2))
    return "Excel中没有导入的数据";
  let orderArr = null;
  for (let rowNum = 0; rowNum < results.length; rowNum++) {
    let result = results[rowNum];
    let curArr = result.split('\t');
    if (rowNum === 0) {
      if (column.length === 1) {
        if (column[0] === "") {
          for (let dataItem of curArr) {
            columnCopy.push("");
          }
          column = columnCopy;
        }
      }
      let curArrNew = [];
      for (let m = 0; m < curArr.length; m++) {
        if (curArr[m] !== "") {
          curArrNew.push(curArr[m])
        }
      }
      curArr = curArrNew;

      if (column.length != curArr.length)
        return "导入列标题和标准的列标题不匹配";
      if (isOrder) {
        let length = 0;
        for (let i = 0; i < column.length; i++) {
          if (column[i].trim() === "") {
            length++;
          }
        }
        if (length != column.length) {
          for (let i = 0; i < column.length; i++) {
            if (column[i].trim() !== curArr[i].trim()) {
              return "【" + curArr[i] + "】" + "列标题不正确，应该为" + "【" + column[i] + "】";
            }
          }
        }
      } else {
        orderArr = new Array();
        for (let j = 0; j < curArr.length; j++) {
          let isHave = false;
          for (let i = 0; i < column.length; i++) {
            if (column[i] == curArr[j]) {
              isHave = true;
              orderArr[j] = i;
              break;
            }
          }
          if (!isHave) {
            return "在标准列标题中不存在列标题为" + "【" + curArr[j] + "】";
          }
        }
      }
    } else {
      let realArr = new Array();
      if (isOrder) {
        for (let i = 0; i < column.length; i++) {
          realArr[i] = curArr[i] ? curArr[i].trim() : "";
        }
      } else {
        if (orderArr) {
          for (let i = 0; i < orderArr.length; i++) {
            realArr[orderArr[i]] = curArr[i] ? curArr[i].trim() : "";
          }
        }
      }
      let errorMsg = ruleFun(rowNum + 1, column, realArr);
      if (errorMsg)
        return errorMsg;
    }
  }
  completeFun();
  return null;
};

/**
 * alertFun:错误信息
 * file:文件
 * columns:execl表头
 * ruleFun：验证
 * completeFun:最后完成方法
 * */
export const importExeclNew = (alertFun, file, columns, columnsNew, ruleFun, completeFun, isOrder = true) => {
  if (!file) {
    return;
  }
  let isBase64 = isIE();
  let reader = new FileReader();
  reader.onload = (e) => {
    let wb = null;//读取完成的数据
    let data = e.target.result;
    if (isBase64) {
      wb = XLSX.read(btoa(fixdata(data)), {//手动转化
        type: 'base64'
      });
    } else {
      wb = XLSX.read(data, {
        type: 'binary'
      });
    }

    let sheetValue = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]], {
      FS: '\t',
      RS: String.fromCharCode(29),
      blankrows: false
    });
    let errorMsg = handleImportExcelDataNew(sheetValue, columns, columnsNew, ruleFun, completeFun, isOrder);
    errorMsg ? alertFun(errorMsg) : null;
  };
  isBase64 ? reader.readAsArrayBuffer(file) : reader.readAsBinaryString(file);
};

/**
 * pasteData:需要导入的Excel数据
 * column:标准列
 * ruleFun:处理的逻辑方法，进行判断
 * isOrder:打乱表头顺序导入，还是不打乱。默认是按照标准列顺序（true）导入
 * completeFun:最后完成方法
 * */
const handleImportExcelDataNew = (pasteData, column, columnsNew, ruleFun, completeFun, isOrder) => {
  if (!pasteData)
    return "Excel中没有导入的数据";
  if (!column)
    return null;
  // pasteData= pasteData.substring(0,pasteData.lastIndexOf(String.fromCharCode(29)));
  let results = pasteData.split(String.fromCharCode(29));
  let columnCopy = [];//当表头为动态的情况下，column的0坐标为空
  if (!(results && results.length >= 2))
    return "Excel中没有导入的数据";
  let orderArr = null;
  for (let rowNum = 0; rowNum < results.length; rowNum++) {
    let result = results[rowNum];
    let curArr = result.split('\t');
    // if(Array.isArray(curArr)&&curArr.length){
    //   for(let i=0; i < curArr.length - 1; i++){
    //     if(curArr[i]!==''){
    //       curArr[i]=curArr[i].trim()
    //     }
    //   }
    // }
    if (rowNum === 0) {
      if (column.length === 1) {
        if (column[0] === "") {
          for (let dataItem of curArr) {
            columnCopy.push("");
          }
          column = columnCopy;
        }
      }
      if (columnsNew.length == curArr.length) {
        column = columnsNew;
      }
      let curArrNew = [];
      for (let m = 0; m < curArr.length; m++) {
        if (curArr[m] !== "") {
          curArrNew.push(curArr[m])
        }
      }
      curArr = curArrNew;
      if (column.length != curArr.length)
        return "导入列标题和标准的列标题不匹配";
      if (isOrder) {
        let length = 0;
        for (let i = 0; i < column.length; i++) {
          if (column[i].trim() === "") {
            length++;
          }
        }
        if (length != column.length) {
          for (let i = 0; i < column.length; i++) {
            if (column[i].trim() !== curArr[i].trim()) {
              return "【" + curArr[i] + "】" + "列标题不正确，应该为" + "【" + column[i] + "】";
            }
          }
        }
      } else {
        orderArr = new Array();
        for (let j = 0; j < curArr.length; j++) {
          let isHave = false;
          for (let i = 0; i < column.length; i++) {
            if (column[i] == curArr[j]) {
              isHave = true;
              orderArr[j] = i;
              break;
            }
          }
          if (!isHave) {
            return "在标准列标题中不存在列标题为" + "【" + curArr[j] + "】";
          }
        }
      }
    } else {
      let realArr = new Array();
      if (isOrder) {
        for (let i = 0; i < column.length; i++) {
          realArr[i] = curArr[i] ? curArr[i].trim() : "";
        }
      } else {
        if (orderArr) {
          console.log(isOrder);
          for (let i = 0; i < orderArr.length; i++) {
            realArr[orderArr[i]] = curArr[i] ? curArr[i].trim() : "";
          }
        }
      }
      console.log(rowNum+1);
      console.log(column);
      console.log(realArr);
      let errorMsg = ruleFun(rowNum + 1, column, realArr);
      if (errorMsg)
        return errorMsg;
    }
  }
  completeFun();
  return null;
};


/**
 * alertFun:错误信息
 * file:文件
 * columns:execl表头
 * ruleFun：验证
 * completeFun:最后完成方法
 * */
export const importExeclOld = (alertFun, file, columns, ruleFun, completeFun, isOrder = true) => {
  if (!file) {
    return;
  }
  let isBase64 = isIE();
  let reader = new FileReader();
  reader.onload = (e) => {
    let wb = null;//读取完成的数据
    let data = e.target.result;
    if (isBase64) {
      wb = XLSX.read(btoa(fixdata(data)), {//手动转化
        type: 'base64'
      });
    } else {
      wb = XLSX.read(data, {
        type: 'binary'
      });
    }
    let sheetValue = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]], {
      FS: '\t',
      RS: String.fromCharCode(29),
      blankrows: false
    });
    let errorMsg = handleImportExcelDataOld(sheetValue, columns, ruleFun, completeFun, isOrder);
    errorMsg ? alertFun(errorMsg) : null;
  };
  isBase64 ? reader.readAsArrayBuffer(file) : reader.readAsBinaryString(file);
};
/**
 * pasteData:需要导入的Excel数据
 * column:标准列
 * ruleFun:处理的逻辑方法，进行判断
 * isOrder:打乱表头顺序导入，还是不打乱。默认是按照标准列顺序（true）导入
 * completeFun:最后完成方法
 * */
const handleImportExcelDataOld = (pasteData, column, ruleFun, completeFun, isOrder) => {
  if (!pasteData)
    return "Excel中没有导入的数据";
  if (!column)
    return null;
  // pasteData= pasteData.substring(0,pasteData.lastIndexOf(String.fromCharCode(29)));
  let results = pasteData.split(String.fromCharCode(29));
  let columnCopy = [];//当表头为动态的情况下，column的0坐标为空
  if (!(results && results.length >= 2))
    return "Excel中没有导入的数据";
  let orderArr = null;
  for (let rowNum = 0; rowNum < results.length; rowNum++) {
    let result = results[rowNum];
    let curArr = result.split('\t');
    if (rowNum === 0) {
      if (column.length === 1) {
        if (column[0] === "") {
          for (let dataItem of curArr) {
            columnCopy.push("");
          }
          column = columnCopy;
        }
      }
      if (column.length != curArr.length)
        return "导入列标题和标准的列标题不匹配";
      if (isOrder) {
        let length = 0;
        for (let i = 0; i < column.length; i++) {
          if (column[i].trim() === "") {
            length++;
          }
        }
        if (length != column.length) {
          for (let i = 0; i < column.length; i++) {
            if (column[i].trim() !== curArr[i].trim()) {
              return "【" + curArr[i] + "】" + "列标题不正确，应该为" + "【" + column[i] + "】";
            }
          }
        }
      } else {
        orderArr = new Array();
        for (let j = 0; j < curArr.length; j++) {
          let isHave = false;
          for (let i = 0; i < column.length; i++) {
            if (column[i] == curArr[j]) {
              isHave = true;
              orderArr[j] = i;
              break;
            }
          }
          if (!isHave) {
            return "在标准列标题中不存在列标题为" + "【" + curArr[j] + "】";
          }
        }
      }
    } else {
      let realArr = new Array();
      if (isOrder) {
        for (let i = 0; i < column.length; i++) {
          realArr[i] = curArr[i] ? curArr[i].trim() : "";
        }
      } else {
        if (orderArr) {
          for (let i = 0; i < orderArr.length; i++) {
            realArr[orderArr[i]] = curArr[i] ? curArr[i].trim() : "";
          }
        }
      }
      let errorMsg = ruleFun(rowNum + 1, column, realArr);
      if (errorMsg)
        return errorMsg;
    }
  }
  completeFun();
  return null;
};


/**
 * datas:导出Excel数据源
 * fieldNames:要导出的字段
 * headTexts:表头
 * type:导出excel的格式
 * a:a标签
 * notificationFun:错误信息提示方法
 * */
export const exportExcelFileReference = (datas, fieldNames, headTexts, fileName, notificationFun) => {
  /*if(!(datas && datas.length>0)){
   return;
   }*/
  if (fieldNames == null || headTexts == null || fieldNames.length !== headTexts.length || headTexts.length == 0 || fieldNames.length == 0) {
    return notificationFun ? notificationFun("传参错误") : null;
  }
  let dataOrigin = [];
  dataOrigin.push(headTexts);
  for (let data of datas) {
    let obj = [];
    fieldNames.map((item, i) => {
      obj.push(data[fieldNames[i]])
    });
    dataOrigin.push(obj);
  }
  let sheetName = "Sheet1", ws = sheet_from_array_of_arrays(dataOrigin);
  let wb = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  wb.Sheets[sheetName] = ws;
  let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
  saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), fileName ? fileName + ".xlsx" : "default.xlsx");
};

export const datenum = (v, date1904) => {
  if (date1904) v += 1462;
  let epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
};

//字符串转字符流
export const s2ab = (s) => {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
};

export const sheet_from_array_of_arrays = (data, opts) => {
  let ws = {};
  let range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (let R = 0; R != data.length; ++R) {
    for (let C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = { v: data[R][C] };
      if (cell.v == null) continue;
      let cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      }
      else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
};

//下载文件
export const downLoadFile = (blob, filename) => {
  //主要是IE或者IE内核
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    let a = document.createElement('a');
    let url = window.URL || window.webkitURL;
    if (url) {
      a.href = url.createObjectURL(blob);
      a.download = filename;
      a.target = '_blank';
      let div = document.createElement('div');
      div.appendChild(a);
      document.body.appendChild(div);
      a.click();
      url.revokeObjectURL(url);
      document.body.removeChild(div);
      a = null;
      div = null;
    }
  }
};


export const downloadFileByBase64 = (base64, name) => {
  var myBlob = dataURLtoBlob(base64)
  var myUrl = URL.createObjectURL(myBlob)
  downloadNewFile(myUrl, name)
}

const dataURLtoBlob = (dataurl) => {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
const downloadNewFile = (url, name = 'What\'s the fuvk') => {
  var a = document.createElement("a")
  a.setAttribute("href", url)
  a.setAttribute("download", name)
  a.setAttribute("target", "_blank")
  let clickEvent = document.createEvent("MouseEvents");
  clickEvent.initEvent("click", true, true);
  a.dispatchEvent(clickEvent);
}
/*
 * 作者：伊同钢
 * 时间：2018.12.12
 * 内容：试题部分相关封装方法
 * */
//获取富文本图片样式
export const onGetUilSrcFilerName = (htmlDatas, uuid, suffix) => {
  /*所有img标签集合*/
  let imgArr = [];
  /*所有src属性集合*/
  let phoneSrc = [];
  /*导出数据的集合*/
  let datasArr = {};
  /*判断是否有“img”标签*/
  if (htmlDatas.indexOf("<img") != -1) {
    imgArr.push(htmlDatas.match(/<img[^>]*>/gi));
  } else {
    datasArr.itemText = htmlDatas;
    return datasArr;
  }

  /*验证是否存在img标签，存在区里面的src属性*/
  if (imgArr && imgArr.length > 0 && imgArr[0]) {
    let srcArr = [];
    /*内部存放所有src属性*/
    /*截取src属性*/
    imgArr[0].map((item, i) => {
      if (item.indexOf("src=\"data:image/png;base64") == -1) {
        if (item.indexOf("src=\"") != -1) {
          srcArr.push(item.match(/src="[^"]+/g));
        } else if (item.indexOf("src=\'") != -1) {
          srcArr.push(item.match(/src='[^']+/g));
        }
      }
    });
    /*验证src属性数组是否存在*/
    if (srcArr && srcArr.length > 0) {
      let imagesArr = [];
      srcArr.map((item, i) => {
        if (item && item.length > 0 && item[0]) {
          let arr1 = [];
          let newArr = {};
          arr1 = getURLFileName(item[0]).split(".");
          newArr[uuid] = arr1[0];
          newArr[suffix] = arr1[1];
          imagesArr.push(newArr);
          datasArr.itemImages = imagesArr;
          phoneSrc = item[0].split("/");
        }
      });
    }
    ;
    /*图片src属性保留图片名方法*/
    if (phoneSrc && phoneSrc.length > 1) {
      phoneSrc.pop();
      let phoneStr = phoneSrc.join("/") + "/";
      let reg = new RegExp(phoneStr, "g");
      let arr = htmlDatas.replace(reg, (datas) => {
        datas = "src=" + "\"";
        return datas;
      });
      datasArr.itemText = arr;
    }
    ;
    return datasArr;
  }
  ;
};

//获取富文本  以“/”拆分地址，并返回文件名
export const getURLFileName = (url) => {
  let arr = url.split("/");
  let name = arr[arr.length - 1];
  return name;
};

//将对象和数组对比，查找相同项，给数组中的对象值改变
export const gatherAssignment = (arr1, arr2, inquireKey, assignmentKey, value) => {
  if (arr1 && arr2) {
    for (let arr of arr1) {
      if (arr[inquireKey] == arr2[inquireKey]) {
        arr[assignmentKey] = value;
        return arr1;
      }
    }
  }
};

//比重表拼接数据
export const getFlatTo = (datas) => {
  let Arr = [];
  let mapKey = {};
  for (let data of datas) {
    if (data.hasOwnProperty("id") && data.hasOwnProperty("parentId")) {
      if (data.parentId === null || !mapKey.hasOwnProperty(data.parentId)) {
        data.level = 1;
        data.childrenLength = 0;
        Arr.push(data);
      } else {
        if (mapKey[data.parentId].children === null) {
          mapKey[data.parentId].children = [];
        }
        mapKey[data.parentId].children.push(data);
        data.level = mapKey[data.parentId].level + 1;
      }
      mapKey[data.id] = data;
    }
  }
  return Arr;
};

/**双语数据为动态拼接  arr为数组，动态数据例如:[datas.length,item.length]。content为语言包数据。动态数据为## 例如:此题为大小题，共##道小题，当前为第##小题 */
export const changeTextContent = (arr, content) => {
  let contentSplit = content.split("##");
  let textContent = "";
  for (let i = 0; i < contentSplit.length; i++) {
    if (arr[i] || arr[i] == 0) {
      textContent += contentSplit[i] + arr[i];
    } else {
      textContent += contentSplit[i];
    }
  }
  return textContent;
};

//将表格复选框集合“,”拼接。arr为数据源。type为需要拼接的参数如id，uuid等；
export const selectedAllRowsArr = (arr, type) => {
  let typeArr = [];
  for (let i = 0; i < arr.length; i++) {
    typeArr.push(arr[i][type])
  }
  console.log(typeArr);
  return typeArr.join(",");
}

/**
 * 检索二级/一级菜单的某项操作权限
 * @param type 检查的权限名
 * @returns {boolean} true 含有此权限 false 没有此权限
 */
export const retrievalAuth = (type) => {
  let menu = sessionStorage.getItem('selectItemData') ? JSON.parse(sessionStorage.getItem('selectItemData')) : []
  let selectKey = sessionStorage.getItem('selectedKeys') ? sessionStorage.getItem('selectedKeys') : ''
  if (menu.canAddChild) {
    // 二级
    let data = '';
    menu.menuDtoList.map((item) => {
      if (selectKey === item.code) {
        data = item
      }
    })
    return data.elementNames ? data.elementNames.indexOf(type) !== -1 : '';
  } else {
    // 一级
    return menu.elementNames ? menu.elementNames.indexOf(type) !== -1 : '';
  }
}

/**
 * 舍去保留两位小数
 * @param x
 * @returns {string|boolean}
 */
export const toDecimal2 = (x) => {
  let f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(x * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

/**
 * inArray
 * @param search
 * @param array
 * @returns {boolean}
 */
export const inArray = (search, array) => {
  for (let i in array) {
    if (array[i] == search) {
      return true;
    }
  }
  return false;
}

// 数据有效性Excel
// header ["heard1", "heard2", "heard3", "heard4"]
// rowsNum Number
// colAndList [{col:'E', list:'等级1,等级2,等级3'}]
// codeList ["code1","code2","code3","code4"]
export const effectivenessExcel = (list, header, rowsNum, colAndList, codeList, name, redArr, blueArr, notificationFun) => {

  if (!Array.isArray(header) || !Array.isArray(codeList) || !header.length || !codeList.length || header.length !== codeList.length) {
    return notificationFun("数据错误!")
  }

  let data = [];
  for (let i = 0; i < list.length; i++) {
    let arr = []
    codeList.map((item, index) => {
      arr.push(list[i].codeList[index])
    })
    data.push(arr);
  }
  console.log(data); //处理数据

  let workbook = new Workbook(); //创建工作簿
  let worksheet = workbook.addWorksheet(name); //添加工作表


  let headerRow = worksheet.addRow(header); //添加一行
  
  worksheet.getCell('A4').value = "说明";
  worksheet.getCell('A5').value = "1、导入时必须先删除说明信息后再导入。";
  worksheet.getCell('A6').value = "2、请勿修改、调整表头名字与字段顺序和单元数据类型。";
  worksheet.getCell('A7').value = "3、红色标记列为必填项。  ";
  worksheet.getCell('A8').value = "4、当证件类型填写居民身份证时，性别和出生日期可不填；当证件类型不是身份证时，性别和出生日期为必填项。";
  worksheet.getCell('A9').value = "5、当证书领取方式填写快递到付时，邮寄地址必填项。";
  worksheet.getCell('A10').value = "6、出生日期请按照YY-MM-DD的格式进行填报。例如：2019-10-01";
  
  worksheet.getCell('A4').font = {
    color: { argb: 'FFFF0000' },
  };
  worksheet.getCell('A5').font = {
    color: { argb: 'FFFF0000' },
  };
  worksheet.getCell('A6').font = {
    color: { argb: 'FFFF0000' },
  };
  worksheet.getCell('A7').font = {
    color: { argb: 'FFFF0000' },
  };
  worksheet.getCell('A8').font = {
    color: { argb: 'FF2f8acc' },
  };
  worksheet.getCell('A9').font = {
    color: { argb: 'FF2f8acc' },
  };
  worksheet.getCell('A10').font = {
    color: { argb: 'FFFF0000' },
  };


  headerRow.eachCell((cell, number) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' },
      bgColor: { argb: 'FFFFFFFF' }
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  })

  redArr.map((item)=>{
    // worksheet.getCell(item.col+'1').fill = {
    //   type: 'pattern',
    //   pattern:'solid',
    //   fgColor: { argb: 'FFFF0000' },
    //   bgColor: { argb: 'FFFF0000' }
    // };
    worksheet.getCell(item+'1').font = {
      color: { argb: 'FFFF0000' },
    };
  })

  blueArr.map((item)=>{
    worksheet.getCell(item+'1').font = {
      color: { argb: 'FF2f8acc' },
    };
  })

  // worksheet.getColumn(3).width = 30;//表格宽度

  if(Array.isArray(data)&&data.length>0){
    data.forEach(d => {
      let row = worksheet.addRow(d);
    });
  }

  if (rowsNum) {
    for (let index = 0; index < rowsNum; index++) {
      colAndList.map((item, i) => {
        worksheet.getCell(item.col + (+index + 2)).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${item.list}"`]
        };
      })
    }
  } else {
    list.forEach((element, index) => {
      colAndList.map((item, i) => {
        worksheet.getCell(item.col + (+index + 2)).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${item.list}"`]
        };
      })
    })
  }
  console.log(worksheet);
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${name}.xlsx`);
  })
}
