String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    
    return theString;
}
function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	}
var isMobile = {
		Android : function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry : function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS : function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera : function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows : function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any : function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS()
					|| isMobile.Opera() || isMobile.Windows());
		}
};
function serverInfo(){
	//var serverRoot="http://{0}/buzzoo/micromodel";
	var serverRoot="/buzzoo/micromodel";
	var server = "localhost";
	var port = "8080";
	if (isMobile.any()) {    		
		server = "52.26.16.210";
		port =80;
	} 	
	var contextRoot = server;
	if(port!=80)
		contextRoot = server+":"+port;	
	window.serverRoot = String.format(serverRoot,contextRoot);
}
serverInfo();

window.wallPaper="assets/images/reachy.jpg";

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**Location Utils ***/
function getLocationInternal(callBack) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(callBack);
		} else {  			
			callBack(null);
		}
}
	
function getLocation(p) {  	
		window.position=p;
}
	
var position=null;  	
getLocationInternal(getLocation);


function fetchGenericData(url,cb){
	$.ajax({
		url : url,
		type : 'GET',
		dataType: "text",
		success : function(rowdata) {
			cb.success(rowdata);
		},
		error : function(e) {
			cb.error(rowdata);
		}
	});
}

function createObject(dataDomain,dataKey,model){
    var topObject = new Object();
	topObject.objectClass = "com.jdo.CloudRowData";
	topObject.limit=1;
	topObject.offset=0;
	topObject.action="add";			
	topObject.object=new Object();
	topObject.object.data = JSON.stringify(model);	
	topObject.object.dataDomain = dataDomain;	
	topObject.object.dataKey = dataKey;				
	return "data=" + encodeURIComponent(JSON.stringify(topObject));
}
function editObject(dataDomain,dataKey,model){
    var topObject = new Object();
	topObject.objectClass = "com.jdo.CloudRowData";
	topObject.limit=1;
	topObject.offset=0;
	topObject.action="add_or_edit";			
	topObject.object=new Object();
	topObject.object.data = JSON.stringify(model);	
	topObject.object.dataDomain = dataDomain;	
	topObject.object.dataKey = dataKey;				
	return "data=" + encodeURIComponent(JSON.stringify(topObject));
}
function execCommand(url,data, callBack) {
	
		$.ajax({
			type : "POST",
			url : url,
			data : data,
			success : function(data, status) {
				callBack(data);
			},
			async : true
		});


}
function execCommandGet(url,data, callBack) {
	
	$.ajax({
		type : "GET",
		url : url,
		data : data,
		success : function(data, status) {
			callBack(data);
		},
		async : true
	});


}
