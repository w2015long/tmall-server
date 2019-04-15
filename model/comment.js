const mongoose = require('mongoose');
const pagination = require('../util/pagination.js')


const commentSchema = new mongoose.Schema({
	content:{
		type:String
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'user'
	},
	article:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'article'
	},
	createAt:{
		type:Date,
		default:Date.now
	}
});

commentSchema.statics.getPaginationComments = function(req,query={}){
	return pagination({
		page:req.query.page,
		model:this,
		query:query,
		projection:"-__v",
		sort:{_id:-1},
		populates:[{path:'user',select:'username'},{path:'article',select:'title'}]
	})	
}


//3.生成模型model 
const commentModel = mongoose.model('comment', commentSchema);
//4.导出模块
module.exports = commentModel;