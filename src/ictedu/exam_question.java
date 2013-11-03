package ictedu;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;

public class exam_question {
	
	public static Hashtable callFunction (HttpServletRequest request) {
		String functionName = (String) request.getParameter("function");
		String executor = (String)request.getParameter("executor");
		String session = (String)request.getParameter("session");
		
		Hashtable t_return = new Hashtable();
		if (functionName.equals("grid")) {	
			String sortname = "id";
			String sortorder = "asc";
			if( request.getParameter("sortname") != null ){
				sortname = (String) request.getParameter("sortname");
			}
			if( request.getParameter("sortorder") != null ){
				sortorder = (String) request.getParameter("sortorder");
			}				
			t_return = grid(
				 (String) request.getParameter("search")
				,(String) request.getParameter("pagesize")
				,(String) request.getParameter("page")
				,executor
				,sortname
				,sortorder
				);	
		}
		else if (functionName.equals("loadConfig")) {
			t_return = loadConfig();
		}
		else if (functionName.equals("readQuestions")) {
			String ids = (String) request.getParameter("ids");
			t_return = readQuestions(ids);
		}	
		else if(functionName.equals("remove")){
			t_return = remove(
					(String)request.getParameter("ids"),
					executor
					);						
		}
		
		return t_return;
	} 
	
	public static Hashtable loadConfig() {
		Hashtable t_return = new Hashtable();
		Connection conn = conn = tools.getConn();
		Statement stmt = null;
		ResultSet rset = null;
		ArrayList a = null;
		String sql = null;
		
		try {
			stmt = conn.createStatement();
			
			sql = "select code,title as value from exam_subject ";
			rset = stmt.executeQuery(sql);
			a = new ArrayList();
			Hashtable t = null;
			while (rset.next()) {			
				t = new Hashtable();	
				t.put("code", rset.getString("code"));
				t.put("value", rset.getString("value"));			
				a.add(t);
			}
			t_return.put("exam_subject", a);
			
			a = new ArrayList();
			t = new Hashtable();	
			t.put("code", "1");t.put("value", "单选");a.add(t);
			t = new Hashtable();	
			t.put("code", "2");t.put("value", "多选");a.add(t);
			t = new Hashtable();	
			t.put("code", "3");t.put("value", "判断");a.add(t);
			t = new Hashtable();	
			t.put("code", "4");t.put("value", "填空");a.add(t);
			t = new Hashtable();	
			t.put("code", "5");t.put("value", "组合");a.add(t);
			t = new Hashtable();	
			t.put("code", "6");t.put("value", "简答");a.add(t);
			t = new Hashtable();	
			t.put("code", "7");t.put("value", "题纲");a.add(t);
			t_return.put("type", a);
			
		} catch (SQLException e) {
			e.printStackTrace();
			t_return.put("msg", e.toString());		
		} finally {
	        try { if (rset != null) rset.close(); } catch(Exception e) { }
	        try { if (stmt != null) stmt.close(); } catch(Exception e) { }
	        try { if (conn != null) conn.close(); } catch(Exception e) { }
	    }		
	

		return t_return;
	}
	
	private static String search(
			String search
			,String user_type
			,String executor
			,String group_code
			){
		String where = " where id>0 ";

		Hashtable search_t = (Hashtable) new Gson().fromJson(search, Hashtable.class);
		for (Iterator it = search_t.keySet().iterator(); it.hasNext();) {
			String key = (String) it.next();
			Object value = search_t.get(key);
			if(key.equals("exam_subject")){
				where += " and subject_code = '"+value+"'";
			}
			else if(key.equals("type")){
				where += " and type = '"+value+"'";
			}
			
		}
		
		return where;
	}
	
