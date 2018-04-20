var tanentId = null;
var DeskItem = function(di) {
	this.di = di;
}

var Model = function() {
	this.objectClass = null;
	this.object = null;
	this.action = null;
	this.extra = null;
}

var Desktop = function() {
	this.items = [];

	this.getItem = function(type) {
		return this.items[type];
	}, this.draw = function() {

	}, this.addItem = function(di) {
		this.items[di.name] = di;
	}, this.remove = function(di) {

	}, this.edit = function(di) {

	}
};
function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16)
				.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4()
			+ s4() + s4();
}
var desktop = new Desktop();
var dataMap = [];
function updateModel(type, action, pval) {
	if (pval == 'undefined') {

		pval = null;
	}
	var di = desktop.getItem(type);
	var model = di.dModel;
	model.action = action;
	var ml = di.dataModel.length;
	var obj = new Object();
	if (pval && action != "add") {
		obj = dataMap[pval];
	}
	if (di.objectClass == "com.jdo.CloudRowData") {
		if (pval && dataMap[pval]) {
			obj = dataMap[pval].originalData;
		}
		model = new Object();
		model.action = action;
		var data = new Object();
		for (var a = 0; a < ml; a++) {
			
			
			if (!(di.dataModel[a]).editable) {
				continue;
			}
			if ((di.dataModel[a]).mappedName
					&& (di.dataModel[a]).mappedName != "") {
				var decoded = (di.dataModel[a]).mappedName.replace(/&/g, "and");
				// obj[decoded] = $("#" + (di.dataModel[a]).name).val();

				var fv = null;
				if ((di.dataModel[a]).type == "select2") {
					fv = getJSONColumns($("#" + (di.dataModel[a]).name).val());
				} else {
					fv = $("#" + (di.dataModel[a]).name).val();
				}
				if ((di.dataModel[a]).name=="owner") {
					if(fv)
					data.owner = fv[0].uid;
				}else
				    obj[decoded] = fv;// $("#" + (di.dataModel[a]).name).val();

			} else {
				// obj[(di.dataModel[a]).name] = $("#" +
				// (di.dataModel[a]).name).val();

				var fv = null;
				if ((di.dataModel[a]).type == "select2") {
					fv = getJSONColumns($("#" + (di.dataModel[a]).name).val());
				} else {
					fv = $("#" + (di.dataModel[a]).name).val();
				}
				obj[(di.dataModel[a]).name] = fv;

			}
		}
		data.data = JSON.stringify(obj);

		if (!pval) {
			pval = guid();
		}
		data.dataKey = pval;
		if (window.position) {
			data.lat = window.position.coords.latitude;
			data.lon = window.position.coords.longitude;
		}
		model.objectClass = di.objectClass;
		if (di.dataDomain) {
			data.dataDomain = di.dataDomain;
		}

		model.object = data;

	} else {
		for (var a = 0; a < ml; a++) {
			if ((di.dataModel[a]).mappedName
					&& (di.dataModel[a]).mappedName != "") {
				var decoded = (di.dataModel[a]).mappedName.replace(/&/g, "and");
				var fv = null;
				if ((di.dataModel[a]).type == "select2") {
					fv = getJSONColumns($("#" + (di.dataModel[a]).name).val());
				} else {
					fv = $("#" + (di.dataModel[a]).name).val();
				}
				obj[decoded] = fv;// $("#" + (di.dataModel[a]).name).val();

			} else {

				var fv = null;
				if ((di.dataModel[a]).type == "select2") {
					fv = getJSONColumns($("#" + (di.dataModel[a]).name).val());
				} else {
					fv = $("#" + (di.dataModel[a]).name).val();
				}
				obj[(di.dataModel[a]).name] = fv;
			}
		}

		model.object = obj;
	}

	var postD = "data=" + encodeURIComponent(JSON.stringify(model));

	/*
	 * $.ajax({ url : server+'/micromodel', type : 'POST', data : postD, success :
	 * function(data) { if (di.objectKey) { showStickyToast(di.name + " '" +
	 * obj[di.objectKey] + "' updated successfully", "success", false); } else {
	 * showStickyToast(di.name + " updated successfully", "success", false); }
	 * di.getTableData(); $("#photo1").overlay().close(); }, error : function(e) {
	 * showStickyToast(di.name + " failed ", "error", true); } });
	 */

	sendUpdate(di, postD, model.object[di.objectKey]);

}

function getJSONColumns(targets) {
	var ta = new Array();
	$(targets).each(function(i, j) {
		var spa = j.split(":");
		if(spa.length==1){
			ta.push({
				"uid" : spa[0],
				"type" : spa[0]
			});
		}else
		if (j == "all") {
			ta.push({
				"uid" : "all",
				"type" : "all"
			});
		} else {
			ta.push({
				"uid" : spa[1],
				"type" : spa[0]
			});
		}
	});
	return ta;
}

