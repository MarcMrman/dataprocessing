// Marc Moorman
// 10769781
// program that......

// function that is triggered when page is loaded
window.onload = function() {

	// data
	// $.getJSON("./Governmental education expenditure.json", function(json) {
 //    	console.log(json); });

	// $.getJSON("./World uni ranking.json", function(json) {
 //    	console.log(json); });

	// queuing steps to do before drawing plot
	d3.queue()
	  .defer(d3.request, "./Governmental education expenditure.json")
	  .defer(d3.request, "./World uni ranking.json")
	  .awaitAll(loadingPage);
	
	// response to request
	function loadingPage(error, response) {
		if (error) throw error;
		//console.log(response[0])
		//console.log(response[0].response)
		console.log(response[1].responseText)	
	};
};

function drawBarChart(){

};
//google D3 datamaps, dan eerste link