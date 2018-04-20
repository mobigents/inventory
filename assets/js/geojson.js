/**
 * 
 */
//{

//  "type": "FeatureCollection",
//  "features": [
//    
//{
//  "type": "FeatureCollection",
//  "features": [
//    {
//      "type": "Feature",
//      "properties": {
//        "id": "ire3k295",
//        "title": "Cornell University",
//        "description": "<div style=\"width:330px;height:240px;overflow:auto\"><div class=\"googft-info-window\" style=\"font-family:sans-serif\"> <b>Governmental Body/Entity:</b> Cornell University<br><p> <b>Type of Drone:</b> University Built (One-Third Scale Piper Cub) UAS</p><p><b>Status:</b> Expired</p><p> <b>General Location of Drone Activity:</b> Aurora, NY</p><p> <b>Stated objective/purpose of COA:</b> The purpose of the proposed UAV flights in this COA is to develop and use experimentally, a system to vertically profile the atmosphere from 300 ft agl to 3000 ft agl.  The UAV payload will be instrumentation to continuously measure temperature, relative humidity, wind speed and wind direction as the UAV spirals vertically from 300 ft agl to 3000 ft agl and back down to 300 ft agl.  The UAV will maintain a GPS controlled circle with a 1500 ft diameter utilizing a Micropilot 1028 autopilot.  The climb rate will be 150 ft/min and the duration of the flight will be approximately 40 min. This system will replace the release of helium filled balloons with radio equipped weather packages and the use of tethered blimps utilized to lift weather instrumentation into the lower atmosphere.   An UAV mounted system is superior because the helium filled free flying balloons rise through the lower 3000 ft of the atmosphere too quickly for accurate weather data.  The tethered blimps have a FAA imposed altitude restriction of 1000-1500 ft due to their danger to aircraft and the inability of the operators to react quickly enough to avoid full scale aircraft.  In contrast, a UAV mounted system can spiral up to 3000 ft in a relatively short time period, yielding high quality weather measurements and can quickly be diverted to avoid full scale aircraft which enter into the area of UAV flights.</p><p> <b>Effective Dates:</b> 3/1/2010-2/28/2011</p><p> <b>Comments:</b> </p><p><b>Link to Records:</b> <a href=\"https://www.eff.org/document/cornell-university-drone-records\" target=\"_blank\">https://www.eff.org/document/cornell-university-drone-records</a></p> </div></div>",
//        "marker-color": "#00bcce",
//        "marker-size": "medium",
//        "marker-symbol": "airport",
//        "marker-zoom": ""
//      },
//      "geometry": {
//        "coordinates": [
//          -76.702448,
//          42.753959
//        ],
//        "type": "Point"
//      },
//      "id": "ci9bzhum74haejrlvrn7i8fep"
//    }
//    ]
//}
function FeatureCollection(){
	this.type= "FeatureCollection";
	this.features=[];
	
}
function Feature(){
	
	this.type= "Feature";
	this.geometry={
			coordinates:[],
			type: "Point"
	};
	this.id="";
	this.properties={};
	
}

function GeoModal(dataModel,dataArray){
	
	this.dataModel = dataModel;
	this.dataArray = dataArray;
}

(function($) {
    $.fn.geoJson = function() {    	
    	var geoModel = (this)[0]; 
    	
    	var latField = "lat";
    	var lonField = "lon";   
    	var featureCollection = new FeatureCollection();
    	var displayNames =[];
    	$(geoModel.dataModel).each( function() {    		
    		if(this.dataType=="lat"){    			
    			latField = this.name;
    		}else
    		if(this.dataType=="lon"){    			
    			lonField = this.name;
    		}else{    			
    			displayNames[this.name] = true;
    		}
        });
    	
    	$(geoModel.dataArray).each( function() { 
    		var data=this;
    		var coordinates=[]; 
    		var properties = {};
    		for(var k in data){    			
    			if(!(k==lonField || k==latField) && displayNames[k])
    				properties[k] = data[k];
    		}
    		var idata=data.data;
    		if(idata){
	    		for(var k in idata){    			
	    			if(displayNames[k])
	    				properties[k] = idata[k];
	    		}
    		}
    		
    		if(!data[lonField]){
    			data[lonField]="0.0";
    		}
    		if(!data[latField]){
    			data[latField]="0.0";
    		}
    		if(data[lonField] && data[lonField]!="" && data[latField] && data[latField]!=""){
    			coordinates.push(Number(data[lonField]));
        		coordinates.push(Number(data[latField]));
        		var feature = new Feature();
        		feature.geometry.coordinates=coordinates;
        		feature.id = data[geoModel.objectKey];  
        		if(!feature.id)
        			feature.id = idata[geoModel.objectKey];  
        		feature.properties = properties;
        		featureCollection.features.push(feature);
    		}
    		
        });    	
    	return featureCollection;
    }

}(jQuery));