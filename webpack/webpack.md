# WebPackage

### webpack 简介

- webpack 在未配置的情况下只能解析 js 和 json 文件 ，不能处理css,img等其他资源
- mode=production 生产模式比 mode=development 开发模式多了js文件压缩功能

### 开发环境基本配置

- ```javascript
  const { resolve }  = require("path"); // path 模块中拼接路径的方法，类似于 path.join()
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  
  module.exports = {
  	entry:"./src/index.js", //入口文件
  	output:{                //输出文件位置配置
  		filename:"built.js", // filename:"js/built.js", 指定js 要输出到的文件夹
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
  				// less-loader 负责将 less 文件编译成 css 文件，不仅需要下载 less-loader，还需要下载 					less
  				test:/\.less$/,
  				use:["style-loader","css-loader","less-loader"]
  			},
  			{
  				// 配置解析css 文件中图片 url 的loader，url-loader ， 需要配合 file-loader 使用，						url-loader 无法解析img标签中的 url
  				test:/\.(png|jpg|gif)$/,  	// 处理各种后缀的图片
  				loader:"url-loader",		// 如果只使用一个 loader ,就单独使用 loader 属性，如果												有多个就用 use 数组属性
  				options:{
  					limit: 8*1024,			// 图片小于8kb（根据开发者设定），webpack 会将其处理成												base64格式，减少hhtp请求次数，
  											// 降低服务器压力，但是图片体积会变大
  					esModule:false,			// url-loader 默认使用的es6模块解析，但是html-loader引												入的图片是commonjs规范
  											// 需要关闭url-loader 的 es6模块化，使用commonjs 规													范进行解析
  					name:"[hash:10].[ext]",	// 打包后的图片名称为 图片的hash值加后缀， 图片的hash值太												长，可以设置截取hash值得长度
  					outputPath:"imgs"		// 将所有的图片打包输出到 build 的 imgs 文件夹中， 设置												了图片资源的输出路径
  				}
  			},
  			{
  				// 配置解析html文档中img标签src路径的loader，html-loader
  				// html-loader 负责引入img ， 从而能够被url-loader 进行处理(html-loader引入的图片是						commonjs规范)
  				test:/\.html$/,
  				loader:"html-loader"
  			},
  			{
  				// 配置打包其他资源的loader，file-loader(不对资源进行压缩和解析，原样将资源文件打包)
  				test:/\.(eot|svg|ttf|woff|woff2)$/,					// 可以使用test属性指定需要打																		包资源的后缀名
  				//exclude:/\.(json|js|css|less|html|png|jpg|gif)$/,	// 可以使用exclude属性排除已经													处理的资源，然后将剩余的资源统一打包
  				loader:"file-loader",
  				options:{
  					name:"[hash:10].[ext]",
  					outputPath:"other"		// 将所有的其他资源（字体文件等）打包输出到 build 的 												other 文件夹中，设置了其他资源的输出路径
  				}
  			}
  		]
  	},
  	// 配置 webpack 的插件
  	// 下载对应的插件之后，需要先引入（require）, 然后再plugins 中调用
  	plugins:[
  		// html-webpack-plugin 插件的作用
  		// 功能： 创建一个空的 html 文件，自动引入被打包的所有资源（包括js/css等）（注意：创建出来的 				html 文件没有 html 结构）
  		new HtmlWebpackPlugin({
  			// 配置对象 template 作用： 以指定的 html 文件为模板复制一份 html 文件，并自动引入所					有被打包的资源（这样就有 html 结构了） 
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
  ```

### 生产环境基本配置

```javascript
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

// 设置node 的环境变量
process.env.NODE_ENV = "development";	// 这个变量的意思： postcss 会以 package.json 中browsewslist 中											的要求进行css兼容性处理
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
					MiniCssExtractPlugin.loader,		//从built.js提取css到单独的css文件需要的															loader 配置
					"css-loader",						// 直接写字符串，就会使用该 loader 的默认配置
					{
						loader:"postcss-loader",    	// css 兼容性处理使用到 postcss-loader 和 															postcss-preset-env
						options:{						// postcss 会去package.json中查找																browserslist ，通过其配置设置响应的css样式
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
					{								// 此处注意postcss-loader的位置，需要在less-														loader处理之后，在css-loader之前
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
			{			// 使用eslint-loader 检查js 文件中的语法错误，注意需要排除第三方库的js 文件，不检							查第三方库
						// 使用airbnb 提供的语法标准， 在packsge.json 文件中配置eslintConfig
						// 需要 eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import 								四个库
						// 如果不想对某行的js 语句进行eslint 语法检查，可以在那条语句上方下一个注释如下：
						// eslint-disable-next-line
						// console.log(add(1, 2));
						// 正常来讲一个文件只能被一个loader处理，如果要被多个loader处理，一定要执行loader								的顺序
						// js 文件需要先被eslint-loader 处理，然后在被babel-loader处理，不然会报很多语法							错误
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
		        test: /\.js$/,	// @babel/core @babel/polyfill @babel/preset-env babel babel-loader 									core-js 需要这几个包
		        				// @babel/preset-env负责转换基础的语法， 例如promise 等高级语法无法转换
		        				// @babel/polyfill 的使用：在入口文件中引入即可，但是@babel/polyfill会									将所有需要兼容的js语法
		        				// 进行转化，不管程序中是否用到了， 最后打包生成的文件体积很大（不建议使用										这种方式）
		        				// core-js 可以按需加载，指定需要兼容到的浏览器版本，对程序中需要兼容的js										语法进行转化
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
```

