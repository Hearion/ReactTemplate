var webpack = require('webpack');
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝文件
var os = require('os');
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
}); //根据电脑的CPU的核数修改
var releaseOrgan = require('./app/constants/ReleaseOrgan');
var jsRoot = "js";
var cssRoot = "css";
var imgRoot = "img";
var imgSize = 200; //图片大小500kb
module.exports = {
    entry: {
        app: path.resolve(APP_PATH, 'index')
    },
    output: {
        path: BUILD_PATH,
        filename: jsRoot + '/[hash:8].js',
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
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    enforce: true,
                    chunks: 'all'
                },
            },
        },
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false,
                    compress: {
                        // 删除所有的 `console` 语句，可以兼容ie浏览器
                        drop_console: true,
                        // 内嵌定义了但是只用到一次的变量
                        collapse_vars: true,
                        // 提取出出现多次但是没有定义成变量去引用的静态值
                        reduce_vars: true,
                        drop_debugger: true,
                    },
                    mangle: true,
                    output: {
                        // 最紧凑的输出
                        beautify: false,
                        // 删除所有的注释
                        comments: false,
                    }
                },
                parallel: true,
                cache: true,
            }),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.optimize\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {safe: true, discardComments: {removeAll: true}},
                canPrint: false
            })
        ],
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
        //在 plugin 中添加
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            filename: 'index.html', //生成的html存放路径，相对于 path
            template: './app/index.html', //html模板路径
            favicon: releaseOrgan.isWk ? '' : './app/' + releaseOrgan.getFaviconIco(),
            inject: true, // 自动注入
            hash: false,    //为静态资源生成hash值
            minify: {
                minifyJS: true,
                removeComments: true,        //去注释
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,    //压缩空格
                removeAttributeQuotes: false,  //去除属性引号
                removeRedundantAttributes: true,
                removeEmptyAttributes: true
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './app/dist/fonts',
                    to: 'dist/fonts',
                },
                {from: './app/dist/js', to: 'dist/js'},
                {from: './app/dist/fonts', to: 'dist/fonts'},
                {
                    from: "./app/file",
                    to: "file",
                }
            ],
        }),
        // 配置环境变量到Production，防止控制台警告
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
};
