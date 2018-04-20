var startD = null;
var endD = null;
var columnsMetaMap = [];
var serverRoot=getParameterByName("server");//"http://localhost:8081";
if(!serverRoot){
	serverRoot="http://ec2-35-169-132-136.compute-1.amazonaws.com:8081";
}
var server = serverRoot+"/mobigents-core";
//Table Template
//
var tableTemplate =function(){
	
	return '<table class="table card"  id="{tableId}"  data-toggle="table" data-show-refresh="true" data-show-columns="true" data-show-export="true"'+
	'data-ajax="{onRequest}" data-toolbar="#toolbar" data-height="500" data-side-pagination="server"'+
	'data-pagination="true" data-page-size="200" data-page-list="[5, 10, 20, 50, 100, 200]" data-search="true" data-show-filter="true">'+
	'<thead><tr></tr></thead></table>';
	
}



var toolBarTemplate = 
	'<div id="toolbar">'+
	'	<button id="new" type="button" class="btn" data-toggle="modal" data-target="#modalTable">'+
	'		<i class="glyphicon glyphicon-plus"></i> Add'+
	'	</button>'+
	'	<button id="edit" type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalTable">'+
	'		<i class="glyphicon glyphicon-edit"></i> Edit'+
	'	</button>'+
	'	<button id="remove" class="btn btn-danger" disabled>'+
	'		<i class="glyphicon glyphicon-remove"></i> Delete'+
	'	</button>'+	
	'</div>';
		

var modalTemplate = function(options){
return '<div class="modal fade" id="modalTable" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
'			<div class="modal-dialog">'+
'				<div class="modal-content">'+
'					<div class="modal-header">'+
'						<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
'							<span aria-hidden="true">×</span>'+
'						</button>'+
'						<h4 class="modal-title"></h4>'+
'					</div>'+
'					<div class="modal-body">'+
''+
'						<div id="dataModel"></div>'+
'					</div>'+
'					<div class="modal-footer">'+
'						<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
'						<button type="button" class="btn btn-primary" onclick="submitObject(\''+options.domainName+'\');">Done</button>'+
''+
'					</div>'+
'				</div>'+
'				<!-- /.modal-content -->'+
'			</div>'+
'			<!-- /.modal-dialog -->'+
'		</div>'+
'		'+
'		<div class="modal fade" id="confirm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
'			<div class="modal-dialog">'+
'				<div class="modal-content">'+
'					<div class="modal-header">'+
'						<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
'							<span aria-hidden="true">×</span>'+
'						</button>'+
'						<h4 class="modal-title"></h4>'+
'					</div>'+
'					<div class="modal-body">'+
''+
'						'+
'					</div>'+
'					<div class="modal-footer">'+
'						<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
'						<button type="button" class="btn btn-primary" onclick="confirmDelete();">Done</button>'+
''+
'					</div>'+
'				</div>'+
'				<!-- /.modal-content -->'+
'			</div>'+
'			<!-- /.modal-dialog -->'+
'		</div>'+
'		<!-- /.modal -->'
+
'		<div class="modal fade" id="popMap" style="z-index:10000" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
'			<div class="modal-dialog">'+
'				<div class="modal-content">'+
'					<div class="modal-header">'+
'						<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
'							<span aria-hidden="true">×</span>'+
'						</button>'+
'						<h4 class="modal-title"></h4>'+
'					</div>'+
'					<div class="modal-body" style="height:500px">'+
''+
'						'+
'					</div>'+
'					<div class="modal-footer">'+
'						<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
'						<button type="button" class="btn btn-primary" onclick="confirmSnap();">Done</button>'+
''+
'					</div>'+
'				</div>'+
'				<!-- /.modal-content -->'+
'			</div>'+
'			<!-- /.modal-dialog -->'+
'		</div>'+
'		<!-- /.modal -->';

}