###  开发环境和生产环境loader和插件汇总

- 打包样式资源（css文件）

  + 开发环境：style-loader  css-loader 
    + style-loader 负责将打包后js文件中的css样式提取出来，放到style标签中，并插入到html的head标签中
    + css-loader 负责将css 文件打包进js 文件中

  + 生产环境：mini-css-extract-plugin css-loader
    + mini-css-extract-plugin代替开发环境中的style-loader，将js文件中的样式资源提取到单独的css文件中

- 打包less 文件

  + 开发环境：style-loader  css-loader less-loader less
    + less-loader 负责将less样式资源转换成css样式资源

  + 生产环境：mini-css-extract-plugin css-loader less-loader

- 打包html资源
  + html-webpack-plugin

+ 打包图片资源
  + url-loader file-loader html-loader
  + url-loader 的使用需要以file-loader为基础，url-loader 处理css文件中的url资源
  + html-loader 处理html 文件中的img 标签的url

- 打包其他资源
  + file-loader 
  + file-loader不对资源进行解析和压缩等处理，直接将其打包进js文件（主要处理字体文件等）

- devServer
  + webpack-dev-server
  + 开发服务器devServer:自动化打包资源（自动编译,自动打开浏览器，自动刷新浏览器）

- 提取CSS为单独的文件
  + mini-css-extract-plugin
  + 将打包进js文件中的css样式提取到单独的css文件中

- css 兼容性处理
  + postcss-loader postcss-preset-env
  + postcss 会去package.json中查找browserslist ，通过其配置设置响应的css样式

- 压缩css
  + optimize-css-assets-webpack-plugin
  + 压缩CSS文件

- js语法检查
  + eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import
  + 使用airbnb 提供的语法标准， 在packsge.json 文件中配置eslintConfig

- js语法兼容性处理
  + @babel/core @babel/polyfill @babel/preset-env babel babel-loader core-js
  + babel  @babel/core 这两个包是基础包
  + @babel/preset-env 兼容js 基础语法
  + @babel/polyfill 全部需要兼容的语法都打包（不建议使用）
  + core-js 按需进行兼容性处理

- 压缩 html 和 js
  + 将 mode 设置成 production ， 就会自动进行 js 压缩
  + 设置 html-webpack-plugin 的minify 属性进行 html 文件的压缩

### webpack 性能优化

#### 优化方法介绍

##### HMR(模块热更新)（属于构建速度优化）

+ HMR的开启方式非常简单，在devServer配置对象中添加一个hot属性，设置为true即可，如下代码所示：

+ ```javascript
  devServer: {
      contentBase: resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
      open: true,
      // 开启HMR功能
      // 当修改了webpack配置，新配置要想生效，必须重新webpack服务
      hot: true
    }
  ```

+ HMR 的作用：webpack 会将html、js、css、图片等各种资源(每种资源可能包含众多模块)打包到一个js 文件中，**HMR可以实现一个模块发生变化，只会重新打包这一个模块，而不是将所有的模块重新打包**，极大的提升了构建的速度

+ 不同文件对HMR功能的支持

  * 样式文件：可以使用HMR功能，因为style-loader内部实现了，所以开发时处理样式资源需要使用style-loader包

  * js 文件：默认不能使用HMR功能，需要修改 js 代码，添加支持HMR功能的代码。**HMR功能只能处理非入口文件的其他js文件**，具体代码如下（在入口js文件中添加）：

    ```javascript
    // 引入
    import print from './print';
    console.log("hahaha");
    if (module.hot) {
      // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
      module.hot.accept('./print.js', function() {
        // 方法会监听 print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建。
        // 会执行后面的回调函数
        print();//想使用print.js中模块完成的功能，再一次调用
      });
    }
    ```

  * html文件：默认不能使用HMR功能，**html文件不需要HMR功能（可能是单页面应用，只有一个html）**，并且开启 hot:true 后，html文件无法通过devServer实现自动更新了，解决方法如下：

    ```javascript
    entry: ['./src/js/index.js', './src/index.html'], // 修改entry 入口文件，将html文件添加上去 
    ```

