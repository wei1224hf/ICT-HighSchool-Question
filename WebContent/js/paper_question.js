var paper_question = paper;	
paper_question.objName = 'paper_question';
paper_question.readQuestions = function(afterAjax){
	var paperObj = this;
	var ids = getParameter("ids", window.location.toString() );
    $.ajax({
        url : config_path__paper_question__readQuestions,
        type : "POST",
        data : {        	 
             executor: top.basic_user.loginData.username
            ,session: top.basic_user.loginData.session
            ,ids: ids
        },
        dataType: 'json',
        success : function(responseData) {
            paperObj.questions = responseData
            
            if ( typeof(afterAjax) == "string" ){
                eval(afterAjax);
            }else if( typeof(afterAjax) == "function"){
                afterAjax();
            }    
        },
        error : function(){
        	alert('error');
        }
    });
};
paper_question.submit = function(){    
    for(var i=0;i<this.questions.length;i++){        
    	this.questions[i].getMyAnswer();        
    }   	
    this.showDescription();    
    $('#submit').remove();
};