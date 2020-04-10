const express = require("express");
const router = express.Router();
const User = require("./model/user.js");
const md5 = require("blueimp-md5");
const session = require("express-session");

router.get("/",function(req,res,next){
	let id = req.query.id
	res.render("index.html",{
		user:req.session[id]
	})
})
// 渲染登录页面
router.get("/login",function(req,res,next){
	res.render("login.html");
})

// 处理登录请求
router.post("/login",function(req,res,next){
	let body = req.body;
	body.password = md5(md5(body.password));
	User.findOne({
		email:body.email,
		password:body.password
	},function(err,user){
		if (err) {
			return res.json({resCode:500,message:"server busy ..."});
		}
		if (user) {
			let id = user.id;
			req.session[id] = user;
			//req.session.user = user;
			return res.json({resCode:0,message:"ok",user_id:id});
		}
		res.json({resCode:5,message:"邮箱或密码错误"});
	})
})
// 测试mongoose导出多个model 是可行的， 这样就只连接一次数据库
/*router.post("/login",function(req,res,next){
	let body = req.body;
	body.password = md5(md5(body.password));
	new User.good({
		name:"大白菜",
		price:200
	}).save(function(err,good){
		console.log(good);
	})

	User.user.findOne({
		email:body.email,
		password:body.password
	},function(err,user){
		if (err) {
			return res.json({resCode:500,message:"server busy ..."});
		}
		if (user) {
			let id = user.id;
			req.session[id] = user;
			//req.session.user = user;
			return res.json({resCode:0,message:"ok",user_id:id});
		}
		res.json({resCode:5,message:"邮箱或密码错误"});
	})
})*/

// async 版本处理注册请求
router.post("/register",async function(req,res,next){
	let body = req.body;
	body.password = md5(md5(body.password));
	try{
		if (await User.findOne({email:body.email})){
			res.json({resCode:1,message:"邮箱已注册"});
		}else if (await User.findOne({name:body.name})){
			res.json({resCode:2,message:"用户名已使用"});
		}else {
			//req.session.user =  await new User(body).save();
			let user =  await new User(body).save();
			let id = user.id;
			req.session[id] = user;
			//res.redirect("/");
			res.json({resCode:0,message:"ok",user_id:id});
		}
	}catch(e){
		res.json({resCode:500,message:"server busy ..."});
	}
})

// promise 版本处理注册请求
/*router.post("/register",function(req,res,next){
	let body = req.body;
	body.password = md5(md5(body.password));
	User.findOne({
		email : body.email
	}).then(data =>{
		if (data) {
			res.json({resCode:1,message:"邮箱已注册"});
			return Promise.reject('邮箱已注册.');
		}
		return User.findOne({name:body.name});
	}).then(data => {
		if (data) {
			res.json({resCode:2,message:"用户名已使用"});
			return Promise.reject('用户名已使用.');
		}
		return new User(body).save();
	}).then(user =>{
		if (user) 
			return res.json({resCode:0,message:"ok"});
		res.json({resCode:500,message:"server error ..."});
	}).catch(reason => {
		console.log('got error:', reason);
	});
})*/

// 退出主页面
router.get("/logOut",function(req,res,next){
	delete req.session[req.query.id];
	res.status(200).json({
		resCode:0,
		message:"ok"
	})
})

module.exports = router;
