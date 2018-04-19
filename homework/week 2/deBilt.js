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

	var date = dayData[0];
	dates.push(date)
}
//console.log(dates)

var JSdates = [];

// make arrays with which JS can create JS dates
for ( var i = 0; i < dates.length; i ++){
	var tempDate = [];
	
	// divide string up into yyy/mm/dd
	var year = dates[i].substring(0, 4)
	var month = dates[i].substring(4, 6)
	var day = dates[i].substring(6, 8)
	
	tempDate.push(year, month, day)
	var tempDate1 = tempDate.join("-")
	JSdates.push(tempDate1)
	//console.log(tempDate)
}
//console.log(JSdates)

// convert date strings to javascript dates
var jsDatesUse= [];
for (var i = 0; i < JSdates.length; i ++){
	var JSdates1 = new Date(JSdates[i])
	jsDatesUse.push(JSdates1)
}
//console.log(jsDatesUse)

// milliseconds van maken
// var dateMil = [];
// for (var i = 0; i < jsDatesUse.length; i ++){
// 	var d1 = jsDatesUse[i].getTime();
// 	dateMil.push(d1)
// }
// console.log(dateMil)

// find min and max temperature
var minTemp = Math.min.apply(Math, temps);
//console.log("min temp:", minTemp)
var maxTemp = Math.max.apply(Math, temps);
//console.log("max temp:", maxTemp)

// find earliest and latest date
var minDate = Math.min.apply(Math, jsDatesUse)
//console.log("min date:", minDate)
var maxDate = Math.max.apply(Math, jsDatesUse)
//console.log("max date:", maxDate)

// initialize canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// determining domaines and ranges
var domainTemp = [minTemp, maxTemp]
var rangeTemp = [100, 480]
var domainDate = [minDate, maxDate]
var rangeDate = [100, 580]

// function to determine slope and coordinates
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

// calcualte alpha and beta for both range and domain
var yaxis = createTransform(domainTemp, rangeTemp)
var xaxis = createTransform(domainDate, rangeDate)

// Graph axis
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(100, 480);
ctx.lineTo(580, 480);
ctx.stroke();

// text in graph
ctx.font = "24px arial";
ctx.strokeText("Average temperature deBilt (2017)", 200, 20)
ctx.font = "10px arial"
ctx.fillText("Average temperature", 0, 10);
ctx.font = "10px arial"
ctx.fillText("Date", 450, 420);

// Plot graph
for (var i = 0; i < temps.length; i ++){

	var firstX = xaxis(jsDatesUse[i]);
	var nextX = xaxis(jsDatesUse[i + 1]);
	var firstY = yaxis(temps[i]);
	var nextY = yaxis(temps[i + 1]);
	
	ctx.moveTo(firstX, maxTemp - firstY),
	ctx.lineTo(nextX, maxTemp - nextY),
	ctx.stroke();
}