function sendUpdate(di, postD, keyValue) {

	$.ajax({
		url : server + '/micromodel',
		type : 'POST',
		data : postD,
		success : function(data) {
			if (di.objectKey) {
				showStickyToast(di.name + " '" + keyValue
						+ "' updated successfully", "success", false);
			} else {
				showStickyToast(di.name + " updated successfully", "success",
						false);
			}
			di.getTableData();
			$("#photo1").overlay().close();
		},
		error : function(e) {
			showStickyToast(di.name + " failed ", "error", true);
		}
	});
}

function fetchDomains(domainId) {
	setTimeout(function() {

		fetchGenericData(server + '/actions?action=getDomains', {
			success : function(rowdata) {
				var orig = JSON.parse(rowdata);
				var html = "<option>--Select--</option>";
				$(orig).each(function(a, b) {
					html += "<option>" + b.datadomain + "</option>";
				});
				$("#" + domainId).html(html);
			},
			error : function(e) {
				showStickyToast("Unable to fetch domains from server", "error",
						true);
			}
		});

	}, 1000);

}

function printModel(type, action, pval) {
	var di = desktop.getItem(type);
	var model = di.dModel;
	model.action = action;
	var ml = di.dataModel.length;
	var obj = new Object();
	$("#printcontent").empty();
	var htmlC = '';

	for (var a = 0; a < ml; a++) {
		if ((di.dataModel[a]).print) {
			// displayName
			// htmlC+=((di.dataModel[a]).displayName +" : "+$("#" +
			// (di.dataModel[a]).name).val());
			var fontSize = "20px";
			var mName = ($("#" + (di.dataModel[a]).name).val());
			if (mName.length > 18) {
				fontSize = "16px;"
			}
			htmlC += "<p style=\"" + fontSize + "\">"
					+ ($("#" + (di.dataModel[a]).name).val()) + "</p>";
			htmlC += "<br>"
		}
	}

	$("#printcontent").append(htmlC);
	setTimeout(function() {
		printDiv('printcontent');
	}, 100);

	if (di.onBeforePrint)
		di.onBeforePrint(pval);

}

function fieldPrints(fieldIds) {

	$("#printcontent").empty();
	var fontSize = $("#fontSizeG").val();
	if (!fontSize || fontSize == "") {
		fontSize = "20px";
	}
	var htmlC = '';

	for (var a = 0; a < fieldIds.length; a++) {
		if (fieldIds[a]) {
			htmlC += "<p style=\"font-size:" + fontSize + ";\">"
					+ $("#" + fieldIds[a]).val() + "</p>";
			htmlC += "<br>"
		}
	}
	$("#printcontent").append(htmlC);

	printDiv('printcontent');

}

function success(data) {

}
// notice,warning,error
function showStickyToast(msg, type, sticky) {
	$().toastmessage('showToast', {
		text : msg,
		sticky : sticky,
		position : 'top-right',
		type : type,
		closeText : '',
		close : function() {
			console.log("toast is closed ...");
		}
	});

}

