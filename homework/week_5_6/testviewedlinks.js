// Marc Moorman
// 10769781
// program that......

// Feedback:
// queue functie ipv d3.json(?), staat er toch
// barchart niet helemaal verwijderen maar alleen bars
// Landnamen op x-as barchart
// NOORWEGEN NOG IN DE KAART KRIJGEN
// INDENTATION NOG VRAGEN 

// function that is triggered when page is loaded
window.onload = function() {

	// queuing steps to do before drawing plot
	d3.queue()
	  .defer(d3.json, "./Governmental education expenditure.json")
	  .defer(d3.json, "./World uni ranking.json")
	  .defer(d3.json, "./countryCoordinates.json")
	  .awaitAll(loadingPage);
	
	// response to request
	function loadingPage(error, response) {
		if (error) throw error;

		//console.log(response[0])
		// calling function drawBarChart
		drawBarChart(response[0])
		//drawBarChart(response[0], 2)
		createMap(response[1], response[2], 2012, response[0], 2)
	};
};

// function to draw map of europe
function createMap(uniRanking, countries, ranking, educationExpenses, wishedYear){

	var ranking2012 = [];
	var ranking2013 = [];
	var ranking2014= [];
	//console.log(ranking2012)

	// 100/200/300 hardoced
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

	// initial data INITiAL DATA NOG FIXEN!!!
	//var wishedRanking = "ranking201" + ranking;
	//console.log(ranking)

	// determining width and height	
	var w = 600;
	var h = 400;

	//Define map projection and center Europe
	var projection = d3.geoMercator()
						.center([13, 52])
						.translate([w / 2, h / 2])
						.scale([w / 1.5]);

	//Define path generator
	var path = d3.geoPath()
				.projection(projection);

	//Create SVG
	var svg = d3.select("#container")
				.append("svg")
				.attr("id", "map")
				.attr("width", w)
				.attr("height", h);

	// creating info window
	var tip = d3.tip()
				.attr("class", "d3-tip")
			    .offset([0, 0]).html(function(d, i) {
		 	    		return "<strong>Country:</strong> <span style='color:black'>" + countries.features[i].properties.admin + "</span>" + "</br>" +
		 	    			"<strong>Univsersities:</strong> <span style='color:black'>" + getUni(countries.features[i].properties.admin, ranking) + "</span>" + "</br>" });
	svg.call(tip);

	//Load in GeoJSON data WEGHALEN, WORDT AL INGELADEN MET RESPONSE[2]
	d3.json("countryCoordinates.json", function(json) {
		
		//Bind data and create one path per GeoJSON feature
		svg.selectAll("path")
		   .data(json.features)
		   .enter()
		   .append("path")
		   .attr("d", path)
		   .attr("stroke", "rgba(8, 81, 156, 0.2)")
		   .attr("fill", "rgba(8, 81, 156, 0.6)")
		   //.on("click", )
		   .on("mouseover", tip.show)
		   .on("mouseout", tip.hide);
	});

	updateGraphs(uniRanking, countries, ranking2012, ranking2013, ranking2014, educationExpenses, wishedYear )
};

