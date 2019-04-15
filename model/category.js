const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: {
		type:String,
	},
	order:{
		type:Number,
		default:0
	}
});


//3.生成模型model 
const categoryModel = mongoose.model('category', categorySchema);
//4.导出模块
module.exports = categoryModel;