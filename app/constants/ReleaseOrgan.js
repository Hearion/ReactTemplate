//打包的一些参数设置  目前只能一个为true
const service = 'gyh'; // 观音湖观空间(true)  其余为fasle

const serviceInfo = {
    gyh: {
        title: '慧明慧行',
        ico: 'favicon.ico'
    }
}


//如果在发布版本的时候，需要对访问的连接加url的层级，可以修改rootPath(如：/a/)
// const rootPath = "/manage/"; //其他
const rootPath = "/";//本地

const getFirmName = () => {
    return serviceInfo[service].title
}
const getDocumentTitle = () => {
    return serviceInfo[service].title
};

const getFaviconIco = () => {
    return serviceInfo[service].ico
};

module.exports = {
    service,
    rootPath: rootPath,
    getFirmName: getFirmName,
    getDocumentTitle: getDocumentTitle,
    getFaviconIco: getFaviconIco,
};