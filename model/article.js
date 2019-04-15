const mongoose = require('mongoose');
const pagination = require('../util/pagination.js')


const articleSchema = new mongoose.Schema({
	title: {
		type:String,
	},
	intro:{
		type:String,
	},
	content:{
		type:String
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'user'
	},
	category:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'category'
	},
	createAt:{
		type:Date,
		default:Date.now
	},
	click:{
		type:Number,
		default:100
	}
});

articleSchema.statics.getPaginationArticles = function(req,query={}){
	return pagination({
		page:req.query.page,
		model:this,
		query:query,
		projection:"-__v",
		sort:{_id:-1},
		populates:[{path:'user',select:'username'},{path:'category',select:'name'}]
	})	
}


//3.生成模型model 
const articleModel = mongoose.model('article', articleSchema);
//4.导出模块
module.exports = articleModel;