
const express = require('express')
const router = express.Router()
const categoryModel = require('../model/category.js')
const pagination = require('../util/pagination.js')

router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登陆</h1>')
	}
})

//显示分类列表
router.get('/', (req, res)=> {


	pagination({
		page:req.query.page,
		model:categoryModel,
		query:{},
		projection:"-__v",
		sort:{order:-1}
	})
	.then(data=>{
		res.render('admin/category_list',{
			userInfo:req.userInfo,
			categories:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/category'
		})		
	})
})

//显示分类
router.get('/add', (req, res)=> {
  res.render('admin/category_add_edit',{
  	userInfo:req.userInfo
  })
})

//处理新增分类
router.post('/add', (req, res)=> {
	//新增前查询是否数据库分类已存在
	const {name,order} = req.body;//body(一般为post请求发送的数据)
	categoryModel.findOne({name})
	.then(category=>{
		if(category){//分类已存在
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'添加分类失败,分类已存在',

			})

		}else{//新增分类
			categoryModel.insertMany({name,order})
			.then(categories=>{
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'添加分类成功',
					url:'/category'

				})
			})
			.catch(err=>{
				throw err;
			})


		}
	})
	.catch(err=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'添加分类失败,请稍后重试'
		})		
	})

})

//显示编辑页面
router.get('/edit/:id',(req,res)=>{
	const {id} = req.params;//params:后边带id的请求(example /list/123)
	categoryModel.findById(id)
	.then(category=>{
		res.render('admin/category_add_edit',{
			userInfo:req.userInfo,
			category
		})		
	})
})

//处理编辑
router.post('/edit',(req,res)=>{
	////body(一般为post请求发送的数据)
	const {id,name,order} = req.body;

	categoryModel.findById(id)
	.then(category=>{
		if(category.name == name && category.order == order){//没有更改
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'请修改后在提交'
			})				

		}else{//修改的当前分类 查找数据库是否存在
			categoryModel.findOne({name:name,_id:{$ne:id}})
			.then(newCategory=>{//当前分类已存在(修改失败)
				if(newCategory){
					res.render('admin/error',{
						userInfo:req.userInfo,
						message:'修改分类失败,分类已存在'
					})
				}else{
					categoryModel.updateOne({_id:id},{name,order})
					.then(result=>{
						res.render('admin/success',{
							userInfo:req.userInfo,
							message:'修改分类成功',
							url:'/category'
						})						
					})
					.catch(err=>{
						throw err
					})
				}
			})
			.catch(err=>{
				throw err
			})
		}
	})
	.catch(err=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'修改分类失败,请稍后重试'
		})		
	})
})


//处理删除分类
router.get('/delete/:id',(req,res)=>{
	const {id} = req.params;
	categoryModel.deleteOne({_id:id})
	.then(result=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除分类成功',
		})		
	})
	.catch(err=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'删除分类失败,请稍后重试'
		})		
	})	
})

module.exports = router