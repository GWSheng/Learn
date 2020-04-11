const { resolve }  = require("path"); // path 模块中拼接路径的方法，类似于 path.join()
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry:"./src/index.js", //入口文件
	output:{                //输出文件位置配置
		filename:"built.js",
		path: resolve(__dirname,"build")
	},  
	// 配置各种loader 
	// 需要先下载对应的 loader，然后在 module 中配置即可
	module:{
		rules:[
			// 不同的文件格式需要配置不同的loader
			{	//配置解析 css 文件的 loader, use 数组中的 loader 按照从右往左，从下往上的顺序进行解析
				// css-loader 负责将 css 文件变成commonjs模块加载到js文件中，内容是样式字符换
				// style-loader 在 head 中创建 style 标签，负责将js中的样式资源写入到 style 标签中
				test:/\.css$/,
				use:["style-loader","css-loader"]
			},
			{	//配置解析 less 文件的loader
				// less-loader 负责将 less 文件编译成 css 文件，不仅需要下载 less-loader，还需要下载 less
				test:/\.less$/,
				use:["style-loader","css-loader","less-loader"]
			},
			{
				// 配置解析css 文件中图片 url 的loader，url-loader ， 需要配合 file-loader 使用，url-loader 无法解析img标签中的 url
				test:/\.(png|jpg|gif)$/,  	// 处理各种后缀的图片
				loader:"url-loader",		// 如果只使用一个 loader ,就单独使用 loader 属性，如果有多个就用 use 数组属性
				options:{
					limit: 8*1024,			// 图片小于8kb（根据开发者设定），webpack 会将其处理成base64格式，减少hhtp请求次数，
											// 降低服务器压力，但是图片体积会变大
					esModule:false,			// url-loader 默认使用的es6模块解析，但是html-loader引入的图片是commonjs规范
											// 需要关闭url-loader 的 es6模块化，使用commonjs 规范进行解析
					name:"[hash:10].[ext]",	// 打包后的图片名称为 图片的hash值加后缀， 图片的hash值太长，可以设置截取hash值得长度
					outputPath:"imgs"		// 将所有的图片打包输出到 build 的 imgs 文件夹中， 设置了图片资源的输出路径
				}
			},
			{
				// 配置解析html文档中img标签src路径的loader，html-loader
				// html-loader 负责引入img ， 从而能够被url-loader 进行处理(html-loader引入的图片是commonjs规范)
				test:/\.html$/,
				loader:"html-loader"
			},
			{
				// 配置打包其他资源的loader，file-loader(不对资源进行压缩和解析，原样将资源文件打包)
				test:/\.(eot|svg|ttf|woff|woff2)$/,					// 可以使用test属性指定需要打包资源的后缀名
				//exclude:/\.(json|js|css|less|html|png|jpg|gif)$/,	// 可以使用exclude属性排除已经处理的资源，然后将剩余的资源统一打包
				loader:"file-loader",
				options:{
					name:"[hash:10].[ext]",
					outputPath:"other"		// 将所有的其他资源（字体文件等）打包输出到 build 的 other 文件夹中，设置了其他资源的输出路径
				}
			}
		]
	},
	// 配置 webpack 的插件
	// 下载对应的插件之后，需要先引入（require）, 然后再plugins 中调用
	plugins:[
		// html-webpack-plugin 插件的作用
		// 功能： 创建一个空的 html 文件，自动引入被打包的所有资源（包括js/css等）（注意：创建出来的 html 文件没有 html 结构）
		new HtmlWebpackPlugin({
			// 配置对象 template 作用： 以指定的 html 文件为模板复制一份 html 文件，并自动引入所有被打包的资源（这样就有 html 结构了） 
			template:"./src/index.html"
		})
	],

	// 设置 webpack 的运行模式
	mode:"development", // 开发模式
	// mode:"production" // 生产模式

	// 开发服务器devServer:自动化打包资源（自动编译,自动打开浏览器，自动刷新浏览器）
	// 特点：只会在内存中编译打包，不会输出任何资源，传统的 webpack 打包输出的资源会输出到指定的文件夹
	// 注意: 如果只是本地安装了 webpack-dev-server ,需要使用 npx webpack-dev-server命令启动
	devServer:{
		contentBase:resolve(__dirname,"build"),		// 指定项目构建后的路径
		compress:true,								// 打包时启用gzip压缩
		port:3000,									// 指定devServer 服务器的端口号
		open:true									// 打包后自动打开电脑默认浏览器
	}
}