var locationTempate = function(data){
	var lat=0.0;
	var lon=0.0;
	if(data.lat){
		lat = data.lat;
	}else if(position){
		lat = position.coords.latitude;
	}
	if(data.lon){
		lon = data.lon;
	}else if(position){
		lon = position.coords.longitude;
	}
	return   '<div class="row">'+
	'    <div class="col-md-4">'+
	'        <div class="form-group">'+
	'            <label>Lat</label>'+
	'            <input type="text" class="form-control" id="lat" placeholder="Latitude" value="'+lat+'">'+
	'        </div>'+
	'    </div>'+
	'    <div class="col-md-4">'+
	'        <div class="form-group">'+
	'            <label>Lon</label>'+
	'            <input type="text" class="form-control" id="lon" placeholder="Longitude" value="'+lon+'">'+
	'        </div>'+
	'    </div>'+
	'    <div class="col-md-4">'+
	'        <div class="form-group">'+
	'            <label></label>'+
	'            <button style="display:block" id="editWithMap" type="button" class="btn btn-primary" data-toggle="modal" data-target="#popMap"><i class="pe-7s-map-marker" style="color:green"></i>Edit with Map</button>'+
	'        </div>'+
	'    </div>'+
	'    </div>';
		


}
var mobTableContent =function(options){
	var hh ="";
	
	var gg = "";
	
	if(options.title){
		hh='<div class="header">'+
		'<h4 class="title">'+options.title+'</h4>'+
		'<p class="category">'+options.subTitle+'</p>'+
		'</div>';
	}
	return '<div class="row">'+
''+
hh
+

'						<div id="dateContainer" class="col-md-3 pull-right" style="padding: 0px;">'+
'<div id="mapView" class="pull-right"><a href="ptt/geojson.html?cid='+options.domainName+'">Map View</a></div>'+
'							<div id="geoRange" class="pull-right"'+
'								style="background: #fff;padding: 5px 10px; border: 1px solid #ccc; width: 100%;display:none;">'+
'								<i class="pe-7s-map-marker"></i>  <span></span><input id="distance" type="number"></input><span style="font-size:0.8em">Meters Radius</span>'+
'							</div>'+
'							<div id="reportrange" class="pull-right"'+
'								style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc; width: 100%;display:none;">'+
'								<i class="glyphicon glyphicon-calendar fa fa-calendar"></i>  <span></span> <b class="caret"></b>'+
'							</div>'+
'						</div>'+
'					</div>'+
''+
'					<div class="col-md-12">'+
'						<div class="row">'+
'							<div class="content">'+
'								<div class="row contentTableRow">'+
'									'+
''+
'								</div>'+
''+
'							</div>'+
'						</div>'+
''+
'					</div>';
}
	

//

function isMyScriptLoaded(url) {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
    	var inTups =url.split("/");
    	var urlScript = inTups[inTups.length-1];
    	
    	var eTups =scripts[i].src.split("/");
    	var eUrl = eTups[eTups.length-1];
    	
        if (urlScript == eUrl) return true;
    }
    return false;
}

function isStyleLoaded(url) {
    var scripts = document.getElementsByTagName('link');
    for (var i = scripts.length; i--;) {
    	var inTups =url.split("/");
    	var urlScript = inTups[inTups.length-1];
    	
    	var eTups =scripts[i].href.split("/");
    	var eUrl = eTups[eTups.length-1];
    	
        if (urlScript == eUrl) return true;
    }
    return false;
}

function loadScripts(array,callback){
    var loader = function(src,handler){
    	
    	if(isMyScriptLoaded(src)){
    		handler();
    	}else{
        var script = document.createElement("script");
        script.src = src;
        script.onload = script.onreadystatechange = function(){
            script.onreadystatechange = script.onload = null;
            handler();
        }
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild( script );
    	}
    };
    (function run(){
        if(array.length!=0){
            loader(array.shift(), run);
        }else{
            callback && callback();
        }
    })();
}

function loadStyles(styles){
	for(var k in styles){
		if(!isStyleLoaded(styles[k])){
			$("<link/>", {
				   rel: "stylesheet",
				   type: "text/css",
				   href: styles[k]
			}).appendTo("head");
		}
	}
	
}

