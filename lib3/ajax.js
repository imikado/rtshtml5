function getXmlHttpRequest(){
	if (window.XMLHttpRequest || window.ActiveXObject) {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} else {
			xhr = new XMLHttpRequest(); 
		}
	} else {
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return;
	}
	return xhr;
}

function ajaxCallFunctionWithText(sMode,sUrl,sFunction){
	
	var xhr=getXmlHttpRequest();
	
	xhr.onreadystatechange = function()
	{ 
		             
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			sFunction(xhr.responseText);
			
		}
	}
	
	
	xhr.open(sMode, sUrl, true);                
	xhr.send(null); 
	
}

function ajaxCallFunctionWithXml(sMode,sUrl,sFunction){
	
	var xhr=getXmlHttpRequest();
	
	xhr.onreadystatechange = function()
	{ 
		             
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			sFunction(xhr.responseXML);
			
		}
	}
	
	
	xhr.open(sMode, sUrl, true);                
	xhr.send(null); 
	
}