##### source-map (调试优化)

+ source-map 是一种对调试进行优化的手段，开发环境和生产环境根据需求不同，采用的参数不同(不同的参数可以互相组合，以达到想要的效果)

+ source-map 是一种提供**源代码到构建后代码的映射技术**，这样当网页运行出现错误时，可以根据构建后代码的错误位置定位到源代码的错误位置

+ source-map  开启方式如下：

  ```javascript
  devtool: 'source-map' //在webpack.config.js中添加一个属性值devtool（和entry...并列）
  
  mode: 'development',
  devServer: {
     contentBase: resolve(__dirname, 'build'),
     compress: true,
     port: 3000,
     open: true,
     hot: true
   },
  devtool: 'source-map'
  ```

  

- source-map 参数介绍

  * source-map

    ```javascript
    devtool: 'source-map' // 会单独生成一个map文件，提示错误代码准确信息和源代码的错误位置
    ```

  * inline-source-map

    ```javascript
    devtool: 'inline-source-map' // 在构建的js文件下方生成map信息，提示错误代码准确信息和源代码的错误位置
    ```

  * hidden-source-map

    ```javascript
    devtool: 'hidden-source-map' // 会单独生成一个map文件，提示构建代码错误信息和位置，但是无法追踪源代码的错误位置
    ```

  * eval-source-map

    ```javascript
    devtool: 'eval-source-map' // 内联：会在构建js文件中的每一个eval函数后面生成对应的map信息，提示错误代码准确信息和源代码的错误位置
    ```

  * nosources-source-map

    ```javascript
    devtool: 'nosources-source-map' // 会单独生成一个map文件,提示构建代码错误信息和位置，但是无法追踪源代码的错误位置，源代码全部隐藏
    ```

  * cheap-source-map

    ```javascript
    devtool: 'cheap-source-map' // 会单独生成一个map文件,提示构建代码错误信息和位置和源代码的错误位置，但是只能定位到行，无法定位列
    ```

  * cheap-module-source-map

    ```javascript
    devtool: 'cheap-module-source-map' // 会单独生成一个map文件,提示构建代码错误信息和位置和源代码的错误位置，但是只能定位到行，无法定位列;相对于cheap-source-map，会将各种loader的map信息也加入到生成的map文件中
    ```

- 内联map 和外部map

  - 内联map构建速度更块

- 开发环境参数选择

  - 速度快（eval>inline>cheap>...）
  - 调试友好（source-map>cheap-module-source-map>cheap-source-map）
  - 最终选择：
    - eval-source-map  / eval-cheap-module-source-map

- 生产环境参数选择

  - 源代码要不要隐藏，调试要不要更友好？
  - 内联会让构建代码体积变大，所以生产环境不用内联

- 最终选择：

  * source-map  / cheap-module-source-map

##### oneOf （优化loader处理流程）

+ module rules里面有处理不同文件的多个loader，当webpack处理一个文件的时候，会对这个文件把所有的loader都匹配一遍，十分浪费性能

+ oneOf 就是帮助webpack ，当某个文件被某个loader处理后，就不能在匹配其他loader，也就不能在被其他loader处理

+ oneOf 虽然提搞了匹配的效率，但是也会带来一些问题，比如我们需要对js文件进行 js 语法检查和js 兼容性处理，所以js 文件需要匹配多个loader,被多个loader进行处理，但oneOf无法实现， 所以需要将其中一个loader提取出来，书写方式如下：

  ```javascript
    module: {
      rules: [
        {
          // 在package.json中eslintConfig --> airbnb
          test: /\.js$/,
          exclude: /node_modules/,
          // 优先执行
          enforce: 'pre',
          loader: 'eslint-loader',
          options: {
            fix: true
          }
        },
        {
          // 以下loader只会匹配一个
          // 注意：不能有两个配置处理同一种类型文件
          oneOf: [
            {
              test: /\.css$/,
              use: [...commonCssLoader]
            },
            {
              test: /\.less$/,
              use: [...commonCssLoader, 'less-loader']
            },
  
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'usage',
                      corejs: {version: 3},
                      targets: {
                        chrome: '60',
                        firefox: '50'
                      }
                    }
                  ]
                ]
              }
            },
            {
              test: /\.(jpg|png|gif)/,
              loader: 'url-loader',
              options: {
                limit: 8 * 1024,
                name: '[hash:10].[ext]',
                outputPath: 'imgs',
                esModule: false
              }
            },
            {
              test: /\.html$/,
              loader: 'html-loader'
            },
            {
              exclude: /\.(js|css|less|html|jpg|png|gif)/,
              loader: 'file-loader',
              options: {
                outputPath: 'media'
              }
            }
          ]
        }
      ]
    }
  ```

