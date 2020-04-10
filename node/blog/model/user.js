const mongoose = require("mongoose");

const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/blog");

//定义表结构
const userSchema = new Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	ceate_time:{
		type:Date,
		default:Date.now
	},
	gender:{
		type:Number,
		enum:[0,1], // 0表示男性用户，1表示女性用户
		default:0
	},
	birthday:{
		type:Date,
	},
	avatar:{
		type:String,
	},
	status:{
		type:Number,
		enum:[0,1,2], //0表示正常用户，1表示不能评论，2 表示用户被注销
		default:0
	}
});

const goodSchema = new Schema({
	name:{
		type:String,
		required:true
	},
	price:{
		type:Number,
		required:true
	}
})

// 导出数据模型
module.exports = mongoose.model("User",userSchema);

// 测试mongoose导出多个model 是可行的， 这样就只连接一次数据库
/*exports.user = mongoose.model("User",userSchema);
exports.good = mongoose.model("Good",goodSchema);*/