function preloadScripts(callBack){
	
	loadStyles(['assets/css/bootstrap.min.css','assets/css/animate.min.css','assets/css/light-bootstrap-dashboard.css','assets/css/demo.css',
	            'http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css','http://fonts.googleapis.com/css?family=Roboto:400,700,300',
	            'assets/bootstrap-table/bootstrap-table.css','assets/bootstrap-table/extensions/editable/select2.css',
	            'assets/css/pe-icon-7-stroke.css','http://cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.css','assets/css/dropzone.css']);
	
	loadScripts(['assets/js/jquery-1.10.2.js','assets/js/bootstrap.min.js','assets/js/bootstrap-checkbox-radio-switch.js',
	             'assets/js/chartist.min.js','assets/js/bootstrap-notify.js','assets/js/light-bootstrap-dashboard.js','assets/js/demo.js',
	             'http://cdn.jsdelivr.net/momentjs/latest/moment.min.js','http://cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.js',
                 'assets/bootstrap-table/bootstrap-table.js','assets/bootstrap-table/extensions/export/bootstrap-table-export.js',
                 'http://rawgit.com/hhurz/tableExport.jquery.plugin/master/tableExport.js','assets/bootstrap-table/extensions/editable/select2.js',
                 'assets/bootstrap-table/extensions/filter-control/bootstrap-table-filter-control.js','microutils.js','selectutils.js','assets/js/dropzone.js']
			  ,function(){
	              
	             callBack();
	 });
}

var dynaFunction = function (name, fn) {
    return (new Function("return function (call) { return function " + name +
        " () { return call(this, arguments) }; };")())(Function.apply.bind(fn));
};   

/**
 * Expose domainTable as a JQuery plugin
 * @param $
 */

var domainContext =null;

var isLoaded=false;

(function($) {
    $.fn.domainTable = function(options) { 
    	
    	domainContext = (this).selector;
    	
    	function loadMetadata(){
    		
    		$('body #modalTable').remove();
    		
    		$('body').append(modalTemplate(options));
        	
    		$(domainContext).append(mobTableContent(options));
    		
    		fetchMetadata(domainContext,options, function(info) {
        		console.log("Loaded ...");
        		initTable(options);
        		
        		$("#waitingModal").hide();
        		
        		$("#distance").unbind();
        		$("#distance").change(function(){
            		$table.bootstrapTable('refresh');
        		});
        	});
    		
    	}
    	
    	if(!isLoaded){
    		preloadScripts(function(){
    			$(domainContext).addClass("container-fluid");
            	
            	isLoaded=true;
            	
            	loadMetadata();
    		});
    	}else{
    		loadMetadata();
    	}
    	
    	return domainContext;
    }
}(jQuery));

function initDateFilter(){
	var start = moment();
	var end = moment();
	function cb(start, end) {
		$('#reportrange span').html(
				start.format('YYYY.MM.DD') + ' - '
						+ end.format('YYYY.MM.DD'));
		startD = start.format('YYYY.MM.DD');
		endD = end.format('YYYY.MM.DD');
	}
	$('#reportrange')
			.daterangepicker(
					{
						startDate : start,
						endDate : end,
						ranges : {
							'Today' : [ moment(), moment() ],
							'Yesterday' : [
									moment().subtract(1, 'days'),
									moment().subtract(1, 'days') ],
							'Last 7 Days' : [
									moment().subtract(6, 'days'),
									moment() ],
							'Last 30 Days' : [
									moment().subtract(29, 'days'),
									moment() ],
							'This Month' : [
									moment().startOf('month'),
									moment().endOf('month') ],
							'Last Month' : [
									moment().subtract(1, 'month')
											.startOf('month'),
									moment().subtract(1, 'month')
											.endOf('month') ]
						}
					}, cb);

	cb(start, end);
}

/**
 * Loading of the table starts here
 */
var position=null;
function initTable(options) {
	
	var schema=schemaMap[options.domainName];
	if(schema && schema.geoSupport){
		getLocation(function(pos){
			//position.coords.latitude//,position.coords.longitude,loc.lat,loc.lon);
			
			position =pos;
			
			$("#geoRange").show();
		});
		
	}
	
	if(options.dateFilter){
		initDateFilter();
		$("#reportrange").show();
	}
	
	
}

var schemaMap=[];

