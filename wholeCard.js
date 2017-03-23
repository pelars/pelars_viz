
var data;
var types = ["hand","ide","particle","face"];
var handData = [];
var moduleTypes = ["B","CC","BM","M","L"];
var interactionTypes = ["inputs","outputs","programming","games"];
var uniqueNames;
var theseNames = [];
var maxFaces;
var faceUseComp = [];
var faceNum = [];
var hardCumu = [];
var yOther = d3.scale.ordinal()
var linkData;
var force;
var theseTotals = [];
var one = [];
var two = [];
var three = [];

	var softS1 = [];
	var softS2 = [];
	var softS3 = [];

var marginLeft = 37;
var xPath;

var startMin, endMin, totalTime;

var faceRadius = 5;
var maxRadius = faceRadius*4;

var hardwareColor = "#15989C";
var softwareColor = "#B19B80";
/////////
var obsReflect = [];
var obsDoc = [];
var obsPlan = [];
////////
var phaseData = [];
var planStart, planEnd;
var obs = [];

var listComponents = ["BTN","POT","TMP","ACR","COL","ROT","LDR","LED","PEZ", "RGB","IF", "Interval", "Fade", "Swap", "Map","MAP","MAPTOHIGHER", "Counter", "Trigger","Note", "Random", "PONG", "SimonSays"];
var inputs=["BTN","POT","TMP","ACR","COL","ROT","LDR"]
var outputs=["LED","PEZ", "RGB"]
var programming = ["NOTE", "Random", "PONG", "SimonSays","IF", "Interval", "Fade", "Swap", "Map","MAP","MAPTOHIGHER", "Counter", "Trigger"]
// var games = ["Note", "Random", "PONG", "SimonSays"]
var hardware = ["BTN","POT","TMP","ACR","COL","ROT","LDR","LED","PEZ", "RGB"]


var topMarg = 10;
var textH = 30;
var iconW = 15;
var iconLMarg = 27;
var textL = 10;
///////summary
var uniqueHards;
var uniqueSofts;
var bothHS;
var uniqueManips;
var hardNames = [];
var softNames = [];
var hardwareOnly = [];
var softwareOnly = [];
var manipNames = [];
var totalLinks;
var totalLinks = [];
var totalTime;
var humanReadableTime;
///////summary
var diffSoftHard;
var totalComps = [];
var	hardUseComp = [];
var	softUseComp = [];
var colorText = "black";




var	faceTotal = [];



////button stuff
var particleOnly = [];
var getthis = [];
var buttonData = [];
var button1 = [];
var button2 = [];
////
var thisMinute = [];
var changes = [];


var toggling = true;

// var links;
var newguy = [];
var onlyalpha = [];
var links = [];
var nodes = {};
var newData = [];
var newguy2 = [];
var links2 = [];
var nodes2 = {};

var cwidth=200,cheight=200,cmargin=25,maxr=5;

var nested_data;
var m = [15, 20, 40, 120]; //top right bottom left
var h = $("#container").height();//document.body.clientHeight;
var w = $("#container").width()-55;//document.body.clientWidth;


var goAhead;
var svgMain = d3.select("#container").append("svg").attr("width",w+55).attr("height",h)
	.attr("class","mainSVG")            
	.attr("transform", "translate(" + 0 + "," + 0 + ")");


var forcewidth = w/3-15;
var forceheight = h/3.5;

var ardSVG = d3.select("#network")
	.append("svg")
	.attr("width",forcewidth)
	.attr("height",forceheight)  
	.style("border","1px solid white") 
	.style("margin-top","1px")

var buttonSVG = d3.select("#ardinfo")
	.append("svg")
	.attr("width",forcewidth)
	.attr("height",forceheight)  
	.style("border","1px solid white") 
	.style("margin-top","1px");

var activeSVG = d3.select("#buttonuse")
	.append("svg")
	.attr("width",forcewidth)
	.attr("height",forceheight)  
	.style("border","1px solid white") 
	.style("margin-top","1px");


var timeSVGH = h/2-60;
var timeSVG = d3.select("#timeline")
	.append("svg")
	.attr("width",w)
	.attr("height",timeSVGH)  
	.style("border","1px solid white") 
	.style("margin-top","1px");

buttonSVG.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .attr("fill",colorText)
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");  

var nest_again;
var ideData;

var ide_nest, ide_nest2;
var open = [];
var close = [];
var letspush = [];
var letsadjust = [];
var arr = [];
var only1 = [];

var timeMin, timeMax;
var timeX = d3.scale.linear();
var timeX2 = d3.scale.linear();
var maxtime = [];
var whatTime = [];	



var inputs = [];
var outputs = [];
var programming = [];
var games = [];
var options=("BTN","POT","TMP","ACR","COL","ROT","LDR","LED","PEZ", "RGB","IF", "Interval", "Fade", "Swap", "Map","MAP","MAPTOHIGHER", "Counter", "Trigger","Note", "Random", "PONG", "SimonSays");
inputs.push("BTN","POT","TMP","ACR","COL","ROT","LDR")
outputs.push("LED","PEZ", "RGB")
programming.push("Note", "Random", "PONG", "SimonSays","IF", "Interval", "Fade", "Swap", "Map","MAP","MAPTOHIGHER", "Counter", "Trigger")
games.push("Note", "Random", "PONG", "SimonSays")
var radiusMin = 5;
var spaceFactor = radiusMin;
var colorScale = d3.scale.ordinal()
    .domain(moduleTypes)
    .range(d3.scale.category20c().range());
var colorNet = d3.scale.ordinal()
    .domain(options)
    .range(d3.scale.category10().range());
var handColor = d3.scale.ordinal()
    .domain([0,20])
    .range(d3.scale.category20c().range());
var faceColor = d3.scale.ordinal()
    .domain([0,5])
    .range(d3.scale.category10().range());

var yspace = radiusMin*2.5;
var y_i = h/1.7,
y_o = h/1.7+yspace,
y_p = h/1.7+yspace*2,
y_g = h/1.7+yspace*3;

var y = d3.scale.ordinal()
    .domain(interactionTypes)
    .rangePoints([h/2, (h/2)+yspace*3]);


//hands face stuff
var radSize = 3;
var summaryHands;
var summaryFace;
var minRX, maxRX, minRY, maxRY, minFX, minFY, maxFX, maxFY;


var rx = [];
var ry = [];
var rtime = [];
var thisid = [];
var rnum
var newThing = []; 

var activeOne = [];
var activeTwo = [];
var activeThree = [];

var xIs = [];
var yIs = [];
var x=d3.scale.linear().range([cmargin,cwidth-cmargin]);
var y=d3.scale.linear().range([cheight-cmargin,cmargin]);
var o=d3.scale.linear().domain([0,300000]).range([.5,1]);

var fx=d3.scale.linear().range([cmargin,cwidth-cmargin]);
var fy=d3.scale.linear().range([cheight-cmargin,cmargin]);

var rows = 2;
var endTime;
var thisSession;

