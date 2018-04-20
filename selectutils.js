function generateOptionGroup(domain,selector,groupMember,groupBy,groupValuePrepend,currentValue){	
	var reArray = [];
	fetchData(domain,function(data){		
		$(data).each(function(i,j){
			if(j.data){
				var md = JSON.parse(j.data);
				if(groupBy){
					var tdataA = reArray[md[groupBy]];
					if(!tdataA){
						tdataA=new Array();
						//reArray[md.Category]=tdataA;
						reArray[md[groupBy]]=tdataA;
					}
				}else{
					tdataA=reArray;
				}
				tdataA.push(md);	
			}
		});	
		if(!groupBy){
			for(var k in reArray){
				//$(selector).append("<optgroup  label='"+k+"'>");
				var mdA = reArray[k];
				$(mdA).each(function(i,md){
					var value= md[groupMember];	
					var selo = "";
					if(currentValue==value){
						selo= " selected "
					}
					$(selector).append("<option "+selo+" value='"+value+"'>"+value+"</option>");
				});
			}	
		}else{
			for(var k in reArray){
				$(selector).append("<optgroup  label='"+k+"'>");
				var mdA = reArray[k];
				$(mdA).each(function(i,md){
					var value= md[groupBy]+":"+md[groupMember];				
					if(groupValuePrepend)
						$(selector).append("<option value='"+groupValuePrepend+":"+md[groupBy]+"'>&#09;"+value+"</option>");
					else
						$(selector).append("<option value='"+value+"'>&#09;"+value+"</option>");
				});
				$(selector).append("</optgroup>");
			}	
		}
	});
}

function fetchData(domain,cb){	
	var mo = new Object();
	mo.objectClass = "com.jdo.CloudRowData";
	mo.action = "list";
	mo.limit = 10000;
	if(domain){			
		var fi = new Array();
		fi.push({"key":"dataDomain","value":domain,"operation":"equals"});
		mo.extra = {"filters":fi};
	}	
	var postD = "data=" + JSON.stringify(mo);
	var dataStr = "";
	$.ajax({
		url : server+'/micromodel',
		type : 'POST',
		dataType: "json",
		data : postD,
		success : function(rowdata) {
			if(rowdata.rows){
				cb(rowdata.rows);
			}else
				cb(rowdata);
		}
	});

}

/***********/

function generateOptionsURL(url,selector,groupBy,groupMember,groupValuePrepend){	
	var reArray = [];
	fetchDataURL(url,function(data){		
		$(data).each(function(i,j){
			if(j.data){
				var md = JSON.parse(j.data);
				var tdataA = reArray[md[groupBy]];
				if(!tdataA){
					tdataA=new Array();
					//reArray[md.Category]=tdataA;
					reArray[md[groupBy]]=tdataA;
				}
				tdataA.push(md);	
			}
		});		
		for(var k in reArray){
			$(selector).append("<optgroup  label='"+k+"'>");
			var mdA = reArray[k];
			$(mdA).each(function(i,md){
				var value= md[groupBy]+":"+md[groupMember];				
				if(groupValuePrepend)
					$(selector).append("<option value='"+groupValuePrepend+":"+md[groupBy]+"'>&#09;"+value+"</option>");
				else
					$(selector).append("<option value='"+value+"'>&#09;"+value+"</option>");
			});
			$(selector).append("</optgroup>");
		}		
	});
}

function fetchDataURL(url,cb){	
	
	$.ajax({
		url : server+'/'+url,
		type : 'POST',
		dataType: "json",
		success : function(rowdata) {
			if(rowdata.rows){
				cb(rowdata.rows);
			}else
				cb(rowdata);
		}
	});

}