function fetchMetadata(context,options, callBack) {
	var name=options.domainName;

	if (columnsMetaMap[name]) {
		if (callBack) {
			callBack(columnsMetaMap[name]);
		}
	} else {

		$
				.getJSON(
						serverRoot+"/mobigents-rest/meta/objects/"
								+ name,
						function(data) {
							var columns = [];

							columns.push({
								field : '',
								title : '',
								checkbox : 'true',
							});

							columns.push({
								field : 'id',
								title : 'ID',
								visible : false
							});

							for ( var k in data.columns) {

								var column = data.columns[k];

								columns.push(column);
							}

							columnsMetaMap[data.name] = columns;
							
							schemaMap[data.name]=data;
							
							var tm = tableTemplate().replace(new RegExp("{tableId}"),options.tableId);
							
							tm = tm.replace(new RegExp("{onRequest}"),"onRequest_"+options.tableId);
							
							var cls = dynaFunction("onRequest_"+options.tableId, function (params) {
								return ajaxRequest(options,params);
							});
							
							window[("onRequest_"+options.tableId)] = cls

							$(context +" .contentTableRow").append(toolBarTemplate);
							
							$(context +" .contentTableRow").append(tm);
							
							var tableSelector = "#"+options.tableId;

							$table = $(tableSelector);

							$table.on('editable-save.bs.table',
									function(field, row, oldValue, $el) {
										console.log(field);
										console.log(row);
										console.log(oldValue);
										console.log($el);
									});

							$table.bootstrapTable({
								columns : columns
							});
							
							$remove = $('#remove');
							
							$edit = $('#edit');

							$table.on(
											'check.bs.table uncheck.bs.table '
													+ 'check-all.bs.table uncheck-all.bs.table',
											function() {

												$remove
														.prop(
																'disabled',
																!($table
																		.bootstrapTable('getSelections').length==1));
												$edit
														.prop(
																'disabled',
																!($table
																		.bootstrapTable('getSelections').length==1));

												// save your data, here just save the current page
												selections = getIdSelections();
												// push or splice the selections if you want to save all data selections
											});
							$remove.prop('disabled', !$table
									.bootstrapTable('getSelections').length);
							$edit.prop('disabled', !$table
									.bootstrapTable('getSelections').length);
							
							

							$("#new").click(function() {

								newAction(name);
							});

							$("#edit").click(function() {

								editAction(name);
							});
							
							$remove.click(function() {
								$("#confirm .modal-title").html("Are you sure to continue ?");
								$("#confirm").modal('show');
							});

							if (callBack) {
								callBack(columns);
							}
						});
	}
	return;

}
var context = {
	name : "",
	id : "",
	action : "add"
};

function newAction(name) {
	context = {
		name : name,
		id : null,
		action : "add"
	};
	var cols = columnsMetaMap[name];
	$("#modalTable .modal-title").html(name);
	$("#modalTable #dataModel").empty();
//	for ( var k in cols) {
//		if (cols[k].field != "id" && cols[k].field != '') {
//			var col = '<div class="form-group">' + '<label for="'
//					+ cols[k].field + '">' + cols[k].title + '</label>'
//					+ '<input type="text" class="form-control" id="'
//					+ cols[k].field + '" placeholder="' + cols[k].title + '">'
//					+ '</div>';
//
//			$("#modalTable #dataModel").append(col);
//		}
//	}
	
	renderContext(context,{});
}

function getLocation(callBack) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(callBack,function(){
		
		},{timeout: 30000, enableHighAccuracy: true});
		
	} else {
		
		//x.innerHTML = "Geolocation is not supported by this browser.";
	}
}
function showPosition(position) {
			
	
}

function editAction(name) {
	var da = getIdSelections();
	var data = dataMapStore[da[0]];
	context = {
		name : name,
		id : da[0],
		action : "edit"
	};
	
	$("#modalTable .modal-title").html(name + " " + da[0]);
	renderContext(context,data);
	
	
}

