// Marc Moorman
// 10769781
// program that......

// function that is triggered when page is loaded
window.onload = function() {

	// queuing steps to do before drawing plot
	d3.queue()
	  .defer(d3.json, "./Governmental education expenditure.json")
	  .defer(d3.json, "./World uni ranking.json")
	  .awaitAll(loadingPage);
	
	// response to request
	function loadingPage(error, response) {
		if (error) throw error;
		
		console.log(response[1])	
		console.log(response[0])
		
		// calling function drawBarChart
		drawBarChart(response[0], 2)
		createMap()
	};
};

// functino to draw bar charts depending on year given
function drawBarChart(educationExpenses, wishedYear){

	//console.log(educationExpenses)
	
	// initial data
	var year = "201"+ wishedYear + " [YR201" + wishedYear + "]"
	
	// change year variable to show updated data when clicked
	document.getElementById("2012 [YR2012]").onclick = function(){
		// remove old svg
		d3.select("svg").remove();
		wishedYear = 2;
		drawBarChart(educationExpenses, wishedYear);
	};
	console.log(wishedYear)

	// change year variable to show updated data when clicked
	document.getElementById("2013 [YR2013]").onclick = function(){
		// remove old svg
		d3.select("svg").remove();
		wishedYear = 3;
		drawBarChart(educationExpenses, wishedYear);
	};
	console.log(wishedYear)

	// change year variable to show updated data when clicked
	document.getElementById("2014 [YR2014]").onclick = function(){
		// remove old svg
		d3.select("svg").remove();
		wishedYear = 4;
		drawBarChart(educationExpenses, wishedYear);
	};
	console.log(wishedYear)

	// Characteristics for SVG element
	var w = 500;
	var h = 300;
	var barPadding = 5;
	var leftMargin = 50;
	var bottomMargin = 50;
	var topMargin = 10
	var rightMargin = 35;
	
	// max expenses 29 NIET HARDCODEN
	var expenses = [];
	for (var i = 0; i < 29; i ++){
		var maxY = educationExpenses.data[i][year] //["2012 [YR2012]"]
		expenses.push(maxY)
	}    

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
	   		return h - bottomMargin - (educationExpenses.data[i][year] * 12);
	   })
	   .attr("width", ((w - leftMargin) / educationExpenses.data.length) - barPadding)
	   .attr("height", function(d, i){
	   		return educationExpenses.data[i][year] * 12;
	   })
	   // .on("click", function(d, i){
	   // 		console.log(educationExpenses.data[i])}) // click werkt, nu nog linken aan map
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

function createMap(){
	
	// determining width and height	
	var w = 800;
	var h = 400;

	//Define map projection and center Europe
	var projection = d3.geoMercator()
						.center([ 13, 52 ])
						.translate([ w / 2, h / 2 ])
						.scale([ w / 1.5 ]);

	//Define path generator
	var path = d3.geoPath()
				.projection(projection);

	//Create SVG
	var svg = d3.select("#container")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	// creating info window
	var tip = d3.tip()
				.attr("class", "d3-tip")
			    .offset([-20, 0]).html(function(d, i) {
		 	    		return "<strong>Country:</strong> <span style='color:black'>" + educationExpenses.data[i]["Country Name"] + "</span>" + "</br>" +
		 	    			"<strong>Expenses:</strong> <span style='color:black'>" + educationExpenses.data[i][year] + "</span>" + "</br>" }); //["2012 [YR2012]"]
	svg.call(tip);

	//Load in GeoJSON data
	d3.json("countryCoordinates.json", function(json) {
		
		//Bind data and create one path per GeoJSON feature
		svg.selectAll("path")
		   .data(json.features)
		   .enter()
		   .append("path")
		   .attr("d", path)
		   .attr("stroke", "rgba(8, 81, 156, 0.2)")
		   .attr("fill", "rgba(8, 81, 156, 0.6)");
});
}

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