$(document).ready(function() {

getSession();
var token;

function getParam ( sname )
{
  var params = location.search.substr(location.search.indexOf("?")+1);
  var sval = "";
  params = params.split("&");
    // split param and value into individual pieces
    for (var i=0; i<params.length; i++)
       {
         temp = params[i].split("=");
         if ( [temp[0]] == sname ) { sval = temp[1]; }
       }
  return sval;
}

function getCookie(name) {
    var arg = name + "="
    var alen = arg.length
    var clen = document.cookie.length
    var i = 0
    console.log(clen)
    while (i < clen) {
        var j = i + alen
        console.log(document.cookie.substring(i, j))
        if (document.cookie.substring(i, j) == arg){
            return getCookieVal(j)
        }
        i = document.cookie.indexOf(" ", i) + 1
        if (i == 0) break
    }
    return null
}

function getCookieVal(offset){
    var endstr = document.cookie.indexOf (";", offset)
    if (endstr == -1)
    endstr = document.cookie.length
    return unescape(document.cookie.substring(offset, endstr))
}


function getSession(){
	var token = pelars_authenticate();

	console.log("got token: " + token)

	$.getJSON("/pelars/session?token="+token,function(json1){
			thisSession = getParam("session")
			getData(thisSession, token);
	})
}
var firstData;

var startFirst, endFirst;
// IF START TIME OF ONE IS LESS THAN START TIME OF OTHER, MAKE IT THAT
function getData(thisSession, token){
	console.log(thisSession);
	if(thisSession>0){
		$.getJSON("/pelars/data/"+thisSession+"?token="+token,function(json){
				console.log("ready")
startFirst = json[0].time;
endFirst = json[json.length-1].time;
// 	timeX.domain([startTime, endTime]).range([10, w-40]);

// console.log(startTime+"start")
firstData = json;
 				// ready(json)
				getPhases(thisSession, token);
			})
	}
}
function getPhases(thisSession,token){
	$.getJSON("/pelars/phase/"+thisSession+"?token="+token,function(phasesJSON){
		console.log("phase")
		console.log(phasesJSON)
if(phasesJSON[0].phase=="setup"&&phasesJSON.length==1){
	console.log("IN HERE")
	startTime = startFirst;
	endTime = endFirst;	
	timeX.domain([startTime, endTime]).range([10, w-50]);
}
	else{
			if(phasesJSON[0].start<startFirst){
				startTime = phasesJSON[0].start;		
				console.log(startTime+"phases start")	
			} else{
				startTime = startFirst;			
			}
			if(phasesJSON[phasesJSON.length-1].end>phasesJSON[phasesJSON.length-2].end){
				endPhase = phasesJSON[phasesJSON.length-1].end;
			} 		
			else{
				endPhase = phasesJSON[phasesJSON.length-2].end;
			}
			if(endPhase>endFirst){
				endTime = endPhase;
			} else{
				endTime = endFirst;
			}
	timeX.domain([startTime, endTime]).range([10, w-50]);
		showPhases(phasesJSON)
		}

console.log(startTime+"START"+endTime+"end")
		ready(firstData)
	})
}
function pelars_authenticate(){

	var token = getCookie('token');

	console.log("read the token :" + token);

	return token;
}


function ready(data1) {
		data = (data1);
    var xAxisCall = timeSVG.append('g');

    var xAxis = d3.svg.axis();
    var xAxisScale = d3.time.scale()
        .domain([startTime, endTime])
        .range([10, w-40]);
    var timeFormat = d3.time.format("%H:%M");

    xAxis
        .scale(xAxisScale)
        .orient("top")
        .ticks(7)
        .tickPadding(1)
        .tickFormat(timeFormat);
    xAxisCall.call(xAxis)
        .attr("class", "axis") //Assign "axis" class
            .attr("text-anchor", "end")
        .attr('transform', 'translate(0, ' + (timeSVGH-1) + ')');

var	handPic = svgMain.append("g").attr("class","backlabels")
		.append("image")
	    .attr("x", timeX(startTime)+iconW)
	    .attr("y",h/2-iconW*1.5)
	    .attr("width",iconW)
	    .attr("height",iconW)
               .attr("xlink:href","assets/hand.png")
var	labelsHand = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", timeX(startTime)+22)
	    .attr("y", h/2)
	    .text("Hands")
	    .attr("text-anchor","middle")
	    .attr("font-size",8)


var	facePic = svgMain.append("g").attr("class","backlabels")
		.append("image")
	    .attr("x", timeX(startTime)+iconW)
	    .attr("y", 173)
	    .attr("width",iconW)
	    .attr("height",iconW)
               .attr("xlink:href", "assets/face2.png")
var	labelsFace = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", timeX(startTime)+22)
	    .attr("text-anchor","middle")
	    .attr("y", 197)
	    .text("Faces")
	    .attr("font-size",8)

var kitPic = svgMain.append("g").attr("class","backlabels")
		.append("image")
	    .attr("x", timeX(startTime)+iconW)
	    .attr("y", h/4 - iconW*1.5)
	    .attr("width",iconW+2)
	    .attr("height",iconW+2)
               .attr("xlink:href", "assets/icons/btn.png")
var	labelsKit = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", timeX(startTime)+24)
	    .attr("y", h/4)
	    .text("Kit")
	    .attr("text-anchor","middle")
	    .attr("font-size",8)


var kitColor = svgMain.append("g").attr("class","backlabels")
		.append("circle")
	    .attr("cx", w+iconW+8-10)
	    .attr("cy", h/4 - iconW*1.5+20)
	    .attr("r", 4)
	    .attr("fill",hardwareColor)
	    .attr("stroke",hardwareColor)
var	kitNameColor = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", w+19)
	    .attr("y", h/4)
	    .text("Hardware")
	    .attr("font-size",8)
var kitColor2 = svgMain.append("g").attr("class","backlabels")
		.append("circle")
	    .attr("cx", w+iconW+8-10)
	    .attr("cy", h/4 +12)
	    .attr("r", 4)
	    .attr("fill",softwareColor)
	    .attr("stroke",softwareColor)
var	kitNameColor2 = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", w+19)
	    .attr("y", h/4+15)
	    .text("Software")
	    .attr("font-size",8)

startMin = new Date(startTime).getMinutes();
endMin = new Date(endTime).getMinutes();
startHour = new Date(startTime).getHours();
endHour = new Date(startTime).getHours();
if(endMin>startMin){
	totalMin = (endMin-startMin);	
}else{
	totalMin = (60-startMin)+endMin;	
}

console.log(totalMin);
var totalTime = endTime-startTime;
// var minutes=(totalTime/(1000*60))%60;
// var hours=(totalTime/(1000*60*60))%24;
humanReadableTime = millisecondsToStr(totalTime);
console.log(humanReadableTime)
function millisecondsToStr (milliseconds) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }

    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    //TODO: Months! Maybe weeks? 
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less than a second'; //'just now' //or other string you like;
}





for(i=0; i<data.length; i++){
		if(data[i].type == "button"){
			particleOnly.push(data[i]);
		}
}

		nested_data = d3.nest()
			.key(function(d) { return d.type; })
			.key(function(d){ return d.num; })
			.entries(data);



		nested_face = d3.nest()
			.key(function(d) { return d.type; })
			.entries(data);
var rex = [];
var rey = [];
		nest_again = d3.nest()
			.key(function(d) { return d.type; })
			.key(function(d){ return d.num; })
			.rollup(function(leaves) { 
				return { 
						"max_time": d3.max(leaves, function(d) {
							return parseFloat(d.time);
						}),
						"min_time": d3.min(leaves, function(d) {
							return parseFloat(d.time);
						}),
						"meanX": d3.mean(leaves, function(d) {
							return parseFloat(d.rx);
						}),
						"meanY": d3.mean(leaves, function(d) {
							return parseFloat(d.ry);
						}),
						"deviationX": d3.mean(leaves, function(d){ 
							return parseFloat(d.rx) 
						}),
						"deviationY": d3.mean(leaves, function(d){ 
							return parseFloat(d.ry) 
						})
					} 
				})
			.entries(data)


		if (typeof nested_data !== "undefined"){
			console.log(nested_data)
			for(i=0; i<nested_data.length; i++){
				console.log(nested_data[i])
				if(nested_data[i].key==types[3]){
					goFace(nested_face[i], nest_again[i].values);
				}
				if(nested_data[i].key==types[1]){
					goIDE(nested_data[i].values, nest_again[i].values);					
				}
			}
			for(i=0; i<nested_data.length; i++){
				if(nested_data[i].key==types[0]){
					goHands(nested_data[i], nest_again[i].values);
				}
			}	
		}
goButton(particleOnly);
	};