function createWindow(di) {
	var nD = $(".micon").length % 10;
	var ind = parseInt(Math.ceil($(".micon").length / 10)) - 1;
	if (ind < 0) {
		ind = 0;
	}
	var top = (nD) * 80 + 20;

	var diStr = '<a class="abs icon micon" style="left:' + (ind * 100 + 20)
			+ 'px;top:' + top + 'px;" href="#icon_dock_' + di.id + '">'
			+ '<img src="' + di.icon + '" />' + di.name + '</a>';

	var cs = "";
	if (di.countSupport) {
		cs = getCountSupportHTML(di.name);
	}
	if (di.icon.indexOf("fa ") != -1) {
		// <i class="fa fa-mobile"></i>
		diStr = '<a class="abs icon micon" style="left:' + (ind * 100 + 20)
				+ 'px;top:' + top + 'px;" href="#icon_dock_' + di.id + '">'
				+ '<i class="' + di.icon + ' fa-3x dicon"></i>' + di.name + cs
				+ '</a>';
	}

	$("#desktop").append(diStr);

	var dockStr = '<li id="icon_dock_' + di.id + '"><a href="#' + di.id + '">'
			+ '<img src="' + di.smallIcon + '" /> Computer     </a>      </li>';
	$("#dock").append(dockStr);

	var div = document.createElement("div");
	div.className = "abs window";
	div.id = di.id;

	var divTop = document.createElement("div");
	divTop.className = "window_top";
	var geoTag = "";
	if (di.geoSupport) {
		geoTag = '<div onclick="openGeoWindow(\''
				+ di.name
				+ '\')" class="button" style=" text-align: center;    margin: auto;    line-height: 25px;display: inline-block;position: absolute; right: 120px;border-width:2px;background:deeppink">Map View</div>';
	}

	divTop.innerHTML = '<span class="float_left"><img src="'
			+ di.smallIcon
			+ '" />'
			+ di.name
			+ '</span>'
			+ geoTag
			+ '<span class="float_right"><a href="#" class="window_min"><i class="fa fa-minus"></i></a><a href="#" class="window_resize"><i class="fa fa-expand"></i></a>'
			+ '<a href="#icon_dock_' + di.id
			+ '" class="window_close"><i class="fa fa-times"></i></a></span>';

	div.appendChild(divTop);

	var divContent = document.createElement("div");
	divContent.className = "abs window_content";

	div.appendChild(divContent);

	var divAside = document.createElement("div");
	divAside.className = "window_aside";
	divContent.appendChild(divAside)
	if (di.searchable) {
		var appDom = "";
		if (di.objectClass == "com.jdo.CloudRowData" && !di.dataDomain) {
			appDom = '<div class="domainSelector"><select id="domainSelect" onchange="rebind(\''
					+ di.name + '\');"></select></div>';
		}
		divAside.innerHTML = appDom + searchify(di.name);
	}
	if (di.objectClass == "com.jdo.CloudRowData" && !di.dataDomain) {
		fetchDomains("domainSelect");
	}

	var divWindowMain = document.createElement("div");
	divWindowMain.className = "window_main";
	divWindowMain.innerHTML = di.getTableFrame();
	divContent.appendChild(divWindowMain);

	var divBottom = document.createElement("div");
	divBottom.className = "abs window_bottom";
	divBottom.innerHTML = di.bottomText();
	if (di.searchable) {
		divBottom.style.height = '30px';
	}
	div.appendChild(divBottom);

	var divResizeSpan = document.createElement("span");
	divResizeSpan.className = "abs ui-resizable-handle ui-resizable-se";
	div.appendChild(divResizeSpan);

	document.getElementById("desktop").appendChild(div);
	if (di.searchable) {
		makeItSearchable(di.name);
	}

}

function createDataWindow(di) {
	var nD = $(".micon").length % 5;
	var ind = parseInt(Math.ceil($(".micon").length / 10)) - 1;
	if (ind < 0) {
		ind = 0;
	}
	var top = (nD) * 80 + 20;

	var diStr = '<a class="abs icon micon" style="left:' + (ind * 100 + 20)
			+ 'px;top:' + top + 'px;" href="#icon_dock_' + di.id + '">'
			+ '<img src="' + di.icon + '" />' + di.name + '</a>';
	$("#desktop").append(diStr);

	var dockStr = '<li id="icon_dock_' + di.id + '"><a href="#' + di.id + '">'
			+ '<img src="' + di.smallIcon + '" /> Computer     </a>      </li>';
	$("#dock").append(dockStr);

	var div = document.createElement("div");
	div.style.width = "100%";
	div.style.height = "100%";
	div.style.left = "0px";
	div.style.top = "0px";
	div.className = "abs window";
	div.id = di.id;

	var divTop = document.createElement("div");
	divTop.className = "window_top";
	var geoTag = "";
	if (di.geoSupport) {
		geoTag = '<div onclick="openGeoWindow(\''
				+ di.name
				+ '\')" class="button" style=" text-align: center;    margin: auto;    line-height: 25px;display: inline-block;position: absolute; right: 120px;border-width:2px;background:deeppink">Map View</div>';
	}
	divTop.innerHTML = '<span class="float_left"><img src="'
			+ di.smallIcon
			+ '" />'
			+ di.name
			+ '</span>'
			+ geoTag
			+ '<span class="float_right"><a href="#" class="window_min"><i class="fa fa-minus"></i></a><a href="#" class="window_resize"><i class="fa fa-expand"></i></a>'
			+ '<a href="#icon_dock_' + di.id
			+ '" class="window_close"><i class="fa fa-times"></i></a></span>';

	div.appendChild(divTop);

	var divContent = document.createElement("div");
	divContent.className = "abs window_content";

	div.appendChild(divContent);

	var divAside = document.createElement("div");
	divAside.className = "window_aside";
	divContent.appendChild(divAside)

	var divWindowMain = document.createElement("div");
	divWindowMain.className = "window_main";
	divWindowMain.innerHTML = di.formHTML();
	divContent.appendChild(divWindowMain);

	var divBottom = document.createElement("div");
	divBottom.className = "abs window_bottom";

	div.appendChild(divBottom);

	var divResizeSpan = document.createElement("span");
	divResizeSpan.className = "abs ui-resizable-handle ui-resizable-se";
	div.appendChild(divResizeSpan);

	document.getElementById("desktop").appendChild(div);

}