	public static String[] types = {"单选题","多选题","判断题","填空","组合","简答","题纲"};
	public static Hashtable grid(
			 String search
			,String pagesize
			,String pagenum
			,String executor
			,String sortname
			,String sortorder) {		
		Hashtable t_return = new Hashtable();
		
		String sql = tools.getSQL("exam_question__grid");
		String orderby = " order by "+sortname+" "+sortorder;
		String where = search(search,"",executor,"");	
		int startRow = (Integer.valueOf(pagesize) * (Integer.valueOf(pagenum)-1) );
		int endRow = startRow+Integer.valueOf(pagesize);
		
		sql = sql.replace("__WHERE__", where);
		sql = sql.replace("__ORDER__", orderby);
		
		Statement stmt = null;
		ResultSet rest = null;
		Connection conn = tools.getConn();
		ArrayList a_rows = new ArrayList();
		try {
			stmt = conn.createStatement();
			System.out.println(sql);
			rest = stmt.executeQuery(sql);
			ResultSetMetaData rsData = rest.getMetaData();
			int rowIndex = 0;
			while (rest.next()) {
				rowIndex ++;
				if(!(rowIndex>startRow && rowIndex<=endRow))continue;
				System.out.print(rowIndex+" "+startRow+" "+endRow);
				Hashtable t = new Hashtable();	
				for(int i=1;i<=rsData.getColumnCount();i++){
					if(rest.getString(rsData.getColumnLabel(i)) != null){
						t.put(rsData.getColumnLabel(i), rest.getString(rsData.getColumnLabel(i)));
					}else{
						t.put(rsData.getColumnLabel(i), "-");
					}
				}
				if(!((String)t.get("type")).equals("-")){
					t.put("type_", types[Integer.valueOf((String)t.get("type"))-1] );
				}
				a_rows.add(t);
			}
			t_return.put("Rows", a_rows);
			
			String sql_total = "select count(*) as count_ from exam_question " + where;
			rest = stmt.executeQuery(sql_total);
			rest.next();
			t_return.put("Total", rest.getInt("count_")-1);
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
            try { if (rest != null) rest.close(); } catch(Exception ex) { }
            try { if (stmt != null) stmt.close(); } catch(Exception ex) { }
            try { if (conn != null) conn.close(); } catch(Exception ex) { }
        }

		return t_return;
	}	
	
	public static Hashtable remove(String ids,String executor){
		Hashtable t_return = new Hashtable();
		Statement stmt = null;
		ResultSet rest = null;
		Connection conn = tools.getConn();
		String[] id = ids.split(",");
		String sql = "";
		
		try {
			stmt = conn.createStatement();
			for(int i=0;i<id.length;i++){
				sql = "delete from exam_question where id = '"+id[i]+"' ;";
				stmt.executeUpdate(sql);
			}	
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
            try { if (rest != null) rest.close(); } catch(Exception ex) { }
            try { if (stmt != null) stmt.close(); } catch(Exception ex) { }
            try { if (conn != null) conn.close(); } catch(Exception ex) { }
        }
	
		t_return.put("status", "1");
		t_return.put("msg", "ok");
		return t_return;
	}
	
	public static Hashtable readQuestions(String ids){
		Hashtable t_return = new Hashtable();
		String sql = "select * from exam_question where id in ("+ids+") order by id";
		Statement stmt = null;
		ResultSet rest = null;
		Connection conn = tools.getConn();
		ArrayList a_rows = new ArrayList();
		try {
			stmt = tools.getConn().createStatement();
			System.out.println(sql);
			rest = stmt.executeQuery(sql);
			ResultSetMetaData rsData = rest.getMetaData();
			while (rest.next()) {
				Hashtable t = new Hashtable();	
				for(int i=1;i<=rsData.getColumnCount();i++){
					if(rest.getString(rsData.getColumnLabel(i)) != null){
						t.put(rsData.getColumnLabel(i), rest.getString(rsData.getColumnLabel(i)));
					}else{
						t.put(rsData.getColumnLabel(i), "-");
					}
				}
				t.put("title", ((String)t.get("title")).replace("\n", "<br/>"));
				a_rows.add(t);
			}
			t_return.put("Rows", a_rows);
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
            try { if (rest != null) rest.close(); } catch(Exception ex) { }
            try { if (stmt != null) stmt.close(); } catch(Exception ex) { }
            try { if (conn != null) conn.close(); } catch(Exception ex) { }
        }
		return t_return;
	}
	
	public static void main(String args[]){
		Hashtable t = exam_question.grid("{}", "20", "1", "", "id", "desc");
		System.out.println(new Gson().toJson(t));
	}
}
