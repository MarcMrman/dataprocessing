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

// create dates for temperature points SUBSTRINGS van maken om op de goede manier te doen
for(var i = 17167 ; i < 17532; i ++){
		var date = new Date(i * 86400000);
		dates.push(date)
}
//console.log(dates)
//console.log(temps)

// find min and max temperature
var minTemp = Math.min.apply(Math, temps);
var maxTemp = Math.max.apply(Math, temps);
console.log(maxTemp)
console.log(minTemp)

// find earliest and latest date
var minDate = Math.min.apply(Math, dates)
var maxDate = Math.max.apply(Math, dates)
console.log(minDate)
console.log(maxDate)

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var domainTemp = [minTemp, maxTemp]
var rangeTemp = [20, 400]
var domainDate = [minDate, maxDate]
var rangeDate = [20, 500]

createTransform(domainTemp, rangeTemp)
createTransform(domainDate, rangeDate)

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 	// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    console.log(alpha)
    console.log(beta)
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
// ctx.font = "24px arial";
// ctx.strokeText("Average temperature deBilt (2017)", 200, 20)
// ctx.font = "10px arial"
// ctx.fillText("Average temperature", 0, 10);
// ctx.font = "10px arial"
// ctx.fillText("Date", 450, 420);