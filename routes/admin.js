
const express = require('express')
const router = express.Router()
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })
const userModel = require('../model/user.js')
const commentModel = require('../model/comment.js')
const pagination = require('../util/pagination.js')
const hmac = require('../util/hmac.js')

router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登陆</h1>')
	}
})

//显示后台首页
router.get('/', (req, res)=> {
  res.render('admin/index',{
  	userInfo:req.userInfo
  })
})

//显示用户列表
router.get('/users', (req, res)=> {

	pagination({
		page:req.query.page,
		model:userModel,
		query:{},
		projection:"-password -__v",
		sort:{id:-1}
	})
	.then(data=>{
		res.render('admin/users_list',{
			userInfo:req.userInfo,
			users:data.docs,
			page:data.page,
			pages:data.pages,
			list:data.list,
			url:'/admin/users'
		})		
	})
	
})

//处理上传图片
router.post('/uploadImage',upload.single('upload'),(req,res)=>{
	// console.log(req.file)
	let uploadedFilePath = '/uploads/' + req.file.filename

	res.json({
		uploaded:true,
		url:uploadedFilePath
	})
})


//处理评论
router.get('/comments',(req,res)=>{
	//显示评论列表
	commentModel.getPaginationComments(req)
	.then(data=>{
		res.render('admin/comments_list',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/admin/comments'
		})		
	})	
})


//处理删除评论
router.get('/comment/delete/:id',(req,res)=>{
	const {id} = req.params;
	commentModel.deleteOne({_id:id})
	.then(result=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除评论成功',
			url:'/admin/comments'
		})		
	})
	.catch(err=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'删除评论失败,请稍后重试'
		})		
	})	
})


//密码管理
router.get('/password',(req,res)=>{
	res.render('admin/repassword',{
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
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'修改成功',
			url:'/'//回首页
		})		
	})
})

module.exports = router