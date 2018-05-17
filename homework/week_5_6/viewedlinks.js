/** 
* Marc Moorman
* 10769781
* Program with interactive charts who both display information. 
* The visualisations (map and bar chart) are both drawn with their own function. 
**/

// function that is triggered when page is loaded
window.onload = function() {

	// queuing files to be loaded in
	d3.queue()
	  .defer(d3.json, "./Governmental education expenditure.json")
	  .defer(d3.json, "./World uni ranking.json")
	  .defer(d3.json, "./countryCoordinates.json")
	  .awaitAll(loadingPage);
	
	// function to load page after queuing
	function loadingPage(error, response) {
		if (error) throw error;

		drawBarChart(response[0], 2);
		addLegend();
		createMap(response[1], response[2], 2012, response[0], 2);
		description();
	};
};

// function to draw bar charts depending on year given
function drawBarChart(educationExpenses, wishedYear){
	
	// initial data
	var year = "201"+ wishedYear + " [YR201" + wishedYear + "]"

	// characteristics for SVG element
	var w = 500;
	var h = 300;
	var barPadding = 5;
	var leftMargin = 50;
	var bottomMargin = 50;
	var topMargin = 10
	var rightMargin = 35;
	
	// finding max expenses for y-axis
	var expenses = [];
	for (var i = 0; i < educationExpenses.data.length; i ++){
		var maxY = educationExpenses.data[i][year]
		expenses.push(maxY)
	}    
	var maxY = Math.max.apply(Math, expenses)

	// scaling for the axis
	var scaleX = d3.scaleLinear()
 		.range([leftMargin, w]);
	var scaleY = d3.scaleLinear()
		.domain([maxY * 1.10, 0])
		.range([topMargin, h - bottomMargin]);

	// axis characteristics
	var x_axis = d3.axisBottom()
		.scale(scaleX)
		.ticks(0);			
	var y_axis = d3.axisLeft()
		.scale(scaleY);

	// create SVG element
	var svgBarChart = d3.select("#containerBarChart")
        .append("svg")
        .attr("id", "barChart")
        .attr("width", w)
        .attr("height", h);

	// creating info window for hovering
	var tipBar = d3.tip()
		.attr("class", "d3-tip")
	    .offset([-20, 0]).html(function(d, i) {
    		return "<strong>Country:</strong> <span style='color:black'>" + educationExpenses.data[i]["Country Name"] + "</span>" + "</br>" +
			"<strong>Expenses:</strong> <span style='color:black'>" + Math.round(educationExpenses.data[i][year] * 100) / 100 
			+ "%" + "</span>" + "<br>" });
	svgBarChart.call(tipBar);

	// drawing bars in bar chart
	svgBarChart.selectAll("rect")
	   .data(educationExpenses.data)
	   .enter()
	   .append("rect")
	   .attr("class", "rect")
	   .attr("id", function(d, i){
	   		return educationExpenses.data[i]["Country Code"]})
	   .attr("x", function(d, i){
	   		return i * ((w - leftMargin) / educationExpenses.data.length) + leftMargin;
	   })
	   .attr("y", function(d, i){
	   		return h - bottomMargin - (educationExpenses.data[i][year] * 12);
	   })
	   .attr("width", ((w - leftMargin) / educationExpenses.data.length) - barPadding)
	   .attr("height", function(d, i){
	   		return educationExpenses.data[i][year] * 12;
	   })
	   .attr("fill", "grey")
	   .on("mouseover", tipBar.show)
	   .on("mouseout", tipBar.hide);

	// drawing x axis
	svgBarChart.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(0," + (h - bottomMargin) + ")")
	    .call(x_axis);
	// drawing y axis
	svgBarChart.append("g")
		.attr("class", "axis")
	    .attr("transform", "translate(" + leftMargin + ", 0)")
	    .call(y_axis);
	
	// x axis label
	svgBarChart.append("text") 
		.attr("class", "axisText")            
	    .attr("transform", "translate(" + ( w / 2) + " ," + (h - bottomMargin + 20) + ")")
	    .style("text-anchor", "middle")
	    .text("Country");
	// y axis label
	svgBarChart.append("text")
     	.attr("class", "axisText")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 20)
	    .attr("x", - (h / 2))
	    .attr("dy", "1em")
	    .style("text-anchor", "middle")
	    .text("Expenses on education (as % of total government expenses)");
};

