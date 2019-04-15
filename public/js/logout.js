(function($){

	//4.用户退出
	$('#logout').on('click',function(){
		$.ajax({
			url:'/user/logout'
		})
		.done(function(result){
			if(result.status == 0){//请求成功
				window.location.href = '/';
				// window.location.reload()
			}
		})
		.fail(function(err){
			return console.error('退出失败，请稍后重试')
		})
	})


})(jQuery);