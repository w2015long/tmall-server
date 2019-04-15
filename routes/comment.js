
const express = require('express')
const commentModel = require('../model/comment.js')
const router = express.Router()

router.use((req,res,next)=>{
	if(req.userInfo){
		next()
	}else{
		res.json({
			status:10,
			message:'请登录'
		})
	}
})


//添加评论
router.post('/add',(req,res)=>{
	const {content , article} = req.body;
	commentModel.insertMany({
		content,
		user:req.userInfo._id,
		article
	})
	.then(comments=>{
		//获取评论分页数据返回到前台渲染页面
		commentModel.getPaginationComments(req,{article})
		.then(data=>{
			res.json({
				status:0,
				data
			})		
		})			
	})

})

//评论分页
router.get('/list',(req,res)=>{
	const {id} = req.query;
	let query = null;

	if(id){
		query = {article:id}
	}
	//获取评论分页数据返回到前台渲染页面
	commentModel.getPaginationComments(req,query)
	.then(data=>{
		res.json({
			status:0,
			data
		})		
	})	

})




module.exports = router