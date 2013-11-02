<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" import="java.util.*,ictedu.*,com.google.gson.Gson"%>
<%
request.setCharacterEncoding("UTF-8");
Hashtable t_return = null;
String className = request.getParameter("class");

if(className==null){
	out.print("no class");	
}else{
	if(className.equals("exam_question")){
		t_return = exam_question.callFunction(request);
	}
	else if(className.equals("basic_user")){
		t_return = basic_user.callFunction(request);
	}

	String s_out = new Gson().toJson(t_return);
	out.print(s_out);	
}

%>