function generateForm(type, action, pval) {
	var di = desktop.getItem(type);
	var fstr = '<div class="details"><h2>' + di.name + '</h2>'
			+ '<form><fieldset>';
	var delS = "";
	var delButton = "";
	if (pval) {
		delButton = '<div id="delete" class="new button1 delete"	style="text-shadow: 0px 0px;width: 60px; position: relative; margin-top: 0px; padding: 7px; float: left; height: 12px;line-height: 12px;background-color: #222;" onclick="updateModel(\''
				+ type + '\',\'delete\',\'' + pval + '\');">Delete</div>';

		/*
		 * delS += '<div id="print" class="new button1 edit"
		 * style="text-shadow: 0px 0px;width: 60px; position: relative;
		 * margin-top: 0px; padding: 3px; float: left; height: 12px;line-height:
		 * 12px;" onclick="printModel(\'' + type + '\',\'print\',\'' + pval +
		 * '\');">Print</div>';
		 */
	}

	var ml = di.dataModel.length;
	var dMo = (pval != null) ? dataMap[pval] : null;
	for (var a = 0; a < ml; a++) {
		var cv = (dMo != null) ? dMo[(di.dataModel[a]).name] : "";
		if (!cv && dMo) {
			cv = dMo[(di.dataModel[a]).mappedName];
		}
		fstr += '<label for="' + (di.dataModel[a]).name + '">'
				+ (di.dataModel[a]).displayName + '</label>';

		var extra = "";
		if (!(di.dataModel[a]).editable) {
			extra = " readonly "
		}
		if ((di.dataModel[a]).type == "select2") {
			var out = "";
			if (cv) {
				$(cv).each(
						function(a, b) {
							out += '<option value="' + b.type + ':' + b.uid
									+ '" selected>' + b.type + ':' + b.uid
									+ '</option>';
						});
			}
			if(out==""){
				out += '<option value="' + cv
				+ '" selected>' + cv
				+ '</option>';
			}
			fstr += '<select  multiple '
					+ extra
					+ ' name="'
					+ (di.dataModel[a]).name
					+ '" id="'
					+ (di.dataModel[a]).name
					+ '" value="'
					+ cv
					+ '" class="ajax-select2 text ui-widget-content ui-corner-all">'
					+ out + '</select>';
			if((di.dataModel[a]).lookupFunction){
				fstr += '<script>'+(di.dataModel[a]).lookupFunction+'("#' + (di.dataModel[a]).name
				+ '","' + (di.dataModel[a]).lookupUrl + '","'+(di.dataModel[a]).formatter+'");</script>';
			}else{
				fstr += '<script>loadUserGroups("#' + (di.dataModel[a]).name
				+ '","' + (di.dataModel[a]).lookupUrl + '");</script>';
			}
		}
		if ((di.dataModel[a]).type == "textarea" || di.name == "DataTable") {

			fstr += '<textarea type="text" ' + extra + ' name="'
					+ (di.dataModel[a]).name + '" id="'
					+ (di.dataModel[a]).name
					+ '" class="text ui-widget-content ui-corner-all">' + cv
					+ '</textarea>';

		} else {

			fstr += '<input type="text" ' + extra + ' name="'
					+ (di.dataModel[a]).name + '" id="'
					+ (di.dataModel[a]).name + '" value="' + cv
					+ '" class="text ui-widget-content ui-corner-all">';
		}

	}
    
	fstr += '<input type="submit" tabindex="-1" style="position:absolute; top:-1000px"></fieldset>'
			+ delButton
			+ '<div id="newButton" class="new button1 edit"	style="text-shadow: 0px 0px;width: 60px; position: relative; margin-top: 0px; padding: 7px; float: left; height: 12px;line-height: 12px;background-color: darkblue;" onclick="updateModel(\''
			+ type
			+ '\',\''
			+ action
			+ '\',\''
			+ pval
			+ '\');">Submit</div>'
			+ '</form></div>';
	
	return fstr;
}
function searchify(name) {

	return ("<div><img style='position:absolute;height:24px;width:24px;margin:4px;margin-left:2px' src='assets/images/app/bg_searchgo.gif'/><input style='padding:7px;padding-left:28px;width:120px;border-radius:5px;border:1px solid #aaa' id='search_"
			+ name + "' class='search' type='text'></input></div>");

}
function createUserItem() {
	var ut = new Object();
	ut.name = "Users";
	ut.id = "user";
	ut.searchable = true;
	ut.icon = "assets/images/gui/users.jpg";
	ut.dataIcon = "assets/images/user_small.png";
	ut.smallIcon = "assets/images/user_16.png";
	ut.objectClass = "com.jdo.CloudContactInfo";
	ut.objectKey = "endpointAddress";
	ut.count = 1000;
	ut.dataFormatter = function(data) {

		return data;
	}
	ut.dataModel = [ {
		displayName : 'User Name',
		name : 'endpointAddress',
		index : 'endpointAddress',
		width : 55,
		editable : false,
		editoptions : {
			readonly : true,
			size : 10
		}
	}, {
		displayName : 'Password',
		name : 'secret',
		index : 'secret',
		width : 55,
		editable : true,
		editoptions : {
			readonly : true,
			size : 10
		}
	}, {
		displayName : 'Country',
		name : 'countryCode',
		index : 'countryCode',
		width : 55,
		editable : true,
		editoptions : {
			readonly : true,
			size : 10
		}
	} ];
	createDesktopItem(ut);
}
function getConvertedHead(data, key) {
	var md = data[key];
	if (!md) {
		key = key.replace(/&/g, "and");
		md = data[key];
	}
	return md;
}

