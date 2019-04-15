
const express = require('express')
const router = express.Router()
const articleModel = require('../model/article.js')
const categoryModel = require('../model/category.js')
// const pagination = require('../util/pagination.js')

router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登陆</h1>')
	}
})

//显示博文列表
router.get('/', (req, res)=> {
	/*
	pagination({
		page:req.query.page,
		model:articleModel,
		query:{},
		projection:"-__v",
		sort:{_id:-1},
		populates:[{path:'user',select:'username'},{path:'category',select:'name'}]
	})
	*/


	articleModel.getPaginationArticles(req)
	.then(data=>{
		// console.log('data',data)
		res.render('admin/article_list',{
			userInfo:req.userInfo,
			articles:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/article'
		})		
	})
})



//显示博文分类(点击http://localhost:3000/article 页面的新增博文按钮)

router.get('/add', (req, res)=> {
	//显示新增博文前先查找博文属于category哪个分类
	categoryModel.find({},'name')
	.sort({order:-1})
	.then(categories=>{
		// console.log('categories',categories)
		res.render('admin/article_add_edit',{
			userInfo:req.userInfo,
			categories
		})		
	})


})

//处理新增博文分类
router.post('/add', (req, res)=> {
	
	const {category,title,intro,content} = req.body;

	articleModel.insertMany({
		category,
		title,
		intro,
		content,
		user:req.userInfo._id
	})
	.then(article=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'添加博文成功',
			url:'/article'
		})
	})			
	.catch(err=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'添加博文失败,请稍后重试'
		})		
	})

})



//显示编辑页面
router.get('/edit/:id',(req,res)=>{
	const {id} = req.params;
	//显示博文编辑前先把此篇博文属于哪一个分类传过来
	categoryModel.find({},'name')
	.sort({order:-1})
	.then(categories=>{
		articleModel.findById(id)
		.then(article=>{
			res.render('admin/article_add_edit',{
				userInfo:req.userInfo,
				article,
				categories
			})		
		})		
	})

})

//处理编辑博文
router.post('/edit',(req,res)=>{
	const {id,category,title,intro,content} = req.body;
	articleModel.updateOne({_id:id},{category,title,intro,content})
	.then(result=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'修改分类成功',
			url:'/article'
		})						
	})
	.catch(err=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'修改分类失败,请稍后重试'
		})		
	})
})


//处理删除博文
router.get('/delete/:id',(req,res)=>{
	const {id} = req.params;
	articleModel.deleteOne({_id:id})
	.then(result=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除博文成功',
		})		
	})
	.catch(err=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'删除博文分类失败,请稍后重试'
		})		
	})	
})


module.exports = router