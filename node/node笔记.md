# node笔记

### node 的require加载规则

- 优先从缓存加载，使用require加载某个模块时，node会先判断此模块是否已经被加载过，如果加载过，就直接从缓存中加载（提升性能），如果没有加载过，就正常加载该模块；
- 第三方包的加载规则（大概规则，详细的需要再去查，了解），首先node判断是不是加载自定义的模块（相对路径的方式加载），在判断是不是加载node提供的核心模块，如果都不是的话，就是加载第三方包：
  + 先从当前目录的node_modules目录中寻找对应名字的目录
  + 找到目录之后，查找package.json里面的main属性
  + 根据main属性对应的文件名称，查找这个文件，并加载
  + 如果package.json不存在，或者main属性不存在，或者对应的文件不存在，就默认去加载本文件夹里面的index.js文件
  + 如果经历以上步骤还是没有找到，则继续去上一级目录的node_modules目录中以相同的方式查找第三方包，一直找到项目所在的磁盘根目录为止


- 多个js文件都加载了某个模块时，无需担心模块重复加载造成的性能问题，当这个模块初次加载完之后，其他js文件再去加载这个模块时，就会使用第一次加载时的缓存

### package.json文件

- package.json文件叫做包描述文件，主要用于描述项目的一些信息，目前最重要的作用就是保存项目的依赖项（第三方模块）
  + npm init 生成包描述文件
  + npm i jquery --save   通过--save将第三方包的信息加到包描述文件中
  + npm install 如果项目中的node_modules丢失，可以根据包描述文件以及npm install 命令，完成项目第三方依赖包的加载

### npm常用命令

- ```shell
  npm init  初始化项目的package.json文件
  npm install 根据package.json文件加载所有的第三方包
  npm install 包名 安装第三方包
  npm install 包名@1.1.1  --save  安装指定版本的包，并将包信息写道package.json文件中
  npm uninstall 包名 卸载某个包，但不删除package.json中的对应包描述信息
  npm uninstall 包名 --save 卸载某个包，并删除package.json中的对应包描述信息
  ```

- cnpm 时npm的国内镜像（淘宝搞的），通过 npm install --global cnpm 命令全局安装cnpm后，就可以使用cnpm 安装第三方包，速度比npm快很多

### Express

#### express处理项目静态资源：

+ ```javascript
  app.use("/public/",express.static("./public/")); 推荐这种方式。开放项目中的public目录，浏览器输入框中必须以public/。。。/。。。这种方式访问开放的资源
  
  app.use("/aaa/",express.static("./public/")); aaa相当于给public 起了一个别名，在访问开放资源时，需要使用aaa/。。。/。。。这种方式访问静态资源
  
  app.use(express.static("./public/")) 这种方式省略了第一个参数，在浏览器访问开放资源时，直接输入资源在public目录里面的路径，不需要添加public，添加了将会报错
  ```

#### express处理post请求需要使用body-parser插件

- ```javascript
  const express = require("express");
  const bodyParser = require("body-parser");
  const app = express();
  
  //开放静态资源
  app.use("/public/",express.static("./public/"));
  app.use("/node_modules/",express.static("./node_modules/"));
  
  //处理前端的post请求的数据体
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  
  通过 req.body获取post请求的数据。
  express处理get请求的数据，无需插件，使用 req.query 即可获取数据
  ```

#### express中使用art-template模板引擎

- ```javascript
  //引入art-template模板引擎
  app.engine("html",require("express-art-template"));
  
  app.get("/",function(req,res){
  	res.render("index.html",{
  		title:["a","b","c","d"]
  	});
  });
  ```

- node 默认会去views文件夹中寻找需要render的网页，如果开发人员不想让其去views文件夹中找，可以手动配置其他文件夹

### 文件操作路径和模块操作路径

