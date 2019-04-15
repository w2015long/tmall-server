const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type:String,
	},
	password:{
		type:String
	},
	isAdmin:{
		type:Boolean,
		default:false
	}
});


//3.生成模型model 
const userModel = mongoose.model('user', userSchema);
//4.导出模块
module.exports = userModel;