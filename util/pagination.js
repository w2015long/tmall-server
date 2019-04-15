

/*
page:请求页码
model:数据模型
query:查询条件
projection:投影
sort:排序,
populates:关联数据模型(数组)
*/

async function pagination(options){


	let {page,model,query,projection,sort,populates} = options;

	/*
	约定每页显示3条 limit(3)

	每页要跳过3条数据 skip(3)

	第page页 跳过 (page - 1) * skip

	 */
	
	//第一次进来没有page
	if(isNaN(page)){
		page = 1
	}

	page = parseInt(page);

	const limit = 3;
	//跳页不能为负
	if(page == 0){
		page = 1
	}
	//计算总页数
	const count = await model.countDocuments(query);

	const pages = Math.ceil(count / limit);


	if(page > pages){
		page = pages
	}

	if(pages == 0){
		page = 1
	}

	let list = [];
	for(let i=1;i<=pages;i++){
		list.push(i)
	}
	let skip = (page - 1) * limit ;

	let findData = model.find(query,projection);

	if(populates){
		populates.forEach(populate=>{
			findData = findData.populate(populate)
		})
	}

	const docs = await findData.sort(sort).skip(skip).limit(limit);

	return {
		docs,
		page,
		pages,
		list
	}


}

module.exports = pagination