function showPhases(phasesJSON) {
	console.log(phasesJSON)
	phaseData = phasesJSON;
	var phaseNum = 0;
	for(i=1; i<phaseData.length; i++){ //change this
		if(phaseData[i].phase!=phaseData[i-1].phase){
			
			if(phaseData[i].phase.substring(0, 4) != "obs_"){
				phaseData[i].phase = "obs_" + phaseData[i].phase;
			}
			
			console.log("phaseData[i]: " + phaseData[i].phase);
			
			if(phaseData[i].phase=="obs_rate" || phaseData[i].phase=="setup" || phaseData[i].phase == "rate"){}
				else{
					phaseNum+=1;
					obs[phaseNum]=({
						"num":phaseNum,
						"phase": phaseData[i].phase,
						"start": phaseData[i].start,
						"end": phaseData[i].end
					})
					if(phaseData[i].phase=="obs_plan" || phaseData[i].phase=="plan"){
						obsPlan.push(phaseData[i])
					}
					if(phaseData[i].phase=="obs_document" || phaseData[i]=="document"){
						obsDoc.push(phaseData[i])
					}
					if(phaseData[i].phase=="obs_reflect" || phaseData[i].phase=="reflect"){
						obsReflect.push(phaseData[i])
					}
			}
		}	
	}

	var totalPlan, totalReflect, totalDoc;
for(i=0; i<obsPlan.length; i++){ 
	totalPlan = obsPlan[obsPlan.length-1].end-obsPlan[0].start;
}
for(i=0; i<obsReflect.length; i++){ 
	totalReflect = obsReflect[obsReflect.length-1].end-obsReflect[0].start 
}
for(i=0; i<obsDoc.length; i++){ 
	totalDoc = obsDoc[obsDoc.length-1].end-obsDoc[0].start 
}
var phaseArray = [];
phaseArray.push(totalPlan, totalDoc, totalReflect)
console.log(phaseArray+"phasearray")




// var dataset = {
//   apples: [53245, 28479, 19697, 24037, 40245],
// };

var width = forcewidth,
    height = forceheight;
var diameter = forcewidth;
var margin = 60;
var radius = (diameter / 2)-margin+3;
    // radius = Math.min(width, height) / 2.4;

var color = ["#3F51B5","#607D8B","#7986CB"];

var pie = d3.layout.pie()
    .sort(null);





var outerRadius = radius;//-10;
var innerRadius = radius-20;//-30;
var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
   var labelr = radius/1.7 + 22; // radius for label anchor



var netSVG = d3.select("#facehand")
	.append("svg")
	.attr("width",forcewidth)
	.attr("height",forceheight)  
	.append("g")
	.style("border","1px solid white") 
	.style("margin-top","1px")
    .attr("transform", "translate(" + width/2 + "," + 80 + ")");

var pathPie = netSVG.selectAll("pathPie")
    .data(pie(phaseArray))
  .enter().append("path")
    .attr("fill", function(d, i) { return color[i]; })
    .attr("d", arc);

var label_group = netSVG.append("svg:g")
    .attr("class", "lblGroup")
// DRAW SLICE LABELS
var sliceLabel = label_group.selectAll("text")
    .data(pie(phaseArray))
sliceLabel.enter().append("svg:text")
    .attr("class", "arcLabel")
    .attr("transform", function(d) {
        var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x*x + y*y);
        return "translate(" + (x/h * labelr) +  ',' +
           (y/h * labelr) +  ")"; 
    })
    .attr("dy",  function(d){
        var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x*x + y*y);
    	if ((y/h * labelr)>outerRadius/2) {
    		return "1.5em"
    	}
		else{
			return ("-.8em")
		}
    })
    .attr("dx",  function(d){
        var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x*x + y*y);
    	if ((x/h * labelr)>outerRadius/2) {
    		return "1.5em"
    	}
		else{
			return ("-2.5em")
		}
    })
    .attr("text-anchor", "middle")
    .text(function(d, i) { 
    	if(i==0){
    		return "Plan"
    	}
    	if(i==1){
    		return "Document"
    	}
    	if(i==2){
    		return "Reflect"
    	}
    })
    .attr("fill", function(d, i) { return color[i]; })

obs = cleanArray(obs)

	console.log(obs);
	//draw a rectangle for each key
	var rectPhase = timeSVG.selectAll(".phase")
		.data(obs)
		.enter()
	  	.append("rect")
	  	.attr("class","phase")
		  .attr("x",function(d,i){
		  	console.log(d);
		  	console.log(timeX(d.start))
		  	return timeX(d.start); 
		  })
		  .attr("y",0)
		  .attr("width",function(d,i){
		  	return timeX(d.end)-timeX(d.start);
		  })
		  .attr("height",timeSVGH)//-2*cmargin)
		  .attr("fill",function(d,i){
		  	if(d.num%2==0){
		  		return "none"
		  	} else{
		  		return "lightgray";
		  	}
		  })
		  .attr("opacity",.1)
		  .attr("stroke","grey")

	var textPhase = timeSVG.selectAll(".phaseText")
		.data(obs)
		.enter()
	  	.append("text")
	  	.attr("class","phaseText")
		  .attr("x",function(d,i){
		  	// if(i>0){
var currentX = timeX(d.start)+(timeX(d.end)-timeX(d.start))/2;
// var oneBefore = (timeX(obs[i-1].start)+(timeX(obs[i-1].end)-timeX(obs[i-1].start))/2);
	return currentX;	
		  })
		  // .attr("dx","")
		  .attr("y",function(d,i){
if(i>0){
var currentX = timeX(d.start)+(timeX(d.end)-timeX(d.start))/2;
var oneBefore = (timeX(obs[i-1].start)+timeX(obs[i-1].end)-timeX(obs[i-1].start))/2;
var whichIndex=1; 
	if((currentX-oneBefore)>70){
		return 15;
	} else{
		whichIndex++;
		return 15*whichIndex;
	}
}
if(i==0){
	return 15;
}
})
		  .text(function(d){
		  	if(d.phase=="obs_reflect" || d.phase == "reflect"){
		  		return "REFLECTION"
		  	}
		  	if(d.phase=="obs_document" || d.phase == "document"){
		  		return "DOCUMENTATION"
		  	}
		  	if(d.phase=="obs_plan" || d.phase == "plan"){
		  		return "PLANNING"
		  	}
		  })
		  .attr("text-anchor","middle")
}







