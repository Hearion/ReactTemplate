"use strict";

//Date中不提供这种格式化的内容，已经修改。或者替换之前的。
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(let k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

//windowURL
(() => {
    let _createObjectURL = window.URL.createObjectURL;
    Object.defineProperty(window.URL, 'createObjectURL', {
        set: (value) => {
            _createObjectURL = value;
        },
        get: () => {
            return _createObjectURL;
        }
    })
})();
(() => {
    let _revokeObjectURL = window.URL.revokeObjectURL;
    Object.defineProperty(window.URL, 'revokeObjectURL', {
        set: (value) => {
            _revokeObjectURL = value;
        },
        get: () => {
            return _revokeObjectURL;
        }
    })
})();
(() => {
    let _URL = window.URL;
    Object.defineProperty(window, 'URL', {
        set: (value) => {
            _URL = value;
        },
        get: () => {
            return _URL;
        }
    })
})();

Map