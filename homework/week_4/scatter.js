// Marc Moorman
// 10769781

// function that is triggered when page is loaded
window.onload = function() {

	console.log('Yes, you can!')

	// sources:
	// hrs worked = http://stats.oecd.org/BrandedView.aspx?oecd_bv_id=lfs-data-en&doi=data-00303-en#
	// gdp = http://stats.oecd.org/BrandedView.aspx?oecd_bv_id=pdtvy-data-en&doi=data-00686-en
	// min wage = http://stats.oecd.org/BrandedView.aspx?oecd_bv_id=lfs-data-en&doi=data-00656-en

	// using api's to retrieve data
	var GDP = "http://stats.oecd.org/SDMX-JSON/data/PDB_LV/AUS+BEL+EST+FRA+DEU+GRC+HUN+IRL+JPN+LVA+LUX+NLD+NZL+POL+PRT+SVN+ESP+GBR+USA+LTU.T_GDPPOP.VPVOB/all?startTime=2004&endTime=2013&dimensionAtObservation=allDimensions"
	var realMinWage = "http://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+EST+FRA+DEU+GRC+HUN+IRL+JPN+LVA+LUX+NLD+NZL+POL+PRT+SVN+ESP+GBR+USA+LTU.PPP.A/all?startTime=2004&endTime=2013&dimensionAtObservation=allDimensions";
	//var hoursWorkedAnnually = "http://stats.oecd.org/SDMX-JSON/data/ANHRS/AUS+BEL+EST+FRA+DEU+GRC+HUN+IRL+JPN+LVA+LUX+NLD+NZL+POL+PRT+SVN+ESP+GBR+USA+LTU.TE.A/all?startTime=2004&endTime=2013&dimensionAtObservation=allDimensions"
	//var kleuren = Noord/west/zuid/oost europa 

	// queuing steps to do before drawing plot
	d3.queue()
	  .defer(d3.request, GDP)
	  .defer(d3.request, realMinWage)
	  //.defer(d3.request, hoursWorkedAnnually)
	  .awaitAll(loadingPage);

	// responding to request
	function loadingPage(error, response) {
	  if (error) throw error;
	  //console.log(response);
	  
	  // writing JSON
	  else 
	  	var gdpJSON = JSON.parse(response[0].responseText);
	  	console.log(gdpJSON)
	  	var wageJSON = JSON.parse(response[1].responseText);
	  	console.log(wageJSON)
	  	//var hoursJSON = JSON.parse(response[2].responseText);
	  	//console.log(hoursJSON)

	  	console.log(gdpJSON.dataSets[0].observations["0:0:0:0"][0])

	  	for (var i = 0; i < response.dataSets.observations.length`1``	; i ++){
		  	console.log(gdpJSON.dataSets[0].observations[i + ":0:0:0"][0])
		  	console.log(wageJSON.dataS																																11	ets[0].observations[i + ":0:0:0"][0])
		  	//console.log(hoursJSON.dataSets[0].observations[i + ":0:0:0"][0])
	  	}

	};
};

