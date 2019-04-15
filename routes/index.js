const express = require('express')
const router = express.Router()
const articleModel = require('../model/article.js')
const categoryModel = require('../model/category.js')
const commentModel = require('../model/comment.js')



//首页显示:获取各种数据
async function getCommonData(){
	//文章具体属于哪一个分类
	let categoriesPromise = categoryModel.find({}).sort({order:-1});
	//拿到博文排行数据(右侧排行栏)
	let topArticlesPromise = articleModel.find({},'_id click title').sort({click:-1}).limit(10);

	const categories = await categoriesPromise;
	const topArticles = await topArticlesPromise;

	return {
		categories,
		topArticles
	}
}
router.get('/', (req, res)=> {
	//查询后台数据显示前台首页
	getCommonData()
	.then(data=>{
		const {categories,topArticles} = data;
		articleModel.getPaginationArticles(req)
		.then(data=>{
			res.render('main/index',{
				userInfo:req.userInfo,
				categories,
				topArticles,
				//首页博文分页
				articles:data.docs,
				page:data.page,
				list:data.list,
				pages:data.pages,
			})	
		})
	
	})
})

//收到ajax请求 处理博文文章分页数据
router.get('/articles',(req,res)=>{
	//query:字符串带问号形式的请求(例如：/?page=1$id=123)
	const { id } = req.query;
	let query = null;
	if(id){
		query = {category:id}
	}
	//点击页码发送请求获取博文数据
	articleModel.getPaginationArticles(req,query)
	.then(data=>{
		res.json({
			status:0,
			data
		})		
	})
})

//详情页显示：1.博文分类数据
//           2.博文排行数据
//           3.更新点击量数据
//           4.评论数据(包括分页)

async function getDetailDate(req){
	// 具体文章的id (article._id.toString())
	const {id} = req.params;

	//1.博文分类数据 and 2.博文排行数据
	let dataPromise = getCommonData();
	//3.更新点击量数据
	let clickArticlePromise = articleModel
		.findOneAndUpdate({_id:id},{$inc:{click:1}},{new:true})
		.populate('user','username')
		.populate('category','name')
																//查询条件:具体文章下的评论
	let commentsPagePromise = commentModel.getPaginationComments(req,{article:id});

	const data = await dataPromise;
	const {categories,topArticles} = data;
	const comments = await commentsPagePromise;
	const article = await clickArticlePromise;

	return {
		categories,//1.博文分类数据
		topArticles,//2.博文排行数据
		article,//3.更新点击量数据
		comments//4.评论数据(包括分页)
	}
}



//detail详情页
router.get('/view/:id',(req,res)=>{
	
	//const {id} = req.params;//(params:后边带id的请求)
	getDetailDate(req)
	.then(data=>{
		const {categories,topArticles,article,comments} = data;
		res.render('main/detail',{
			userInfo:req.userInfo,
			categories,
			topArticles,
			article,
			//回传id 详情页博文具体属于哪一分类
			category:article.category._id,
			//详情页评论分页
			comments:comments.docs,
			page:comments.page,
			list:comments.list,
			pages:comments.pages,
		})			

	})
})

//list详情页
router.get('/list/:id',(req,res)=>{

	//具体分类的id (category._id.toString())
	const {id} = req.params;//params:后边带id的请求(example /list/123) 
	getCommonData()
	.then(data=>{
		const {categories,topArticles} = data;
		articleModel.getPaginationArticles(req,{category:id})
		.then(data=>{
			res.render('main/list',{
				userInfo:req.userInfo,
				categories,
				topArticles,
				//list页面分页
				articles:data.docs,
				page:data.page,
				list:data.list,
				pages:data.pages,
				//回传id 知道属于哪一个分类
				category:id
			})	
		})

	})
})
module.exports = router