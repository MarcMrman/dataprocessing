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
	// LIJSTEN HEBBEN NIET ZELFDE LANDEN VOLGORDE
	var GDP = "http://stats.oecd.org/SDMX-JSON/data/PDB_LV/AUS+BEL+EST+FRA+GRC+HUN+IRL+JPN+LVA+LUX+NLD+NZL+POL+PRT+SVN+ESP+GBR+LTU.T_GDPPOP.VPVOB/all?startTime=2004&endTime=2013&dimensionAtObservation=allDimensions"
	var realMinWage = "http://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+EST+FRA+GRC+HUN+IRL+JPN+LVA+LUX+NLD+NZL+POL+PRT+SVN+ESP+GBR+LTU.PPP.A/all?startTime=2004&endTime=2013&dimensionAtObservation=allDimensions";
	//var hoursWorkedAnnually = "http://stats.oecd.org/SDMX-JSON/data/ANHRS/AUS+BEL+EST+FRA+GRC+HUN+IRL+JPN+LVA+LUX+NLD+NZL+POL+PRT+SVN+ESP+GBR+LTU.TE.A/all?startTime=2004&endTime=2013&dimensionAtObservation=allDimensions"
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
	  	//console.log(gdpJSON)
	  	var wageJSON = JSON.parse(response[1].responseText);
	  	//console.log(wageJSON)
	  	// var hoursJSON = JSON.parse(response[2].responseText);
	  	// console.log(hoursJSON)

	  	// console.log(gdpJSON.structure.dimensions.observation[0].values[0].name)
	  	
	  	// var sorted = gdpJSON.sort(function(a, b){
	  	// 	for (var i = 0; i < 19; i ++)
	  	// 		if (a.structure.dimensions.observation[0].values[i].name < b.structure.dimensions.observation[0].values[i].name) return -1;
	  	// 		if (a.structure.dimensions.observation[0].values[i].name > b.structure.dimensions.observation[0].values[i].name) return 1;
	  	// 		return 0;
  		// 	};
	  	// console.log(sorted)	
	  	// });

	  	// putting info in seperate arrays
	  	var gdp_PY = [];
	  	var wage_PY = [];
	  	for (var j = 0; j < 10; j ++){
	  		var yearlyGDP = [];
	  		var yearlyWage = [];

	  		for (var i = 0; i < 18; i ++){
	  			yearlyGDP.push(gdpJSON.dataSets[0].observations[i + ":0:0:" + j][0]);
	  			yearlyWage.push(wageJSON.dataSets[0].observations[i + ":" + j +":0:0"][0]);
	  		};
	  		gdp_PY.push(yearlyGDP)
	  		wage_PY.push(yearlyWage)
	  	};
	  	console.log(gdp_PY)
	  	console.log(wage_PY)

	  	// lijsten samenvoegen om zo coordinaten te krijgen
	  	console.log(gdp_PY[0][0])
	  	console.log(wage_PY[0][0])

	  	var dataset = [];

	  	for (var i = 0; i < gdp_PY[0].length; i ++){
	  		var x_yGdpWage = [];
	  		x_yGdpWage.push(gdp_PY[0][i])
	  		x_yGdpWage.push(wage_PY[0][i])
	  		dataset.push(x_yGdpWage)
	  	};
	  	console.log(dataset)

	  	//Create SVG element
	  	var w = 1000
	  	var h = 500
	  	// var leftMargin = 
	  	// var rightMarging =
	  	// var topMargin =
	  	// var bottomMargin = 

		var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        // creating circles
        svg.selectAll("circle")
		   .data(gdp_PY[0])
		   .enter()
		   .append("circle")
		   .attr("class", "circle")
		   .attr("cx", function(d, i){
		   		return dataset[i][0] / w;
		   })
   			.attr("cy", function(d, i){
		   		return dataset[i][1] / h;
		   	})
   			.attr("r", 4);
	};

	// function getData() --> deze in window.onload uit laten voeren
	// alle functies er buiten definieren

	// function makeScater

	// function addLegend etc.
};

// function(d, i) {
// 			    console.log(dataset[i][1])
// 			    return (Math.sqrt(h - dataset[i][1])) / 10000;
// 			}