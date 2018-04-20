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

function backKeyRegister(callBack){	
        document.addEventListener("backbutton", callBack, false);    
}
function exitApp(){
	if(navigator.app){
		navigator.app.exitApp();
	}
}
function onCancel(){		   		
		$("#activate").click();
}

function serverInfo(){
	var serverRoot="http://{0}/buzzoo/micromodel";
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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}