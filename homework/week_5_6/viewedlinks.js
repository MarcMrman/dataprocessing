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
		
		// console.log(response[0])
		// console.log(response[1])	

		drawBarChart(response[0])
	};
};

function drawBarChart(educationExpenses){

	console.log(educationExpenses)
	
	// initial data
	var year = "2012 [YR2012]"

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
		var maxY = educationExpenses.data[i]["2012 [YR2012]"]
		expenses.push(maxY)
	}    
	console.log(expenses)
	var maxY = Math.max.apply(Math, expenses)

	// scaling for the axis
	var scaleX = d3.scaleLinear()
             			//.domain([minDate, maxDate]) KIJKEN HOE DAT WERKT MET LANDEN
             			.range([leftMargin, w - rightMargin]);
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
		 	    			"<strong>Expenses:</strong> <span style='color:black'>" + educationExpenses.data[i]["2012 [YR2012]"] + "</span>" + "</br>" });
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
	   		return h - bottomMargin - (educationExpenses.data[i]["2012 [YR2012]"] * 12);
	   })
	   .attr("width", ((w - leftMargin) / educationExpenses.data.length) - barPadding)
	   .attr("height", function(d, i){
	   		return educationExpenses.data[i]["2012 [YR2012]"] * 12;
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

function updateGraph() {
	if onclick 
		if get element ("value") == "2013 [YR2013]"
			year = "2012 [YR2012]" drawBarChart

}
//google D3 datamaps, dan eerste link