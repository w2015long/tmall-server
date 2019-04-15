
const express = require('express')
const router = express.Router()
const userModel = require('../model/user.js')
const commentModel = require('../model/comment.js')
const hmac = require('../util/hmac.js')

router.use((req,res,next)=>{
	if(req.userInfo._id){
		next()
	}else{
		res.send('<h1>请登录后再试</h1>')
	}
})

//显示后台首页
router.get('/', (req, res)=> {
  res.render('home/index',{
  	userInfo:req.userInfo
  })
})




//处理评论
router.get('/comments',(req,res)=>{
	//显示评论列表
	commentModel.getPaginationComments(req,{user:req.userInfo._id})
	.then(data=>{
		res.render('home/comments_list',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/home/comments'
		})		
	})	
})


//处理删除评论
router.get('/comment/delete/:id',(req,res)=>{
	const {id} = req.params;
	commentModel.deleteOne({_id:id})
	.then(result=>{
		res.render('home/success',{
			userInfo:req.userInfo,
			message:'删除评论成功',
			url:'/home/comments'
		})		
	})
	.catch(err=>{
		res.render('home/error',{
			userInfo:req.userInfo,
			message:'删除评论失败,请稍后重试'
		})		
	})	
})


//密码管理
router.get('/password',(req,res)=>{
	res.render('home/repassword',{
		userInfo:req.userInfo,
	})
})

//修改密码
router.post('/repassword',(req,res)=>{
	const {password} = req.body;
	userModel.updateOne({_id:req.userInfo._id},{password:hmac(password)})
	.then(result=>{
		//退出登录(清除cookie)
		req.session.destroy();
		res.render('home/success',{
			userInfo:req.userInfo,
			message:'修改成功',
			url:'/'//回首页
		})		
	})
})

module.exports = router