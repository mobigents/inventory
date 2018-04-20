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
var OS = {
		getType:function(){
			if(isMobile.Android()){
				return "Android";
			}else if(isMobile.iOS()){
				return "IOS";
			}else if(isMobile.Windows()){
				return "Windows";
			}else if(isMobile.Opera()){
				return "Opera";
			}else{
				return navigator.userAgent;
			}
		}
};

function backKeyRegister(callBack){	
	backCallBack=callBack;
	document.addEventListener("backbutton", wrapWithOverlayCheck, false); 
}
var backCallBack=null;

function wrapWithOverlayCheck(){
	
	if(document.overLayInfo){
		document.overLayInfo().close();
	}else{
		backCallBack(); 
	}
}
function exitApp(){
	if(navigator.app){
		navigator.app.exitApp();
	}
}
function onCancel(){		   		
		$("#activate").click();
}

function getItem(key){	
	if (localStorage.getItem(key)) {
		return localStorage.getItem(key);
	} else {
		return null;
	}
}
function setItem(key,val){	
	localStorage.setItem(key,val);
}

function removeItem(key){	
	localStorage.removeItem(key);
}

function getBootServerIP(cb){	
	var serviceDiscoveryUrl = getItem("serviceDiscoveryUrl");
	if(!serviceDiscoveryUrl)
		serviceDiscoveryUrl = "http://ec2-52-89-63-116.us-west-2.compute.amazonaws.com/servers.jsp";
	
	 getRemote(serviceDiscoveryUrl,function(sinfo){			
			var jsonList = sinfo;
			var profile=null;
			if(!jsonList.servers && jsonList){
				jsonList = JSON.parse(jsonList);
			}
			$(jsonList.servers).each(function(i,j){
				if(j.profile=="production"){
					profile=j;
				}		
			});	
			cb(profile);
	});
}

function getServer(cb){	
	try{
		if(!isMobile.any() || !mobigentplugin || isMobile.iOS()){
			getBootServerIP(cb);
		}else{	
			mobigentplugin.getServerProfile(function(profile){
				if(profile && profile.ip)
					cb(profile);
				else
					getBootServerIP(cb);				
			}); 
						
		}
		
	}catch(e){
		return "localhost";
	}
}

function getRemote(remote_url,cb) {
    $.get(remote_url,function(sinfo){		
		cb(sinfo);
	}).error(function() { 
		cb({servers:[]});
	});
}

function serverInfo(callBack){
	var serverRoot="http://{0}/buzzoo/micromodel";
	var server = "localhost";
	var port = "8080";
	/*if (isMobile.any()) { 		
		port =80;
	} else{
		window.serverRoot = "http://localhost:8080/buzzoo/micromodel";
		callBack();
		return;
	} 
	*/
	getServer(function(profile){	
		if(!profile){
			if(callBack){
				window.contextRoot="";
				window.server="NO_SERVER";
				window.serverRoot ="NO_SERVER";
				callBack(profile);
			}
			return;
		}
		var contextRoot = profile.ip;
		if(profile.port){
			port=profile.port;
		}else{
			port=80;
		}
		if(port!=80)
			contextRoot = profile.ip+":"+port;
		window.contextRoot=contextRoot;
		window.server=profile.ip;
		window.serverRoot = String.format(serverRoot,contextRoot);	
		if(callBack)
			callBack(profile);
	});	
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function createCount(){
	
}
function checkConnection(callBack) {
    var networkState = navigator.connection.type;
    var states = {};    
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    callBack(networkState,states[networkState]);
}
function getDataDomainURL(domainName){	
	var dataDomain ="datadomain = '"+domainName+"' ";
	return window.serverRoot+'?data={"objectClass":"com.jdo.CloudRowData",action="list",limit=10000,jsonFilter:"'+dataDomain+'"}';
}

function getDataDomainURLFiltered(filter){	
	var dataDomain =filter;
	return window.serverRoot+'?data={"objectClass":"com.jdo.CloudRowData",action="list",limit=10000,jsonFilter:"'+dataDomain+'"}';
}

function fetDataForDomain(domain,successCallBack,errorCallBack) {
	    var dataDomain ="datadomain = '"+domain+"' ";
		var data = 'data={"objectClass":"com.jdo.CloudRowData",action="list",limit=10000,offset=0,jsonFilter:"'
    			+ dataDomain + '"}';
		$.ajax({
			type : "POST",
			url : window.serverRoot,
			data : data,
			success : function(data, status) {				
				successCallBack(data);
			},
			error:function(xhr,response){
				errorCallBack(xhr);
			},
			async : true
	});
}
var toast=function(msg,imgS,callBack,target){
	var imgSr="";
	if(!target){
		target=".page";
	}
	if(imgS){
		 imgSr ="<img style=\"width:50px;height:50px;float:left;max-width:85%\" src=\"images/"+imgS+"\"/>";
	}
	var width=($(window).width())*.8;
	var left=($(window).width())*.1;

	$("<div style=\"z-index:10000;-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.125);-moz-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.125);box-shadow: 0 2px 4px rgba(0, 0, 0, 0.125);\" class='ui-loader ui-overlay-shadow ui-body-a ui-corner-all'>"+imgSr+"<h2 style=\"line-height:30px;width:100%;font-size:16px;text-align:center\">"+msg+"</h2></div>")
	.css({ display: "block",
		opacity: 0.90,
		position: "fixed",
		padding: "7px",
		"text-align": "center",
		width: width+"px",
		left: left,
		top: $(window).height()/3 })
	.appendTo(target).delay( 2000 )
	.fadeOut( 500, function(){		
		$(this).remove();
		if(callBack){
			callBack();
		}
	});
}

var assertNonEmpty=function(val,message){
	if(!val || val==""){
		toast(message, "error.png");
	}
}

function execCommand(data, callBack) {
	//alert("hhh");
	serverInfo(function() {
		$.ajax({
			type : "POST",
			url : window.serverRoot,
			data : data,
			beforeSend: function(xhr) {
				var tid = getItem("tanentId");
				if(tid && tid!=""){
					xhr.setRequestHeader("tanentId", tid);
				}
			},
			success : function(data, status) {
				callBack(data);
			},
			async : true
		});
	});

}

function execGetCommand(url, callBack) {
	//serverInfo(function() {
		$.ajax({
			type : "GET",
			url : url,
			beforeSend: function(xhr) {
				var tid = getItem("tanentId");
				if(tid && tid!=""){
					xhr.setRequestHeader("tanentId", tid);
				}
			},
			success : function(data, status) {
				callBack(data);
			},
			error :function(response){
				callBack(null);
			},
			async : true
		});

}

function execRootGetCommand(data, callBack) {
		//alert("hhh");
		serverInfo(function() {
			$.ajax({
				type : "POST",
				url : window.serverRoot,
				data : data,
				
				success : function(data, status) {
					callBack(data);
				},
				async : true
			});
		});

}

function executeJsonOnServer(method,url,contextType, data, callBackSuccess,callBackFailure) {

    $.ajax({
            type : method,
            url : url,
            data : data,
            contentType:contextType,
            beforeSend: function(xhr) {
                    var tid = getItem("tanentId");
                    if(tid && tid!=""){
                            xhr.setRequestHeader("tanentId", tid);
                    }
            }, 
            success : function(data, status) {
          	  callBackSuccess(data);
            },
            error : function(response) {
          	  callBackFailure(null);
            },
            async : true
    });
}