function goButton(incomingData){
	buttonData.push(incomingData);
	console.log(incomingData);
	for(i=0; i<buttonData[0].length; i++){
		getthis.push(buttonData[0][i].data);
		if(buttonData[0][i].data=="b1"){
			button2.push({
				"button": "button2",
				"time": buttonData[0][i].time
			});				
		}
		if(buttonData[0][i].data=="b2"){
			button1.push({
				"button": "button1",
				"time": buttonData[0][i].time
			});				
		}
		// button1.push({
		// 	"button": getthis[i].match(/button1/g),
		// 	"time": buttonData[0][i].time
		// });	

		// button2.push(getthis[i].match(/button2/g));	
	}
button1 = button1.filter(function(n){ return n.button != undefined }); 
button2 = button2.filter(function(n){ return n.button != undefined }); 

	console.log(button1.length+"number of button1 presses")
	console.log(button2.length+"number of button2 presses")

var buttonTot;
if(button2.length>button1.length){
	buttonTot = button2.length;
}else{ buttonTot = button1.length; }
console.log(buttonTot)
// var iconW = (forcewidth/1.5)/buttonTot
	var xSpace = d3.scale.linear()
		.domain([0, buttonTot+1])
		.range([textL, forcewidth-iconW])

var iconBut = timeSVG.selectAll(".button1")	
	.data(button1)
	iconBut.enter()
	.append("image")
	.attr("class","button1")
	.attr("xlink:href", "assets/icons/idea.png")
	.attr("x", function(d){
		return timeX(d.time);
	})
	.attr("y", timeSVGH/2+iconW/2+21)
	.attr("width",iconW)
	.attr("height",iconW);
var iconLine1 = timeSVG.selectAll(".button1L")	
	.data(button1)
	iconLine1.enter()
	.append("line")
	.attr("class","button1L")
	.attr("x1", function(d){
		return timeX(d.time)+7.25;
	})
	.attr("x2", function(d){
		return timeX(d.time)+7.25;
	})
	.attr("y1", timeSVGH/2+iconW+25)
	.attr("y2", timeSVGH)
	.attr("stroke","grey")

console.log(button2);
var iconBut2 = timeSVG.selectAll(".button2")	
	.data(button2)
	iconBut2.enter()
	.append("image")
	.attr("class","button2")
	.attr("xlink:href", "assets/icons/thunder.png") //just checking now put back to thunder
	.attr("x", function(d){
		return timeX(d.time);
	})
	.attr("y", timeSVGH/2+iconW/2+21)
	.attr("width",iconW)
	.attr("height",iconW);

var iconLine2 = timeSVG.selectAll(".button2L")	
	.data(button2)
	iconLine2.enter()
	.append("line")
	.attr("class","button2L")
	.attr("x1", function(d){
		return timeX(d.time)+8;
	})
	.attr("x2", function(d){
		return timeX(d.time)+8;
	})
	.attr("y1", timeSVGH/2+iconW+25)
	.attr("y2", timeSVGH)
	.attr("stroke","grey")
}

function goIDE(incomingD, summary){
	ideData = incomingD[0].values;
	sumIDE = summary;
	console.log("in IDE");
    var patt1 = /[A-Z]/gi; 
	// console.log(ideData);
	for(i=0; i<ideData.length; i++){
		if(ideData[i].opt.match(patt1)!=null) {
		// if((ideData[i].opt.match(patt1).join().replace(/,/g, '')).toUpperCase()!=null) {
			ideData[i].name= (ideData[i].opt.match(patt1).join().replace(/,/g, '')).toUpperCase();	
		}
		if(ideData[i].action_id.length>2){
			ideData[i].mod = ideData[i].action_id.substr(0, 2);
			ideData[i].oc = parseInt(ideData[i].action_id.substr(2, 2));
		}else{ //doesn't matter about the CC without open close
			ideData[i].mod = ideData[i].action_id.substr(0, 1);
			ideData[i].oc = parseInt(ideData[i].action_id.substr(1, 1));
		}



		if(ideData[i].oc==2){ ideData[i].oc=-1 }



		ideData[i].special_id = ideData[i].mod+ideData[i].opt;
		ideData[i].hour = (new Date(ideData[i].time)).getHours();
		ideData[i].minute = (new Date(ideData[i].time)).getMinutes();
	}
	ide_nest = d3.nest()
		.key(function(d) { 
			return d.time; 
		})
		.sortKeys(d3.ascending)
		.entries(ideData);

	ide_nest2 = d3.nest()
		.key(function(d) { 
			return d.special_id; 
		})		
		.entries(ideData);
	for(i=0; i<ide_nest2.length; i++){
		for(j=0; j<ide_nest2[i].values.length-1; j++){
			if(ide_nest2[i].values[j].oc==1 && ide_nest2[i].values[j+1].oc==-1){
				var secondguy = ide_nest2[i].values[j+1].time;
				ide_nest2[i].values[j].end = secondguy;
			} else{ 
				// idenest2[i].values[j].end = +Date.now(); 
			}
		}
	}
	showIDE();

		//trying to figure out links here
        links = ideData.filter(function(d) {
            return d.mod == "L";
        });
		for(i=0; i<links.length; i++){
			newguy.push(links[i].opt.split(" "));
			links[i].source = newguy[i][1];
			links[i].target = newguy[i][3];
		}
			for(i=0; i<links.length; i++){
				for(j=0; j<listComponents.length; j++){
				    if (links[i].source.indexOf(listComponents[j]) > -1) {
						links[i].source = listComponents[j];
					}
				    if (links[i].target.indexOf(listComponents[j]) > -1) {
						links[i].target = listComponents[j];
					}
				}
			}
		console.log(links)

	var circle, path, text;
	var force;



	// Compute the distinct nodes from the links.
	links.forEach(function(link) {
	  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, mod:link.mod});
	  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, mod:link.mod});
	});

var linkdist = w/10;
	force = d3.layout.force()
	    .nodes(d3.values(nodes))
	    .links(links)
	    .size([forcewidth, forceheight-20])
	    .linkDistance(linkdist)
	    .charge(-100)
	    // .on("tick", tick)
	    // .start();  
// makeChords(force.nodes(), force.links());
// console.log(links);
// console.log(force.nodes())
// console.log(force.links())
makeEdge(links,force.nodes(), force.links());

}














































var miniTime = [];
function goFace(incomingData, summary){
	faceData = incomingData;
	// console.log(toD)
	summaryFace = summary;
	// console.log(summary);
	for(j=0; j<summaryFace.length; j++){
		miniTime.push(summaryFace[j].values.min_time)
		whatTime.push(summaryFace[j].values.max_time)
	}
	timeMin = d3.min(miniTime);
	timeMax = d3.max(whatTime);
	showFace();
}

function goHands(incomingData, summary){	
	console.log(summary+"summaryHands")
	console.log(incomingData)

	handData = incomingData;
	summaryHands = summary;
	// One cell for each hand tracked (hands are in nested data @ at 1)
	showHands();
}