function initDropZone(id,value){
	
	$('#'+id+"_form").dropzone({ 
	    url: serverRoot+"/mobigents-rest/content",
	    maxFilesize: 100,
	    maxFiles: 1,
	    paramName: "uploadfile",
	    maxThumbnailFilesize: 1,
	    init: function() {
	    	
	    	if(value){
		    	var thisDropzone = this;
	
		        $.getJSON( serverRoot+"/mobigents-rest/content/"+value+"/info", function(data) { // get the json response
		           
		                var mockFile = { name: data.name, size: data.size }; // here we get the file name and size as response 
	
		                thisDropzone.options.addedfile.call(thisDropzone, mockFile);
		                
		                thisDropzone.options.thumbnail.call(thisDropzone, mockFile, serverRoot+"/mobigents-rest/content/"+value);//uploadsfolder is the folder where you have all those uploaded files
		                thisDropzone.files.push(mockFile);

		        });
	    	}
	        
	      this.on('success', function(file, json) {
	    	  $('#'+id).val(json.rows[0].dataKey);
	      });
	      
	      this.on('addedfile', function(file) {
	    	  if (this.files.length > 1) {
	    	      this.removeFile(this.files[0]);
	    	   }
	      });
	      
	      this.on('drop', function(file) {
	        alert('file');
	      }); 
	    }
	  });
}

function renderContext(context,data){
	var name = context.name;
	$("#modalTable #dataModel").empty();
	var cols = columnsMetaMap[name];
	for ( var k in cols) {
		if (cols[k].field != "id" && cols[k].field != '') {
			
			if (cols[k].editable.type && cols[k].editable.type == "image") {
				
				var disabled = "";
				
				var value= null;
				if(data.data)
					value = data.data[cols[k].field];
				
				var col = '<div class="form-group">'
						+ '<label for="inputEmail">' + cols[k].title
						+ '</label>' 
						+ '<input type="hidden" value="" id="'+cols[k].field+'">'
						+ '<form action="/upload" class="dropzone" drop-zone="" id="'+cols[k].field+'_form"></form>'
						+ '</div>';

				$("#modalTable #dataModel").append(col);
				
				initDropZone(cols[k].field,value);

			}else if (cols[k].editable.type && cols[k].editable.type == "mselect") {
				/*{
						source:{
							domainName :ownUsers,
							fieldName:ownId,
							groupName:company
						}
					
				}*/
				var sel = '<div class="form-group"><label for="'
						+ cols[k].field + '">' + cols[k].title
						+ '</label><select id="' + cols[k].field
						+ '" class="js-example-tokenizer form-control">';

				$("#modalTable #dataModel").append(sel + '</select></div>');
				
				var value= null;
				if(data.data)
					value = data.data[cols[k].field];

				generateOptionGroup(cols[k].editable.source.domain, "#"
						+ cols[k].field, cols[k].editable.source.field,
						null, null,value);

			} else if (cols[k].editable.type
					&& cols[k].editable.type == "select") {

				var sel = '<div class="form-group"><label for="'
						+ cols[k].field + '">' + cols[k].title
						+ '</label><select id="' + cols[k].field
						+ '" class="js-example-tokenizer form-control">';
				var option = '';
				var ss = cols[k].editable.source;

				var value= "";
				if(data.data)
					value = data.data[cols[k].field];
				
				if(!cols[k].mandatory || cols[k].mandatory=="false"){
					
					option += '<option value=""></option>';
				}
				
				for ( var x in ss) {
					
					var selOption = "";
					if(ss[x].value==value){
						selOption=" selected ";
					}

					option += '<option '+selOption+' value="' + ss[x].value + '">'
							+ ss[x].text + '</option>';
				}

				sel += option;
				sel += '</select></div>';
				//alert(sel);

				$("#modalTable #dataModel").append(sel + '</select></div>');

				//generateOptionGroup("OwnUsers","#"+cols[k].field,"ownId");

			} else {
				var disabled = "";
				if (cols[k].editable && cols[k].editable.restrictedActions) {

					for ( var x in cols[k].editable.restrictedActions) {

						if (context.action == (cols[k].editable.restrictedActions)[x]) {

							disabled = "disabled";
						}
					}
				}
				var value= "";
				if(data.data)
					value = data.data[cols[k].field];
				
				
				var col = '<div class="form-group">'
						+ '<label for="inputEmail">' + cols[k].title
						+ '</label>' + '<input ' + disabled + ' value="'
						+ value
						+ '" type="text" class="form-control" id="'
						+ cols[k].field + '" placeholder="' + cols[k].title
						+ '">' + '</div>';

				$("#modalTable #dataModel").append(col);
			}
		}
	}
	
	var schema=schemaMap[context.name];
	if(schema.geoSupport){
		$("#modalTable #dataModel").append(locationTempate(data));
		$("#editWithMap").unbind();
		$("#editWithMap").click(function(){
			$("#popMap .modal-body").html('<iframe src="geo/geoeditor.html?lat='+$("#lat").val()+'&lon='+$("#lon").val()+'" style="width: 100%;height: 100%;border: none;"></iframe>');
		});
		
	}
	
}
function deleteAction() {

	var data = dataMapStore[da[0]];

}
function submitObject(domainName) {
	var cols = columnsMetaMap[context.name];
	var dm = new Object();
	for ( var k in cols) {
		if (cols[k].field != '') {
			var col = cols[k].field;
			if (col != 'id') {
				dm[col] = $("#" + col).val();
			}

		}
	}
	var latlon="";
	
	var schema=schemaMap[context.name];
	if(schema.geoSupport && $("#lat").val()!="" && $("#lon").val()!=""){
		latlon="?lat="+$("#lat").val()+"&lon="+$("#lon").val();
	}
	if (context.action == "add") {
		post(
				serverRoot+"/mobigents-rest/objects/"+domainName+latlon,
				"POST", JSON.stringify(dm), function(data) {
					//alert(JSON.stringify(data));
					$table.bootstrapTable('refresh');
					$('#modalTable').modal('hide');
				});
	} else {
		post(
				serverRoot+"/mobigents-rest/objects/"+domainName+"/"
						+ context.id+latlon, "PUT", JSON.stringify(dm),
				function(data) {
					//alert(JSON.stringify(data));
					$table.bootstrapTable('refresh');
					$('#modalTable').modal('hide');
				});
	}

}