// function to draw bar charts depending on year given
function drawBarChart(educationExpenses){ //, wishedYear){
	
	// initial data
	//var year = "201"+ wishedYear + " [YR201" + wishedYear + "]"

	// Characteristics for SVG element
	var w = 500;
	var h = 300;
	var barPadding = 5;
	var leftMargin = 50;
	var bottomMargin = 50;
	var topMargin = 10
	var rightMargin = 35;
	
	console.log(educationExpenses)
	// max expenses 29 NIET HARDCODEN
	var expenses = [];
	for (var i = 0; i < 29; i ++){
		//var maxY = educationExpenses.data[i]["2012 [YR2012"]
		var exp2012 = educationExpenses.data[i]["2012 [YR2012]"]
		var exp2013 = educationExpenses.data[i]["2013 [YR2013]"]
		var exp2014 = educationExpenses.data[i]["2014 [YR2014]"]
		expenses.push(exp2012);
		expenses.push(exp2013);
		expenses.push(exp2014);
	};    
	console.log(expenses)
	var maxY = Math.max.apply(Math, expenses)

	// scaling for the axis
	var scaleX = d3.scaleLinear()
             			//.domain([minDate, maxDate]) KIJKEN HOE DAT WERKT MET LANDEN
             			.range([leftMargin, w]); // - rightMargin]);
	var scaleY = d3.scaleLinear()
						.domain([maxY * 1.10, 0])
						.range([topMargin, h - bottomMargin]);

	// axis characteristics
	var x_axis = d3.axisBottom()
						.scale(scaleX)
						.ticks(0);
	var y_axis = d3.axisLeft()
					.scale(scaleY);

	//Create SVG element
	var svg = d3.select("body")
	            .append("svg")
	            .attr("id", "barChart")
	            .attr("width", w)
	            .attr("height", h);

	// creating info window MINDER GETALLEN ACHTER DE KOMMA
	var tip = d3.tip()
				.attr("class", "d3-tip")
			    .offset([-20, 0]).html(function(d, i) {
		 	    		return "<strong>Country:</strong> <span style='color:black'>" + educationExpenses.data[i]["Country Name"] + "</span>" + "</br>" +
		 	    			"<strong>Expenses:</strong> <span style='color:black'>" + educationExpenses.data[i][year] + "</span>" + "</br>" }); //["2012 [YR2012]"]
	svg.call(tip);

	// drawing bars
	svg.selectAll("rect")
	   .data(educationExpenses.data)
	   .enter()
	   .append("rect")
	   .attr("class", "rect")
	   .attr("x", function(d, i){
	   		return i * ((w - leftMargin) / educationExpenses.data.length) + leftMargin;
	   })
	   .attr("y", function(d, i){
	   		return h - bottomMargin - (educationExpenses.data[i] * 12);
	   })
	   .attr("width", ((w - leftMargin) / educationExpenses.data.length) - barPadding)
	   .attr("height", function(d, i){
	   		return educationExpenses.data[i] * 12;
	   })
	   //.on("click", function(d, i){
	   	//	console.log(educationExpenses.data[i]["Country Name"])}) // click werkt, nu nog linken aan map
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
	    .attr("transform", "translate(" + ( w / 2) + " ," + (h - bottomMargin + 20) + ")")
	    .style("text-anchor", "middle")
	    .text("Country");
	// y axis label
	svg.append("text")
     	.attr("class", "axisText")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 20)
	    .attr("x", - (h / 2))
	    .attr("dy", "1em")
	    .style("text-anchor", "middle")
	    .text("Expenses on education (as % of total government expenses)");
};

// function to retrieve universities listed in country hoovered over
function getUni(country, wishedYear) {
	var unis = [];

	// gathering uni's per country
	for (var i = 0; i < wishedYear.length; i ++){
		if (country == wishedYear[i].country){
			unis.push(wishedYear[i].world_rank),
			unis.push(wishedYear[i].institution);
		}
	}
	return unis;
}

function updateGraphs(uniRanking, countries, ranking2012, ranking2013, ranking2014, educationExpenses, wishedYear){

	// change year variable to show updated data when clicked
	document.getElementById("2012 [YR2012]").onclick = function(){
		
		// remove old bar chart svg
		console.log("updatefunciton")
		d3.select("#barChart").remove();
		d3.select("#map").remove();
		wishedYear = 2;
		wishedRanking = ranking2012;
		drawBarChart(educationExpenses, wishedYear);
		createMap(uniRanking, countries, wishedRanking, educationExpenses, wishedYear);
	};	

	// change year variable to show updated data when clicked
	document.getElementById("2013 [YR2013]").onclick = function(){
		
		// remove old bar chart svg
		console.log("updatefunciton")
		d3.select("#barChart").remove();
		d3.select("#map").remove();
		wishedYear = 3;
		wishedRanking = ranking2013;
		drawBarChart(educationExpenses, wishedYear);
		createMap(uniRanking, countries, wishedRanking, educationExpenses, wishedYear);
	};

	// change year variable to show updated data when clicked
	document.getElementById("2014 [YR2014]").onclick = function(){
		
		// remove old bar chart svg
		console.log("updatefunciton")
		d3.select("#barChart").remove();
		d3.select("#map").remove();
		wishedYear = 4;
		wishedRanking = ranking2014;
		drawBarChart(educationExpenses, wishedYear);
		createMap(uniRanking, countries, wishedRanking, educationExpenses, wishedYear);
	};
};

// function that toggles between hiding and showing the dropdown content when clicked on
function dropwdownFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}