<%@ page contentType="text/xml; charset=utf-8"
	import="java.util.*,com.jspsmart.upload.*,java.io.File,myapp.tools"%><%
String Command = (String) request.getParameter("Command");
String CurrentFolder = (String) request.getParameter("CurrentFolder");
if(Command.equals("FileUpload")){
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
		String filename = file.getFileName().replace("."+file.getFileExt(),"")+"__"+String.valueOf(calendar.getTimeInMillis())+"."+file.getFileExt();;
		String saveurl = application.getRealPath("/")+"file/upload"+CurrentFolder + filename ;

		System.out.println(saveurl);
		file.saveAs(saveurl,SmartUpload.SAVE_PHYSICAL);		

		String str = "<script type=\"text/javascript\">\n"+
		"(function(){var d=document.domain;while (true){try{var A=window.parent.document.domain;break;}catch(e) {};d=d.replace(/.*?(?:\\.|$)/,\'\');if (d.length==0) break;try{document.domain=d;}catch (e){break;}}})();window.parent.OnUploadCompleted(0,\""+"/file/upload"+CurrentFolder + filename+"\",\""+filename+"\", \"\") ;</script>";
		response.setHeader("Content-Type","text/html");
		response.setContentType("text/html; charset=utf-8");
		out.print(str);
		break;
		
	}
}else if(Command.equals("GetFoldersAndFiles")||Command.equals("GetFolders")){
	String path = application.getRealPath("/")+"file/upload"+CurrentFolder;
	tools.filelist = new ArrayList<String>();
	tools.folderList = new ArrayList<String>();
	tools.getFiles(path);
	//http://localhost:8080/libs/FCKeditor-v2.6.3/fckeditor/editor/filemanager/connectors/jsp/connector.jsp?Command=FileUpload&Type=Image&CurrentFolder=%2F
	String xml = "<?xml version=\"1.0\" encoding=\"utf-8\" ?><Connector command=\""+Command+"\" resourceType=\"Image\"><CurrentFolder path=\""+CurrentFolder+"\" url=\"/file/upload"+CurrentFolder+"\" /><Folders>";
	for(int i=0;i<tools.folderList.size();i++){
		xml += "<Folder  name=\""+tools.folderList.get(i)+"\" />";
	}
	xml+="</Folders><Files>";
	for(int i=0;i<tools.filelist.size();i++){
		xml += "<File name=\""+tools.filelist.get(i)+"\" size=\"1\" />";
	}
	xml+="</Files></Connector>";
	out.print(xml);
}else if(Command.equals("CreateFolder")){
	String NewFolderName = (String) request.getParameter("NewFolderName");
	String path = application.getRealPath("/")+"file/upload"+CurrentFolder+NewFolderName;
	System.out.println(path);
	File file = new File(path);
	
    file.mkdirs();
	String xml = "<?xml version=\"1.0\" encoding=\"utf-8\" ?><Connector command=\""+Command+"\" resourceType=\"Image\"><CurrentFolder path=\""+CurrentFolder+"\" url=\"/file/upload"+CurrentFolder+"\" /><Error number=\"0\" originalDescription=\"\" /><Files>";
	out.print(xml);
}
%>