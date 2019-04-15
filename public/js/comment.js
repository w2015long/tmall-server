(function($){
	$('.btn-comment').on('click',function(){
		var content = $('#comment').val().trim()
		var $warning = $('p.err');
		if(!content){
			$warning.html('请输入评论')
		}else if(content.length > 100){
			$warning.html('评论过长')
		}else{
			$warning.html('')
		}

		//评论属于具体哪一篇博文
		var id = $(this).data('id');
		
		$.ajax({
			url:'/comment/add',
			type:'post',
			dataType:'json',
			data:{
				content:content,
				article:id
			}
		})
		.done(function(result){
			//评论后 评论框致空
			$('#comment').val('')

			//刷新一下评论页面
			$('#page-comment').trigger('get-data',[result.data])

		})
		.fail(function(err){
			console.log(err)
		})
	})


})(jQuery);