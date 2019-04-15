
const express = require('express')
const router = express.Router()

const userModel = require('../model/user.js')
const hmac = require('../util/hmac.js')


//处理注册
router.post('/register', (req, res)=> {
	let {username,password} = req.body;
	let result = {
		status:0,//success
		messige:''
	}

	//检测数据库是否已有用户
	userModel.findOne({username})
	.then(user=>{
		if(user){////用户已存在
			result.status = 10;
			result.messige = '用户已存在';
			//并把数据返回到前台
			res.json(result)
		}else{//把新用户插入数据库
			userModel.insertMany({
				username,
				password:hmac(password),
				// isAdmin:true
			})
			.then(user=>{
				res.json(result)
			})
			.catch(err=>{
				throw err;
			})

		}
	})
	.catch(err=>{//数据库查询时出错
			result.status = 10;
			result.messige = '服务器出错，请稍后重试';
			res.json(result)
	})
})

//处理登录
router.post('/login', (req, res)=> {
	let {username,password} = req.body;

	let result = {
		status:0,//success
		message:''
	}

	//检测数据库是否已有用户
	userModel.findOne({username,password:hmac(password)},"-password -__v")
	.then(user=>{
		if(user){//登录
			result.data = user;
			/*
			//设置cookies.set( name, [ value ], [ options ] )
			req.cookies.set('userInfo',JSON.stringify(user))
			*/
			//session设置cookies
			req.session.userInfo = user
			res.json(result)
		}else{//登录失败
			result.status = 10;
			result.message = '用户不存在,或者密码错误';
			//并把数据返回到前台
			res.json(result)

		}
	})
	.catch(err=>{//数据库查询时出错
			result.status = 10;
			result.message = '服务器出错，请稍后重试';
			res.json(result)
	})
})

//退出登录
router.get('/logout', (req, res)=> {
	let result = {
		status:0,//success
		message:''
	}
	/*
	//cookies方法
	req.cookies.set('userInfo',null);
	*/
	req.session.destroy()
	res.json(result)
})

module.exports = router