function createDataFrom() {
	var ut = new Object();
	ut.name = "ContentManagement";
	ut.id = "content";
	ut.searchable = false;
	ut.icon = "assets/images/data-upload-icon.png";
	ut.dataIcon = "assets/images/data-upload-icon1.png";
	ut.smallIcon = "assets/images/data-upload-icon2.png";
	ut.formHTML = function() {
		alert("Test");
	}
	createDesktopItem(ut);
}
function createReportsFrom() {
	var ut = new Object();
	ut.name = "Audits";
	ut.id = "audit";
	ut.searchable = false;
	ut.icon = "assets/images/data-upload-icon.png";
	ut.dataIcon = "assets/images/data-upload-icon1.png";
	ut.smallIcon = "assets/images/data-upload-icon2.png";
	ut.formHTML = function() {
		return "<iframe src='table.html' style='width:100%;min-height:100%;'/>";
	}
	createDesktopItem(ut);
}
var server = "/buzzoo";
function createDesktopItem(template, noUi) {
	var di = new Object();
	di.name = template.name;
	di.id = template.name;
	di.icon = template.icon;
	di.searchable = template.searchable;
	di.smallIcon = template.smallIcon;
	di.isArray = false;
	di.objectClass = template.objectClass;
	di.formHTML = template.formHTML;
	di.objectKey = template.objectKey;
	di.count = template.count;
	di.limit = template.limit;
	di.dataFormatter = template.dataFormatter;
	di.rowCss = template.rowCss;
	/** ** Callbacks before Updates *** */
	di.onBeforePrint = template.onBeforePrint;
	di.onBeforeUpdate = template.onBeforeUpdate;

	/** ** Ends here ** */

	/**
	 * 
	 * GeoSupport
	 */
	di.countSupport = template.countSupport;
	di.geoSupport = template.geoSupport;
	di.dataDomain = template.dataDomain;
	var model = new Model();
	model.objectClass = di.objectClass;
	model.extra = {};
	di.dModel = model;
	di.dataIcon = template.dataIcon;
	di.dataModel = template.dataModel;
	if (!noUi) {
		di.bottomText = function() {
			return '<div data-type="'
					+ this.name
					+ '" id="new_'
					+ this.name
					+ '" class="newobj button1 edit"	style="text-shadow: 0px 0px;width: 60px; position: relative; margin-top: 0px; padding: 7px; float: left; height: 12px;line-height: 12px;">New (+)</div> <div id="'
					+ di.name
					+ '_red" style="display:none;margin: 2px;margin-right:30px;float:right"></div>';
		}

		di.getTableFrame = function() {
			var head = '<table class="data" style="white-space: normal;"><thead id="thead_'
					+ di.id + '"><tr>';
			if (this.dataIcon) {
				head += '<th class="shrink">&nbsp;</th>';
			}
			di.modelMap = [];
			$.each(this.dataModel, function(i, j) {
				head += "<th>" + j.displayName + "</th>";
				di.modelMap[j.name] = true;
			});

			var tdataHtml = "";
			if (di.objectClass != "com.jdo.CloudRowData" || di.dataDomain) {
				tdataHtml = di.getTableData();
			}
			head += "</tr></thead><tbody id='tbody_" + di.id + "'>" + tdataHtml
					+ "</tbody></table>";
			return head;
		}
		di.getTableData = function(index, filter) {
			fetchPage(this, index, filter);
			return "";
		}
		if (di.formHTML) {
			createDataWindow(di);
		} else
			createWindow(di);
	}
	desktop.addItem(di);
	if (!noUi) {
		$(".newobj").click(function() {
			var type = $(this).attr("data-type");
			$("#photo1 .details").html(generateForm(type, "add"));
			$("#photo1").overlay().load();

		});
	}

}