##### 缓存

- 此处的缓存处理有两种，一种是开启 babel 缓存，另一种是文件缓存

- babel 缓存（提升构建速度）

  - babel 缓存的目的是让第二次打包构建的速度更块，babel 对所有js 模块进行兼容性处理之后，对这些兼容性处理的内容进行缓存，当某个js 模块发生变动后，babel 只需要对这个发生变化的js 模块重新进行兼容性处理，而其他的js 模块使用之前处理好的缓存，这样会提高构建打包的速度
  - babel 缓存的开启方法如下代码所示：

  ```javascript
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
       presets: [],
       // 开启babel缓存
       // 第二次构建时，会读取之前的缓存
       cacheDirectory: true
   }
  }
  ```

- 文件缓存（提升上线运行速度）

  + 文件缓存开启后，当网页再次请求相同的文件名的文件时，就会使用缓存的文件，而不是重新向服务器发起请求

  + 开启文件缓存之后带来的一个问题，当文件发生变化后，浏览器不在重新发起请求，而是使用旧的缓存文件。解决这个问题的方法就是给文件添加一个版本号，当文件内容发生变化后，通过版本号的改变从而改变了文件的名称，这样浏览器就会发新的请求，使用修改后得文件内容

  + 以node 服务器为例，开启文件缓存的代码如下：

    ```javascript
    // server.js 服务器文件代码
    const express = require('express');
    const app = express();
    // express.static向外暴露静态资源
    // maxAge 资源缓存的最大时间，单位ms
    app.use(express.static('build', { maxAge: 1000 * 3600 }));// 将构建后的文件夹里面的资源进行缓存
    app.listen(3000);
    ```

  + 如何更改文件的版本号呢？

    ```javascript
    // hash 值：[hash] 每次webpack构建时会生成一个唯一的hash值
    // 问题：因为js 和 css文件以及其他资源使用的是同一个hash值，所以如果重新打包，会导致所有的缓存失效，都会重新请求，但是可能只修改了js文件，css文件没有修改，css文件继续使用缓存才是合理的
    // chunkhash:[chunkhash] 根据chunk生成的hash值，如果打包来源于同一个chunk,那么hash值就一样
    // 问题： js和css文件的hash值还是一样的，因为css是在js入口文件中引入的，属于同一个chunk
    // contenthash：[contenthash] 根据文件的内容生成的hash值，不同文件的hash值一定不一样。
    // 使用contenthash 值是最佳的使用方案，具体使用代码如下所示：
    // 给构建后的js文件添加版本号：
    output: {
        filename: 'js/built.[contenthash:10].js',
        path: resolve(__dirname, 'build')
      },
    // 给从js中分离出来的css文件添加版本号：
    new MiniCssExtractPlugin({
          filename: 'css/built.[contenthash:10].css'
        })  
    ```

##### tree shaking

- tree shaking 的作用就是去除无用的代码，引入的第三方包以及自己编写的js文件，其中没有被使用到的代码将会被去除(构建后的js文件中不包含上述没有用到的代码)
- 如何开启tree shaking
  + 如果是js 文件，则必须使用es6模块化语法
  + 开启mode:'production' （生产环境默认使用了uglyify插件）

- tree shaking 会减少代码体积，加快请求和加载的速度

- ```json
  // 在package.json 中配置 sideEffects 属性
  "sideEffects": false  // 会对所有代码进行 tree shaking,有可能会把 css/@babel/polyfill 等没有用到的文件去除掉
  "sideEffects": [
      "*.css","*.less"
    ]
  // 可以通过设置sideEffects 来指定哪些后缀的文件不进行tree shaking...
  ```

##### code split

- code split 代码分割，传统的webpack 打包方式会将所有的资源文件打包进一个js 文件，通过code split 可以将源代码中不同的js文件打包到不同的js 文件。

- 这样打包构建生成多个js 文件， 就可以并行加载，提高网页访问速度

