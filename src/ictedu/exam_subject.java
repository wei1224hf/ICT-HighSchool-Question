package ictedu;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;

import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

public class exam_subject {
	
	public static Hashtable callFunction (HttpServletRequest request) {
		String functionName = (String) request.getParameter("function");
		String executor = (String)request.getParameter("executor");
		String session = (String)request.getParameter("session");
		Hashtable t_return = new Hashtable();
		if (functionName.equals("grid")) {	
			String sortname = "code";
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
		return t_return;
	} 
	
	public static Hashtable grid(
			 String search
			,String pagesize
			,String pagenum
			,String executor
			,String sortname
			,String sortorder) {
		Hashtable t_return = new Hashtable();
		String filePath = tools.getConfigItem("APPPATH")+""+tools.getConfigItem("PAPER_FILE_PATH");
		InputStream fs = null;
		Workbook workBook = null;
		Sheet sheet = null;
		int columns,rows,startRow,endRow = 0;
		
		try {
			fs = new FileInputStream(filePath);
			workBook = Workbook.getWorkbook(fs);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
	 		t_return.put("status", "2");
	 		t_return.put("msg", "Excel path wrong");
	 		return t_return;
        } catch (BiffException e) {
        	e.printStackTrace();
        } catch (IOException e) {
        	e.printStackTrace();
        }		
		
        sheet = workBook.getSheet("exam_question");
        rows = sheet.getRows();
        if(rows>20000){
    		t_return.put("status", "2");
    		t_return.put("msg", "row count must be less than 20000 , your rows:"+rows);
    		return t_return;
        }
        
        ArrayList a_questions = new ArrayList();
        startRow = (Integer.valueOf(pagesize) * (Integer.valueOf(pagenum)-1) )+1;
        endRow = (Integer.valueOf(pagesize) * (Integer.valueOf(pagenum)-0) )+1;
        endRow = (endRow>rows)?rows:endRow;
        System.out.println(startRow+" "+endRow);
        Hashtable t_row = null;
        for(int i=startRow;i<endRow;i++){
        	t_row = new Hashtable();
        	int column = 0;
        	t_row.put("id", sheet.getCell(column,i).getContents());column++;
        	t_row.put("id_parent", sheet.getCell(column,i).getContents());column++;
        	t_row.put("cent", sheet.getCell(column,i).getContents());column++;
        	t_row.put("type2", sheet.getCell(column,i).getContents());column++;
        	t_row.put("type", sheet.getCell(column,i).getContents());column++;
        	t_row.put("subject_code", sheet.getCell(column,i).getContents());column++;
        	t_row.put("title", sheet.getCell(column,i).getContents().trim().replace("\n", "<br/>"));column++;
        	t_row.put("option_length", sheet.getCell(column,i).getContents());column++;
        	t_row.put("option_1", sheet.getCell(column,i).getContents());column++;
        	t_row.put("option_2", sheet.getCell(column,i).getContents());column++;
        	t_row.put("option_3", sheet.getCell(column,i).getContents());column++;
        	t_row.put("option_4", sheet.getCell(column,i).getContents());column++;
        	t_row.put("option_5", sheet.getCell(column,i).getContents());column++;
        	t_row.put("option_6", sheet.getCell(column,i).getContents());column++;
        	t_row.put("option_7", sheet.getCell(column,i).getContents());column++;
        	t_row.put("answer", sheet.getCell(column,i).getContents().trim());column++;
        	t_row.put("description", sheet.getCell(column,i).getContents().trim());column++;
        	t_row.put("knowledge", sheet.getCell(column,i).getContents().trim());column++;
        	t_row.put("difficulty", sheet.getCell(column,i).getContents().trim());column++;
        	t_row.put("path_listen", sheet.getCell(column,i).getContents().trim());column++;
        	t_row.put("path_img", sheet.getCell(column,i).getContents().trim());column++;
        	
        	a_questions.add(t_row);
        }
        t_return.put("Rows", a_questions);
        t_return.put("Total", rows-1);
		
		return t_return;
	}	
	
	public static void main(String args[]){
		Hashtable t = exam_subject.grid("", "20", "1", "", "", "");
		System.out.println(new Gson().toJson(t));
	}
}