function compress(){
	d3.selectAll(".hand")
		.transition().delay(1000).duration(2000)
		.attr("transform",function(d,i) {
	  		return "translate("+cmargin+",0)";
	  	});

	$(".rectText").hide();
	$(".faceText").hide();
}
// }
})
function showHands(){
	var numPanels = handData.values.length;

	var g = timeSVG.selectAll(".hand")
		.data(handData.values.sort(d3.ascending))
		.enter()
	  	.append("g")
	  	// .attr("class","hand")
	  	.attr("transform",function(d,i) {
	  		handColor.domain([d.key])
	  		theseTotals.push(d.values.length);
			theseTotals.sort(d3.descending); 			
	  		return "translate("+(cwidth*i)+",0)";
	  	})
	  	.attr("class", function(d,i){
	  			if(d.values.length==theseTotals[0]){
		  			one.push(d.values);
		  		}
	  			if(d.values.length==theseTotals[1]){
		  			two.push(d.values);
		  		}
	  			if(d.values.length==theseTotals[2]){
		  			three.push(d.values);
		  		}
		  		else{}	
		  		return "hand";
	  	})

var rx1 = [];
var ry1 = [];
var time1 = [];
if(one!="undefined"){
	for(i=0; i<one[0].length; i++){
	  	time1.push(one[0][i].time)
	  	rx1.push(one[0][i].rx);
	  	ry1.push(one[0][i].ry);
	}
	if(time1.length>0){ //check if array is full
		for(i=0; i<one[0].length; i++){
			if(i>0){
		    	activeOne.push({
		    		"changeDist": Math.sqrt(Math.pow((rx1[i]-rx1[i-1]), 2) + Math.pow((ry1[i]-ry1[i-1]),2)),
		    		"changeTime": time1[i]-time1[i-1],
		    		"thisTime": time1[i]
		    	})
		    }
		}
	}
	var delta1 = [];
	if(activeOne){
		for(i=0; i<activeOne.length; i++){
			delta1.push(activeOne[i].changeDist);
		}
	}
	var cumu1 = delta1;
	    _.map(cumu1,function(num,i){ if(i > 0) cumu1[i] += cumu1[i-1]; });
// console.log(cumu1)
	var interval = 160;
	for(i=0; i<cumu1.length; i++){
		if(i>interval){
			softS1.push((cumu1[i]-cumu1[i-interval])/(activeOne[i].thisTime-activeOne[i-interval].thisTime))
		}
	}
	console.log(softS1.length+"softspeedlength1")
	console.log(activeOne.length+"activelength1")

}else{console.log("no")}

var rx2 = [];
var ry2 = [];
var time2 = [];
if(two.length>0){
	for(i=0; i<two[0].length; i++){
	  	time2.push(two[0][i].time)
	  	rx2.push(two[0][i].rx);
	  	ry2.push(two[0][i].ry);
	}
	if(time2.length>0){ //check if array is full
		for(i=0; i<two[0].length; i++){
			if(i>0){
		    	activeTwo.push({
		    		"changeDist": Math.sqrt(Math.pow((rx2[i]-rx2[i-1]), 2) + Math.pow((ry2[i]-ry2[i-1]),2)),
		    		"changeTime": time2[i]-time2[i-1],
		    		"thisTime": time2[i]
		    	})
		    }
		}
	}
	var delta2 = [];
	if(activeTwo){
		for(i=0; i<activeTwo.length; i++){
			delta2.push(activeTwo[i].changeDist);
		}
	}
	var cumu2 = delta2;
	    _.map(cumu2,function(num,i){ if(i > 0) cumu2[i] += cumu2[i-1]; });
	// var interval = 160;
	for(i=0; i<cumu2.length; i++){
		if(i>interval){
			softS2.push((cumu2[i]-cumu2[i-interval])/(activeTwo[i].thisTime-activeTwo[i-interval].thisTime))
		}
	}
	console.log(softS2.length+"softspeedlength2")
	console.log(activeTwo.length+"activelength2")

}else{console.log("notwo")}

var rx3 = [];
var ry3 = [];
var time3 = [];
if(three.length>0){
	for(i=0; i<three[0].length; i++){
	  	time3.push(three[0][i].time)
	  	rx3.push(three[0][i].rx);
	  	ry3.push(three[0][i].ry);
	}
	if(time3.length>0){ //check if array is full
		for(i=0; i<three[0].length; i++){
			if(i>0){
		    	activeThree.push({
		    		"changeDist": Math.sqrt(Math.pow((rx3[i]-rx3[i-1]), 2) + Math.pow((ry3[i]-ry3[i-1]),2)),
		    		"changeTime": time3[i]-time3[i-1],
		    		"thisTime": time3[i]
		    	})
		    }
		}
	}
	var delta3 = [];
	if(activeThree){
		for(i=0; i<activeThree.length; i++){
			delta3.push(activeThree[i].changeDist);
		}
	}
	var cumu3 = delta3;
	    _.map(cumu3,function(num,i){ if(i > 0) cumu3[i] += cumu3[i-1]; });
	// var interval = 160;
	for(i=0; i<cumu3.length; i++){
		if(i>interval){
			softS3.push((cumu3[i]-cumu3[i-interval])/(activeThree[i].thisTime-activeThree[i-interval].thisTime))
		}
	}
	console.log(softS3.length+"softspeedlength3")
	console.log(activeThree.length+"activelength3")

}else{console.log("nothree")}





var maxActive1, maxActive2, maxActive3;
if(softS1.length>0){
	var maxActive1 = d3.max(softS1)//d3.max(justSpeed);//d3.max(justDelta);	
}
if(softS2.length>0){
	var maxActive2 = d3.max(softS2)//d3.max(justSpeed);//d3.max(justDelta);	
}
if(softS3.length>0){
	var maxActive3 = d3.max(softS3)//d3.max(justSpeed);//d3.max(justDelta);
}
// console.log(maxActive1+"maxactive1"+maxActive2);
var maxActiveOverall;

if(maxActive2>maxActive1){
	maxActiveOverall = maxActive2;
} else{
	maxActiveOverall = maxActive1;
}
if(maxActive3>maxActiveOverall){
	maxActiveOverall = maxActive3;
} else{
	maxActiveOverall = maxActiveOverall;
}
console.log(maxActive3);
//which is the most active

var pathActive1, lineActive1, pathActive2, lineActive2, pathActive3, lineActive3;

var yActivePath;
  yActivePath = d3.scale.linear() 
      .domain([0,maxActiveOverall]).range([timeSVGH-maxRadius, timeSVGH/2+(maxFaces*faceRadius)]); //timeSVGH/2

  xActivePath = d3.scale.linear() //startTime, endTime
      .domain([startTime, endTime]).range([10, w-40]);

  lineActive1 = d3.svg.line()
      .x(function(d, i) { return xActivePath(activeOne[i].thisTime); })
      .y(function(d, i) { return yActivePath(d); })
      .interpolate("bundle")
  pathActive1 = timeSVG.append("g")
    .append("path")
    .attr("class","activepath1")
    .attr("fill","none")
    .attr("stroke","darkgrey")
    .attr("stroke-dasharray",1)
    .attr("stroke-width",2)
  	pathActive1
  		.datum(softS1)
  		.attr("d", lineActive1);

  lineActive2 = d3.svg.line()
      .x(function(d, i) { return xActivePath(activeTwo[i].thisTime); })
      .y(function(d, i) { return yActivePath(d); })
      .interpolate("bundle")
      // .tension(5)
  pathActive2 = timeSVG.append("g")
    .append("path")
    .attr("class","activepath2")
    .attr("fill","none")
    .attr("stroke","darkgrey")
    .attr("stroke-dasharray",2)
    .attr("stroke-width",2)

  	pathActive2
  		.datum(softS2)
  		.attr("d", lineActive2);
  lineActive3 = d3.svg.line()
      .x(function(d, i) { return xActivePath(activeThree[i].thisTime); })
      .y(function(d, i) { return yActivePath(d); })
      .interpolate("linear")
  pathActive3 = timeSVG.append("g")
    .append("path")
    .attr("class","activepath3")
    .attr("fill","none")
    .attr("stroke","darkgrey")
    // .attr("stroke-dasharray",3)
    .attr("stroke-width",2)

  	pathActive3
  		.datum(softS3)
    	// .attr("transform", function(d,i){
     //    return "translate(" + 0 + ", "+50+")";
    	// })
  		.attr("d", lineActive3);
}

var pathFace, lineFace;
var thisData = [];

function showFace(){
	var minTotal, maxTotal;
	var thisMany = [];
	maxTotal = 4;

	  var yOffset = h/2;
	  var mini = 4;
	  var heightPanel = 100;
	  var yPath = d3.scale.linear()
		  .domain([0, maxTotal])
		 .range([timeSVGH/2, 0]);

  	lineFace = d3.svg.line()
      .x(function(d, i) { return timeX(d.time); })
      .y(function(d, i) { return yPath(d.num); })
      .interpolate("cardinal")


var faceColor = "#AB47BC"
//has to get calculated first
// ////////////OPTION 2
	rectFace = timeSVG.append("g").attr("class","facerect").selectAll(".facerect")
	    .data(faceData.values)
	  	.enter().append("rect")
	    .attr("class", "facerect")
	    .attr("x", function(d){
	    	faceNum.push(d.num);
	    	return timeX(d.time)
	    })
	    .attr("y", function(d,i){
	    	return timeSVGH/2-d.num*faceRadius;
	    })
	    .attr("height", function(d,i){
	    	return 2*(d.num*faceRadius);
	    })
	    .attr("width",2)
	    .attr("fill", faceColor)
	    .attr("opacity",.6)
		.attr("stroke","none")
////////////OPTION 2
maxFaces = d3.max(faceNum);
/////OPTION 1
	lineFace = timeSVG.append("g").attr("class","backline").selectAll(".backline")
	    .data(d3.range(1))
	  	.enter().append("line")
	    .attr("class", "backline")
	    .attr("x1", timeX(startTime))
	    .attr("x2", timeX(startTime)+timeX(endTime)-timeX(startTime))
	    .attr("y1", timeSVGH/2-maxFaces*faceRadius+2*(maxFaces*faceRadius))
	    .attr("y2", timeSVGH/2-maxFaces*faceRadius+2*(maxFaces*faceRadius))
	    // .attr("height", 2*(maxFaces*faceRadius))
	    // .attr("width",timeX(endTime)-timeX(startTime))
	    .attr("fill", "none")
		.attr("stroke","grey")
		.attr("stroke-dasharray",1)
}




