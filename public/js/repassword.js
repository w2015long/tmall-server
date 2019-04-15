
;(function($){
    var $repassword = $('#btn-repassword');
    var $form = $('.repassword');


    var passwordReg = /^\w{3,10}$/;
    $repassword.on('click',function(){
		var password = $form.find('[name="password"]').val();
        var repassword = $form.find('[name="repassword"]').val();

		var errMags = '';
        //密码3-6位字符
		if(!passwordReg.test(password)){
            errMags = '密码3-6位字符';
		}
		else if(repassword != password){
			errMags = '两次密码不一致'
		}

		if(errMags){//验证不通过
			$form.find('.err').html(errMags)
			return false
		}else{//验证通过
            $form.find('.err').html('');
        }            
        
    })
    
})(jQuery);
