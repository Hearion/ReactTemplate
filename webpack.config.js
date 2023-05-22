var webpack = require('webpack');
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, './app');
var os = require('os');

var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝文件
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
}); //根据电脑的CPU的核数修改
var releaseOrgan = require('./app/constants/ReleaseOrgan');

var rootUrlPort = 8899;
var rootUrl = 'http://127.0.0.1:' + rootUrlPort + releaseOrgan.rootPath;

var jsRoot = "js";
var cssRoot = "css";
var imgRoot = "img";
var imgSize = 200; //图片大小200kb

module.exports = {
    devServer: {
        historyApiFallback: true,
        compress: true,
        hot: true,
        inline: true,
        host: "0.0.0.0",
        port: rootUrlPort
    },
    devtool: "cheap-module-eval-source-map", //在控制台的sources下，点开可以看到webpack://目录，里面可以直接看到我们开发态的源代码，这样方便我们直接在浏览器中打断点调试
    entry: {
        app: path.resolve(APP_PATH, 'index')
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: jsRoot + '/[name].js',
        publicPath: '/' //主要是CSS样式中使用了url的方式去访问图片路径，所以需要配置。（只是调试需要使用）
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [{
                loader: 'HappyPack/loader?id=happyPackId'
            }],
        },
            {
                test: /\.css$/,
                exclude: /^node_modules$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                // scss文件处理
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // css中的图片路径增加前缀
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=' + imgSize + '&name=' + imgRoot + '/[name].[ext]',
                options: {esModule: false}
            },
            {
                // css中svg文件处理
                test: /\.svg$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        // 保留原文件名和后缀名
                        name: '[name].[ext]',
                        // 输出到dist/fonts/目录
                        outputPath: 'images',
                    }
                }
            },
        ]
    },

    resolve: {
        extensions: ['.mjs', '.js', '.json', '.jsx', '.ts', '.tsx']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: cssRoot + "/[hash:8].css",
        }),
        new HappyPack({
            id: 'happyPackId',
            cache: true,
            threadPool: happyThreadPool,
            loaders: [{
                path: 'babel-loader',
                query: {
                    cacheDirectory: '.happypack_cache'
                }
            }]
        }),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: './app/dist/fonts',
                        to: 'dist/fonts',
                    },
                    {
                        from: './app/dist/js',
                        to: 'dist/js',
                    },
                    {
                        from: "./app/file",
                        to: "file",
                    }
                ]
            }),
        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: 'index.html', //生成的html存放路径，相对于 path
            template: APP_PATH + '/index.html', //html模板路径
            favicon: './app/' + releaseOrgan.getFaviconIco(),
            inject: true, // 自动注入
            hash: false,
            //为静态资源生成hash值
            minify: {
                minifyJS: true,
                removeComments: true, //去注释
                removeCommentsFromCDATA: true,
                collapseWhitespace: true, //压缩空格
                removeAttributeQuotes: false, //去除属性引号
                removeRedundantAttributes: true,
                removeEmptyAttributes: true
            }
        }),
        new OpenBrowserPlugin({
            url: rootUrl
        }),
    ]
};
