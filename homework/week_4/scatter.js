// Marc Moorman
// 10769781

// function that is triggered when page is loaded
window.onload = function() {

	// using api's to retrieve data
	var GDP = "http://stats.oecd.org/SDMX-JSON/data/PDB_LV/AUS+BEL+EST+FRA+GRC+HUN+IRL+JPN+LVA+LUX+NLD+NZL+POL+PRT+SVN+ESP+GBR+LTU.T_GDPPOP.VPVOB/all?startTime=2004&endTime=2013&dimensionAtObservation=allDimensions"
	var realMinWage = "http://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+EST+FRA+GRC+HUN+IRL+JPN+LVA+LUX+NLD+NZL+POL+PRT+SVN+ESP+GBR+LTU.PPP.A/all?startTime=2004&endTime=2013&dimensionAtObservation=allDimensions";
	var hoursWorkedAnnually = "http://stats.oecd.org/SDMX-JSON/data/ANHRS/AUS+BEL+EST+FRA+GRC+HUN+IRL+JPN+LVA+LUX+NLD+NZL+POL+PRT+SVN+ESP+GBR+LTU.TE.A/all?startTime=2004&endTime=2013&dimensionAtObservation=allDimensions"

	// queuing steps to do before drawing plot
	d3.queue()
	  .defer(d3.request, GDP)
	  .defer(d3.request, realMinWage)
	  .defer(d3.request, hoursWorkedAnnually)
	  .awaitAll(loadingPage);

	// responding to request
	function loadingPage(error, response) {
	  if (error) throw error;
	  
	  // writing JSON
	  else 
	  	// parsing api data
	  	var gdpJSON = JSON.parse(response[0].responseText);
	  	//console.log("GDP JSON:", gdpJSON)
	  	var wageJSON = JSON.parse(response[1].responseText);
	  	//console.log("Wage:", wageJSON)
	  	var hoursJSON = JSON.parse(response[2].responseText);
	  	//console.log("HOURS:", hoursJSON)

	  	// putting info in seperate arrays per year
	  	var wage_PY = [];
	  	var gdp_PY = [];
	  	var hours_PY = [];
	  	for (var j = 0; j < 10; j ++){
	  		
	  		var yearlyGDP = [];
	  		var yearlyWage = [];
	  		var yearlyHRS = [];
	  		//var countryCodeGDP = [];
	  		//var countryCodeWage = [];
	  		
	  		// putting info in arrays per country
	  		for (var i = 0; i < 18; i ++){
	  			//countryCodeGDP.push(gdpJSON.structure.dimensions.observation[0].values[i].name)
	  			//countryCodeWage.push(wageJSON.structure.dimensions.observation[0].values[i].name)
	  			yearlyGDP.push(gdpJSON.dataSets[0].observations[i + ":0:0:" + j][0]);
	  			yearlyWage.push(wageJSON.dataSets[0].observations[i + ":" + j +":0:0"][0]);
	  			yearlyHRS.push(hoursJSON.dataSets[0].observations[i + ":" + j +":0:0"][0]);
	  		};
	  		
	  		//console.log(yearlyHRS)
	  		//console.log(yearlyGDP)
	  		//console.log(yearlyWage)

	  		hours_PY.push(yearlyHRS)
	  		gdp_PY.push(yearlyGDP)
	  		wage_PY.push(yearlyWage)
	  	};
	  	// console.log("hours:", hours_PY)
	  	// console.log("gdp:", gdp_PY)
	  	// console.log("wage:", wage_PY)	  	

	  	// lijsten samenvoegen om zo coordinaten te krijgen
	  	//console.log("gdp:", gdp_PY[0][0])
	  	//console.log("wage:", wage_PY[0][0])

	  	// creating lists with datapoints as coordinates
	  	var datasetHrs = [];
	  	var datasetWage = [];
	  	for (var i = 0; i < gdp_PY[0].length; i ++){
	  		var x_yGdpHrs = [];
	  		var x_yGdpWage = [];
	  		x_yGdpHrs.push(gdp_PY[0][i])
	  		x_yGdpHrs.push(hours_PY[0][i])
	  		datasetHrs.push(x_yGdpHrs)
	  		x_yGdpWage.push(gdp_PY[0][i])
	  		x_yGdpWage.push(wage_PY[0][i])
	  		datasetWage.push(x_yGdpWage)
	  	};
	  	console.log("datasetHrs:", datasetHrs)
	  	console.log("datasetWage:", datasetWage)

	  	// set svg charactersitics
	  	var w = 1000
	  	var h = 500
	  	var leftMargin = 100
	  	var rightMargin = 200
	  	var padding = 10;
	  	var topMargin = 50
	  	var bottomMargin = 100
	  	
	  	// max values for axis
  		var maxX_Value = Math.max.apply(Math, hours_PY[0]);
  		var max_GDP = Math.max.apply(Math, gdp_PY[0]);
  		//var min_GDP = Math.min.apply(Math, gdp_PY[0]);
  		// console.log("max gdp:", max_GDP)
  		// console.log("max x value:", maxX_Value)

	  	// x axis characteristics
	  	var scaleX = d3.scaleLinear()
	  		.domain([0, maxX_Value * 1.06])
	  		.range([leftMargin, w - rightMargin])
		
		var x_axis = d3.axisBottom()
			.scale(scaleX);	    

		// y axis characteristics
		var scaleY = d3.scaleLinear()
			.domain([max_GDP*1.11, 0])
			.range([padding, h - bottomMargin]);

		var y_axis = d3.axisLeft()
			.scale(scaleY)
			.ticks(18);

		// creating svg element
		var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        // creating info window
        var tip = d3.tip()
      				.attr("class", "d3-tip")
				    .offset([-20, 0]).html(function(d, i) {
		 	    		return "<strong>Country:</strong> <span style='color:black'>" + gdpJSON.structure.dimensions.observation[0].values[i].name + "</span>" });
		svg.call(tip);

        // creating circles
        svg.selectAll("circle")
		   .data(gdp_PY[0])
		   .enter()
		   .append("circle")
		   .attr("class", "circle")
		   .attr("cx", function(d, i){
		   		return scaleX(datasetHrs[i][1]);
		   })
   			.attr("cy", function(d, i){
		   		return scaleY(datasetHrs[i][0]);
		   	})
   			.attr("r", function(d, i){
   				return (datasetHrs[i][0] / datasetHrs[i][1]) / 2;
   			})
   			.attr("fill", function(d, i){
   				// GDP / hour worked ratio
   				if (datasetHrs[i][0] / datasetHrs[i][1] > datasetHrs[0][0] / datasetHrs[0][1]) {return "#c51b8a"}
   				else if (datasetHrs[i][0] / datasetHrs[i][1] < datasetHrs[0][0] / datasetHrs[0][1]) {return "#fa9fb5"}
   				else {return "#000000"}
   			})
   			.on("mouseover", tip.show)
			.on("mouseout", tip.hide);

   		// drawing x axis
		svg.append("g")
			.attr("class", "axis")
		    .attr("transform", "translate(0," + (h - bottomMargin) + ")")
			.call(x_axis);
		
		// drawing y axis
		svg.append("g")
			.attr("class", "axis")
		    .attr("transform", "translate(" + leftMargin + ", 0)")
			.call(y_axis);

		// x axis label
		svg.append("text") 
			.attr("class", "axisText")            
	    	.attr("transform", "translate(" + ( w / 2) + " ," + (h - (padding * 5)) + ")")
	    	.style("text-anchor", "middle")
	    	.text("Average hours worked (annually per person)");

		// y axis label
		svg.append("text")
	     	.attr("class", "axisText")
		    .attr("transform", "rotate(-90)")
		    .attr("y", 20)
		    .attr("x", - (h / 2))
		    .attr("dy", "1em")
		    .style("text-anchor", "middle")
		    .text("GDP (in millions)");

  		// adding legend (colors chosen using color brewer color blind friendly)
		var legend = svg.selectAll("legend")
		var three = [1, 2, 3];
		legend.append("rect")
			  .data(three)
			  .enter()
			  .append("rect")
			  .attr("class", "legend")
		      .attr("y", function(d, i){
		      		return h - h + 100 - (i * 30);
		      	})
		      .attr("x", w - 100)
		      .attr("width", 20)
		      .attr("height", 5)
		      .style("fill", function(d, i){
		      	if (h - h + 100 - (i * 30) == 100 ) {return "#c51b8a"}
		      	else if (h - h + 100 - (i * 30) == 70) {return "#fa9fb5"}
		      	else {return "#000000"}
		      });

		// adding text in legend
		svg.append("text")
			.attr("x", w - 100)
		    .attr("y", h - h + 100 - (3 * 30))
		    .attr("dy", ".35em")
		    .style("text-anchor", "end")
		    .text("GDP/Hour worked ratio (Australia as benchmark):");

		svg.append("text")
			.attr("x", w - 100)
		    .attr("y", h - h + 100 - (0 * 30))
		    .attr("dy", ".35em")
		    .style("text-anchor", "end")
		    .text("Higher");

		svg.append("text")
			.attr("x", w - 100)
		    .attr("y", h - h + 100 - (1 * 30) )
		    .attr("dy", ".35em")
		    .style("text-anchor", "end")
		    .text("Lower");

		svg.append("text")
			.attr("x", w - 100)
		    .attr("y", h - h + 100 - (2 * 30) )
		    .attr("dy", ".35em")
		    .style("text-anchor", "end")
		    .text("Equal");
		
		// function to update data when clicked on button
		function updateData(){

		}


		//On click, update with new data			
		// d3.selectAll(".m")
		// 	.on("click", function() {
		// 		var year = this.getAttribute("value");

		// 		var str;
		// 		if(year == "2004"){
		// 			str = "2004.json";
		// 		}else if (year == "2003"){
		// 			str = "2003.json";}
				// }else if(date == "2014-02-21"){
				// 	str = "21.json";
				// }else if(date == "2014-02-22"){
				// 	str = "22.json";
				// }else{
				// 	str = "23.json";
				// }



		svg.select(".title")
			.text("Number of messages per hour on " + date + ".");
	};

	// function getData() --> deze in window.onload uit laten voeren
	// alle functies er buiten definieren

	// function makeScater

	// function addLegend etc.
};


	  	// LANDEN SORTEREN EN JUISTE DINGEN BIJ ELKAAR
	  	// var gdpCountrySort = [];
	  	// for (var j = 0; j < 18; j ++){
	  	// 	gdpCountrySort.push(countryCodeGDP[j])
	  	// 	gdpCountrySort.push(gdp_PY[i])
	  	// 	for (var i = 0; i < 10; i ++){
	  	// 		gdpCountrySort.push(gdp_PY[i])
	  	// 	}
	  	// }
	  	// console.log(gdpCountrySort)