var topY = 200;
var bottomY = 500;


var xStart = 15;
var xEnd = xStart*spaceFactor;
var xI = d3.scale.ordinal()
    .domain(inputs)
    .rangePoints([xStart, xEnd]);
var xO = d3.scale.ordinal()
    .domain(outputs)
    .rangePoints([xStart, xEnd]);
var xP = d3.scale.ordinal()
    .domain(programming)
    .rangePoints([xStart, xEnd]);
var xG = d3.scale.ordinal()
    .domain(games)
    .rangePoints([xStart, xEnd]);

function showIDE(){

	yOther
	    .rangePoints([topMarg, forceheight-topMarg/2-iconW/2]);

	timeX2.domain([startTime, endTime]).range([forcewidth/4, forcewidth]);

	var g = activeSVG.selectAll(".ide")
		.data(ide_nest2)
		.enter()
	  	.append("g")
	  	.attr("class","ide");
		g.selectAll(".logs")
		.data(function(d) {
				return d.values;				
		}) 
		.enter()
		.append("rect")
		.attr("class",function(d){
			if(d.name){
				if(d.mod=="M"){
			d.timeEdit = Math.round(d.time/100)*100;
					hardwareOnly.push(d);
					hardNames.push(d.name);
				}
				if(d.mod=="B"){
			d.timeEdit = Math.round(d.time/100)*100;
					softwareOnly.push(d);
					softNames.push(d.name);
				}
				uniqueHards = unique(hardNames);
				uniqueSofts = unique(softNames);
				bothHS = uniqueHards.concat(uniqueSofts);
				yOther.domain(bothHS);
			}
			return d.name;
		})
		.attr("x", function(d){
			if(d.mod=="M" || d.mod=="B"){
				return timeX2(d.time)
			}
		})
        .attr("y", function(d, i) {
			if(d.mod=="M" || d.mod=="B"){
	            return yOther(d.name);
    		}
        })
		.attr("width",function(d,i){
			if(d.mod=="M" || d.mod=="B"){
				if(d.oc==1){
					if(d.end){
						return timeX2(d.end)-timeX2(d.time);
					}else{
						return timeX2(endTime)-timeX2(d.time);				
					}
				} else{
					return 0;
				}
			}
		})
		.attr("height", 5)
		.attr("fill", function(d){
			if(yOther(d.name)!=undefined){
			if(d.mod=="M"){
				return hardwareColor;
			} if (d.mod=="B"){
				return softwareColor;
					// return colorScale(d.mod);
				} else{
					return "none";
				}
			} else{
					return "none";
				}
		})
		.attr("stroke", "none")
		.attr("opacity",.4);

        var iconsHS;
           iconsHS = activeSVG.selectAll(".iconsHS")
               .data(bothHS)
           iconsHS.enter().append("image")
               .attr("class", "iconsHS")
               .attr("xlink:href", function(d, i) {
                   return "assets/icons/"+d.toLowerCase() + ".png";
               })
               .attr("y", function(d,i) {
            		return yOther(d)-7;
               })
               .attr("width", iconW)
               .attr("height", iconW)
               .attr("x", 2)

	activeSVG.selectAll(".timeText")
		.data(bothHS)
		.enter()
		.append("text")
		.attr("class","timeText")
		.attr("x", iconLMarg)
        .attr("y", function(d, i) {
            return yOther(d)+5;
        })
		.attr("fill", "black")
		// 	function(d){
		// 	if(yOther(d.name)!=undefined){
		// 		return colorScale(d.mod);
		// 	} else{
		// 		return "none";
		// 	}
		// })
		.text(function(d){
			return d;
		})
		.attr("font-size",8)
		.attr("text-anchor","start")

if(endMin>startMin){
	totalMin = (endMin-startMin);	
}else{
	totalMin = (60-startMin)+endMin;	
}
console.log("startMin"+startMin+"endMin"+endMin+"totalTime"+totalTime)

hardwareOnly.sort(function(x, y){
   return d3.ascending(x.time, y.time);
})
console.log(hardwareOnly.length)
uniqueHWOnly = 
_.uniq(hardwareOnly, function(hware) { return hware.timeEdit; })
console.log(hardwareOnly.length+"done")
// console.log(_.uniq(hardwareOnly, function(hware) { return hware.timeEdit; }))



softwareOnly.sort(function(x, y){
   return d3.ascending(x.time, y.time);
})
uniqueSWOnly = 
_.uniq(softwareOnly, function(sware) { return sware.timeEdit; })
console.log(uniqueSWOnly.length+"in sw unique")
console.log(uniqueHWOnly.length+"in hw unique")

	    // _.map(hardwareOnly,function(num,i){ if(i > 0) hardwareOnly[i].oc += hardwareOnly[i-1].oc; });
	    // _.map(softwareOnly,function(num,i){ if(i > 0) softwareOnly[i].oc += softwareOnly[i-1].oc; });

	for(j=startTime; j<endTime; j++){
		var thisDate = new Date(j).getMinutes();

		var thisHour = new Date(j).getHours();
		
		var thisD = thisHour+thisDate;
		
			hardUseComp[thisD] = ({ 
				"total":hardUseTotals(thisDate), 
				"time": j,
				"min":thisDate,
				"hour":thisHour
			});

			softUseComp[thisD] = ({ 
				"total":softUseTotals(thisDate), 
				"time": j,
				"min":thisDate,
				"hour":thisHour
			});
	}

	// uniqueHards = unique(hardNames);
	// uniqueSofts = unique(softNames);
	        console.log("hardware in use"+uniqueHards);
	        console.log("software in use"+uniqueSofts);
			console.log("components in use"+uniqueNames)
	diffSoftHard = _.difference(uniqueSofts, uniqueHards);
	console.log("this is the difference between hard and soft"+diffSoftHard)
	var both = uniqueHards.concat(diffSoftHard);
	var both2 = diffSoftHard.concat(uniqueHards);
	var bothLength;
	if(uniqueHards.length>=diffSoftHard.length){
		bothLength = uniqueHards.length;
	} else{
		bothLength = diffSoftHard.length;
	}


//arrays are dirty with undefined values
hardUseComp = cleanArray(hardUseComp)
// hardUseComp.sort(function(x, y){
//    return d3.ascending(x.time, y.time);
// })
softUseComp = cleanArray(softUseComp)
// softUseComp.sort(function(x, y){
//    return d3.ascending(x.time, y.time);
// })
// 
	// var maxComps = d3.max(totalComps)
	// console.log(maxComps)
	var yHPath, ySPath, minTotal, maxTotal, pathH, index, lineS, lineH, svgPath;






var howManyHard = [];
var howManySoft = [];
for (i=0; i<hardUseComp.length; i++){
	howManyHard.push(hardUseComp[i].total);
}
for (i=0; i<softUseComp.length; i++){
	howManySoft.push(softUseComp[i].total);
}
var maxHeightH = d3.max(howManyHard);
var maxHeightS = d3.max(howManySoft);
if(maxHeightH>maxHeightS){
	maxHeight = maxHeightH;
} else{
	maxHeight = maxHeightS;
}
console.log(maxHeight+"real max height")
	xPath = d3.scale.linear()
	      .domain([startTime,endTime]).range([10, w-40]);

console.log(bothLength+"bothlength");
// var maxFaces = 5;
	yHPath = d3.scale.linear()
	      .domain([0,maxHeight+1]) //max hardware components
	      .range([timeSVGH/2-(maxFaces*faceRadius), 0]);
	ySPath = d3.scale.linear()
	      .domain([0,maxHeight+1]) //max software components
	      .range([timeSVGH/2-(maxFaces*faceRadius), 0]);

	lineH = d3.svg.area()
      .x(function(d, i) { 
      	if(d==undefined){ return 0; }
      	// if(d<0){ return 0;}
      		else{
		       	return xPath(d.time);      			
      		}
      })
      .y0(timeSVGH/2-(maxFaces*faceRadius))
      .y1(function(d, i) { 
      	if(d==undefined){return 0;}
      	if(d.total<0){ return 0}
      		else{
      			return yHPath(d.total);  //actually totals now
      		}
      })
      .interpolate("linear");

	lineS = d3.svg.area()
      .x(function(d, i) { 
      	if(d==undefined){ return 0; }
      		else{
		       	return xPath(d.time);      			
      		}
      })
      .y0(timeSVGH/2-(maxFaces*faceRadius))
      .y1(function(d, i) { 
      	if(d==undefined){return 0;}
      	if(d.total<0){ return 0}
      		else{
      			return ySPath(d.total); 
      		}
      })
      .interpolate("linear");



var opacityPath = .5;
  pathH = timeSVG.append("g")
    .append("path")
    .attr("class","timepathH")
  		.attr("fill",hardwareColor)
  		.attr("opacity",opacityPath)
  		.attr("stroke",hardwareColor);
  	pathH
  		.datum(hardUseComp)
	    .attr("class","timepathH")
  		.attr("d", lineH);

var pathS;
  pathS = timeSVG.append("g")
    .append("path")
    .attr("class","timepathS")
  		.attr("fill",softwareColor)
  		.attr("opacity",opacityPath)
  		.attr("stroke",softwareColor);
  	pathS
  		.datum(softUseComp)
  		.attr("d", lineS);


        function ardUseTotals(index) {
            var total = 0;
            for (i = 0; i < ideData.length; i++) {
                if (ideData[i].minute == index) {
                    total++;
                } else {}
            }
            return total;
        }

        function hardUseTotals(index) {
            var total = 0;
            for (i = 0; i < uniqueHWOnly.length; i++) {
                if (uniqueHWOnly[i].minute == index){ 
                    total++;
                } 
            }
            return total;
        }
        function softUseTotals(index) {
            var total = 0;
            for (i = 0; i < uniqueSWOnly.length; i++) {
                if (uniqueSWOnly[i].minute == index) {
                    total++;
                }  
            }
            return total;
        }


	var yUniqueH = d3.scale.linear()
		.domain([0,bothLength])
	    .range([topMarg, forceheight-topMarg/2]);
	var yUniqueS = d3.scale.linear()
		.domain([0,bothLength])
	    .range([topMarg, forceheight-topMarg/2]);



        var icons;
           icons = ardSVG.selectAll(".icons")
               .data(uniqueHards)
           icons.enter().append("image")
               .attr("class", "icons")
               .attr("xlink:href", function(d, i) {
                   return "assets/icons/"+d.toLowerCase() + ".png";
               })
               .attr("y", function(d,i) {
                   return yUniqueH(i)-12;
               })
               .attr("width", iconW)
               .attr("height", iconW)
               .attr("x", iconLMarg)

var textHardware;
	textHardware = ardSVG.selectAll("textHard")
	    .data(uniqueHards)
	    .enter().append("text")
	    .attr("class", "textHard")
	    .attr("x", textL)
	    .attr("y",function(d,i){
	    	return yUniqueH(i) //not d
	    })
    	.attr("text-anchor", "start") // set anchor y justification
	    .attr("fill", "black")
	    .text(function(d){
	    	return d;
	    })

var textSoftware;
	textSoftware = ardSVG.selectAll("textSoft")
	    .data(diffSoftHard)
	    .enter().append("text")
	    .attr("class", "textSoft")
    	.attr("text-anchor", "start") // set anchor y justification
	    .attr("x", forcewidth/2)
	    .attr("y", function(d,i){
	    	return yUniqueS(i) //not d
	    })
	    .text(function(d){
	    	return d;
	    })
	    .attr("fill","black")
var iconsSoft;
   iconsSoft = ardSVG.selectAll(".iconsS")
       .data(diffSoftHard)
   iconsSoft.enter().append("image")
       .attr("class", "iconsS")
       .attr("xlink:href", function(d, i) {
       	// console.log(d.toLowerCase());
           return "assets/icons/"+d.toLowerCase() + ".png";
       })
       .attr("y", function(d,i) {
           return yUniqueS(i)-12;
       })
       .attr("width", iconW)
       .attr("height", iconW)
       .attr("x", (forcewidth/2)+iconLMarg)
//alphabetize these or order them in terms of time of connection?



linksNames = Object.keys(nodes);
	for (j = 0; j < linksNames.length; j++) {
	    totalLinks[j] = ({
	    		"totalFrom": linkTotalFrom(linksNames[j]),
	    		"totalTo": linkTotalTo(linksNames[j]),
	    		"linkName": linksNames[j]
	    	})
	}
function linkTotalFrom(name) {
    var total = 0;
    for (i = 0; i < links.length; i++) {
        if (links[i].source.name == name) {
            total++;
        } else {}
    }
    return total;
}
function linkTotalTo(name) {
    var total = 0;
    for (i = 0; i < links.length; i++) {
        if (links[i].target.name == name) {
            total++;
        } else {}
    }
    return total;
}
        console.log("total links made to and from")
        console.log(totalLinks)
}


