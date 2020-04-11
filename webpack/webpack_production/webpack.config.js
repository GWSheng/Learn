const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

// 设置node 的环境变量
process.env.NODE_ENV = "development";	// 这个变量的意思： postcss 会以 package.json 中browsewslist 中的要求进行css兼容性处理
// process.env.NODE_ENV = "production"; // 这个变量的默认值是 production

module.exports = {
	entry:"./src/js/index.js",
	output:{
		filename:"js/built.js",
		path:resolve(__dirname,"build")
	},
	module:{
		rules:[
			{
				test:/\.css$/,
				//use:["style-loader","css-loader"]		// 开发环境配置的处理css文件的loader
				use:[
					MiniCssExtractPlugin.loader,		//从built.js提取css到单独的css文件需要的loader 配置
					"css-loader",						// 直接写字符串，就会使用该 loader 的默认配置
					{
						loader:"postcss-loader",    	// css 兼容性处理使用到 postcss-loader 和 postcss-preset-env
						options:{						// postcss 会去package.json中查找browserslist ，通过其配置设置响应的css样式
							ident:"postcss",
							plugins:()=>[
								// postcss 插件
								require("postcss-preset-env")()
							]
						}
					}
				] 
			},
			{
				test:/\.less$/,
				use:[
					MiniCssExtractPlugin.loader,
					"css-loader",
					{								// 此处注意postcss-loader的位置，需要在less-loader处理之后，在css-loader之前
						loader:"postcss-loader",  
						options:{						
							ident:"postcss",
							plugins:()=>[
								require("postcss-preset-env")()
							]
						}
					},
					"less-loader"
				]
			},
			{			// 使用eslint-loader 检查js 文件中的语法错误，注意需要排除第三方库的js 文件，不检查第三方库
						// 使用airbnb 提供的语法标准， 在packsge.json 文件中配置eslintConfig
						// 需要 eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import 四个库
						// 如果不想对某行的js 语句进行eslint 语法检查，可以在那条语句上方下一个注释如下：
						// eslint-disable-next-line
						// console.log(add(1, 2));
						// 正常来讲一个文件只能被一个loader处理，如果要被多个loader处理，一定要执行loader的顺序
						// js 文件需要先被eslint-loader 处理，然后在被babel-loader处理，不然会报很多语法错误
						// 例如：babel 将const处理成var ,但是eslint 中不支持用var 声明变量
				test:/\.js$/,
				exclude:/node_modules/,
				enforce:"pre",		// 这个属性的作用是最先执行这个loader
				loader:"eslint-loader",
				options:{
					fix:true	// 自动修复语法错误
				}
			},
			{
		        test: /\.js$/,	// @babel/core @babel/polyfill @babel/preset-env babel babel-loader core-js 需要这几个包
		        				// @babel/preset-env负责转换基础的语法， 例如promise 等高级语法无法转换
		        				// @babel/polyfill 的使用：在入口文件中引入即可，但是@babel/polyfill会将所有需要兼容的js语法
		        				// 进行转化，不管程序中是否用到了， 最后打包生成的文件体积很大（不建议使用这种方式）
		        				// core-js 可以按需加载，指定需要兼容到的浏览器版本，对程序中需要兼容的js语法进行转化
		        				// 推荐使用： @babel/preset-env core-js  这两个结合使用
		        exclude: /node_modules/,
		        loader: 'babel-loader',		
		        options: {
		          // 预设：指示babel做怎么样的兼容性处理
		          presets: [	// presets 数组里面一定要在放一个数组，不然'@babel/preset-env'不生效
		            [
		              '@babel/preset-env',
		              {
		                // 按需加载
		                useBuiltIns: 'usage',
		                // 指定core-js版本
		                corejs: {
		                  version: 3
		                },
		                // 指定兼容性做到哪个版本浏览器
		                targets: {
		                  chrome: '60',
		                  firefox: '60',
		                  ie: '9',
		                  safari: '10',
		                  edge: '17'
		                }
		              }
		            ]
		          ]
		        }
      		},
      		{
      			test:/\.(jpg|png|gif)$/,
      			loader:"url-loader",
      			options:{
      				limit:8*1024,
      				name:"[hash:10].[ext]",
      				outputPath:"imgs",
      				esModule:false
      			}
      		},
      		{
      			test:/\.html$/,
      			loader:"html-loader"
      		},
      		{
      			exclude:/\.(js|css|less|html|jpg|png|gif)$/,
      			loader:"file-loader",
      			options:{
      				outputPath:"other"
      			}
      		}
		]
	},
	plugins:[
		new HtmlWebpackPlugin({
			template:"./src/html/index.html",
			minify:{		// 压缩 html 代码
				collapseWhitespace:true,	// 移除html 中的空格
				removeComments:true			// 移除html 中的注释
			}	
		}),
		new MiniCssExtractPlugin({
			filename:"css/built.css"	// 指定提取出来的css文件的路径和名称
		}),
		new OptimizeCssAssetsWebpackPlugin()	// 压缩 css 文件
	],
	mode:"production"
	// mode:"production" // 压缩js 代码 ，设置成生产模式，打包时就会自动压缩js 代码
}