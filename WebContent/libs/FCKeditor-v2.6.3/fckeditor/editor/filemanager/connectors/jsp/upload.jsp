<%@ page contentType="text/html; charset=gbk"
	import="java.util.*,com.jspsmart.upload.*,com.google.gson.Gson,myapp.*"%>

<%
	// 新建一个SmartUpload对象
	SmartUpload su = new SmartUpload();
	// 上传初始化
	su.initialize(pageContext);
	// 设定上传限制
	// 1.限制每个上传文件的最大长度。
	// su.setMaxFileSize(10000);
	// 2.限制总上传数据的长度。
	// su.setTotalMaxFileSize(20000);
	// 3.设定允许上传的文件（通过扩展名限制）,仅允许doc,txt文件。
	//su.setAllowedFilesList("xls");
	// 4.设定禁止上传的文件（通过扩展名限制）,禁止上传带有exe,bat,jsp,htm,html扩展名的文件和没有
	//扩展名的文件。
	su.setDeniedFilesList("exe,bat,jsp,htm,html,,");
	// 上传文件
	su.upload();
	// 将上传文件全部保存到指定目录，需要先在在Web应用的根目录下，创建一个upload目录
	//int count = su.save("/file/upload");

	for (int i = 0; i < su.getFiles().getCount(); i++) {
		com.jspsmart.upload.File file = su.getFiles().getFile(i);
		// 若文件不存在则继续
		Calendar calendar = Calendar.getInstance();
		String filename = String.valueOf(calendar.getTimeInMillis())+"."+file.getFileExt();;
		String saveurl = application.getRealPath("/")+"file/upload/" + filename ;

		System.out.println(saveurl);
		file.saveAs(saveurl,SmartUpload.SAVE_PHYSICAL);		
		
		// 显示当前文件信息

			Hashtable t = new Hashtable();
			t.put("status", "1");
			t.put("msg", "ok");
			t.put("path", "../file/upload/" + filename );
		String str = "<script type=\"text/javascript\">(function(){var d=document.domain;while (true){try{var A=window.parent.document.domain;break;}catch(e) {};d=d.replace(/.*?(?:\\.|$)/,\'\');if (d.length==0) break;try{document.domain=d;}catch (e){break;}}})();window.parent.OnUploadCompleted(0,\""+"/file/upload/" + filename+"\",\""+filename+"\", \"\") ;</script>";
			out.println(str);
		break;
		
	}
%>