(function($){

    ClassicEditor
    .create( document.querySelector( '#content' ),{
    	language:'zh-cn',
    	// 配置上传图片
    	ckfinder:{
			uploadUrl:'/admin/uploadImage'
		}    	
    } )
    .catch( error => {
        console.error( error );
    } );


})(jQuery);