- code split 实现代码分割以下三个方式：

  + 第一种方式：

    ```javascript
    module.exports = {
      // 单入口 这样打包构建完之后只生成一个js 文件
      // entry: './src/js/index.js',
      entry: {
        // 多入口：有几个入口文件最终就会输出几个打包好的js 文件，输出js文件的名称需要重新指定
        index: './src/js/index.js',
        test: './src/js/test.js'
      },
      output: {
        // [name]：取文件名 name的值为entry对象中的键名
        filename: 'js/[name].[contenthash:10].js',
        path: resolve(__dirname, 'build')
      },
      plugins: [],
      mode: 'production'
    };
    ```

  + 第二种方式：

    ```javascript
    module.exports = {
      // 单入口
      // entry: './src/js/index.js',
      entry: { // 多入口
        index: './src/js/index.js',
        test: './src/js/test.js'
      },
      output: {
        // [name]：取文件名
        filename: 'js/[name].[contenthash:10].js',
        path: resolve(__dirname, 'build')
      },
      plugins: [],
     // 添加一个optimization属性，对其进行设置如下
     /*
     	添加optimization属性之后：
     	如果是单入口的项目，那么webpack 将会对node_modules中的代码单独打包一个chunk最终输出，单独输出	  一个js文件
     	如果是多入口文件，不仅会对node_modules中的代码单独打包一个chunk最终输出，还会自动检查多个入口chunk中有没有公共的文件（用到的相同的第三方或自定义的文件），有的话会单独一个chunk进行打包
     */
      optimization: {
        splitChunks: {
          chunks: 'all'
        }
      },
      mode: 'production'
    };
    ```

  + 第三种方式：

    ```javascript
    module.exports = {
      // 单入口， 单入口但是又想对其他文件进行独立打包，需要在入口文件中书写js代码进行支持
      entry: './src/js/index.js',
      output: {
        // [name]：取文件名
        filename: 'js/[name].[contenthash:10].js',
        path: resolve(__dirname, 'build')
      },
      plugins: [],
      //webpack 将会对node_modules中的代码单独打包一个chunk最终输出，单独输出一个js文件
      optimization: {
        splitChunks: {
          chunks: 'all'
        }
      },
      mode: 'production'
    };
    //*********************************入口文件******************************************
    /*
      在入口文件中引入test.js文件例子如下
      通过js代码，让某个文件被单独打包成一个chunk
      import动态导入语法：能将某个文件单独打包
      webpackChunkName: 'test' 这个注释是对单独打包的js文件进行命名
    */
    import(/* webpackChunkName: 'test' */'./test')
      .then(({ mul, count }) => {
        // 文件加载成功~
        // eslint-disable-next-line
        console.log(mul(2, 5));
      })
      .catch(() => {
        // eslint-disable-next-line
        console.log('文件加载失败~');
      });
    ```

##### js 文件的懒加载和预加载

- js 文件的**懒加载**是当某个js 文件的功能被使用到时，在去加载这个js文件（当文件需要使用时才加载）

- js文件的**预加载prefetch**会在文件被使用之前，提前加载好，等主要资源加载完毕之后，浏览器处于空闲状态了，在去加载设置为prefetch的文件（懒加载的浏览器支持性不好，慎用）

- **正常加载**可以认为是并行加载，同一时间加载多个文件，当文件过多时会造成阻塞

- 懒加载和预加载是在code split 的基础上进行的，具体实现如下代码所示：

  ```javascript
  console.log('index.js文件被加载了~');
  // import { mul } from './test';  // 正常加载方式
  document.getElementById('btn').onclick = function() {
    // 懒加载：将文件的导入时机放到一个异步函数中
    // 懒加载~：当文件需要使用时才加载~
    // 预加载 prefetch：会在使用之前，提前加载js文件 
    // 正常加载可以认为是并行加载（同一时间加载多个文件） 
    // 预加载 prefetch：等其他资源加载完毕，浏览器空闲了，再偷偷加载资源
    // webpackChunkName: 'test' 为单独打包的js文件修改名字
    // webpackPrefetch: true 设置js 文件预加载，注释中设置这个参数则开启了预加载，不设置这个参数则是懒加载
    import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
      console.log(mul(4, 5));
    });
  };
  ```

  

##### PWA（渐进式网络开发应用程序）（离线可访问）

- 通过workbox实现PWA， webpack的话需要安装workbox-webpack-plugin这个包

- PWA可以实现离线刷新的时候页面还有内容，内容是从serverwork上获取得到的，而不是页面资源无法访问（PWA演示的时候需要网页是从服务器请求的，而不是本地打开）

- 具体配置如下代码所示：

  ```javascript
  //****************************package.json************************************
  const { resolve } = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
  /*
    PWA: 渐进式网络开发应用程序(离线可访问)
      workbox --> workbox-webpack-plugin
  */
  module.exports = {
    entry: './src/js/index.js',
    output: {
      filename: 'js/built.[contenthash:10].js',
      path: resolve(__dirname, 'build')
    },
    module: {},
    plugins: [
      new WorkboxWebpackPlugin.GenerateSW({
        /*
        	配置对象中两个参数的作用
          1. 帮助serviceworker快速启动
          2. 删除旧的 serviceworker
          生成一个 serviceworker 配置文件~
        */
        clientsClaim: true,
        skipWaiting: true
      })
    ],
    mode: 'production',
  };
  //****************************入口文件************************************
  /*
    1. eslint不认识 window、navigator全局变量
      解决：需要修改package.json中eslintConfig配置
        "env": {
          "browser": true // 支持浏览器端全局变量
        }
     2. sw代码必须运行在服务器上
        --> nodejs  通过node使页面运行在服务器端
        -->
          npm i serve -g     使用serve插件也可以是使页面运行在服务器点
          serve -s build 启动服务器，将build目录下所有资源作为静态资源暴露出去
  */
  // 注册serviceWorker
  // 处理兼容性问题
  // 需要在页面的load 事件完成之后 注册serviceworker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')  // workbox 插件在build目录生成的配置文件service-worker.js
        .then(() => {					 //  是不是还需要在service-worker.js 文件中进行配置？
          console.log('sw注册成功了~');   // 比如哪些资源加载？ 哪些资源不加载？
        })
        .catch(() => {
          console.log('sw注册失败了~');
        });
    });
  }
  
  ```

