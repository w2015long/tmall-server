(function($){
	$.fn.extend({
		pagination:function(options){

			var $elem = $(this);
			//事件代理
			$elem.delegate('a','click',function(){
				var $this = $(this);
				//定义变量页码
				var page;
				//计算当前页
				var currentPage = $elem.find('.active a').html();
				var lable = $this.attr('aria-label');
				if(lable == 'Next'){
					page = currentPage * 1 + 1 ;
				}else if(lable == 'Previous'){
					page = currentPage * 1 - 1 ;
				}else{//点击的页码数
					page = $this.html();
				}
				//防止多次点击当前页
				if(currentPage == page){
					return false
				}

				//点击页码 发送ajax请求
				var url = options.url + '?page=' + page;
				var id = $elem.data('id');
				if(id){
					url += "&id=" + id
				}
				$.ajax({
					url:url,
					dataType:'json'
				})
				.done(function(result){
					if(result.status == 0){
						$elem.trigger('get-data',[result.data]);
					}
				})
				.fail(function(err){
					console.log(err);
				})

			})			
		}

	})



})(jQuery);