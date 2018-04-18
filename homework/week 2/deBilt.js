/**
* Marc Moorman
* 10769781
* Drawing a graph with javascript on a webpage
**/

// retrieve temperature data from html
var data = document.getElementById("rawdata").innerHTML;
//console.log(data)

// create arrays after newlines remove the first line
var lines = data.split('\n').slice(1);
//console.log(lines)

var dict = [];

// remove whitespaces from strings
for (var i = 0; i < lines.length; i ++){
	var lines1 = lines[i].replace(/\s+/g, "");
	dict.push(lines1);
	//console.log(lines1)
}
//console.log(dict)

var dates = [];
var temp = [];
var dict1 = [];

// split arrays at comma's and push to seperate arrays
for(var i = 0; i < dict.length; i ++){
	var dayData = dict[i].split(',');

	dates.push(dayData[0]);
	temp.push(dayData[1]);

	 dict1.push({
	 	key: dayData[0],
	 	value: dayData[1]
	 	})
}

console.log(dict1)
// console.log(dates)
// console.log(typeof(dates))
console.log(temp)
console.log(typeof(temp))

var str = string(temp);
console.log(str)
//var max = Math.max.apply(Math, temp);
//console.log(max)

// domain is x-axis
//var domain = 
// range is y-axis
//var range = 

// function createTransform(domain, range){
// 	// domain is a two-element array of the data bounds [domain_min, domain_max]
// 	// range is a two-element array of the screen bounds [range_min, range_max]
// 	// this gives you two equations to solve:
// 	// range_min = alpha * domain_min + beta
// 	// range_max = alpha * domain_max + beta
//  	// a solution would be:

//     var domain_min = domain[0]
//     var domain_max = domain[1]
//     var range_min = range[0]
//     var range_max = range[1]

//     // formulas to calculate the alpha and the beta
//    	var alpha = (range_max - range_min) / (domain_max - domain_min)
//     var beta = range_max - alpha * domain_max

//     // returns the function for the linear transformation (y= a * x + b)
//     return function(x){
//       return alpha * x + beta;
//     }
// }

// var canvas = document.getElementById("myCanvas");
// //canvas.width = 300;
// //canvas.length = 300;
// var ctx = canvas.getContext("2d");
// ctx.fillStyle = "rgb(0,256,256)";
// ctx.fillRect(50, 50, 500, 500);