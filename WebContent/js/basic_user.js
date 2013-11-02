var basic_user = {
	 loginData: {}
	,permission: []
	
	,login : function(username,password,afterAjax){
		if(this.ajaxState==true)return;
		this.ajaxState = true;
		$.ajax({
			url : config_path__basic_user__login,
			data : {
				username: username,
				password: password
			},
			type : "POST",
			dataType: 'json',
			success : function(data) {	
				basic_user.ajaxState = false;
				if(data.status!='2'){
					if(data.status=='3')alert(data.msg);
					top.basic_user.loginData = data.loginData;					
					top.basic_user.permission = data.permission;					
					top.il8n = data.il8n;					

					SetCookie("myApp_username",username,0.5);
					SetCookie("myApp_password",password,0.5); 
					
					if ( typeof(afterAjax) == "string" ){
						eval(afterAjax);
					}else if( typeof(afterAjax) == "function"){
						afterAjax();
					}		
				}else{
					alert(data.msg);
					delCookie("myApp_username");
					delCookie("myApp_password");
				}
			},
			error : function(){
				$.ligerDialog.error('net error');
			}
		});
	}
};