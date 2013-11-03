var paper = {
	    
	objName: 'paper',
    questions : [],   //题目集
    count : {
        giveup : 0,   //漏题数量,放弃不做的
        right : 0,    //作对数
        wrong : 0,    //做错
        total : 0,     //题目总数
        byTeacher : 0  //需要教师批改的题目总数
    },

    state : '',       //试卷状态 
    mode : 'server',  //服务端模式或者 client 单机模式
    cent : 0,         //卷子总分
    cent_ : 0,        //我的得分
    
    brief: {}
   
    ,wls_quiz_nav : function(id) {
        $("#wls_quiz_main").parent().scrollTop($("#wls_quiz_main").parent().scrollTop() * (-1));
        var target = $('#wls_quiz_main').find('#w_qs_'+id);
        $("#wls_quiz_main").parent().scrollTop($(target).offset().top-30);
    }

    ,initLayout : function() {
		 $(document.body).append(''+
		 '<div id="layout1"> '+ 
		 ' <div position="left" title="'+top.getIl8n('exam_paper','navigation')+'"> '+
		 ' <table><tr><td> '+
		 ' <div id="navigation" ></div> '+
		 ' </td></tr> '+
		 ' <tr><td> '+
		 ' <br/> '+
		 ' <div id="paperBrief" style=" background-color: #FAFAFA; border: 1px solid #DDDDDD;" ></div>'+
		 ' </td></tr> '+
		 ' <tr><td> '+
		 ' <br/> '+
		 ' <input id="submit" style="width:100px;" class="l-button l-button-submit" onclick="'+this.objName+'.submit();" value="'+top.getIl8n('exam_paper','submit')+'"></input> '+
		 ' </td></tr> '+
		 ' </table> '+
		 ' </div> '+
		 ' <div position="center" title="'+top.getIl8n('exam_paper','title')+'" ><div type="submit" id="wls_quiz_main" class="w_q_container"></div></div> '+
		 '</div> '+
		 '');
        
        $("#layout1").ligerLayout(); 
    }  
    
    ,initQuestions : function() {
    	
    	var quesData = this.questions;
    	var questions_ = [];
    	
    	var index = 1;
        for(var i=0;i<quesData.length;i++){
            var question = null;
            if(quesData[i].type==1){//单项选择题
                question = new question_choice();
                question.option_length = quesData[i].option_length;
                question.options = [];
                for(var ii=1;ii<=parseInt(quesData[i].option_length);ii++){
                    eval("question.options.push(quesData[i].option_"+ii+")");
                }
                question.index = index;index++;
                question.layout = quesData[i].layout;
                question.title = quesData[i].title;                       
            }
            else if(quesData[i].type==2){//多项选择题
                question = new question_multichoice();
                question.option_length = quesData[i].option_length;
                question.index = index;index++;
                question.layout = quesData[i].layout;
                question.title = quesData[i].title;
                question.options = [];
                for(var ii=1;ii<=parseInt(quesData[i].option_length);ii++){
                    eval("question.options.push(quesData[i].option_"+ii+")");
                }
            }
            else if(quesData[i].type==3){//判断题
                question = new question_check();
                question.index = index;index++;
                question.layout = quesData[i].layout;
                question.title = quesData[i].title;
                question.options = [quesData[i].option1,quesData[i].option2];
            }else if(quesData[i].type==7){//大题, 不需要题编号
                question = new question_big();
                question.title = quesData[i].title;
            }else if(quesData[i].type==4){//填空题
                question = new question_blank();
                question.index = index;index++;
                question.title = quesData[i].title;
            }else if(quesData[i].type==5){//组合题, 不需要题编号
                question = new question_mixed();
                question.title = quesData[i].title;
            }else if(quesData[i].type==6){//简答题
            	question = new question_writings();
            	question.index = index;index++;
            }else{
                continue;
            }
            //console.debug(index+"     "+quesData[i].type);
            question.type = quesData[i].type;
            question.path_listen = quesData[i].path_listen;
            question.path_img = quesData[i].path_img;
            question.cent = quesData[i].cent;
            question.id = quesData[i].id;
            question.id_parent = quesData[i].id_parent;
            question.paper = this;
            if(quesData[i].answer){
            	question.answer = quesData[i].answer;
            	question.description = quesData[i].description;
            }
            question.initDom();
            questions_.push(question);
        }    	
        this.questions = questions_;   	

    	$('#wls_quiz_main').parent().css("overflow","auto");
     }
     
    ,initNavigation : function() {
         var str = '';
         var index = 1;
         for (var i = 0; i < this.questions.length; i++) {
             var type = this.questions[i].type;

             if( type==1||type==2||type==3||type==4||type==6){
            	 var css_class = "w_q_sn_undone";
            	 if(type==4 || type==6){
            		 css_class = "w_q_sn_mark";
            	 }
                 str += "<div class='"+css_class+"' id='w_q_subQuesNav_"
                         + this.questions[i].id
                         + "' onclick='paper.wls_quiz_nav("
                         + this.questions[i].id
                         + ")' style='height:18px;'><a href='#' style='border:0px;font-size:10px;margin-top:2px;' >"
                         + index + "</a></div>";
                 index ++;
             }
         }
         $("#navigation").append(str);
    }
    
    ,initBrief: function(){   
    	$(".l-layout-header",$(".l-layout-center")).html( this.title );
    	var htmlStr = "";

    	for(var j in this.brief){    
    		
    		eval("var value = this.brief."+j);
    		eval("var key = top.getIl8n('exam_"+this.objName+"','"+j+"')");
    		htmlStr += "<span class='brief' style='width:50px;'>"+key+"</span><span class='brief'>&nbsp;"+value+"</span><br/>";
    	}; 
    	
        $('#paperBrief').html(htmlStr);
        //setInterval($('#paperBrief').fadeOut(500).fadeIn(500),2000);
    }
    
    ,readPaper: function(afterAjax){
        var id = getParameter("id", window.location.toString() );
        this.id_paper = id;
        var paperObj = this;
        $.ajax({
             url: config_path__exam_paper__view
            ,type: "POST"
            ,data: {
            	 id: getParameter("id", window.location.toString() )
                ,executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
            }      
            ,dataType: 'json'
            ,success : function(response) {
            	var data = response.data;

            	paperObj.title = data.title;
            	paperObj.brief = {
     		       subject_name: data.subject_name
     		       ,cost: data.cost
    		       ,count_question: data.count_question
    		       ,creater_code: data.creater_code
    		       ,cent: data.cent
            	};
                
                if ( typeof(afterAjax) == "string" ){
	                eval(afterAjax);
	            }else if( typeof(afterAjax) == "function"){
	                afterAjax();
	            }				
            }
            ,error : function(){
                alert('error');
            }
        });
    }   
    
    ,readQuestions: function(afterAjax){
        var paperObj = this;
        $.ajax({
            url : config_path__exam_paper__questions,
            type : "POST",
            data : {
            	 paper_id: getParameter("id", window.location.toString() )
            	 
                ,executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
            },
            dataType: 'json',
            success : function(responseData) {
                if(responseData.status!='1'){
                    alert(responseData.msg);return;
                }

                paperObj.questions = responseData.data;
                
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
    }
    
    ,submit: function(){
    	if(this.mode=='client'){
    		this.showDescription();
    		return;
    	}
    	/*
    	if(top.basic_user.loginData.type!='2'){
    		alert("only student can submit");
    		return;
    	}
    	*/
        if(this.state=='submitted'){
            alert("paper has submitted arleady");
            return;
        }
        this.state = 'submitted';
        $('#submit').val(top.getIl8n('exam_paper','waitting'));

        var toSend = [];
        var ids = "";
        for(var i=0;i<this.questions.length;i++){
        	var data = {
        			question_id: this.questions[i].id,
                    myanswer: this.questions[i].getMyAnswer()
                };
        	if(this.questions[i].type=='4' || this.questions[i].type=='6'){
        		data.img = this.questions[i].getImg();
        	}
            toSend.push(data);
            ids += this.questions[i].id+",";//搜集所有题目的编号
        }        
        ids = ids.substring(0,ids.length-1);//去掉最后一个 ,  TODO 
        var paperObj = this;
        
        $.ajax({
            url : config_path__exam_paper__submit,
            type : 'POST',
            data : {
                  json: $.ligerui.toJSON(toSend)
            	 ,paper_id: getParameter("id", window.location.toString() )
            	 
                 ,executor: top.basic_user.loginData.username
                 ,session: top.basic_user.loginData.session
            }, 
            dataType: 'json',
            success : function(response) {
            	if(response.status!='1'){
            		alert(response.msg);
            		return;
            	}
                var questions = response.answers;
                for(var i=0;i < questions.length;i++){
                	paperObj.questions[i].answer = questions[i].answer;
                	paperObj.questions[i].description = questions[i].description;                    
                }                
                paperObj.showDescription();
                
                paperObj.brief = {
	        		 mycent: response.result.mycent
	        		,cent: response.result.cent
	        		,mycent_objective: response.result.mycent_objective
	        		,count_right: response.result.right
	        		,count_wrong: response.result.wrong
                };
                paperObj.objName = "paper_log";
                paperObj.initBrief();
                
                $('#submit').remove();
            }
        });
    } 
    
    ,showDescription : function(){
        for(var i=0;i < this.questions.length;i++){
        	this.questions[i].showDescription();
        }    	
    }    
};