function makeEdge(linkData, linkNodes, linkLinks){
	linkData = linkData;
	var linkNodes = linkNodes;
	var linkLinks = linkLinks;

	// console.log(linkNodes);
	for(i=0; i<linkData.length; i++){
		linkData[i].parent = linkData[i].mod;
	}	
// console.log(linkNodes);
// console.log(linkLinks)
var diameter = forcewidth;
var radius = diameter / 2;
var margin = 60;

    // create plot area within svg image
    var plot = buttonSVG.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + radius + ", " + (radius-39) + ")");


var kitColor3 = buttonSVG.append("g").attr("class","backlabels")
		.append("circle")
	    .attr("cx", forcewidth/3.5-6)
	    .attr("cy", forceheight-5)
	    .attr("r", 4)
	    .attr("fill","lightpink")
	    .attr("stroke","lightpink")
var	kitNameColor3 = buttonSVG.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", forcewidth/3.5)
	    .attr("y", forceheight-3)
	    .text("Inputs")
	    .attr("font-size",8)

var kitColor4 = buttonSVG.append("g").attr("class","backlabels")
		.append("circle")
	    .attr("cx", forcewidth/2-12)
	    .attr("cy", forceheight-5)
	    .attr("r", 4)
	    .attr("fill","#FF9800")
	    .attr("stroke","#FF9800")
var	kitNameColor4 = buttonSVG.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", forcewidth/2-6)
	    .attr("y", forceheight-3)
	    .text("Outputs")
	    .attr("font-size",8)

var kitColor5 = buttonSVG.append("g").attr("class","backlabels")
		.append("circle")
	    .attr("cx", forcewidth/1.5-6)
	    .attr("cy", forceheight-5)
	    .attr("r", 4)
	    .attr("fill","#C71549")
	    .attr("stroke","#C71549")