- ```javascript
  fs.readFile("./data/a.txt");  ./data/a.txt 是相对路径,可以正确读取文件
  fs.readFile("data/a.txt"); data/a.txt 也是相对路径，可以省略./，可以正确读取文件
  fs.readFile("/data/a.txt"); /data/a.txt 是绝对路径，找的是项目所在磁盘根路径下的/data/a.txt
  例如 C：//data//a.txt 无法正确读取文件
  ```

- ```javascript
  require("./data/b.js"); ./data/a.txt 是相对路径,可以正确加载文件
  require("/data/b.js"); 无法正确加载文件
  require("data/b.js");  模块加载时，不能省略./， 省略后无法正确加载文件
  ```

  

### 通过回调函数操作异步获取的数据

- ```javascript
  function fn(){
     setTimeout(function(){
         var data = "123";
     },1000) 
  }
  fn(); //如果执行函数fn才能得到1秒钟之后才获取到的数据呢？
  function fn(callback){
      setTimeout(function(){
          var data = "123";
          callback(data);
      },1000)
  }
  //这样在执行函数fn时，传入一个回调函数，这个回调函数包括了对data的处理，如下所示：
  fn(function(data){
      console.log(data);
  })
  ```

  

### MongoDB 数据库

#### express  mongoose 连接mongodb数据库等基础设置等

- ```javascript
  const mongoose = require("mongoose");
  
  // 连接数据库(本机的curd数据库)
  mongoose.connect("mongodb://localhost/curd");
  
  // 设置数据表（集合）的规则
  const studentSchema = new mongoose.Schema({
  	name:{
  		type:String,
  		rquired:true
  	},
  	gender:{
  		type:Number,
  		rquired:true
  	}
  })
  
  // 生成对象模型，两个参数分别是集合名称和集合规则
  const Student = mongoose.model("Student",studentSchema);
  // 向数据库中添加数据
  new Student({`要添加的数据`},function(err,data){})
  // 从数据库中查询数据 find  findById 等
  Student.find(function(err,data){})
  // 从更新数据库中的数据，具体的api 去mongoose官网查询
  Student.upDateById({查询条件},{新数据},function(err){})
  // 删除数据库中的某些数据
  Student.deleteOne({匹配条件},function(err){})
  ```

  

### Node中的其他成员

- 在node的每个文件模块中，除了`require`,`exports`等与模块相关的api之外，还有两个特殊的成员：
  + __dirname  **动态获取**当前文件所属目录的绝对路径
  + __filename **动态获取**当前文件的绝对路径 

- 在文件操作中（读取文件、写入文件等）使用相对路径是不可靠的，因为node中文件操作部分的相对路径，相对的是执行node命令的路径， 而不是相对的文件（不是bug，有使用场景），为了解决这个问题，在进行文件操作时，使用绝对路径即可，但是绝对路径不能写死，否则，整个项目将不具备灵活性和移植性，这时候就需要使用--dirname 和 --filename来动态获取文件的绝对路径

- 为了避免手动拼接路径出错的问题，使用node中path核心模块的api

  + ```javascript
    // 例如如下动态拼接绝对路径：
    path.join(__dirname,"./a.txt")
    ```

- 需要注意的是，导入模块时使用的相对路径就是相对的文件的路径，和文件操作的相对路径不一样

### art-template、子模版、模板继承

### 服务端重定向

- 服务端重定向只能针对前端的同步请求（表单请求），异步请求后，后端无法进行重定向（重定向之后前端页面没有反应）

### express-session 插件

- 默认session 数据是在内存中进行存储的，服务器一旦重启数据就会丢失，真正的生产环境会把session数据进行持久化存储

  

### node 中间件

### Cookie 和Session

-  https://www.cnblogs.com/zhuyuewei/p/6018374.html

- cookie是保存在浏览器端，session保存在服务端
- cookie相当于用户拿着通行证，让服务端验证通行证，session相当于服务端有一个用户表，用户来了，服务端 对着用户表进行比对
- 