const express = require("express");
const path = require("path");
const router = require("./route.js");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

// 服务器开放静态资源
app.use("/public/",express.static(path.join(__dirname,"./public/")));
app.use("/node_modules/",express.static(path.join(__dirname,"./node_modules/")));

// 配置art-template模板引擎
app.engine("html",require("express-art-template"));

// 配置post请求的数据解析插件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(bodyParser.text());

// 配置session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// 服务器挂载路由
app.use(router);

app.listen(3000,function(){
	console.log("server 3000 is running ...");
});