function fetchPage(parent, index, filter,noUi) {
	var cType = "list";
	var mo = new Object();
	mo.objectClass = parent.objectClass;
	if (parent.limit)
		mo.limit = parent.limit;
	mo.action = cType;
	if (!index) {
		index = 1;
	}
	mo.offset = (index - 1) * parent.limit;

	if (parent.dataDomain) {
		var fi = new Array();
		fi.push({
			"key" : "dataDomain",
			"value" : parent.dataDomain,
			"operation" : "equals"
		});
		mo.extra = {
			"filters" : fi
		};
	}
	var postD = "data=" + JSON.stringify(mo);
	var dataStr = "";
	$.ajax({
		url : server + '/micromodel',
		type : 'POST',
		dataType : "text",
		data : postD,
		success : function(rowdata) {

			var orig = JSON.parse(rowdata);
			var totalFetched = -1;
			if (orig.total) {
				totalFetched = orig.total;
			}
			if (orig.rows) {
				orig = orig.rows;
			}
			if (parent.name == "DataTable") {
				if (orig.length > 0) {
					mapDataModel(parent, JSON.parse(orig[0].data));
				}
			}
			if (parent.dataFormatter) {
				orig = parent.dataFormatter(orig);
			} else {
				var data = orig;
				var tData = new Array();
				for (var i = 0; i < data.length; i++) {
					var to = data[i];
					if (parent.objectClass != "com.jdo.CloudRowData") {
						to.originalData = data[i];
					} else {
						to.originalData = JSON.parse(data[i].data);
					}
					for ( var k in to.originalData) {
						to[k] = (to.originalData)[k];
					}
					tData.push(to);
				}
				orig = tData;
			}

			parent.origFetch = orig;
			parent.total = totalFetched;
			setDataCount(parent, totalFetched);
			parent.geoJson = $(parent).geoJson();
			if (parent.geoJson) {
				parent.geoJson.total = totalFetched;
				parent.geoJson.pageLength = parent.limit;
			}
			if(!noUi){
				drawTable(parent);
				
			}
			if (parent.secondWindow) {
				parent.secondWindow.renderPage(parent.name, index, filter);
			}else if(window.renderPage){
				renderPage(parent.name, index, filter);
			}
		},
		error : function(e) {
			showStickyToast("Unable to fetch " + parent.name + " from server",
					"error", true);
		}
	});

}

window.fetchPageRemote = function(type, index, filter) {

	var di = desktop.getItem(type);
	fetchPage(di, index, filter);
};

function addGeoProps(modelList){
	modelList.push({
		"displayName" : "Longitude",
		"name":"lon",
		"index":"lon",
		"mappedName" : "lon",
		"width":"55",
		"dataType":"lon",
		"editable":"false",
		"editoptions":{
			"readonly" : "true",
			"size" : "10"
		}
	});
	modelList.push({
		"displayName" : "Latitude",
		"name":"lat",
		"index":"lat",
		"mappedName" : "lat",
		"width":"55",
		"dataType":"lat",
		"editable":"false",
		"editoptions":{
			"readonly" : "true",
			"size" : "10"
		}
	});
	
}

function mapDataModel(parent, model) {
	var dmodelList = new Array();
	for ( var k in model) {
		var dmO = {
			"displayName" : k,
			"name" : k,
			"index" : k,
			"mappedName" : k,
			"width" : "55",
			"editable" : "true",
			"editoptions" : {
				"readonly" : "false",
				"size" : "10"
			}

		};
		dmodelList.push(dmO);
	}
	addGeoProps(dmodelList);
	parent.dataModel = dmodelList;
	var head = "";
	if (parent.dataIcon) {
		head += '<th class="shrink">&nbsp;</th>';
	}
	parent.modelMap = [];
	$.each(parent.dataModel, function(i, j) {
		head += "<th>" + j.displayName + "</th>";
		parent.modelMap[j.name] = true;
	});
	$("#thead_" + parent.id + " tr").html(head);
}

