/**
* Marc Moorman
* 10769781
* Drawing a graph with javascript on a webpage
**/

// retrieve temperature data from html
var data = document.getElementById("rawdata").innerHTML;

// create arrays after newlines remove the first line
var lines = data.split('\n').slice(1);

var dict = [];

// remove whitespaces from strings
for (var i = 0; i < lines.length; i ++){
	var line = lines[i].replace(/\s+/g, "");
	dict.push(line);
}

var dates = [];
var temps = [];

// split arrays at comma's and push temperatures to array
for(var i = 0; i < dict.length - 1; i ++){
	var dayData = dict[i].split(',');
	
	var temp = parseInt(dayData[1])
	temps.push(temp);
}

for (var i = 0; i < dates.length; i ++){
	var date1 = date.getTime(dayData[0])
}

// create dates for temperature points SUBSTRINGS van maken om op de goede manier te doen
for(var i = 17167 ; i < 17532; i ++){
		var date = new Date(i * 86400000);
		dates.push(date)
}

//var date1 = date.getTime();

// find min and max temperature
var minTemp = Math.min.apply(Math, temps);
var maxTemp = Math.max.apply(Math, temps);

// find earliest and latest date
var minDate = Math.min.apply(Math, dates)
var maxDate = Math.max.apply(Math, dates)

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// determining domaines and ranges
var domainTemp = [minTemp, maxTemp]
var rangeTemp = [20, 400]
var domainDate = [minDate, maxDate]
var rangeDate = [20, 500]

function createTransform(domain, range){

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

// Graph axis
ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineTo(20, 400);
ctx.lineTo(500, 400);
ctx.stroke();

// text in graph
ctx.font = "24px arial";
ctx.strokeText("Average temperature deBilt (2017)", 200, 20)
ctx.font = "10px arial"
ctx.fillText("Average temperature", 0, 10);
ctx.font = "10px arial"
ctx.fillText("Date", 450, 420);

// Create datapoints
var yaxis = createTransform(domainTemp, rangeTemp)
var xaxis = createTransform(domainDate, rangeDate)

// Plot graph
for (var i = 0; i < temps.length; i ++){
	var firstX = xaxis(dates[i]);
	var nextX = xaxis(dates[i + 1]);
	var firstY = yaxis(temps[i]);
	var nextY = yaxis(temps[i + 1]);

	ctx.moveTo(firstX, firstY),
	ctx.lineTo(nextX, nextY),
	ctx.stroke();
}