##### 多进程打包

- 多进程打包使用到了 thread-loader 这个包， 将thread-loader 放在其他loader前面，就对这些loader 的处理过程开启了多线程，开启多线程以及线程之间进行通讯需要花费大量的时间，所以工作量少的不要使用多线程打包，会适得其反，因为babel 工作量较大，一般在babel-loader 前面添加thread-loader， 但是也要看js代码量的多少。

- 具体使用方法如下代码所示：

  ```javascript
  {
      test: /\.js$/,
          exclude: /node_modules/,
              use: [
                  /* 
                  开启多进程打包。 
                  进程启动大概为600ms，进程通信也有开销。
                  只有工作消耗时间比较长，才需要多进程打包
                */
                  {
                      loader: 'thread-loader',
                      options: {
                          workers: 2 // 进程2个  配置设置开启几个进程
                      }
                  },
                  {
                      loader: 'babel-loader',
                      options: {
                          presets: [
                              [
                                  '@babel/preset-env',
                                  {
                                      useBuiltIns: 'usage',
                                      corejs: { version: 3 },
                                      targets: {
                                          chrome: '60',
                                          firefox: '50'
                                      }
                                  }
                              ]
                          ]
                      }
                  }
              ]
            },
  ```

##### externals

- externals的作用就是可能项目中对某些库的引用是通过CDN的方式，所以当webpack在进行打包构建的时候就需要忽略这些用CDN引入的包， 具体使用方法如下代码所示:

  ```javascript
  const { resolve } = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  module.exports = {
    entry: './src/js/index.js',
    output: {
      filename: 'js/built.js',
      path: resolve(__dirname, 'build')
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ],
    mode: 'production',
    externals: {   //  通过添加externals属性来开启这个功能
      // 拒绝jQuery被打包进来
      jquery: 'jQuery'
    }
  };
  ```

##### dll

- webpack 使用代码分割功能后，会将node_modules中的第三方库统一打包，这样会造成一个js 文件过大，因此采用dll的方法将某些第三方库单独进行打包，然后再手动引入到项目或者使用插件自动引入到项目。
- 通过dll打包第三方库之后，以后再次构建项目的时候通过配置就不会再次打包这个资源了，会极大的提高第二次打包构建的速度
- **dll功能的实现需要webpack包提供的插件以及add-asset-html-webpack-plugin插件**
- dll 和externals 和区别：
  + external 是指定webpack不去打包某个库，但是使用cdn的方式再html中引入
  + dll 是 指定webpack 不去打包某个库，但是需要开发人员手动在html中引入单独打包好的第三方库或者使用插件自动引入

- dll 的具体实现方式如下代码所示：

  ```javascript
  // 需要另外创建一个配置文件，然后运行打包第三方库
  // 在运行webpackconfig.js 打包其他资源
  //******************************webpack.dll.js(名字随意)******************
  /*
    使用dll技术，对某些库（第三方库：jquery、react、vue...）进行单独打包
      当你运行 webpack 时，默认查找 webpack.config.js 配置文件
      需求：需要运行 webpack.dll.js 文件
        --> webpack --config webpack.dll.js
  */
  const { resolve } = require('path');
  const webpack = require('webpack');    // 需要单独引入webpack 包
  module.exports = {
    entry: {
      // 最终打包生成的[name] --> jquery
      // ['jquery'] --> 要打包的库是jquery
      jquery: ['jquery'],
    },
    output: {
      filename: '[name].js',	//单独打包jquery生成的文件命名，[name] 就是entry中的键值
      path: resolve(__dirname, 'dll'), //单独打包jquery生成的文件输出到的目录
      library: '[name]_[hash]' // 打包的库里面向外暴露出去的内容叫什么名字
    },					// 以jquery 为例，暴露出去的内容交 jquer | $ , 通过[name]_[hash]修改这个值
    plugins: [			 // 为什么要修改暴露出去的名字
      // 打包生成一个 manifest.json --> 提供和jquery映射
      new webpack.DllPlugin({
        name: '[name]_[hash]', // 映射库的暴露的内容名称
        path: resolve(__dirname, 'dll/manifest.json') // 输出文件路径
      })
    ],
    mode: 'production'
  };
  //*****************************webpack.config.js******************************
  const { resolve } = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const webpack = require('webpack');
  const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'built.js',
      path: resolve(__dirname, 'build')
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      // 告诉webpack哪些库不参与打包，同时使用时的名称也得变~
      new webpack.DllReferencePlugin({
        manifest: resolve(__dirname, 'dll/manifest.json') //DllReferencePlugin 这个插件去读													manifest.json文件中的内容，获取不需要打包的库的信息
      }),
      // 将某个文件打包输出去，并在html中自动引入该资源
      // AddAssetHtmlWebpackPlugin 插件实现自动将打包的第三方库引入到html中。 
      // 因为第三方库是单独打包的，所以要在项目中用需要单独引入，开发者可以手动引入，也可以使用		    		// AddAssetHtmlWebpackPlugin插件自动引入
      new AddAssetHtmlWebpackPlugin({
        filepath: resolve(__dirname, 'dll/jquery.js')
      })
    ],
    mode: 'production'
  };
  
  ```

  

