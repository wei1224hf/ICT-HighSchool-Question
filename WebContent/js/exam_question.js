var exam_question = {

	 config: null
	,loadConfig: function(afterAjax){
		$.ajax({
			url: config_path__exam_question__loadConfig
			,dataType: 'json'
	        ,type: "POST"
	        ,data: {
                 executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
	        } 			
			,success : function(response) {
				response.types = [
				                  {code:"1",value:"单选题"},
				                  {code:"2",value:"多选题"},
				                  {code:"3",value:"判断题"},
				                  {code:"4",value:"填空"},
				                  {code:"5",value:"组合"},
				                  {code:"6",value:"简答"},
				                  {code:"7",value:"题纲"}
	            ];
				exam_question.config = response;
				if ( typeof(afterAjax) == "string" ){
					eval(afterAjax);
				}else if( typeof(afterAjax) == "function"){
					afterAjax();
				}
			}
			,error : function(){				
				alert(top.il8n.disConnect);
			}
		});	
	}	
	
	,grid: function(){
		var config = {
				id: 'exam_question__grid'
				,height:'100%'
				,pageSizeOptions: [10, 20, 30, 40, 50 ,2000]
				,columns: [
				     { display: top.getIl8n("id"), name: 'id', isSort: true, hide:true }
				     ,{ display: top.getIl8n("exam_question","subject"), name: 'subject_code', width: 100,
				    	 render: function(a,b,c,d){
				    		 for(var i=0;i<exam_question.config.exam_subject.length;i++){
				    			 var item = exam_question.config.exam_subject[i];
				    			 if(item.code == c ){
				    				 return item.value;
				    			 }
				    		 }
				    	 }}
				    ,{ display: top.getIl8n("title"), name: 'title', width: 250 }
				    ,{ display: top.getIl8n("type"), name: 'type_', width: 100 }
				    ,{ display: top.getIl8n("exam_question","difficulty"), name: 'difficulty', width: 100 }
			    
				],  pageSize:20 ,rownumbers:true
				,parms : {
	                executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session     
				},
				url: config_path__exam_question__grid,
				method: "POST"				
				,toolbar: { items: []}
		};
		
		var search = getParameter("search", window.location.toString() );
		if(search!=""){
			config.parms.search = search;
		}else{
			config.parms.search = "{}";
		}	
		
		var permission = [
		     {code:"600701",name:"查询"}
		     /*
		    ,{code:"600702",name:"查看"}
		    ,{code:"600711",name:"导入"}
		    ,{code:"600712",name:"导出"}
		    ,{code:"600713",name:"word导出"}
		    ,{code:"600722",name:"修改"}
		    */
		    ,{code:"600723",name:"删除"}
		    ,{code:"600790",name:"练习"}		    
		];

		for(var i=0;i<permission.length;i++){
			var theFunction = null;
			var actionCode = permission[i].code;
			
			actionCode = actionCode.substring(actionCode.length-2,actionCode.length);
			permission[i].icon = "../file/icon16X16/"+actionCode+"_16X16.gif";
			if(actionCode=='01'){
				theFunction = exam_question.search;
			}
			else if(actionCode=='02'){
				theFunction = function(){
					var selected = exam_question.grid_getSelectOne();

                	var id = selected.id;
                    if(top.$.ligerui.get("exam_question__view_"+id)){
                        top.$.ligerui.get("exam_question__view_"+id).show();
                        return;
                    }					
					top.$.ligerDialog.open({ 
						url: 'exam_question__view.html?id='+selected.id+'&random='+Math.random()
						,height: 350
						,width: 590
						,title: selected.name
						,isHidden: false
						, showMax: true
						, showToggle: true
						, showMin: true						
						,id: 'exam_question__view_'+selected.id
						, modal: false
					}).max();	
					
			        top.$.ligerui.get("exam_question__view_"+selected.id).close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("exam_question__view_"+selected.id));
			        };
				};
				
			}
			else if(actionCode=='11'){
				theFunction = exam_question.upload;
			}
			else if(actionCode=='12'){
				theFunction = exam_question.download;
			}
			else if(actionCode=='21'){
				theFunction = function(){		
					top.$.ligerDialog.open({ 
						 url: 'exam_question__add.html'
						,height: 530
						,width: 400
						,isHidden: false
						, showMax: true
						, showToggle: true
						, showMin: true	
						,id: "exam_question__add"
						, modal: false
						,title: getIl8n("exam_question","resident")+getIl8n("add")
					});	
					
			        top.$.ligerui.get("exam_question__add").close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("exam_question__add"));
			        };					
				};
			}
			else if(actionCode=='22'){               					
				theFunction = function(){
	            	if(top.$.ligerui.get("exam_question__modify")){
	            		alert("close first");return;
	            	}else{
						var selected = exam_question.grid_getSelectOne();
	            		var id = selected.id;
	            	}					
					
					top.$.ligerDialog.open({ 
						 url: 'exam_question__modify.html?id='+id+"&for=bar"
						,height: 400
						,width: 400
						,isHidden: false
						, showMax: true
						, showToggle: true
						, showMin: true	
						,id: "exam_question__modify"
						, modal: false
					});	
					
			        top.$.ligerui.get("exam_question__modify").close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("exam_question__modify"));
			        };						
				};
			}
			else if(actionCode=='23'){
				theFunction = exam_question.remove;
				config.checkbox = true;
			}
			else if(actionCode=='90'){
				theFunction = function(){
					var selected = $.ligerui.get('exam_question__grid').getSelecteds();
					if(selected.length==0)return;
					var ids = "";
					for(var i=0;i<selected.length;i++){
						ids += selected[i].id+",";
					}
					ids = ids.substring(0, ids.length-1);
					
					var id = selected.id;
					top.$.ligerDialog.open({ 
						url: 'exam_question__do.html?ids='+ids+'&random='+Math.random()
						,height: 350
						,width: 400
						,title: selected.title
                        ,showMax: true
                        ,showToggle: true
                        ,showMin: true
                        ,isResize: true
                        ,modal: false
                        ,slide: false  
                        ,isHidden:false
						,id: 'exam_question__do_'
					}).max();	
					
			        top.$.ligerui.get("exam_question__do_").close = function(){
			            top.$.ligerui.win.removeTask(this);
			            this.unmask();
			            this._removeDialog();
			            top.$.ligerui.remove(this);
			        };
				};
			}			
			
			config.toolbar.items.push({line: true });
			config.toolbar.items.push({
				text: permission[i].name , img:permission[i].icon , click : theFunction
			});
		}
		
		$(document.body).ligerGrid(config);
	}
	
	,grid_getSelectOne: function(){
		var selected;
		if($.ligerui.get('exam_question__grid').options.checkbox){
			selected = $.ligerui.get('exam_question__grid').getSelecteds();
			if(selected.length!=1){ 
				alert(getIl8n("selectOne") );
				return;
			}
			selected = selected[0];
		}else{
			selected = $.ligerui.get('exam_question__grid').getSelected();
			if(selected==null){
				alert(getIl8n("selectOne"));
				return;
			}
		}	
		return selected;
	}
	
	,remove: function(){
		var selected = $.ligerui.get('exam_question__grid').getSelecteds();
		if(selected.length==0){alert(top.getIl8n('noSelect'));return;}
		if(confirm( top.getIl8n('sureToDelete') )){
			var ids = "";
			for(var i=0; i<selected.length; i++){
				ids += selected[i].id+",";
			}
			ids = ids.substring(0,ids.length-1);				
			
			$.ajax({
				url: config_path__exam_question__remove,
				data: {
					 ids: ids 
	                ,executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session
				}
				,type: "POST"
				,dataType: 'json'
				,success: function(response) {
					if(response.status=="1"){
						$.ligerui.get('exam_question__grid').loadData();
					}else{
						alert(response.msg);
					}
				},
				error : function(){					
					alert(top.getIl8n('disConnect'));
				}
			});				
		}		
	}
	
	,upload: function(){		
		
		top.$.ligerDialog.open({ 
			 content: "<iframe id='exam_question_upload_if' style='display:none' name='send'><html><body>x</body></html></iframe><form id='xx' method='post' enctype='multipart/form-data' action="+
			 	config_path__exam_question__upload+"&executor="+top.basic_user.loginData.username+"&session="+top.basic_user.loginData.session+
			 	" target='send'><input name='file' type='file' /><input type='submit' value='"+top.getIl8n('submit')+"' /></form>"
			,height: 250
			,width: 400
			,isHidden: false
			,id: "exam_question__upload"
		});
		
		top.$.ligerui.get("exam_question__upload").close = function(){
            var g = this;
            top.$.ligerui.win.removeTask(this);
            g.unmask();
            g._removeDialog();
            top.$.ligerui.remove(top.$.ligerui.get("exam_question__upload"));
        };			

		top.$("#exam_question_upload_if").load(function(){
	        var d = top.$("#exam_question_upload_if").contents();	        
	        var s = $('body',d).html() ;
	        if(s=='')return;
	        eval("var obj = "+s);
	        if(obj.status=='1'){
				alert(obj.msg);
	        }
	    }); 
	}	
	
	,download: function(){

		var data = $.ligerui.get('exam_question__grid').options.parms;
		data.pagesize = $.ligerui.get('exam_question__grid').options.pageSize;
		data.page = $.ligerui.get('exam_question__grid').options.page;
		
		
		$.ajax({
			 url: config_path__exam_question__download
			,data: data
			,type: "POST"
			,dataType: 'json'
			,contentType: "application/x-www-form-urlencoded; charset=gb2312"
			,success: function(response) {
				top.$.ligerDialog.open({ 
					 content: "<a href='"+response.file+"' target='_blank'>download</a>"
					,height: 250
					,width: 400
					,isHidden: false
					,id: "exam_question__download"
				});
				
				top.$.ligerui.get("exam_question__download").close = function(){
		            var g = this;
		            top.$.ligerui.win.removeTask(this);
		            g.unmask();
		            g._removeDialog();
		            top.$.ligerui.remove(top.$.ligerui.get("exam_question__download"));
		        };		
			    		
			},
			error : function(){
				
				alert(top.getIl8n('disConnect'));
			}
		});	
	}
		
	,add: function(){
		var config = {
			id: 'exam_question__add',
			fields: [
			     { display: top.getIl8n('title'), name: "title", type: "text", validate: { required:true } }	
			    ,{ display: top.getIl8n('type'), name: "type", type: "select", options :{data : exam_question.config.type, valueField : "code" , textField: "value" } }
			    
			    ,{ display: top.getIl8n('exam_question','cent'), name: "cent", type: "number", validate: { required:true } }	
				,{ display: top.getIl8n('exam_question','subject_code'), name: "subject_code", type: "select", options :{data : exam_question.config.exam_subject, valueField : "code" , textField: "value" } }
				,{ display: top.getIl8n('exam_question','answer'), name: "answer", type: "text", validate: { required:true } }	
				,{ display: top.getIl8n('exam_question','description'), name: "description", type: "text" }	
				,{ display: top.getIl8n('exam_question','difficulty'), name: "difficulty", type: "number", validate: { required:true }  }	
				,{ display: top.getIl8n('exam_question','path_listen'), name: "path_listen", type: "text" }	
				,{ display: top.getIl8n('exam_question','path_img'), name: "path_img", type: "text" }	
			]
		};
		
		$(document.body).append("<form id='form_add' method='post' name='form_add'></form>");
		$('#form_add').ligerForm(config);	
		
		
		$("[ligeruiid=description]").attr("disabled",true);
		$("[ligeruiid=description]").parent().css("background-color","#ebebee");
		$("li:last",$("[ligeruiid=description]").parent().parent().parent()).css("width","80px").append("&nbsp;<a href='#' onclick='exam_question.addContent(\"description\")' ><img src='../file/icon16X16/02_16X16.gif' /></a>");
		$("[ligeruiid=path_img]").attr("disabled",true);
		$("[ligeruiid=path_img]").parent().css("background-color","#ebebee");
		$("li:last",$("[ligeruiid=path_img]").parent().parent().parent()).css("width","80px").append("&nbsp;<a href='#' onclick='exam_question.addPerson()' ><img src='../file/icon16X16/02_16X16.gif' /></a>");
		$("#[ligeruiid=path_listen]").attr("disabled",true);
		$("#[ligeruiid=path_listen]").parent().css("background-color","#ebebee");
		$("li:last",$("#[ligeruiid=path_listen]").parent().parent().parent()).css("width","80px").append("&nbsp;<a href='#' onclick='exam_question.addPerson()' ><img src='../file/icon16X16/02_16X16.gif' /></a>");
		
		$('#form_add').append('<br/><br/><br/><br/><input name="submit" type="submit" value="'+top.getIl8n('submit')+'" id="exam_question__submit" class="l-button l-button-submit" />' );
		
		$.metadata.setType("attr", "validate");
		var v = $('#form_add').validate({
			debug: true,
			errorPlacement: function (lable, element) {
                if (element.hasClass("l-textarea")) {
                    element.addClass("l-textarea-invalid");
                }
                else if (element.hasClass("l-text-field")) {
                    element.parent().addClass("l-text-invalid");
                }
			},
			success: function (lable) {
                var element = $("#" + lable.attr("for"));
                var nextCell = element.parents("td:first").next("td");
                if (element.hasClass("l-textarea")) {
                    element.removeClass("l-textarea-invalid");
                }
                else if (element.hasClass("l-text-field")) {
                    element.parent().removeClass("l-text-invalid");
                }
			},
			submitHandler: function () {
				if(exam_question.ajaxState)return;
				exam_question.ajaxState = true;
				$("#exam_question__submit").attr("value",top.getIl8n('waitting'));
				
				var data = {};
				var doms = $("input[type='text']",$('#form_add'));
				for(var i=0;i<doms.length;i++){
					var theid = $(doms[i]).attr('ligeruiid');
					var thetype = $(doms[i]).attr('ltype');                                                        
				 
					var thevalue = $.ligerui.get(theid).getValue();
					if(thetype=='date')thevalue = $('#'+theid).val();
					if(thevalue!="" && thevalue!=0 && thevalue!="0" && thevalue!=null){
						eval("data."+theid+"='"+thevalue+"'");
					}
				}			
				
				$.ajax({
					url: config_path__exam_question__add,
					data: {
		                 executor: top.basic_user.loginData.username
		                ,session: top.basic_user.loginData.session
		                
						,data: $.ligerui.toJSON(data)
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {	
						if(response.status=="1"){
							exam_question.ajaxState = false;
							alert(top.getIl8n('done'));
							$("#exam_question__submit").attr("value", top.getIl8n('submit') );
						}else{
							alert(response.msg);
							exam_question.ajaxState = false;
							$("#exam_question__submit").remove();
						}
					},
					error : function(){
						alert(top.il8n.disConnect);
					}
				});	
				
			}
		});
	}	
	
    ,addContent: function(inputid){
        var win = top.$.ligerui.get("win_addContent");
        if(win){                        
            top.$.ligerui.win.addTask(win);
            win.show();
            var iframeDom = top.$.ligerui.get("win_addContent").frame;        
            iframeDom.set($.ligerui.get('content').getValue());                        
        }else{
            win = top.$.ligerDialog.open({ 
                  id : "win_addContent"
                  
                , height: 500
                , url: "content_editor.html?rand="+Math.random()
                , width: 750
                
                , isHidden: true 
                , showMax: true
                , showToggle: true
                , showMin: true
                , isResize: true
                , modal: false
                , slide: false
                , title: top.getIl8n('contentEditor')
                , buttons:[{
	                text: top.getIl8n('save'), onclick: function(){
	                         var iframeDom = top.$.ligerui.get("win_addContent").frame;        
	                         iframeDom.getContent();
	                         $.ligerui.get(inputid).setValue(top.myglobal.content_editor);
	                }
                }]                                
            });                
        }
        win.hide = function(){
                top.$.ligerui.win.removeTask(this);
                this._hideDialog();
        };
	}
	

	,ajaxState: false 	
	,modify: function(){
			
		var config = {
			id: 'exam_question__add',
			fields: [
				 { display: top.getIl8n('name'), name: "name", type: "text", validate: { required:true } }	
							
				,{ display: top.getIl8n('exam_question','time_in'), name: "time_in", type: "date", validate: { required:true } }
				,{ display: top.getIl8n('exam_question','time_out'), name: "time_out", type: "date", validate: { required:true } }
				,{ display: top.getIl8n('exam_question','person_id'), name: "person_id", type: "text", validate: { required:true } }
				,{ display: top.getIl8n('exam_question','job'), name: "job", type: "text", validate: { required:true } }
				
				,{ display: top.getIl8n('exam_question','job_code'), name: "job_code", type: "select", options :{data : exam_question.config.industry, valueField : "code" , textField: "value", slide: false }, validate: {required:true} }
				,{ display: top.getIl8n('exam_question','relation'), name: "relation", type: "select", options :{data : exam_question.config.exam_question__relation, valueField : "code" , textField: "value", slide: false }, validate: {required:true} }
						
				,{ display: top.getIl8n('type'), name: "exam_question__type", type: "select", options :{data : exam_question.config.exam_question__type, valueField : "code" , textField: "value", slide: false }, validate: {required:true} }
				,{ display: top.getIl8n('types'), name: "exam_question__types", type: "select", options :{data : exam_question.config.exam_question__types,isShowCheckBox: true, isMultiSelect: true, valueField : "code" , textField: "value", slide: false } }
				,{ display: top.getIl8n('status'), name: "exam_question__status", type: "select", options :{data : exam_question.config.exam_question__status, valueField : "code" , textField: "value", slide: false }, validate: {required:true} }	
			]
		};
		
		$(document.body).append("<form id='form'></form>");
		$('#form').ligerForm(config);	
		$("#person_id").attr("disabled",true);
		$("li:last",$("#person_id").parent().parent().parent()).css("width","80px").append("&nbsp;<a href='#' onclick='exam_question.modifyPerson()' >"+ top.getIl8n('exam_question','personInfo')+"</a>");				
		
		$('#form').append('<br/><br/><br/><br/><input type="submit" value="'+top.getIl8n('submit')+'" id="exam_question__submit" class="l-button l-button-submit" />' );

		var v = $('#form').validate({
			debug: true,
			errorPlacement: function (lable, element) {
				if (element.hasClass("l-text-field")) {
					element.parent().addClass("l-text-invalid");
				} 
			},
			success: function (lable) {
				var element = $("[ligeruiid="+$(lable).attr('for')+"]",$("form"));
				if (element.hasClass("l-text-field")) {
					element.parent().removeClass("l-text-invalid");
				}
			},
			submitHandler: function () {
				if(exam_question.ajaxState)return;
				exam_question.ajaxState = true;
				$("#exam_question__submit").attr("value",top.getIl8n('waitting'));
				
				var gisid = getParameter("gisid", window.location.toString() )
				if(gisid=="")gisid = "0";
				
				$.ajax({
					url: config_path__exam_question__modify,
					data: {
		                 executor: top.basic_user.loginData.username
		                ,session: top.basic_user.loginData.session
		                
						,data: $.ligerui.toJSON({
							 id: getParameter("id", window.location.toString() )

							,time_in: $('#time_in').val()
							,time_out: $('#time_out').val()
							,name: $.ligerui.get('name').getValue()
							,person_id: $.ligerui.get('person_id').getValue()
							,types: $.ligerui.get('exam_question__types').getValue().replace(";",",")
							,type: $.ligerui.get('exam_question__type').getValue()
							,status: $.ligerui.get('exam_question__status').getValue()
							,job: $.ligerui.get('job').getValue()
							,job_code: $.ligerui.get('job_code').getValue()
							,relation: $.ligerui.get('relation').getValue()
							
						})
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						//服务端添加成功,修改 AJAX 通信状态,修改按钮的文字信息,读取反馈信息
						if(response.status=="1"){
							exam_question.ajaxState = false;
							alert(top.getIl8n('done'));
							$("#exam_question__submit").attr("value", top.getIl8n('submit') );
						//服务端添加失败
						}else{
							alert(response.msg);
							exam_question.ajaxState = false;
							$("#exam_question__submit").remove();
						}
					},
					error : function(){
						alert(top.il8n.disConnect);
					}
				});	
			}
		});
		
		//从服务端读取信息,填充表单内容
		$.ajax({
			url: config_path__exam_question__view
			,data: {
				id: getParameter("id", window.location.toString() )
				
				//服务端权限验证所需
				,executor: top.basic_user.loginData.username
				,session: top.basic_user.loginData.session
			}
			,type: "POST"
			,dataType: 'json'						
			,success: function(response) {	
			    var data = response.data;	
				
				$.ligerui.get('name').setValue(data.name);
				$.ligerui.get('time_in').setValue(data.time_in);
				$.ligerui.get('time_out').setValue(data.time_out);
				$.ligerui.get('person_id').setValue(data.person_id);
				$.ligerui.get('job').setValue(data.job);
				$.ligerui.get('job_code').setValue(data.job_code);
				$.ligerui.get('relation').setValue(data.relation);
				$.ligerui.get('exam_question__type').setValue(data.type);
				$.ligerui.get('exam_question__status').setValue(data.status);
				$.ligerui.get('exam_question__types').setValue(data.types.replace(",",";"));		
								
			}
		});
	}	

	
	//页面列表ligerUI控件	
	,searchOptions: {}	
	/**
	 * 与表格功能对应的 查询条件 
	 * 
	 * 查询条件有 用户名关键字,状态,类型,金币,用户组关键字
	 * */
	,search: function(){
		var formD;
		if($.ligerui.get("formD")){
			formD = $.ligerui.get("formD");
			formD.show();
		}else{
			var form = $("<form id='search_from'></form>");
			$(form).ligerForm({
				inputWidth: 170
				,labelWidth: 90
				,space: 40
				,fields: [
					 { display: top.getIl8n('type'), name: "search___type", newline: true, type: "select", options :{data : exam_question.config.types, valueField : "code" , textField: "value" } }			
					,{ display: top.getIl8n("exam_question","subject"), name: "search___exam_subject", newline: true, type: "select", options :{data : exam_question.config.exam_subject, valueField : "code" , textField: "value" } }			
				]
			}); 
			$.ligerDialog.open({
				 id: "formD"
				,width: 350
				,height: 200
				,content: form
				,title: top.getIl8n('search')
				,buttons : [
				    //清空查询条件
					{text: top.getIl8n('clear'), onclick:function(){
						$.ligerui.get("exam_question__grid").options.parms.search = "{}";
						$.ligerui.get("exam_question__grid").loadData();

						var doms = $("input[type='text']",$('#search_from'));
						for(var i=0;i<doms.length;i++){
							var theid = $(doms[i]).attr('id');
							$.ligerui.get(theid).setValue("");
						}
					}},
					//提交查询条件
				    {text: top.getIl8n('search'), onclick:function(){
						var data = {};
						
						var doms = $("input[type='text']",$('#search_from'));
						for(var i=0;i<doms.length;i++){
							var theid = $(doms[i]).attr('id');
							var thekey = theid.replace('search___',"");
							var thetype = $(doms[i]).attr('ltype');							
						
							var thevalue = $.ligerui.get(theid).getValue();
							if(thetype=='date')thevalue = $('#'+theid).val();
							if(thevalue!="" && thevalue!=0 && thevalue!="0" && thevalue!=null){
								eval("data."+thekey+"='"+thevalue+"'");
							}
						}
						
						$.ligerui.get("exam_question__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("exam_question__grid").loadData();
				}}]
			});
		}
	}
	
	/**
	 * 查看一个用户信息
	 * */
	,viewData: {}
	,view: function(){
		var id = getParameter("id", window.location.toString() );
    	
    	var htmls = "";
    	$.ajax({
            url: config_path__exam_question__view
            ,data: {
                id: id 
                ,executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
            },
            type: "POST",
            dataType: 'json',
            success: function(response) {
            	
            	if(response.status!="1")return;
            	var data = response.data;
            	
            	exam_question.viewData = response.data;
            	for(var j in data){   

            		if(j=='id'||j=='remark')htmls+="<div style='width:100%;float:left;display:block;margin-top:5px;'/>";
            		            		
            		if(j=='remark'||j=='types_'||j=='job'){
	            		eval("var key = getIl8n('exam_question','"+j+"');");
	            		htmls += "<span class='view_lable' style='width:95%'>"+key+"</span><span style='width:95%' class='view_data'>"+data[j]+"</span>";
            		}else{
            			eval("var key = getIl8n('exam_question','"+j+"');");
                		htmls += "<span class='view_lable'>"+key+"</span><span class='view_data'>"+data[j]+"</span>";
            		}
            	}; 
            	$(document.body).html("<div id='menu'  ></div><div id='navtab' style='width:100%;margin-top:5px;'><div tabid='resident' id='resident' title='"+top.getIl8n('exam_question','resident')+"' ></div><div title='"+top.getIl8n('oa_person','person')+"' tabid='person' id='person' style='height:100%' ><iframe frameborder='0' name='person' src='oa_person__view.html?id="+data.person_id+"'></iframe></div>");
            	$("#navtab").ligerTab(); 
            	$("#resident").html(htmls);
            	            	
            	//查看详细,页面上也有按钮的
            	var items = [];            	
                var permission = top.basic_user.permission;
                for(var i=0;i<permission.length;i++){
                    if(permission[i].code=='52'){
                    	if(typeof(permission[i].children)=='undefined')return;
                        permission = permission[i].children;
                        break;
                    }
                }      
                for(var i=0;i<permission.length;i++){
                    if(permission[i].code=='5203'){
                    	if(typeof(permission[i].children)=='undefined')return;
                        permission = permission[i].children;
                        break;
                    }
                }   
                for(var i=0;i<permission.length;i++){
                    if(permission[i].code=='520302'){
                    	if(typeof(permission[i].children)=='undefined')return;
                        permission = permission[i].children;
                        break;
                    }
                }            
                
                for(var i=0;i<permission.length;i++){        
                	var theFunction = function(){};
                    if(permission[i].code=='52030223'){
                        theFunction = function(){};
                    }else if(permission[i].code=='52030222'){
                        theFunction = function(){};
                    }else if(permission[i].code=='52030290'){
                        theFunction = function(){};
                    }else if(permission[i].code=='52030291'){
                        theFunction = function(){};
                    }
                    
                    items.push({line: true });	
					items.push({text: permission[i].name , img:permission[i].icon , click : theFunction});
                }                
                if(items.length>0){
	            	$("#menu").ligerToolBar({
	            		items:items
	            	});
                }

            },
            error : function(){               
                alert(top.il8n.disConnect);
            }
        });
	}
};

