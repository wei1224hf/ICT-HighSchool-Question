<%@ page contentType="text/html; charset=gbk"
	import="java.util.*,com.jspsmart.upload.*,com.google.gson.Gson,myapp.*"%>

<%
	// �½�һ��SmartUpload����
	SmartUpload su = new SmartUpload();
	// �ϴ���ʼ��
	su.initialize(pageContext);
	// �趨�ϴ�����
	// 1.����ÿ���ϴ��ļ�����󳤶ȡ�
	// su.setMaxFileSize(10000);
	// 2.�������ϴ����ݵĳ��ȡ�
	// su.setTotalMaxFileSize(20000);
	// 3.�趨�����ϴ����ļ���ͨ����չ�����ƣ�,������doc,txt�ļ���
	//su.setAllowedFilesList("xls");
	// 4.�趨��ֹ�ϴ����ļ���ͨ����չ�����ƣ�,��ֹ�ϴ�����exe,bat,jsp,htm,html��չ�����ļ���û��
	//��չ�����ļ���
	su.setDeniedFilesList("exe,bat,jsp,htm,html,,");
	// �ϴ��ļ�
	su.upload();
	// ���ϴ��ļ�ȫ�����浽ָ��Ŀ¼����Ҫ������WebӦ�õĸ�Ŀ¼�£�����һ��uploadĿ¼
	//int count = su.save("/file/upload");

	for (int i = 0; i < su.getFiles().getCount(); i++) {
		com.jspsmart.upload.File file = su.getFiles().getFile(i);
		// ���ļ������������
		Calendar calendar = Calendar.getInstance();
		String filename = String.valueOf(calendar.getTimeInMillis())+"."+file.getFileExt();;
		String saveurl = application.getRealPath("/")+"file/upload/" + filename ;

		System.out.println(saveurl);
		file.saveAs(saveurl,SmartUpload.SAVE_PHYSICAL);		
		
		// ��ʾ��ǰ�ļ���Ϣ

			Hashtable t = new Hashtable();
			t.put("status", "1");
			t.put("msg", "ok");
			t.put("path", "../file/upload/" + filename );
		String str = "<script type=\"text/javascript\">(function(){var d=document.domain;while (true){try{var A=window.parent.document.domain;break;}catch(e) {};d=d.replace(/.*?(?:\\.|$)/,\'\');if (d.length==0) break;try{document.domain=d;}catch (e){break;}}})();window.parent.OnUploadCompleted(0,\""+"/file/upload/" + filename+"\",\""+filename+"\", \"\") ;</script>";
			out.println(str);
		break;
		
	}
%>