### webpack.config.js 属性介绍

#### entry

- ```javascript
  const { resolve } = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  
  /*
    entry: 入口起点
      1. string --> './src/index.js'
        单入口
        打包形成一个chunk。 输出一个bundle文件。
        此时chunk的名称默认是 main , [name]这个name使用的就是chunkname
      2. array  --> ['./src/index.js', './src/add.js']
        多入口
        所有入口文件最终只会形成一个chunk, 输出出去只有一个bundle文件。
          --> 只有在HMR功能中让html热更新生效~,这种书写方式解决HMR带来的问题
      3. object
        多入口
        有几个入口文件就形成几个chunk，输出几个bundle文件
        此时chunk的名称是 key
  
        --> 特殊用法
          {
            index: ['./src/index.js', './src/count.js'], 
            add: './src/add.js'
            // 这样最终会生成两个bundle文件，一个index.js一个add.js, 其中indexjs中包括 indexjs和countjs的内容，他俩被打包到了一起
            //dll 时可以使用这种特殊用法， 就是将同属一个技术栈的第三放库打包到一个bundle中,例如：
            vue:["./vue.js","./vue-router.js","./vue-resource.js"]
          }
  */
  
  module.exports = {
    entry: {
      index: './src/index.js', 
      add: './src/add.js'
    },
    output: {
      filename: '[name].js',
      path: resolve(__dirname, 'build')
    },
    plugins: [new HtmlWebpackPlugin()],
    mode: 'development'
  };
  
  ```

#### output

- ```javascript
  const { resolve } = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  module.exports = {
    entry: './src/index.js',
    output: {
      // 文件名称（指定名称+目录）
      filename: 'js/[name].js',
      // 输出文件目录（将来所有资源输出的公共目录）
      path: resolve(__dirname, 'build'),
      // 所有资源引入公共路径前缀 --> 'imgs/a.jpg' --> '/imgs/a.jpg'
      publicPath: '/', // 一般生产环境会使用
      chunkFilename: 'js/[name]_chunk.js', // 非入口chunk的名称，设置非入口chunk输出文件的名称
      // library 一般是结合dll一起使用
      // library: '[name]', // 整个库向外暴露的变量名
      // libraryTarget: 'window' // 变量名添加到哪个对象上 browser环境
      // libraryTarget: 'global' // 变量名添加到哪个对象上 node环境
      // libraryTarget: 'commonjs' // 库打包使用的规则， commonjs amd cmd 。。。
    },
    plugins: [new HtmlWebpackPlugin()],
    mode: 'development'
  };
  	
  ```

#### module

- ```javascript
  const { resolve } = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  
  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'js/[name].js',
      path: resolve(__dirname, 'build')
    },
    module: {
      rules: [
        // loader的配置
        {
          test: /\.css$/,
          // 多个loader用use
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.js$/,
          // 排除node_modules下的js文件
          exclude: /node_modules/,
          // 只检查 src 下的js文件
          include: resolve(__dirname, 'src'), // 设置loader只检查某个文件夹中的文件
          // 优先执行
          enforce: 'pre',
          // 延后执行
          // enforce: 'post',
          // 单个loader用loader
          loader: 'eslint-loader',
          options: {}
        },
        {
          // 以下配置只会生效一个
          oneOf: []
        }
      ]
    },
    plugins: [new HtmlWebpackPlugin()],
    mode: 'development'
  };
  
  ```

#### resolve

