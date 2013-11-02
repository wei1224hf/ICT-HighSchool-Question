package ictedu;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.MessageDigest;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;

public class tools {

	public static Connection getExcelConn(){
		Connection conn = null;
		try {
			String driver = "com.hxtt.sql.excel.ExcelDriver";
			Class.forName(driver).newInstance();  
			String protocol = "jdbc:excel";  
			String database = tools.getConfigItem("APPPATH")+""+tools.getConfigItem("PAPER_FILE_PATH");  
			
			String url = protocol + ":/" + database;
			//url= url.replace("\\", "\\\\");
			System.out.println(url);
			conn = DriverManager.getConnection(url);
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}  

		return conn;	
	}
	
	private static String dbType = null;
	public static Connection getConn(){
		if(tools.dbType==null){
			tools.dbType = tools.getConfigItem("DB_TYPE");
		}
		
		if(tools.dbType.equals("excel")){
			return tools.getExcelConn();
		}
		else{
			return null;
		}
	}
	
	public static HashMap il8n = null;
	public static HashMap readIl8n() {
		if (tools.il8n == null) {
			tools.il8n = new HashMap();
			String path = tools.class.getClassLoader().getResource("")
					+ "../../language/" + tools.getConfigItem("IL8N") + "/";
			path = "/" + path.substring(6, path.length());
			try {
				File file = new File(path);
				File[] files = file.listFiles();
				for (File fl : files) {
					if (fl.isDirectory())
						continue;

					String path2 = path + fl.getName();
					System.out.println(path2);

					BufferedReader reader = new BufferedReader(
							new InputStreamReader(new FileInputStream(path2),
									"utf-8"));

					String line;
					HashMap current = new HashMap();

					String currentSecion = "nothing";

					while ((line = reader.readLine()) != null) {
						line = line.trim();
						// System.out.println(line.toString());
						if (line.matches("\\[.*\\]")) {
							currentSecion = line.replaceFirst("\\[(.*)\\]",
									"$1");
							// System.out.println(currentSecion);

						} else if (line.matches(".*=.*")) {
							if (current != null) {
								int i = line.indexOf('=');
								String name = line.substring(0, i);
								String value = line.substring(i + 1);
								value = value.replace("\"", "");
								// System.out.println(name+" "+value);
								current.put(name, value);
							}
						}
					}
					il8n.put(currentSecion, current);
					reader.close();
				}
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return tools.il8n;
	}

	public static ArrayList list2Tree(ArrayList a_list) {
		ArrayList a_return = new ArrayList();

		for (int i = 0; i < a_list.size(); i++) {
			Hashtable t = (Hashtable) a_list.get(i);
			int len = ((String) t.get("code")).length();
			if (len == 2) {
				a_return.add(t);
				continue;
			}

			ArrayList aa = new ArrayList();
			aa.add(a_return);

			for (int i2 = 2; i2 < len; i2 += 2) {
				ArrayList a = (ArrayList) aa.get(aa.size() - 1);
				int p = a.size() - 1;

				Hashtable item = (Hashtable) a.get(p);
				if (!item.containsKey("children")) {
					item.put("children", new ArrayList());
				}

				aa.add(item.get("children"));
			}
			((ArrayList) aa.get(aa.size() - 1)).add(t);

			for (int i3 = aa.size() - 1; i3 > 0; i3--) {
				((Hashtable) ((ArrayList) (aa.get(i3 - 1))).get(((ArrayList) aa
						.get(i3 - 1)).size() - 1)).put("children", aa.get(i3));
			}
			a_return = (ArrayList) aa.get(0);
		}

		return a_return;
	}

	public static String MD5(String s) {
		char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
				'A', 'B', 'C', 'D', 'E', 'F' };
		try {
			byte[] btInput = s.getBytes();
			MessageDigest mdInst = MessageDigest.getInstance("MD5");
			mdInst.update(btInput);
			byte[] md = mdInst.digest();
			int j = md.length;
			char str[] = new char[j * 2];
			int k = 0;
			for (int i = 0; i < j; i++) {
				byte byte0 = md[i];
				str[k++] = hexDigits[byte0 >>> 4 & 0xf];
				str[k++] = hexDigits[byte0 & 0xf];
			}
			return new String(str).toLowerCase();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static Document configXML = null;
	public static String configXMLFileName = "config.xml";
	public static String getConfigItem(String id) {
		String item = "";
		if (tools.configXML == null || id.equals("reLoad")) {
			tools.dbType = null;
			try {
				String path = tools.class.getClassLoader().getResource("")
						+ "../../" + tools.configXMLFileName;
				System.out.println(path);
				if (System.getProperty("os.name").contains("Windows")) {
					path = path.substring(6);
				} else {
					path = path.substring(5);
				}
				File file = new File(path);
				StringBuffer buffer = new StringBuffer();
				InputStreamReader isr = new InputStreamReader(
						new FileInputStream(file), "utf-8");
				BufferedReader br = new BufferedReader(isr);
				int s;
				while ((s = br.read()) != -1) {
					buffer.append((char) s);
				}
				tools.configXML = DocumentHelper.parseText(buffer.toString());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		item = tools.configXML.elementByID(id).getText();

		return item;
	}
	
	public static Document sqlXML = null;
	public static String getSQL(String id) {
		String item = "";
		if (tools.sqlXML == null) {
			try {
				String path = tools.class.getClassLoader().getResource("")
						+ "../../sql.xml";
				if(System.getProperty("os.name").contains("Windows")){
					path = path.substring(6);
				}else{
					path = path.substring(5);
				}
				File file = new File(path);
				StringBuffer buffer = new StringBuffer();
				InputStreamReader isr = new InputStreamReader(
						new FileInputStream(file), "utf-8");
				BufferedReader br = new BufferedReader(isr);
				int s;
				while ((s = br.read()) != -1) {
					buffer.append((char) s);
				}
				tools.sqlXML = DocumentHelper.parseText( buffer.toString() );
				
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		item = tools.sqlXML.elementByID(id).getText();
		return item;
	}

	private final static String[] hex = { "00", "01", "02", "03", "04", "05",
			"06", "07", "08", "09", "0A", "0B", "0C", "0D", "0E", "0F", "10",
			"11", "12", "13", "14", "15", "16", "17", "18", "19", "1A", "1B",
			"1C", "1D", "1E", "1F", "20", "21", "22", "23", "24", "25", "26",
			"27", "28", "29", "2A", "2B", "2C", "2D", "2E", "2F", "30", "31",
			"32", "33", "34", "35", "36", "37", "38", "39", "3A", "3B", "3C",
			"3D", "3E", "3F", "40", "41", "42", "43", "44", "45", "46", "47",
			"48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52",
			"53", "54", "55", "56", "57", "58", "59", "5A", "5B", "5C", "5D",
			"5E", "5F", "60", "61", "62", "63", "64", "65", "66", "67", "68",
			"69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73",
			"74", "75", "76", "77", "78", "79", "7A", "7B", "7C", "7D", "7E",
			"7F", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89",
			"8A", "8B", "8C", "8D", "8E", "8F", "90", "91", "92", "93", "94",
			"95", "96", "97", "98", "99", "9A", "9B", "9C", "9D", "9E", "9F",
			"A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "AA",
			"AB", "AC", "AD", "AE", "AF", "B0", "B1", "B2", "B3", "B4", "B5",
			"B6", "B7", "B8", "B9", "BA", "BB", "BC", "BD", "BE", "BF", "C0",
			"C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "CA", "CB",
			"CC", "CD", "CE", "CF", "D0", "D1", "D2", "D3", "D4", "D5", "D6",
			"D7", "D8", "D9", "DA", "DB", "DC", "DD", "DE", "DF", "E0", "E1",
			"E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "EA", "EB", "EC",
			"ED", "EE", "EF", "F0", "F1", "F2", "F3", "F4", "F5", "F6", "F7",
			"F8", "F9", "FA", "FB", "FC", "FD", "FE", "FF" };

	private final static byte[] val = { 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x00, 0x01,
			0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,
			0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F };

	public static String escape(String s) {
		StringBuffer sbuf = new StringBuffer();
		int len = s.length();
		for (int i = 0; i < len; i++) {
			int ch = s.charAt(i);
			if ('A' <= ch && ch <= 'Z') {
				sbuf.append((char) ch);
			} else if ('a' <= ch && ch <= 'z') {
				sbuf.append((char) ch);
			} else if ('0' <= ch && ch <= '9') {
				sbuf.append((char) ch);
			} else if (ch == '-' || ch == '_' || ch == '.' || ch == '!'
					|| ch == '~' || ch == '*' || ch == '\'' || ch == '('
					|| ch == ')') {
				sbuf.append((char) ch);
			} else if (ch <= 0x007F) {
				sbuf.append('%');
				sbuf.append(hex[ch]);
			} else {
				sbuf.append('%');
				sbuf.append('u');
				sbuf.append(hex[(ch >>> 8)]);
				sbuf.append(hex[(0x00FF & ch)]);
			}
		}
		return sbuf.toString();
	}

	public static String unescape(String s) {
		StringBuffer sbuf = new StringBuffer();
		int i = 0;
		int len = s.length();
		while (i < len) {
			int ch = s.charAt(i);
			if ('A' <= ch && ch <= 'Z') {
				sbuf.append((char) ch);
			} else if ('a' <= ch && ch <= 'z') {
				sbuf.append((char) ch);
			} else if ('0' <= ch && ch <= '9') {
				sbuf.append((char) ch);
			} else if (ch == '-' || ch == '_' || ch == '.' || ch == '!'
					|| ch == '~' || ch == '*' || ch == '\'' || ch == '('
					|| ch == ')') {
				sbuf.append((char) ch);
			} else if (ch == '%') {
				int cint = 0;
				if ('u' != s.charAt(i + 1)) {
					cint = (cint << 4) | val[s.charAt(i + 1)];
					cint = (cint << 4) | val[s.charAt(i + 2)];
					i += 2;
				} else {
					cint = (cint << 4) | val[s.charAt(i + 2)];
					cint = (cint << 4) | val[s.charAt(i + 3)];
					cint = (cint << 4) | val[s.charAt(i + 4)];
					cint = (cint << 4) | val[s.charAt(i + 5)];
					i += 5;
				}
				sbuf.append((char) cint);
			} else {
				sbuf.append((char) ch);
			}
			i++;
		}
		return sbuf.toString();
	}

	public static ArrayList<String> filelist = new ArrayList<String>();
	public static ArrayList<String> folderList = new ArrayList<String>();

	public static void getFiles(String filePath) {
		System.out.println(filePath);
		File root = new File(filePath);
		File[] files = root.listFiles();
		for (File file : files) {
			if (file.isDirectory()) {
				folderList.add(file.getName());
			} else {
				filelist.add(file.getName());
				System.out.println("显示" + filePath + "下所有子目录"
						+ file.getAbsolutePath());
			}
		}
	}

	public static void main(String args[]){
//		System.out.println(tools.getConfigItem("APPPATH")+""+tools.getConfigItem("PAPER_FILE_PATH"));
		Connection conn = tools.getExcelConn();
		try {
			Statement stmt = conn.createStatement();
			String sql = "select * from exam_question";
			ResultSet rest = stmt.executeQuery(sql);
			while(rest.next()){
				System.out.println(rest.getString("id")+" "+rest.getString("id_parent")+" "+rest.getString("title"));
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}
}