/*******/

  function loadUserSearch(selector,url){
	  loadSelectSearch(selector,url);
  }
  
  function loadSelectSearch(selector,url){
	  $(selector).select2({
		    ajax: {
		      url: url,
		      dataType: 'json',
		      delay: 250,
		      data: function (params) {
		        return {
		          q: params.term, // search term
		          page: params.page
		        };
		      },
		      processResults: function (data, params) {		       
		        params.page = params.page || 1;		
		        return {
		          results: data.items,
		          pagination: {
		            more: (params.page * 30) < data.total_count
		          }
		        };
		      },
		      cache: true
		    },
		    escapeMarkup: function (markup) { return markup; },
		    minimumInputLength: 1,
		    templateResult: formatRepo,
		    templateSelection: formatRepoSelection
		  });
  }

  function formatRepo (repo) {
      if (repo.loading) return repo.text;

      var markup = '<div class="clearfix">' +
      '<div class="col-sm-1">' +
      '<img src="' + repo.owner.avatar_url + '" style="max-width: 100%" />' +
      '</div>' +
      '<div clas="col-sm-10">' +
      '<div class="clearfix">' +
      '<div class="col-sm-6">' + repo.full_name + '</div>' +
      '<div class="col-sm-3"><i class="fa fa-code-fork"></i> ' + repo.forks_count + '</div>' +
      '<div class="col-sm-2"><i class="fa fa-star"></i> ' + repo.stargazers_count + '</div>' +
      '</div>';

      if (repo.description) {
        markup += '<div>' + repo.description + '</div>';
      }

      markup += '</div></div>';

      return markup;
    }

    function formatRepoSelection (repo) {
      return repo.full_name || repo.text;
    }
    

function loadUserGroups(selector, url) {
	$(selector).select2({
		ajax : {
			url : url,
			dataType : 'json',
			delay : 0,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page
				};
			},
			processResults : function(data, page) {
				$.each(data, function(a, b) {

					var jd = JSON.parse(b.data);
					if (b.datadomain == "Users") {
						b.id = "User:"+jd['User Name'];
						b.type = "User";
					} else {
						b.id = "Group:"+jd['Name'];
						b.type = "Group";
					}
				});
				return {
					results : data
				};
			},
			cache : true
		},
		escapeMarkup : function(markup) {
			return markup;
		}, // let our custom
		// formatter work
		minimumInputLength : 1,
		templateResult : formatUserGroupObject, // omitted for brevity, see the
		// source of this page
		templateSelection : formatSelections
	// omitted for brevity, see the source
	// of this page
	});
}

function lookupRoles(selector,url,formatter) {
	$(selector).select2({
		ajax : {
			url : url,
			dataType : 'json',
			delay : 0,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page
				};
			},
			processResults : function(data, page) {
				$.each(data, function(a, b) {
					var jd = JSON.parse(b.data);
					b.id = 	jd['name'];
					b.type = b.datadomain;	
				});
				return {
					results : data
				};
			},
			cache : true
		},
		escapeMarkup : function(markup) {
			return markup;
		}, // let our custom
		// formatter work
		minimumInputLength : 1,
		templateResult : formatObject, // omitted for brevity, see the
		// source of this page
		templateSelection : formatSelections
	// omitted for brevity, see the source
	// of this page
	});
}
function roleFormatter(b){
	var jd = JSON.parse(b.data);
	b.id = 	jd['name'];
	b.type = b.datadomain;
}
function formatUserGroupObject(repo) {
	if (repo.loading)
		return repo.text;

	var dataObj = JSON.parse(repo.data);
	var markup = '<div class="clearfix">';
	if (repo.datadomain == "Users") {
		markup += '<div class="row">User</div>';
		markup += '<div class="row">' + dataObj['User Name'] + '</div>';
	} else {
		markup += '<div class="row">Group</div>';
		markup += '<div class="row">' + dataObj.Name + '</div>';
	}

	if (dataObj.Members) {
		var out = "";
		if(dataObj.Members){
			var app="";
			$(dataObj.Members).each(function(a,b){					
				out+=app+b.type+':'+b.uid;
				app=",";
			});
		}
		markup += '<div>' + out + '</div>';
	} else {
		markup += '<div class="row">' + dataObj.Name + '</div>';
	}

	markup += '</div>';

	return markup;
}
function formatObject(repo) {
	if (repo.loading)
		return repo.text;

	var dataObj = JSON.parse(repo.data);
	var markup = '<div class="clearfix">';
	
		markup += '<div class="row">'+repo.datadomain+'</div>';
		markup += '<div class="row">' + dataObj['name'] + '</div>';
	

	markup += '</div>';

	return markup;
}

function formatSelections(repo) {
	if (repo.id == "Group:All") {
		return "Group:All";
	}
	return repo.id;
}