function drawTable(parent, data) {
	if (!data) {
		data = parent.origFetch;
	}

	if (!parent.paginated && (parent.total > parent.limit)) {
		$('#' + parent.name + '_red').css("display", "block");
		$('#' + parent.name + '_red').smartpaginator({
			totalrecords : parent.total,
			recordsperpage : parent.limit,
			length : 10,
			next : 'Next',
			prev : 'Prev',
			first : 'First',
			last : 'Last',
			theme : 'black',
			controlsalways : true,
			onchange : function(newPage) {
				// $('#r').html('Page # ' + newPage);
				fetchPage(parent, newPage, null);
				return false;
			}
		});

		parent.paginated = true;
	}
	var objKeyIndex = -1;
	var dataStr = "";
	$.each(data, function(i, j) {
		var ml = parent.dataModel.length;
		var css = "";
		if (parent.rowCss) {
			css = parent.rowCss(j);
		}
		if (j[parent.objectKey]) {
			dataStr += "<tr " + css + " id=\"" + j[parent.objectKey] + "\">";
		} else
			dataStr += "<tr " + css + ">";
		if (parent.dataIcon) {
			dataStr += "<td " + css + "><img src='" + parent.dataIcon
					+ "'/></td>";
		}
		for (var a = 0; a < ml; a++) {
			if ((parent.dataModel[a]).name == parent.objectKey) {
				objKeyIndex = a + 1 + ((parent.dataIcon) ? 1 : 0);
				dataMap[j[(parent.dataModel[a]).name]] = j;

			}
			
			if (parent.isArray) {
				dataStr += "<td " + css + ">" + j[a] + "</td>";
			} else {
				if (parent.modelMap[(parent.dataModel[a]).name]) {
					if ((parent.dataModel[a]).type == "select2") {

						console.log("select2");
					}
					
					if (j[(parent.dataModel[a]).name]) {
						var jv = (j)[(parent.dataModel[a]).name];
						var out = "";
						if ((parent.dataModel[a]).type == "select2") {
							var app = "";
							$(jv).each(function(x, y) {
								out += app + y.type + ':' + y.uid;
								app = ",";
							});
							if(out!="")
							jv = out;
						}

						dataStr += "<td " + css + ">" + jv + "</td>";
					} else if (j[(parent.dataModel[a]).mappedName]) {
						var jv = (j)[(parent.dataModel[a]).mappedName];
						var out = "";
						if ((parent.dataModel[a]).type == "select2") {
							var app = "";
							$(jv).each(function(x, y) {
								out += app + y.type + ':' + y.uid;
								app = ",";
							});
							if(out!="")
							jv = out;
						}
						dataStr += "<td " + css + ">" + jv + "</td>";
					} else if (j.data) {

						var jv = (j.data)[(parent.dataModel[a]).name];
						var out = "";
						if ((parent.dataModel[a]).type == "select2") {
							var app = "";
							$(jv).each(function(x, y) {
								out += app + y.type + ':' + y.uid;
								app = ",";
							});
							if(out!="")
							jv = out;
						}
						
						if ((j.data)[(parent.dataModel[a]).name]) {
							dataStr += "<td " + css + ">" + jv + "</td>";
						} else if ((j.data)[(parent.dataModel[a]).mappedName]) {
							dataStr += "<td " + css + ">" + jv + "</td>";
						} else {
							dataStr += "<td " + css + "></td>";
						}
					}else{
						dataStr += "<td " + css + "></td>";
					}
				} else {
					dataStr += "<td " + css + "></td>";

				}
			}
		}
		dataStr += "</tr>";
		if (objKeyIndex == -1 && j[parent.objectKey]) {
			dataMap[j[parent.objectKey]] = j;
		}
	});
	$("#tbody_" + parent.id).html(dataStr);
	if (objKeyIndex != -1) {
		$("#tbody_" + parent.id + " tr").click(function() {
			var val = $("td:nth-child(" + objKeyIndex + ")", $(this)).html();
			$("#photo1 .details").html(generateForm(parent.name, "edit", val));
			$("#photo1").overlay().load();
		});
	} else if (parent.objectKey) {

		$("#tbody_" + parent.id + " tr").click(function() {
			var val = this.id;
			// parent.modelMap[objectKey]
			$("#photo1 .details").html(generateForm(parent.name, "edit", val));
			$("#photo1").overlay().load();
		});
	}
}
// Search Infra
var substringMatcher = function(dMap, q, type) {

	var di = desktop.getItem(type);
	$("#tbody_" + di.id + " tr").removeClass("selected");
	$("#tbody_" + di.id + " tr td").removeClass("selected");
	if (q == "") {
		drawTable(di);
		return;
	}
	var matches, substringRegex;

	// an array that will be populated with substring matches
	matches = [];

	// regex used to determine if a string contains the substring `q`
	substrRegex = new RegExp(q, 'i');
	var resultArray = new Array();
	for ( var key in dMap) {
		var ml = di.dataModel.length;
		var ob = dMap[key];
		for (var a = 0; a < ml; a++) {
			var valC = ob[(di.dataModel[a]).name];
			if (!valC) {
				valC = ob[(di.dataModel[a]).mappedName];
			}
			if (substrRegex.test(valC)) {
				resultArray.push(ob);
				break;
			}
		}
	}
	drawTable(di, resultArray);
	/*
	 * $("#tbody_" + di.id + " tr").each(function(i,j){
	 * 
	 * if (substrRegex.test($(j).html())) {
	 * 
	 * $(j).addClass("selected"); $("td",$(j)).addClass("selected"); }
	 * 
	 * });
	 */

};
var abc = [];
abc['ac'] = 'aaaaaaaaaaaf';
abc['aca'] = 'afsgh';

function makeItSearchable(type) {
	var selector = "search_" + type;
	$("#" + selector).keyup(function() {
		substringMatcher(dataMap, $(this).val(), type);
		// sappend(selector);
	});

}
function sappend(selector) {
	var top = document.getElementById(selector).getBoundingClientRect().top;
	$("#" + selector)
			.parent()
			.after(
					'<ul style="top:'
							+ top
							+ 'px" class="dropdown-menu"><li class="dropdown-menu-header"><strong>Messages</strong></li></ul>');
}