// function to draw map of europe
function createMap(uniRanking, countries, ranking, educationExpenses, wishedYear){

	var ranking2012 = [];
	var ranking2013 = [];
	var ranking2014= [];

	// dividing list up into ranking per year
	for (var i = 0; i < 100; i ++){
		ranking2012.push(uniRanking.data[i])
	};
	
	for (var i = 100; i < 200; i ++){
		ranking2013.push(uniRanking.data[i])
	};

	for (var i = 200; i < 300; i ++){
		ranking2014.push(uniRanking.data[i])
	};

	// svgMap width and height	
	var w = 550;
	var h = 400;

	// define map projection and center Europe
	var projection = d3.geoMercator()
		.center([13, 52])
		.translate([w / 2, h / 2])
		.scale([w / 1.5]);

	// define path generator
	var path = d3.geoPath()
		.projection(projection);

	// create SVG
	var svgMap = d3.select("#containerMap")
		.append("svg")
		.attr("id", "map")
		.attr("width", w)
		.attr("height", h);

	// creating info window for hovering over country
	var tip = d3.tip()
		.attr("class", "d3-tip")
	    .offset(function (d, i) {	
	    	if (d.geometry.coordinates[0][0][0][0] == 8.10273437500004){
	    		return [300, 0];
	    	}
	    	else if (d.geometry.coordinates[0][0][0][1] == 43.743798828124994){
	    		return [400, 250];
	    	}
	    	else {
	    		return [0, 0];
	    	}
        })
	    .html(function(d, i) {
    		return "<strong>Country:</strong> <span style='color:black'>" + countries.features[i].properties.admin + "</span>" + "</br>" +
    		"<strong>Highest ranked univsersity:</strong> <span style='color:black'>" + getUni(countries.features[i].properties.admin, ranking2012)[1] + "</span>" + "</br>" });
	svgMap.call(tip);

	// bind data and create one path per GeoJSON feature
	svgMap.selectAll("path")
	   .data(countries.features)
	   .enter()
	   .append("path")
	   .attr("d", path)
	   .attr("class", "path")
	   .attr("id", function(d, i){
   			return countries.features[i].properties.admin;
   		})
	   .attr("stroke", "rgba(8, 81, 156, 0.2)")
	   .attr("fill", function(d, i){
		   	if (countries.features[i].properties.region_un == "Europe"){
		   			return "#2c7fb8";
		   		}
		   	else if (countries.features[i].properties.admin == "Antarctica"){ 
		   			return "#a6bddb";
		   		}
		   	else {
		   			return "#636363";
		   		}
		   })   	
		// event for mouse to light up a bar when the corresponding country is hovered over
	   .on("mouseenter", function(countries, i) {
			var country = "rect#" + countries.properties.adm0_a3;
  			d3.select("body")
  			.selectAll(country)
  			.style("fill", "rgba(255,191,0, 0.7)") 
  		})	   	
  		.on("mouseleave", function(countries, i){
			var country = "rect#" + countries.properties.adm0_a3;
  			d3.select("body")
  			.selectAll(country)
  			.style("fill", "grey");
  			})
	   .on("mouseover", tip.show)
	   .on("mouseout", tip.hide) 
	   // display universities in a country in top 100 when clicked on country
   	   .on("click", function(uniRanking, i){
	   		document.getElementById("country").innerHTML = countries.features[i].properties.admin;
	   		document.getElementById("uniText").innerHTML = getUni(countries.features[i].properties.admin, ranking);
	   	});

	updateGraphs(uniRanking, countries, ranking2012, ranking2013, ranking2014, educationExpenses, wishedYear);
};

// function to draw a legend
function addLegend(){
	
	// creating svg for legend
	var w = 550;
	var h = 50;

	var legend = d3.select("#containerMap")
		.append("svg")
		.attr("id", "legend")
		.attr("width", w)
		.attr("height", h);

	// drawing rectangles for legend
	var two = [1, 2];
	legend.selectAll("rect")
	  .data(two)
	  .enter()
	  .append("rect")
	  .attr("class", "legend")
      .attr("y", h / 2)
      .attr("x", function(d, i){
      	return w - 200 - (i * 200);
      })
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", function(d, i){
      	if (w - 200 - (i * 200) == w - 200 ) { 
      		return "#636363"; 
      	}
      	else { 
      		return "#2c7fb8"; 
      	}
      });

	legend.append("text")
		.attr("x", function(d, i){
			return w - 165 - (1 * 165);
		})
	    .attr("y", (h / 2) + 10)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text("Europe");

	legend.append("text")
		.attr("x", w - 140)
	    .attr("y", (h / 2) + 10)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text("Other");
};

// function to retrieve universities in country when hoovered over
function getUni(country, wishedYear) {
	
	var unis = [];

	// gathering uni's for country hovered over
	for (var i = 0; i < wishedYear.length; i ++){
		if (country == wishedYear[i].country){
			unis.push(wishedYear[i].world_rank)
			unis.push(wishedYear[i].institution)
			unis.push(wishedYear[i].publications)
			unis.push(wishedYear[i].national_rank)
			unis.push("<br>")
		};		
	};
	return unis;
};

// function to update map and bar chart
function updateGraphs(uniRanking, countries, ranking2012, ranking2013, ranking2014, educationExpenses, wishedYear){

	// change year variable to show updated data when clicked
	document.getElementById("2012").onclick = function(){
		d3.select("#barChart").remove();
		d3.select("#map").remove();
		wishedYear = 2;
		wishedRanking = ranking2012;
		drawBarChart(educationExpenses, wishedYear);
		createMap(uniRanking, countries, wishedRanking, educationExpenses, wishedYear);
	};	

	// change year variable to show updated data when clicked
	document.getElementById("2013").onclick = function(){
		d3.select("#barChart").remove();
		d3.select("#map").remove();
		wishedYear = 3;
		wishedRanking = ranking2013;
		drawBarChart(educationExpenses, wishedYear);
		createMap(uniRanking, countries, wishedRanking, educationExpenses, wishedYear);
	};

	// change year variable to show updated data when clicked
	document.getElementById("2014").onclick = function(){
		d3.select("#barChart").remove();
		d3.select("#map").remove();
		wishedYear = 4;
		wishedRanking = ranking2014;
		drawBarChart(educationExpenses, wishedYear);
		createMap(uniRanking, countries, wishedRanking, educationExpenses, wishedYear);
	};
};

// function for adding text to specific part of the webpage
function description(){
	
	// put text in container
	d3.select("#description")
		.append("p")
		.text("This page gives a visualisation of universities on the European continent that are listed in the top 100 of \
		universities in the world. The map on the left shows the countries in the European area and gives a quick view on which \
		university of that country is highest listed between the elites of the world. By clicking on the country, all listed universities\
		get displayed together with additional information. The bar chart on the right shows the \
		percentage of the total governmental expenses that a country has spend on education. The meaning of this visualisation \
		is to look if more expenses on education (relatively) is a guarantee for higher or more listings in the top of the world. \
		(Note: There was not data available for all years for all countries on education expenses, there a minimum percentage \
		of 0.1 has been put.).")
};