- ```javascript
  const { resolve } = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  module.exports = {
    entry: './src/js/index.js',
    output: {
      filename: 'js/[name].js',
      path: resolve(__dirname, 'build')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [new HtmlWebpackPlugin()],
    mode: 'development',
    // 解析模块的规则
    resolve: {
      // 配置解析模块路径别名: 优点简写路径 缺点路径没有提示
      alias: {
        $css: resolve(__dirname, 'src/css') // 以$css 代替 src/css
      },
      // 配置省略文件路径的后缀名    通过extensions 可以在引入或使用文件时省略文件后缀
      extensions: ['.js', '.json', '.jsx', '.css'],
      // 告诉 webpack 解析模块是去找哪个目录
      // 当webpack 解析node_modules 时， 如果当前项目目录没有node_modules那么就去上一层找，一直往外层找到为止，  为了避免这种寻找node_modules的方法， 可以直接指定node_modules的路径，webpack就会直接去这个路径寻找
      modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
    }
  };
  ```

#### devServer

- ```javascript
  const { resolve } = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  module.exports = {
    entry: './src/js/index.js',
    output: {
      filename: 'js/[name].js',
      path: resolve(__dirname, 'build')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [new HtmlWebpackPlugin()],
    mode: 'development',
    devServer: {
      // 运行代码的目录
      contentBase: resolve(__dirname, 'build'),
      // 监视 contentBase 目录下的所有文件，一旦文件变化就会 reload
      watchContentBase: true,
      watchOptions: {
        // 忽略文件(指定不需要监视的文件)
        ignored: /node_modules/
      },
      // 启动gzip压缩
      compress: true,
      // 端口号
      port: 5000,
      // 域名
      host: 'localhost',
      // 自动打开浏览器
      open: true,
      // 开启HMR功能
      hot: true,
      // 不要显示启动服务器日志信息
      clientLogLevel: 'none',
      // 除了一些基本启动信息以外，其他内容都不要显示
      quiet: true,
      // 如果出错了，不要全屏提示~
      overlay: false,
      // 服务器代理 --> 解决开发环境跨域问题
      proxy: {
        // 一旦devServer(5000)服务器接受到 /api/xxx 的请求，就会把请求转发到另外一个服务器(3000)
        '/api': {
          target: 'http://localhost:3000',
          // 发送请求时，请求路径重写：将 /api/xxx --> /xxx （去掉/api）
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    }
  };
  
  ```

  

#### optimization

- ```javascript
  const { resolve } = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const TerserWebpackPlugin = require('terser-webpack-plugin')
  
  module.exports = {
    entry: './src/js/index.js',
    output: {
      filename: 'js/[name].[contenthash:10].js',
      path: resolve(__dirname, 'build'),
      chunkFilename: 'js/[name].[contenthash:10]_chunk.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [new HtmlWebpackPlugin()],
    mode: 'production',
    resolve: {
      alias: {
        $css: resolve(__dirname, 'src/css')
      },
      extensions: ['.js', '.json', '.jsx', '.css'],
      modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
        // 默认值，可以不写~
        /* minSize: 30 * 1024, // 分割的chunk最小为30kb
        maxSize: 0, // 最大没有限制
        minChunks: 1, // 要提取的chunk最少被引用1次
        maxAsyncRequests: 5, // 按需加载时并行加载的文件的最大数量
        maxInitialRequests: 3, // 入口js文件最大并行请求数量
        automaticNameDelimiter: '~', // 名称连接符
        name: true, // 可以使用命名规则
        cacheGroups: {
          // 分割chunk的组
          // node_modules文件会被打包到 vendors 组的chunk中。--> vendors~xxx.js
          // 满足上面的公共规则，如：大小超过30kb，至少被引用一次。
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            // 优先级
            priority: -10
          },
          default: {
            // 要提取的chunk最少被引用2次
            minChunks: 2,
            // 优先级
            priority: -20,
            // 如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块
            reuseExistingChunk: true
          } 
        }*/
      },
      // 将当前模块的记录其他模块的hash单独打包为一个文件 runtime
      // 解决：修改a文件导致b文件的contenthash变化
      runtimeChunk: {  // 虽然 a和b是单独打包，但是b中保存了a的contenthash， 所以a 变化时（想只有a文件重新打包）， b还是会重新打包， 使得b的缓存失效， 所以使用runtimeChunk 将b中记录的a文件的contenthash提取出来到一个新的文件， 这样a变化是，只有a 文件和 runtime文件重新打包， b文件会使用缓存
        name: entrypoint => `runtime-${entrypoint.name}`
      },
      minimizer: [
        // 配置生产环境的压缩方案：js和css
        // terser-webpack-plugin  替代 uglyify.js 
        new TerserWebpackPlugin({
          // 开启缓存
          cache: true,
          // 开启多进程打包
          parallel: true,
          // 启动source-map
          sourceMap: true
        })
      ]
    }
  };
  
  ```

  