// //
var bar = $('.bar');

if ($('#uploadDataForm').length>0) {
	$('#uploadDataForm').ajaxForm({
		beforeSend : function() {
			var percent = $('#percent');
			var status = $('#status');
			status.empty();
			var percentVal = '0%';
			// bar.width(percentVal);
			percent.html(percentVal);
			$("#upload").css("display", "none");
		},
		uploadProgress : function(event, position, total, percentComplete) {
			var percent = $('#percent');
			var status = $('#status');
			var percentVal = percentComplete + '%';
			bar.width(percentVal)
			percent.html(percentVal);
			// console.log(percentVal, position, total);
		},
		complete : function(xhr) {
			var percent = $('#percent');
			var status = $('#status');
			status.html(xhr.responseText);

			$("#upload").css("display", "block");

		}
	});

	$('#uploadNotification').ajaxForm({
		beforeSend : function() {
			var percent = $('#percent1');
			var status = $('#status1');
			status.empty();
			var percentVal = '0%';
			// bar.width(percentVal);
			percent.html(percentVal);
			$("#upload1").css("display", "none");
		},
		uploadProgress : function(event, position, total, percentComplete) {
			var percent = $('#percent1');
			var status = $('#status1');
			var percentVal = percentComplete + '%';
			bar.width(percentVal)
			percent.html(percentVal);
			// console.log(percentVal, position, total);
		},
		complete : function(xhr) {
			var percent = $('#percent1');
			var status = $('#status1');
			status.html(xhr.responseText);

			$("#upload1").css("display", "block");

		}
	});

	
}
function uploadFile(file) {
	var filename = $("#fileField").val();
	if (filename) {
		if (filename.indexOf(".zip") > -1) {
			$.get("/jsp/data_upload.jsp", function(data) {
				$("#uploadDataForm").attr("action", $.trim(data));
				$("#done").click();
			});
		} else {
			$("#uploadDataForm").attr("action", "/buzzoo/fileupload");
			// $("#done").click();
			$('#uploadDataForm').submit();

		}
	}
	// document.getElementById("done").click();
}
function uploadFile1(file) {
	var filename = $("#fileField1").val();

	$("#done1").click();

}
var printRows = 3;
// Print utils
function printDiv(divName) {

	var printContents = document.getElementById(divName).innerHTML;
	w = window.open();

	for (var i = 0; i < printRows; i++) {
		w.document.write(printContents);
		w.document.write("<br>");
	}
	w.print();
	w.close();
}

function getCountSupportHTML(type) {
	return '<div id="count_'
			+ type
			+ '" style="position: absolute;  margin-top: -60px;  margin-left: 50px;">'
			+ '<i class="fa fa-circle fa-3x" style="color:#11FA30;"></i>'
			+ '<span style="line-height: 30px;  text-align: center;width: 100%;display: block;position: absolute;top: 0px; font-size: 1.5em;text-shadow: none;color:black"></span>'
			+ '</div>';
}

function setDataCount(di, count) {
	if (di.countSupport) {
		$("#count_" + di.name + " span").html(count);
	}
}

window.fetchContent = function(dataId) {
	var di = desktop.getItem(dataId);
	if (di.geoJson) {
		return di.geoJson;
	}else{
		fetchPage(di, 0, "",true);
	}
}
function openGeoWindow(type){
    //var w = 880, h = 600,
    //left = Number((screen.width/2)-(w/2)), tops = Number((screen.height/2)-(h/2)),
    //mapWindow = window.open("geo/ptt/geojson.html?cid="+type, '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=1, copyhistory=no, width='+w+', height='+h+', top='+tops+', left='+left);
    //mapWindow.focus();
    //var di = desktop.getItem(type);
    //di.secondWindow = mapWindow;
	$("#myOverlay iframe").attr("src","geo/ptt/geojson.html?cid="+type);
	$("#myOverlay").overlay().load();
    return false;
}

function openGeoWindow1(type) {
	var w = 880, h = 600, left = Number((screen.width / 2) - (w / 2)), tops = Number((screen.height / 2)
			- (h / 2)), mapWindow = window
			.open(
					"geo/ptt/geojson.html?cid=" + type,
					'',
					'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=1, copyhistory=no, width='
							+ w
							+ ', height='
							+ h
							+ ', top='
							+ tops
							+ ', left='
							+ left);
	mapWindow.focus();
	var di = desktop.getItem(type);
	di.secondWindow = mapWindow;
	return false;
}

var mapWindow = null;

function rebind(name) {
	var di = desktop.getItem(name);
	di.dataDomain = $("#domainSelect").val();
	di.getTableData();
}