/**
Function to render table from metadata
 **/
var columnsMetaMap = [];

var $remove = $('#remove');
var $edit = $('#edit');
var selections = [];
var $table = null;
function renderTable() {

}
var dataMapStore = [];

/**
 * Proxied request to invoke the domain
 * @param options
 * @param params
 */
function ajaxRequest(options,params) {
	// data you need
	console.log(params.data);

	var object = new Object();
	if (params.data.search) {
		object = searchFilter(options.domainName, params.data.search);
	}
	var locStr="";
	var schema=schemaMap[options.domainName];
	if(schema && schema.geoSupport && position ){
		
		var dist =$("#distance").val();
		if(dist!="" && !isNaN(dist)){
			locStr="&lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&distance="+dist;
		}
	}

	post(serverRoot+"/mobigents-rest/objects/"+options.domainName+"/search?count="
					+ params.data.limit + "&offset=" + params.data.offset+locStr,
			"POST", JSON.stringify(object), function(data) {
				var tRows = new Array();
				for ( var k in data.rows) {
					var da = data.rows[k];
					if (da.data) {
						da.data['id'] = da.dataKey;
						dataMapStore[da.dataKey] = da;
						tRows.push(da.data);
					}
				}
				data.rows = tRows;
				params.success(data);

    });
}

function nameFormatter(value, row) {
	var icon = row.id % 2 === 0 ? 'glyphicon-star' : 'glyphicon-star-empty'
	return '<i class="glyphicon ' + icon + '"></i> ' + value;
}

function getIdSelections() {
	return $.map($table.bootstrapTable('getSelections'), function(row) {
		return row.id
	});
}

		
		function confirmSnap() {
			
			$("#lat").val(localStorage.getItem('cLat'));
			$("#lon").val(localStorage.getItem('cLon'));
			$("#popMap").modal('hide');
		}

function confirmDelete() {

	var ids = getIdSelections();

	post(
			serverRoot+"/mobigents-rest/objects/OwnUsers/"
					+ ids[0], "DELETE", "", function() {
				$table.bootstrapTable('remove', {
					field : 'id',
					values : ids
				});
				$remove.prop('disabled', true);
				$table.bootstrapTable('refresh');
				$("#confirm").modal('hide');
			});
}

function post(url, type, data, callBack) {
	$.ajax({
		type : type,
		url : url,
		data : data,
		contentType : "application/json",
		success : function(data, status) {
			callBack(data);
		},
		async : true
	});
}


function searchFilter(name, val) {

	var cols = columnsMetaMap[name];
	var object = new Object();

	for ( var k in cols) {
		if (cols[k].field != "id" && cols[k].field != '') {
			object[cols[k].field] = val;
		}
	}

	return {
		searchFilter : object
	};
}