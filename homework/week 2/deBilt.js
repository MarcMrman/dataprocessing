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

var JSdates = [];

// make arrays with date strings
for ( var i = 0; i < dates.length; i ++){
	
	var tempDate = [];
	
	// divide string up into yyy/mm/dd
	var year = dates[i].substring(0, 4)
	var month = dates[i].substring(4, 6)
	var day = dates[i].substring(6, 8)
	
	tempDate.push(year, month, day)
	var tempDate1 = tempDate.join("-")
	JSdates.push(tempDate1)
}

// convert date strings to javascript dates
var jsDatesUse= [];
for (var i = 0; i < JSdates.length; i ++){
	var JSdates1 = new Date(JSdates[i])
	jsDatesUse.push(JSdates1)
}

// find min and max temperature
var minTemp = Math.min.apply(Math, temps);
var maxTemp = Math.max.apply(Math, temps);

// find earliest and latest date
var minDate = Math.min.apply(Math, jsDatesUse)
var maxDate = Math.max.apply(Math, jsDatesUse)

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

// data for drawing graphs
var amountMonths = 12; 
var Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
var rangeY = rangeTemp[1] - rangeTemp[0];
var amountSteps = (maxTemp - minTemp) / 10;
var stepsTemp = rangeY / amountSteps;
var stepsMonth = (rangeDate[1] - rangeDate[0]) / Months.length;

// Graph axis
ctx.beginPath();
ctx.moveTo(rangeDate[0], rangeTemp[0]);
// drawing y axis
for (var i = 0; i < amountSteps + 1; i ++){
	
	var rangeY = 100 + (i * stepsTemp);	
	var nextTemp = 100 + (i + 1) * stepsTemp;	
	
	ctx.fillText(240 - (i * 10), 75, rangeY);
	ctx.moveTo(100, rangeY);
	ctx.lineTo(100, nextTemp);
}
// drawing x axis
for (var i = 0; i < Months.length; i ++){
	
	var rangeX = 100 + (i * stepsMonth); 
	var nextMonth = 100 + ((i + 1) * stepsMonth); 
	
	ctx.fillText(Months[i], rangeX, 95);
	ctx.moveTo(rangeX, 100);
	ctx.lineTo(nextMonth, 100);
}
ctx.stroke();

// text in graph
ctx.font = "24px arial";
ctx.strokeText("Average temperature deBilt in 0.1 Celcius (2017)", 200, 20)
ctx.font = "10px arial"
ctx.fillText("Average temperature", 0, 500);
ctx.font = "10px arial"
ctx.fillText("Month", 550, 80);

// Plot graph
for (var i = 0; i < temps.length; i ++){

	var firstX = xaxis(jsDatesUse[i]);
	var nextX = xaxis(jsDatesUse[i + 1]);
	var firstY = yaxis(temps[i]);
	var nextY = yaxis(temps[i + 1]);
	
	ctx.moveTo(firstX, rangeTemp[0] + rangeTemp[1] - firstY),
	ctx.lineTo(nextX, rangeTemp[0] + rangeTemp[1] - nextY),
	ctx.stroke();
}

// loading in data from external file
// var tempTXT = XMLHttpRequest();
// tempTXT.open("GET"," ", true)
// tempTXT.onreadystatechange = function() {
//   if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
//     if (txtFile.status === 200) {  // Makes sure it's found the file.
//       allText = txtFile.responseText;
//       lines = txtFile.responseText.split("\n"); // Will separate each line into an array
//     }
//   }
// }
// txtFile.send(null);