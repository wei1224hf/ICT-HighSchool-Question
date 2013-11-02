package ictedu;
import java.util.ArrayList;
import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;

public class basic_user {
	
	public static Hashtable callFunction (HttpServletRequest request) {
		String functionName = (String) request.getParameter("function");
		String executor = (String)request.getParameter("executor");
		String session = (String)request.getParameter("session");
			
		Hashtable t_return = new Hashtable();
		if(functionName.equals("login")){
			t_return = login();
		}

		return t_return;
	}
	
	public static Hashtable login(){
		Hashtable t_return = new Hashtable();
		Hashtable loginData = new Hashtable();
		loginData.put("username", "guest");
		loginData.put("session", "nothing");
		t_return.put("loginData", loginData);
		t_return.put("permission", new ArrayList());
		t_return.put("il8n", tools.readIl8n());
		t_return.put("status", "1");
		return t_return;
	}	
	
	public static void main(String args[]) {

	}	
}