var	kitNameColor5 = buttonSVG.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", forcewidth/1.5)
	    .attr("y", forceheight-3)
	    .text("Functions")
	    .attr("font-size",8)



    // draw border around plot area
    plot.append("circle")
        .attr("class", "outline")
        .attr("fill","none")
        .attr("stroke","black")
        .attr("stroke-width",.5)
        .attr("r", radius - margin+2);

    // // calculate node positions
    // circleLayout(graph.nodes);
    circleLayout(linkNodes);
    console.log("linkNodes")
console.log(linkNodes);
    // // draw edges first
    // drawLinks(graph.links);
    drawCurves(linkLinks);
    console.log("linkLinks")
    console.log(linkLinks)

    // draw nodes last
    drawNodes(linkNodes);
// }
// Calculates node locations
function circleLayout(nodes) {
    // sort nodes by group
    nodes.sort(function(a, b) {
    	// console.log(a.group);
    	// console.log(b.group);
        return a.group - b.group;
    });

    // use to scale node index to theta value
    var scale = d3.scale.linear()
        .domain([0, nodes.length])
        .range([0, 2 * Math.PI]);

    // calculate theta for each node
    nodes.forEach(function(d, i) {
        // calculate polar coordinates
        var theta  = scale(i);
        var radial = radius - margin;

        // convert to cartesian coordinates
        d.x = radial * Math.sin(theta);
        d.y = radial * Math.cos(theta);
    });
}


// Generates a tooltip for a SVG circle element based on its ID
function addTooltip(circle) {
    var x = parseFloat(circle.attr("cx"));
    var y = parseFloat(circle.attr("cy"));
    var r = parseFloat(circle.attr("r"));
    var text = circle.attr("id");

    var tooltip = d3.select("#plot")
        .append("text")
        .text(text)
        .attr("x", x)
        .attr("y", y)
        .attr("dy", -r * 2)
        .attr("id", "tooltip");

    var offset = tooltip.node().getBBox().width / 2;

    if ((x - offset) < -radius) {
        tooltip.attr("text-anchor", "start");
        tooltip.attr("dx", -r);
    }
    else if ((x + offset) > (radius)) {
        tooltip.attr("text-anchor", "end");
        tooltip.attr("dx", r);
    }
    else {
        tooltip.attr("text-anchor", "middle");
        tooltip.attr("dx", 0);
    }
}
function drawNodes(nodes) {
    // used to assign nodes color by group
    var color = d3.scale.category20();
var radius = 5;
    d3.select("#plot").selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function(d, i) { return d.name; })
        .attr("cx", function(d, i) { return d.x; })
        .attr("cy", function(d, i) { return d.y; })
        .attr("r", radius)
        .style("fill",  function(d, i) { 
        	addTooltip(d3.select(this))
        	for(j=0; j<inputs.length; j++){
        		if(d.name.toLowerCase().indexOf(inputs[j].toLowerCase())>-1){
	        		return "lightpink";
        		}
        	}
        	for(k=0; k<outputs.length; k++){
        		if(d.name.toLowerCase().indexOf(outputs[k].toLowerCase())>-1){
	        		return "#FF9800";
        		}
        	}
        	for(l=0; l<programming.length; l++){
        		if(d.name.toLowerCase().indexOf(programming[l].toLowerCase())>-1){
	        		return "#C71549";
        		}
        	}
        })
}
// Draws straight edges between nodes
function drawLinks(links) {
    d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr("fill","none")
	    .attr("marker-end", "url(#end)");
}

// Draws curved edges between nodes
	function drawCurves(links) {
	    // remember this from tree example?
	    var curve = d3.svg.diagonal()
	        .projection(function(d) { return [d.x, d.y]; });

	    d3.select("#plot").selectAll(".link")
	        .data(links)
	        .enter()
	        .append("path")
	        .attr("class", "link")
	        .attr("stroke",function(d, i) { 
        	for(j=0; j<inputs.length; j++){
        		if(d.name.toLowerCase().indexOf(inputs[j].toLowerCase())>-1){
	        		return "lightpink";
        		}
        	}
        	for(k=0; k<outputs.length; k++){
        		if(d.name.toLowerCase().indexOf(outputs[k].toLowerCase())>-1){
	        		return "#FF9800";
        		}
        	}
        	for(l=0; l<programming.length; l++){
        		if(d.name.toLowerCase().indexOf(programming[l].toLowerCase())>-1){
	        		return "#C71549";
        		}
        	}
        })
	        .attr("fill","none")
	        .attr("stroke-dasharray", function(d,i){
	        	// if(d.)
	        })
	        .attr("d", curve);
	}
}





function makeChords(data1, data2){
	// console.log(data2);
   var mpr = chordMpr(data2);
for(i=0; i<data2.length; i++){
	newData.push({
		"has":data2[i].source.name,
		"prefers":data2[i].target.name,
		"count":data2[i].source.weight
	})
}
// console.log(newData);
var mpr = chordMpr(newData);
    mpr
      .addValuesToMap('has')
      .setFilter(function (row, a, b) {
      	// console.log(row.has)
         return (row.has === a.name && row.prefers === b.name)
       })
       .setAccessor(function (recs, a, b) {
         if (!recs[0]) return 0;
         return +recs[0].count;
        });

       // console.log(mpr.getMatrix())
     // drawChords(mpr.getMatrix(), mpr.getMap());
}
      //*******************************************************************
      //  DRAW THE CHORD DIAGRAM
      //*******************************************************************
      function drawChords (matrix, mmap) {
        var r1 = forceheight / 4, r0 = forceheight/6;
 // w = 980, h = 800,
        var fill = d3.scale.ordinal()
            .range(['#c7b570','#c6cdc7','#335c64','#768935','#507282','#5c4a56','#aa7455','#574109','#837722','#73342d','#0a5564','#9c8f57','#7895a4','#4a5456','#b0a690','#0a3542',]);

        var chord = d3.layout.chord()
            .padding(.02)
            .sortSubgroups(d3.descending)

        var arc = d3.svg.arc()
            .innerRadius(r0)
            .outerRadius(r0 + 20);

        var rdr = chordRdr(matrix, mmap);
        chord.matrix(matrix);
        console.log(chord.chords())
        var g = activeSVG.selectAll("g.group")
            .data(chord.groups())
          .enter().append("svg:g")
            .attr("class", "group")
            .attr("transform", "translate(" + forcewidth / 2 + "," + forceheight / 2 + ")");

        g.append("svg:path")
            .style("stroke", "black")
            //needs to be about the type of element
            .style("fill","none")
            .attr("d", arc)

        g.append("svg:text")
            .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
            .style("font-family", "helvetica, arial, sans-serif")
            .style("font-size", "10px")
            .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
            .attr("transform", function(d) {
              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                  + "translate(" + (r0 + 26) + ")"
                  + (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .text(function(d) { return rdr(d).gname; });

          var chordPaths = activeSVG.selectAll("path.chord")
                .data(chord.chords())
              .enter().append("svg:path")
                .attr("class", "chord")
                .attr("d", d3.svg.chord().radius(r0))
            .attr("transform", "translate(" + forcewidth / 2 + "," + forceheight / 2 + ")");
      }








        function unique(obj) {
            var uniques = [];
            var stringify = {};
            for (var i = 0; i < obj.length; i++) {
                var keys = Object.keys(obj[i]);
                keys.sort(function(a, b) {
                    return a - b
                });
                var str = '';
                for (var j = 0; j < keys.length; j++) {
                    str += JSON.stringify(keys[j]);
                    str += JSON.stringify(obj[i][keys[j]]);
                }
                if (!stringify.hasOwnProperty(str)) {
                    uniques.push(obj[i]);
                    stringify[str] = true;
                }
            }
            return uniques;
        }

// Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
    	// console.log(actual.time.sort(d3.ascending))
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

var moveToFront = function() { 
    this.parentNode.appendChild(this); 
}