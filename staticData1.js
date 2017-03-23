//huh
//1593
//no button data in here



var overview;
var timelineImgWidth = 60; //(w/imgData[0].length)*6;
var timelineImgHeight = timelineImgWidth*1.3;
var timelineImgY = yAxisBottom-timelineImgHeight+40;//timeSVGH/2+iconW+25;
var timelineThunderY = timeSVGH/2+iconW/2+21;
var timelineBottomY = timeSVGH;
var bigImgWidth = 8*60; 
var bigImgHeight = 6*60; 
var caption;
var captionDoc;


//more values
var topMarg = 10;
var textH = 30;
var iconW = 15;
var iconLMarg = 27;
var textL = 10;


var canShowPhotos = false;
//data tools
var nested_data;
var nest_again;

// 1. get pelarstoken
// 2. get session number
// 3. get data and create first idea of starttime/endtime
// 4. get multimedia data and get phases
// 5. use phase data to confirm starttime/endtime
// 6. show phases
// 7. parse button
// 8. ready for arduino data 
// 9. show button presses

//arduino data stream
var listComponents = ["BTN","POT","TMP","ACR","COL","ROT","LDR","LED","PEZ", "RGB","IF", "Interval", "Fade", "Swap", "Map","MAP","MAPTOHIGHER", "Counter", "Trigger","Note", "Random", "PONG", "SimonSays"];
var inputs=["BTN","POT","TMP","ACR","COL","ROT","LDR"]
var outputs=["LED","PEZ", "RGB"]
var programming = ["NOTE", "Random", "PONG", "SimonSays","IF", "Interval", "Fade", "Swap", "Map","MAP","MAPTOHIGHER", "Counter", "Trigger"]
var hardware = ["BTN","POT","TMP","ACR","COL","ROT","LDR","LED","PEZ", "RGB"]
var moduleTypes = ["B","CC","BM","M","L"];
var interactionTypes = ["inputs","outputs","programming","games"];

//unique arduino elements
var uniqueHards;
var uniqueSofts;
var bothHS;
// var uniqueManips;
var hardNames = [];
var softNames = [];
var hardwareOnly = [];
var softwareOnly = [];
// var manipNames = []; //not using this
var diffSoftHard;
var totalComps = [];
var	hardUseComp = [];
var	softUseComp = [];
var colorText = darkColor;

//data stream types
var types = ["hand","ide","particle","face"];

//link diagram variables
// var totalLinks; //which one is right?
var totalLinks = [];
var linkData;
var force;
var newguy = [];
var onlyalpha = [];
var links = [];
var nodes = {};
var newData = [];

//face data stream
var maxFaces = 4;
var faceNum = [];
var faceRadius = 5;
var maxRadius = faceRadius*4;
var radiusMin = 5;
var spaceFactor = radiusMin;
var yspace = radiusMin*2.5;

//hand data stream
var theseTotals = []; //to gather all the hand data
var one = []; //one hand
var two = []; //two hand
var three = []; //third hand
//hand data soft speed
var softS1 = [];
var softS2 = [];
var softS3 = [];


//nesting data
var nest_again;
var ideData;
var ide_nest, ide_nest2;
var timeX2 = d3.scale.linear();
var maxtime = [];
var whatTime = [];	


//x and y scales
var yOther = d3.scale.ordinal()
var xPath;
var timeX = d3.scale.linear()
	.range([leftMargin, w-rightMargin]);
var timeX2 = d3.scale.linear();
var y = d3.scale.ordinal()
    .domain(interactionTypes)
    .rangePoints([h/2, (h/2)+yspace*3]);
//color scales
var colorScale = d3.scale.ordinal()
    .domain(moduleTypes)
    .range(d3.scale.category20c().range());

var handColor = d3.scale.ordinal()
    .domain([0,20])
    .range(d3.scale.category20c().range());
var faceColor = d3.scale.ordinal()
    .domain([0,5])
    .range(d3.scale.category10().range());

//timing
//this is all the data but we have to double check timing w/ phases
var firstData; 
var startFirst, endFirst;
var startTime, endTime;
//timing
var thisSession;
//timing
var startMin, endMin, totalTime;


//phase data stream
var obsReflect = [];
var obsDoc = [];
var obsPlan = [];
var phaseData = [];
var planStart, planEnd;
var obs = [];

//hand calculations
var activeOne = [];
var activeTwo = [];
var activeThree = [];

var numSelected = 0;
// var yBottom;
// var yTop;
var yAxisBottom = h-200;
	// if(firstSelect==true){
		// yBottom = yAxisBottom;
		// yTop = h/2;
	// }
// var activateHoverbox;
var lineHY = h/1.7; //h/2
var durTrans = 1500;
var yBottom = belowIcons;
var yTop = lineHY;
var maxTotal = 3;

var yActivePath;
var radiusKey = 4;

var butLineY1 = lineHY; 
var butLineY2 = yBottom+(iconW/2)+3; //butLineY2+iconW+3)
var butY = butLineY2-iconW/2;

function dataStart() {
	pelars_init();
	getData(thisSession, pelarstoken);

	var getNext = setInterval(function(){
		console.log("one")
		if(startFirst>0 && endFirst>startFirst){
			//bad server
			getMulti(thisSession, pelarstoken);
			getPhases(thisSession, pelarstoken);
			clearInterval(getNext);
		}
	},2000); 
	var processNest = setInterval(function(){
		console.log("two")
		if(startTime>0 && endTime>startTime && nested_data.length>0){
			sendNestedData(nested_data);
			clearInterval(processNest);
		}
	},3000); 
}

//ORIGINAL
// thisSession = parseInt(1320); //1542


// var nest_again;
// var overallVals;
// IF START TIME OF overall session IS DIFFERENT THAN START TIME OF phase data...
function getData(thisSession, pelarstoken){
	
	var next = function ()
	{
		dataaccess.getData(thisSession, function(json){
		console.log("getData DONE")
		startFirst = json[0].time; //for all of the data, this is the supposed start
		endFirst = json[json.length-1].time; //for all of the data, this is the supposed end
		firstData = json; //this is the overall set of data
		data = json;
		//first we have to check start and end times with the phases
		console.log(new Date(startFirst)+"startFirst");

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
		.entries(data);
	console.log(nest_again + "nest again for summary");

	nested_data = d3.nest()
		.key(function(d) { return d.type; })
		.key(function(d){ return d.num; })
		.entries(data);

	nested_face = d3.nest()
		.key(function(d) { return d.type; })
		.entries(data);
	})

	}
	console.log("getData ",thisSession,pelarstoken)
	getOverallValues(next);


}
var overallVals;
var sessionHandSpeed, sessionHandProx, sessionFaceProx, sessionPresence, sessionScreen;
var sessionVals;
var seshProxMean = sessionHandProx; 
var seshSpeedMean = sessionHandSpeed; 
var allSpeedMax, allSpeedMean, allProxMean;		
var allFaceProx, allPresence, allScreen;
var allSpeedMin, allProxMin, allFaceMin, allPresenceMin, allPresenceMax, allScreenMax, allScreenMin;
function getOverallValues(next){
//NEEDS TO BE SYNCED WITH SERVER
//not online
	dataaccess.getContextContent(thisSession, function(json){
		console.log("	dataaccess.getContextContent DONE")
		overallVals = json;
		allSpeedMax = overallVals.hand_speed.max;
		allSpeedMean = overallVals.hand_speed.mean;
		allProxMax = overallVals.hand_distance.max;
		allProxMean = overallVals.hand_distance.mean;

		allFaceMax = overallVals.face_distance.max;
		allFaceProx = overallVals.face_distance.mean;

		allPresence = overallVals.presence.mean;
		allScreen = overallVals.time_looking.mean;


		allSpeedMin = overallVals.hand_speed.min;
		allProxMin = overallVals.hand_distance.min;

		allFaceMin = overallVals.face_distance.min;

		allPresenceMin = overallVals.presence.min;
		allPresenceMax = overallVals.presence.max;

		allScreenMax = overallVals.time_looking.max;
		allScreenMin = overallVals.time_looking.min;

		dataaccess.getContent(thisSession,function(json) {
			console.log("dataaccess.getContent DONE");
			sessionVals = json;
			for (i=0; i<json.length; i++){
				if(json[i].name=="aftersession_hand_speed"){
					sessionHandSpeed = json[i].result[(json[i].result.length)-1].overall;		
				}			
				if(json[i].name=="aftersession_hand_proximity"){
					sessionHandProx = json[i].result.mean;		
				}

				if(json[i].name=="aftersession_face_proximity"){
					sessionFaceProx = json[i].result.mean;		
				}
				
				if(json[i].name=="aftersession_presence"){
					sessionPresence = json[i].result.total_presence;		
				}			
				if(json[i].name=="aftersession_time_looking"){
					sessionScreen = json[i].result.active_time;		
				}		
			}
			showStats();
			next()
		})

	})
	console.log(overallVals+"overall summary")	
}

var tempData = [];
var multiData = [];
function getMulti(thisSession,pelarstoken){

	dataaccess.getMultimedias(thisSession,function(multiJSON){
		console.log("getMultimedias DONE")
		tempData.push(multiJSON); 
		multiData.push(tempData[0]);
		parsePhotos(multiData); //online
	})	
}

var phaseData;
function getPhases(thisSession,pelarstoken){

	dataaccess.getPhases(thisSession, function(phasesJSON){
		console.log("getPhases DONE")
		phaseData = phasesJSON;
		if(phasesJSON[0].phase=="setup"&&phasesJSON.length==1){
			startTime = startFirst;
			endTime = endFirst;	
			console.log(new Date(startTime)+"setup only?");
			console.log(new Date(endTime)+"setup only?");
			timeX.domain([startTime, endTime]);
		}
		else{
			if(phasesJSON[0].start<startFirst){
				startTime = phasesJSON[0].start;		
				console.log(new Date(startTime)+"phases start time")	
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
				console.log(new Date(endTime)+"phases end time")
			} else{
				endTime = endFirst;
			}
			timeX.domain([startTime, endTime]);
			showPhases(phasesJSON)
		}
	})
}
var timeXTrue = d3.scale.linear().range([leftMargin, w-rightMargin]);

function sendNestedData(){
	if (typeof nested_data !== "undefined"){

	    var xAxisCall = svgMain.append('g');
		// var leftMargin = 100;
	    var xAxis = d3.svg.axis();
	    var xAxisScale = d3.time.scale()
	        .domain([startTime, endTime])
	        .range([leftMargin, w-rightMargin]);
		timeXTrue
			.domain([startTime, endTime])

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
	        .attr('transform', 'translate(0, ' + (lineHY) + ')');
//new addition
$("g.axis").hide();	        
	console.log(nested_data)
	for(i=0; i<nested_data.length; i++){
		// console.log(nested_data[i])
		if(nested_data[i].key==types[3]){
			goFace(nested_face[i]); //FACE
		}
		if(nested_data[i].key==types[1]){
			goIDE(nested_data[i].values); //IDE					
		}
	}
	for(i=0; i<nested_data.length; i++){
		if(nested_data[i].key==types[0]){ //HAND
			goHands(nested_data[i], nest_again[i].values);
		}
	}	
}
}

//button stuff
var particleOnly = [];
var button1 = [];
var button2 = [];
var btnImg1 = [];
var btnImg2 = [];
//these were switched from b1 to b2
function parseButton(incomingData){ 
	particleOnly = incomingData.filter(function(n){ 
		return n.type == "particle" || n.type == "button"; 
	}); 
	console.log(particleOnly.length + "button press data")
	button1 = particleOnly.filter(function(n){ 
		return n.data == "b2" && n.data!=undefined;
	}); 
	console.log(button1.length + "button 1")
	button2 = particleOnly.filter(function(n){ 
		return n.data == "b1" && n.data!=undefined;
	}); 
	console.log(button2.length + "button 2")

	for(i=0; i<button1.length; i++){
		// $.getJSON("data/button1.json", function(json){
		dataaccess.getSnapshot(thisSession,(button1[i].time/1000000000000)+"E12", function(json){
			json.data += "?token" + pelarstoken
			btnImg1.push(json);
		})
	}

	for(i=0; i<button2.length; i++){
		// $.getJSON("data/button2.json", function(json){
		dataaccess.getSnapshot(thisSession,(button2[i].time/1000000000000)+"E12", function(json){
			json.data += "?token" + pelarstoken
			btnImg2.push(json);
		})
	}

	var getImage = setInterval(function(){  //returns the session		
		if(btnImg1.length>0 || btnImg2.length>0){
			console.log(btnImg1.length+"btn/img1 length")
			drawButton(button1, button2, btnImg1, btnImg2);
			clearInterval(getImage);	
		}
	}, 1000);
}

var thunderSpace = .5;
var ideaSpace = -.25;
// var iconW = 15;

var btnImgW = 200;
var btnImgH = btnImgW*1.3;
var thunder, lightbulb;
var timeMargin = 200;
var btnNest1;
var btnNest2;
var button1Images = [];
function drawButton(button1, button2, img1, img2){
	console.log("draw button")
	console.log(img1)
	// console.log()
	btnNest1 = d3.nest()
		.key(function(d) { 
			return d.time; 
		})
		.sortKeys(d3.ascending)
		.entries(button1); //not btnImg1

	btnNest2 = d3.nest()
		.key(function(d) { 
			return d.time; 
		})
		.sortKeys(d3.ascending)
		.entries(button2); //not btnImg2
	bigImgWidth = bigImgWidth*2;
	bigImgHeight = bigImgHeight*2;
	// var iconBut1 = timeSVG.selectAll(".button1")	
	// 	.data(button1)
	// 	iconBut1.enter()
	// 	.append("image")
	// 	.attr("class","button1")
	// 	.attr("xlink:href", "assets/icons/idea.png")//"assets/icons0/Button.png")
	// 	.attr("x", function(d){
	// 		return timeXTrue(d.time);
	// 	})
	// 	.attr("y", butLineY1)
	// 	.attr("width",iconW)
	// 	.attr("height",iconW)
	// 	.attr("opacity",0)
	// 	.on("click", function(d,i){
	// 		var thisData = d3.select(this);
	// 		var thisTime = thisData[0][0].__data__.time;
	// 		console.log(thisTime+"thisTIME")
	// 		var lIndex = i;
	// 		// var thisIndex = i;
	// 		console.log(btnNest1[lIndex].values[0]);
	// 		console.log(lIndex)
	// 	    lightbulb = timeSVG.selectAll(".clip-circ"+lIndex+"l")
 //                .data(btnImg1[lIndex]) //btnImg2[thisIndex].data or take off data 
 //                .attr("id","clip-circ")
 //                .attr("x", timeXTrue(thisTime)-btnImgW/2)
 //            lightbulb
 //                .enter()
 //                .append("image")
 //                .attr("class", "clip-circ"+lIndex+"l")
 //                .attr("id","clip-circ")
 //                .attr("x", timeXTrue(thisTime)-btnImgW/2)
	// 			.attr("y",  butY-30)
 //        		.attr("width", btnImgW)
 //        		.attr("height", btnImgH)
 //                .attr("xlink:href", function(d, i) {
 //                	console.log(d.view);
 //                	// if(d.time>=thisTime && d.time<=thisTime+timeMargin){
	//                 	if(d.view=="workspace"){
	//                 		console.log(d.view)
	//                 		return d.data;
	//                 		// return "images/frustration.png"	
	//                 	} else {
	//                 		// return (btnNest1[lIndex].values[0][0].data) 
	//                 	}
 //                })
 //        		.attr("opacity",1);
	// 		d3.selectAll("image#clip-circ.clip-circ"+lIndex+"l").transition().attr("opacity",1);
	// 		// lightbulb.exit();
	// 		moveAllToFront();
	// 	})
	// 	.on("mouseout", function(d,i){
	// 		var lIndex = i;
	// 		d3.selectAll(".clip-circ"+lIndex+"l")
	// 			.transition()
	// 			.duration(2000)
	// 			.attr("opacity",0)
	// 	});
//correct above

//working ok
	var iconBut1 = timeSVG.selectAll(".button1")	
		.data(button1)
		iconBut1.enter()
		.append("image")
		.attr("class","button1")
		.attr("xlink:href", "assets/icons/idea.png")//"assets/icons0/Button.png")
		.attr("x", function(d){
			return timeXTrue(d.time);
		})
		.attr("y", butLineY1)
		.attr("width",iconW)
		.attr("height",iconW)
		.attr("opacity",0)
		.on("click", function(d,i){
			var thisData = d3.select(this);
			var thisTime = thisData[0][0].__data__.time;
			console.log(thisTime+"thisTIME")
			var lIndex = i;

			console.log(btnNest1[lIndex].values[0]);
			console.log(lIndex)
		    lightbulb = timeSVG.selectAll(".clip-circ"+lIndex+"l")
                .data(btnImg1[lIndex]) //btnImg2[thisIndex].data or take off data 
                .attr("id","clip-circ")
                // .attr("x", timeXTrue(thisTime)-btnImgW/2)
            lightbulb
                .enter()
                .append("image")
                .attr("class", "clip-circ"+lIndex+"l")
                .attr("id","clip-circ")
	    		.attr("x", function(d,i){
	    			if(timeXTrue(thisTime)-bigImgWidth/2<leftMargin){
	    				console.log("under left edge")
	    				return leftMargin;
	    			}
	    			else if(timeXTrue(thisTime)-bigImgWidth/2>(w-rightMargin-bigImgWidth)){
	    				console.log("over right edge")
	    				return w-rightMargin-bigImgWidth;
	    			}
	    			else{
	    				return timeXTrue(thisTime)-bigImgWidth/2;
	    			}
	    		})
	    		.attr("y", butY/4)
	    		.attr("width",bigImgWidth)
	    		.attr("height",bigImgHeight)
                .attr("xlink:href", function(d, i) {
                	console.log(d.view);
	                	if(d.view=="workspace"){
	                		console.log(d.view)
	                		return d.data;
	                	} else {
	                	}
                })
        		.attr("opacity",1);
			d3.selectAll("image#clip-circ.clip-circ"+lIndex+"l")
				.transition().attr("opacity",1)
	    		.attr("width",bigImgWidth)
	    		.attr("height",bigImgHeight);
			moveAllToFront();
		})
		.on("mouseout", function(d,i){
			var lIndex = i;
			d3.selectAll(".clip-circ"+lIndex+"l")
				.transition()
				.duration(2000)
				.attr("opacity",0)
				.attr("width",0)
	    		.attr("height",0)
		});
//working ok
//messing below
	// var iconBut1 = timeSVG.selectAll(".button1")	
	// 	.data(button1)
	// 	iconBut1.enter()
	// 	.append("image")
	// 	.attr("class","button1")
	// 	.attr("xlink:href", "assets/icons/idea.png")//"assets/icons0/Button.png")
	// 	.attr("x", function(d){
	// 		return timeXTrue(d.time);
	// 	})
	// 	.attr("y", butLineY1)
	// 	.attr("width",iconW)
	// 	.attr("height",iconW)
	// 	.attr("opacity",0)
	// 	.on("click", function(d,i){
	// 		var thisData = d3.select(this);
	// 		var thisTime = thisData[0][0].__data__.time;
	// 		console.log(thisTime+"thisTIME")
	// 		var lIndex = i;

	// 		console.log(btnNest1[lIndex].values[0]);
	// 		console.log(lIndex)
	// 	    lightbulb = timeSVG.selectAll(".clip-circ"+lIndex+"l")
 //                .data(btnImg1[lIndex]) //btnImg2[thisIndex].data or take off data 
 //                .attr("id","clip-circ")
 //                .attr("x", timeXTrue(thisTime)-btnImgW/2)
 //            lightbulb
 //                .enter()
 //                .append("image")
 //                .attr("class", "clip-circ"+lIndex+"l")
 //                .attr("id","clip-circ")
	//     		.attr("x", function(d,i){
	//     			if(timeXTrue(thisTime)-bigImgWidth/2<leftMargin){
	//     				console.log("under left edge")
	//     				return leftMargin;
	//     			}
	//     			else if(timeXTrue(thisTime)-bigImgWidth/2>(w-rightMargin-bigImgWidth)){
	//     				console.log("over right edge")
	//     				return w-rightMargin-bigImgWidth;
	//     			}
	//     			else{
	//     				return timeXTrue(thisTime)-bigImgWidth/2;
	//     			}
	//     		})
	//     		.attr("y", butY+btnImgH)
	//     		.attr("width",bigImgWidth)
	//     		.attr("height",bigImgHeight)
 //                .attr("xlink:href", function(d, i) {
 //                	console.log(d.view);
	//                 	if(d.view=="workspace"){
	//                 		console.log(d.view)
	//                 		return d.data;
	//                 	} else {
	//                 	}
 //                })
 //        		.attr("opacity",1);
	// 		d3.selectAll("image#clip-circ.clip-circ"+lIndex+"l").transition().attr("opacity",1);
	// 		moveAllToFront();
	// 	})
	// 	.on("mouseout", function(d,i){
	// 		var lIndex = i;
	// 		d3.selectAll(".clip-circ"+lIndex+"l")
	// 			.transition()
	// 			.duration(2000)
	// 			.attr("opacity",0)
	// 			.attr("x", timeXTrue(thisTime)-btnImgW/2)
	// 			.attr("y", butY-btnImgH)
	//     		.attr("width",btnImgW)
	//     		.attr("height",btnImgH)
	// 	});






//MESSING

  //   lightbulb = timeSVG.selectAll(".clip-circl")
  //       .data(btnImg1) //btnImg2[thisIndex].data or take off data 
  //       .attr("id","clip-circ")
  //       .attr("x", function(d, i) {
  //       	console.log(d[1]);
  //       	// return timeXTrue(d.time)-btnImgW/2
  //       })
  //   lightbulb
  //       .enter()
  //       .append("image")
  //       // .data()
  //       .attr("class", "clip-circl")
  //       .attr("id","clip-circ")
  //       .attr("x", function(d, i) {
  //       	console.log(d);
  //       	// return timeXTrue(d.time)-btnImgW/2
  //       })
		// .attr("y",  butY-30)
		// .attr("width", btnImgW)
		// .attr("height", btnImgH)
  //       .attr("xlink:href", function(d, i) {
  //       	console.log(d.view);
  //       	// if(d.time>=thisTime && d.time<=thisTime+timeMargin){
  //           	if(d.view=="workspace"){
  //           		console.log(d.view)
  //           		return d[i].data;
  //           		// return "images/frustration.png"	
  //           	} else {
  //           		// return (btnNest1[lIndex].values[0][0].data) 
  //           	}
  //       })
		// .attr("opacity",1)
	 //    .on("click", function(d,i){
	 //    	d3.select(this)
	 //    		.transition()
	 //    		.duration(500)
	 //    		.attr("x", function(d,i){
	 //    			if(timeX(d.time)-bigImgWidth/2<leftMargin){
	 //    				console.log("under left edge")
	 //    				return leftMargin;
	 //    			}
	 //    			else if(timeX(d.time)-bigImgWidth/2>(w-rightMargin-bigImgWidth)){
	 //    				console.log("over right edge")
	 //    				return w-rightMargin-bigImgWidth;
	 //    			}
	 //    			else{
	 //    				return timeX(d.time)-bigImgWidth/2;
	 //    			}
	 //    		})
	 //    		.attr("y", lineHY-bigImgHeight+bigImgHeight/4)
	 //    		.attr("width",bigImgWidth)
	 //    		.attr("height",bigImgHeight)
	 //    		.transition()
	 //    		.delay(3000)
	 //    		.attr("x", function(d){
	 //    			// console.log(d+"image clicked")
	 //    			return timeX(d.time)-timelineImgWidth/4;
	 //    		})
		// 		.attr("y", function(d){
		// 			if(numClicked>2){
		// 				return (lineHY+61) 
		// 			}else{
		// 				return (lineHY+100-timelineImgHeight/2) 
		// 			}
		// 		})
	 //    		.attr("width", timelineImgWidth)
	 //    		.attr("height", timelineImgHeight)   
		// 	d3.select(this).each(moveToFront);
	 //    })
	// d3.selectAll(overview).moveToFront;


//messing












	var iconLine1 = timeSVG.selectAll(".button1L")	
		.data(button1)
		iconLine1.enter()
		.append("line")
		.attr("class","button1L")
		.attr("x1", function(d){
			return timeXTrue(d.time)+iconW/2+ideaSpace;
		})
		.attr("x2", function(d){
			return timeXTrue(d.time)+iconW/2+ideaSpace;
		})
		.attr("y1", butLineY1)
		.attr("y2", butLineY1)
		.attr("stroke-width",.1)
		.attr("stroke","grey");

	// var iconBut2 = timeSVG.selectAll(".button2")	
	// 	.data(button2)
	// 	iconBut2.enter()
	// 	.append("image")
	// 	.attr("class","button2")
	// 	.attr("xlink:href", "assets/icons/thunder.png") //just checking now put back to thunder
	// 	.attr("x", function(d){
	// 		return timeXTrue(d.time);
	// 	})
	// 	.attr("y", butLineY1)
	// 	.attr("width",iconW)
	// 	.attr("height",iconW)
	// 	.attr("opacity",0)
	// 	.on("click", function(d,i){
	// 		var thisData = d3.select(this);
	// 		var thisTime = thisData[0][0].__data__.time;
	// 		console.log(thisTime+"thisTIME")
	// 		var tIndex = i;

	// 		console.log(tIndex)
	// 	    thunder = timeSVG.selectAll(".clip-circ"+tIndex+"t")
 //                .data(btnImg2[tIndex]) //btnImg2[thisIndex].data or take off data 
 //                .attr("id","clip-circ")
 //                .attr("x", timeXTrue(thisTime)-btnImgW/2)
 //            thunder
 //                .enter()
 //                .append("image")
 //                .attr("class", "clip-circ"+tIndex+"t")
 //                .attr("id","clip-circ")
 //                .attr("x", timeXTrue(thisTime)-btnImgW/2)
	// 			.attr("y", butY+20)
 //        		.attr("width", btnImgW)
 //        		.attr("height", btnImgH)
 //        		.attr("opacity",1)
 //                .attr("xlink:href", function(d, i) {
	//                 	if(d.view=="workspace"){
	//                 		console.log(d.view)
	//                 		// return "images/frustration.png"
	//                 		return d.data;
	//                 	} else {
	//                 		// return btnNest2[tIndex].values[0][0].data//btnImg2[tIndex][0].data; 
	//                 	}
 //                })
 //        		.attr("opacity",1);
	// 		d3.selectAll("image#clip-circ.clip-circ"+tIndex+"t").transition().attr("opacity",1);
	// 		moveAllToFront();
	// 	})
	// 	.on("mouseout", function(d,i){
	// 		var tIndex = i;
	// 		d3.selectAll(".clip-circ"+tIndex+"t")
	// 			.transition()
	// 			.duration(2000)
	// 			.attr("opacity",0)
	// 	});








//messing
	var iconBut2 = timeSVG.selectAll(".button2")	
		.data(button2)
		iconBut2.enter()
		.append("image")
		.attr("class","button2")
		.attr("xlink:href", "assets/icons/thunder.png") //just checking now put back to thunder
		.attr("x", function(d){
			return timeXTrue(d.time);
		})
		.attr("y", butLineY1)
		.attr("width",iconW)
		.attr("height",iconW)
		.attr("opacity",0)
		.on("click", function(d,i){
			var thisData = d3.select(this);
			var thisTime = thisData[0][0].__data__.time;
			console.log(thisTime+"thisTIME")
			var tIndex = i;

			console.log(tIndex)
		    thunder = timeSVG.selectAll(".clip-circ"+tIndex+"t")
                .data(btnImg2[tIndex]) //btnImg2[thisIndex].data or take off data 
                .attr("id","clip-circ")
                // .attr("x", timeXTrue(thisTime)-btnImgW/2)
            thunder
                .enter()
                .append("image")
                .attr("class", "clip-circ"+tIndex+"t")
                .attr("id","clip-circ")
	    		.attr("x", function(d,i){
	    			if(timeXTrue(thisTime)-bigImgWidth/2<leftMargin){
	    				console.log("under left edge")
	    				return leftMargin;
	    			}
	    			else if(timeXTrue(thisTime)-bigImgWidth/2>(w-rightMargin-bigImgWidth)){
	    				console.log("over right edge")
	    				return w-rightMargin-bigImgWidth;
	    			}
	    			else{
	    				return timeXTrue(thisTime)-bigImgWidth/2;
	    			}
	    		})
	    		.attr("y", butY/4)
	    		.attr("width",bigImgWidth)
	    		.attr("height",bigImgHeight)
                .attr("xlink:href", function(d, i) {
                	console.log(d.view);
	                	if(d.view=="workspace"){
	                		console.log(d.view)
	                		return d.data;
	                	} else {
	                	}
                })
        		.attr("opacity",1);
			d3.selectAll("image#clip-circ.clip-circ"+tIndex+"t")
				.transition().attr("opacity",1)
	    		.attr("width",bigImgWidth)
	    		.attr("height",bigImgHeight);
			moveAllToFront();
		})
		.on("mouseout", function(d,i){
			var tIndex = i;
			d3.selectAll(".clip-circ"+tIndex+"t")
				.transition()
				.duration(2000)
				.attr("opacity",0).attr("width",0)
	    		.attr("height",0)
		});
//messing












	var iconLine2 = timeSVG.selectAll(".button2L")	
		.data(button2)
		iconLine2.enter()
		.append("line")
		.attr("class","button2L")
		.attr("x1", function(d){
			return timeXTrue(d.time)+iconW/2+thunderSpace;
		})
		.attr("x2", function(d){
			return timeXTrue(d.time)+iconW/2+thunderSpace;
		})
		.attr("y1", butLineY1)
		.attr("y2", butLineY1)
		.attr("stroke-width",.1)
		.attr("stroke","grey");
}

var autoImg = [];
var imgData = [];
var docuImg = [];
var docuNote = [];
var researcherCaptions = [];
var studentCaptions = [];
var researcherNote = [];
// function parsePhotos(multiData){
// 	imgData = multiData;
// 	var captionsText = [];
// 	console.log(multiData.length+"multiData length - photos");
// 		for(i=0; i<imgData[0].length; i++){
// 			if(imgData[0][i].creator=="client" && imgData[0][i].type=="image" && imgData[0][i].view=="workspace"){
// 				autoImg.push(imgData[0][i]);
// 			}
// 			// if(imgData[0][i].creator=="observer" && imgData[0][i].type=="text"){
// 			// 	researcherNote.push(imgData[0][i]);
// 			// }
// 			if(imgData[0][i].creator=="student" && imgData[0][i].type=="text"){
// 				docuNote.push(imgData[0][i])
// 			}
// 			if(imgData[0][i].creator=="student" && imgData[0][i].type=="image"){
// 				docuImg.push(imgData[0][i]);
// 			}
// 		}
// 	function processURL(){
// 		// for(i=0; i<researcherNote.length; i++){
// 		// 	var url1 = researcherNote[i].data+"?pelarstoken="+pelarstoken;
// 		// 	$.get(url1, function(caption){
// 		// 		researcherCaptions.push(caption)
// 		// 	})
// 		// }
// 		for(i=0; i<docuNote.length; i++){
// 			var url1 = docuNote[i].data+"?pelarstoken="+pelarstoken;
// 			$.get(url1, function(caption){
// 				studentCaptions.push(caption)
// 			})
// 		}
// 	}
// 	var urlProcessing = setInterval(function(){  //returns the session		
// 		if(autoImg.length>0 && docuImg.length>0 && docuNote.length>0){ //&& researcherNote.length>0
// 			console.log(docuImg.length+"docuImg length")
// 			processURL();
// 			clearInterval(urlProcessing);	
// 		}
// 	}, 1000);
// 	var imageProcessing = setInterval(function(){  //returns the session		
// 		if(studentCaptions.length>0){ //researcherCaptions.length>0 && 
// 			console.log(studentCaptions.length+"studentCaptions length")
// 			showPhotos();
// 			showStudDoc();
// 			clearInterval(imageProcessing);	
// 		}
// 	}, 3000);	
// }
var theVideo;
function parsePhotos(multiData){
	imgData = multiData;
	var captionsText = [];
	console.log(multiData.length+"multiData length - photos");
		for(i=0; i<imgData[0].length; i++){
			if(imgData[0][i].creator=="client" && imgData[0][i].type=="image" && imgData[0][i].view=="workspace"){
				autoImg.push(imgData[0][i]);
			}
			// if(imgData[0][i].creator=="observer" && imgData[0][i].type=="text"){
			// 	researcherNote.push(imgData[0][i]);
			// }
			if(imgData[0][i].creator=="student" && imgData[0][i].type=="text"){
				docuNote.push(imgData[0][i])
			}
			if(imgData[0][i].creator=="student" && imgData[0][i].type=="image"){
				docuImg.push(imgData[0][i]);
			}
			if(imgData[0][i].creator=="student" && imgData[0][i].type=="video"){
				theVideo = imgData[0][i].data;
			}
		}
////online version
	// function processURL(){
	// 	for(i=0; i<docuNote.length; i++){
	// 		var url1 = docuNote[i].data+"?pelarstoken="+pelarstoken;
	// 		$.get(url1, function(caption){
	// 			studentCaptions.push(caption)
	// 		})
	// 	}
	// }
	// var urlProcessing = setInterval(function(){  //returns the session		
	// 	if(autoImg.length>0 && docuImg.length>0 && docuNote.length>0){ //&& researcherNote.length>0
	// 		console.log(docuImg.length+"docuImg length")
	// 		processURL();
	// 		clearInterval(urlProcessing);	
	// 	}
	// }, 1000);
	// var imageProcessing = setInterval(function(){  //returns the session		
	// 	if(studentCaptions.length>0){ //researcherCaptions.length>0 && 
	// 		console.log(studentCaptions.length+"studentCaptions length")
	// 		showPhotos();
	// 		showStudDoc();
	// 		clearInterval(imageProcessing);	
	// 	}
	// }, 3000);
//	//online version	
	var imageProcessing = setInterval(function(){  //returns the session		
		if(autoImg.length>0){ //researcherCaptions.length>0 && 
			// console.log(studentCaptions.length+"studentCaptions length")
			canShowPhotos = true;
			showPhotos();
			showStudDoc();
			clearInterval(imageProcessing);	
		}
	}, 3000);	
}

//then make it so you can click right and x out?
function showPhotos(){

//autoImg = system images
//researcherNote = just caption
//docuImg = student taken documents = image + caption
	overview = timeSVG.selectAll(".clip-rect")
	    .data(autoImg) 
	    .attr("x", function(d, i) {
			return timeX(d.time)-timelineImgWidth/4;
	    })
	overview
	    .enter()
	    .append("image")
	    .attr("class", "clip-rect")
	    .attr("x", function(d, i) {
			return timeX(d.time)-timelineImgWidth/4;
	    })
		// .attr("y", butLineY1)
		.attr("y", lineHY-timelineImgHeight/2)  //622
		.attr("opacity",0)
		// .attr("y", timelineImgY)  //622//yAxisBottom-timelineImgHeight+40
		.attr("width", timelineImgWidth)
		.attr("height", timelineImgHeight)
	    .attr("xlink:href", function(d, i) {
			// return "images/frustration.png";
			return d.data;                    	                       		
	    })
	    .on("click", function(d,i){
	    	d3.select(this)
	    		.transition()
	    		.duration(500)
	    		.attr("x", function(d,i){
	    			if(timeX(d.time)-bigImgWidth/2<leftMargin){
	    				console.log("under left edge")
	    				return leftMargin;
	    			}
	    			else if(timeX(d.time)-bigImgWidth/2>(w-rightMargin-bigImgWidth)){
	    				console.log("over right edge")
	    				return w-rightMargin-bigImgWidth;
	    			}
	    			else{
	    				return timeX(d.time)-bigImgWidth/2;
	    			}
	    		})
	    		.attr("y", lineHY-bigImgHeight+bigImgHeight/4)
	    		.attr("width",bigImgWidth)
	    		.attr("height",bigImgHeight)
	    		.each("end", function(){
	    			d3.select(this)
			    		.transition()
			    		.delay(3000)
			    		.attr("x", function(d){
			    			// console.log(d+"image clicked")
			    			return timeX(d.time)-timelineImgWidth/4;
			    		})
						.attr("y", function(d){
							if(numClicked>2){
								return (lineHY+61) 
							}else if (numClicked<=2){
								return lineHY-timelineImgHeight/2 
								// (lineHY+100-timelineImgHeight/2) 
							}
						})
			    		.attr("width", timelineImgWidth)
			    		.attr("height", timelineImgHeight)   
					d3.select(this).each(moveToFront);
	    		})
	    })
	// d3.selectAll(overview).moveToFront;    
//mobile image data back up?
}

function revealPhotos(){
	if(overview)
		overview.transition().attr("opacity",1) 
	// ("height",timelineImgHeight)
}

function showStudDoc(){

	var studCommentDoc;
	var docIcon = iconW*2;
	studCommentDoc = timeSVG.selectAll(".studCommentIcon")
		.data(docuNote);
	studCommentDoc.enter()
		.append("image")
		.attr("class","studCommentIcon")
		.attr("xlink:href", "assets/pencil.png") //just checking now put back to thunder
		.attr("x", function(d){
			return timeXTrue(d.time);
		})
		.attr("y", butLineY1)
		.attr("width",iconW)
		.attr("height",iconW)
		.attr("opacity",0)
		.on("click", function(d,i){
			var thisData = d3.select(this);
			var thisTime = thisData[0][0].__data__.time;
			console.log(thisTime+"docuNote time")
			var lIndex = i;
			console.log(docuNote[lIndex]);
// var thisText = svgMain
//                 .append("text").attr("class","new")
//                 .attr("x", 100)
// 				.attr("y", 500)
// 				.attr("fill","red")
//                 .text("BALHABLAHALHAHL")
//         		.attr("opacity",1);
		    // var docCom = svgMain
		    // .selectAll(".SC"+lIndex)
                // .data(docuNote) 
                // .attr("x", timeXTrue(thisTime)-iconW/2)
            docCom = svgMain
                .append("text")
                .attr("class", "SC"+lIndex)
                .attr("x", timeXTrue(thisTime)-iconW/2)
				.attr("y", butY+20)
		      .attr("font-size",10)
		      .attr("dy", "1.5em")
				.attr("fill",darkColor)
                .text(function() {
					d3.text(docuNote[lIndex].data+ "?token="+pelarstoken, function(textData){ 
						console.log(textData);
						return textData;
				  })
                })
		        // .call(wrap2, iconW)
        		.attr("opacity",1);

			d3.selectAll(".SC"+lIndex)
				.transition()
				.duration(2000)
				.attr("opacity",1)
			moveAllToFront();
		})
		.on("mouseout", function(d,i){
			var thisData = d3.select(this);
			var lIndex = i;
			var thisTime = thisData[0][0].__data__.time;
			d3.selectAll(".SC"+lIndex)
				.transition()
				// .duration(2000)
				.attr("opacity",0)
		});


	var studImgDoc;
	studImgDoc = timeSVG.selectAll(".camIcon")
		.data(docuImg);
	studImgDoc.enter()
		.append("image")
		.attr("class","camIcon")
		.attr("xlink:href", "assets/icons0/Documentation.png") //just checking now put back to thunder
		.attr("x", function(d){
			return timeXTrue(d.time);
		})
		.attr("y", butLineY1)
		.attr("width",docIcon)
		.attr("height",docIcon)
		.attr("opacity",0)
		.on("click", function(d,i){
			var thisData = d3.select(this);
			var thisTime = thisData[0][0].__data__.time;
			console.log(thisTime+"docuImg time")
			var lIndex = i;
			console.log(docuImg[lIndex]);

		    var docImg = svgMain.selectAll(".SD"+lIndex)
		    // (".clip-circ"+lIndex+"SD")
                .data(docuImg) 
                // .attr("id","clip-circ")
                .attr("x", timeXTrue(thisTime)-btnImgW/2)
            docImg
                .enter()
                .append("image")
                .attr("class", "SD"+lIndex)
                // .attr("class", "clip-circ"+lIndex+"SD")
                // .attr("id","clip-circ")
                .attr("x", timeXTrue(thisTime)-btnImgW/2)
				.attr("y", butY)
				// .attr("y", butLineY2+btnImgH)
        		.attr("width", btnImgW)
        		.attr("height", btnImgH)
                .attr("xlink:href", function(d, i) {
	                return docuImg[lIndex].data + "?token="+pelarstoken;
                })
        		.attr("opacity",1);

			d3.selectAll(".SD"+lIndex)
			// .selectAll(".clip-circ"+lIndex+"SD")
				.transition()
				// .duration(2000)
				.attr("opacity",1)
			// docImg.exit();
			moveAllToFront();
		})
		.on("mouseout", function(d,i){
			var thisData = d3.select(this);
			var lIndex = i;
			var thisTime = thisData[0][0].__data__.time;

			d3.selectAll(".SD"+lIndex)
			// (".clip-circ"+lIndex+"SD")
				.transition()
				.duration(2000)
				.attr("opacity",0)
				// .attr("width", btnImgW)
				// .attr("height", btnImgH)
                // .attr("x", timeXTrue(thisTime)-btnImgW/2)
				// .attr("y",  butY-30)
				// .attr("y", butLineY2-btnImgH)
		});
		// .on("click", function(d,i){
		// 	var lIndex = i;
		// 	d3.selectAll(".clip-circ"+lIndex+"SD")
		// 		.transition()
		// 		.duration(500)
		// 		.attr("width", bigImgWidth)
		// 		.attr("height", bigImgHeight)
	 //    		.attr("x", function(d,i){
	 //    			if(timeXTrue(d.time)-bigImgWidth/2<leftMargin){
	 //    				console.log("under left edge")
	 //    				return leftMargin;
	 //    			}
	 //    			else if(timeXTrue(d.time)-bigImgWidth/2>(w-rightMargin-bigImgWidth)){
	 //    				console.log("over right edge")
	 //    				return w-rightMargin-bigImgWidth;
	 //    			}
	 //    			else{
	 //    				return timeXTrue(d.time)-bigImgWidth/2;
	 //    			}
	 //    		})
	 //    		.attr("y", timelineImgY-bigImgHeight+bigImgHeight/4)
		// 		.attr("opacity",1)			
		// });

	var docLine = timeSVG.selectAll(".docL")	
		.data(docuImg)
		docLine.enter()
		.append("line")
		.attr("class","docL")
		.attr("x1", function(d){
			return timeXTrue(d.time)+docIcon/2;
		})
		.attr("x2", function(d){
			return timeXTrue(d.time)+docIcon/2;
		})
		.attr("y1", butLineY1)
		.attr("y2", butLineY1)
		.attr("stroke-width",.1)
		.attr("stroke","grey");
	var comLine = timeSVG.selectAll(".comL")	
		.data(docuNote)
		comLine.enter()
		.append("line")
		.attr("class","comL")
		.attr("x1", function(d){
			return timeXTrue(d.time)+6+iconW/2;
		})
		.attr("x2", function(d){
			return timeXTrue(d.time)+6+iconW/2;
		})
		.attr("y1", butLineY1)
		.attr("y2", butLineY1) //-10
		.attr("stroke-width",.1)
		.attr("stroke","grey");



    var x = document.createElement("VIDEO");
// theVideo;
    if (x.canPlayType("video/mp4")) {
        x.setAttribute("src",theVideo);
        // x.setAttribute("src","assets/vid/15350.mp4");
    } else {
    }
    x.setAttribute("width", w/2); //"800");
    x.setAttribute("class", "video");
    x.setAttribute("height", lineHY) //"500");
    // x.setAttribute("width", "320");
    // x.setAttribute("class", "video");
    // x.setAttribute("height", "240");
    x.setAttribute("controls", "controls");
    document.body.appendChild(x);	


	var studVid = timeSVG.append("image")
		.attr("class","vidIcon")
		.attr("xlink:href", "assets/icons0/Video.png") //just checking now put back to thunder
		.attr("x", timeXTrue(endTime)-docIcon/2)
		.attr("y", butLineY1*2)
		.attr("width",docIcon)
		.attr("height",docIcon)
		.attr("opacity",0)
		.on("click", function(){
			console.log("clicked");
			$(".video").show();	
			$(".vidX").show();	
		})
	var studVidLine = timeSVG.append("line")
		.attr("class","vidIconLine")
		.attr("x1", timeXTrue(endTime))
		.attr("x2", timeXTrue(endTime))
		.attr("y1", butLineY1)
		.attr("y2", butLineY1)
		.attr("stroke-width",.1)
		.attr("stroke","grey");

	var studVidRectX = timeSVG.append("rect")
		.attr("class","vidX")
		.attr("x", w/2+w/4)
		.attr("y", 89)
		.attr("width", 32)
		.attr("height", 32)
		.attr("fill","white")
		.attr("stroke-width",4)
		.attr("stroke","lightgrey")
		.on("mouseover", function(){
			d3.select(this).transition()
				.attr("fill","lightgrey")
		})
		.on("mouseout", function(){
			d3.select(this).transition()
				.attr("fill","white")
		})
	var studVidX = timeSVG.append("text")
		.attr("class","vidX")
		.attr("x", w/2+w/4+4)
		.attr("y", 117)
		.attr("fill","red")
		.text("X").attr("font-size", 32)
		.on("mouseover", function(){
			d3.select(this).transition()
				.attr("fill","lightgrey")
		})
		.on("mouseout", function(){
			d3.select(this).transition()
				.attr("fill","red")
		})
		.on("click", function(){
			$(".video").hide();	
			$(".vidX").hide();				
		})


	// for (i=0; i<docuImg.length; i++){
	// 	insideDoc.push(docuImg[i].data)		
	// }
//not working
	// $('.studCommentIcon').tipsy({ 
	// 		gravity: 'nw', 
	// 		html: true, 
	// 		title: function() {
	// 			var dis = this.__data__;
	// 	  		var url1 = dis.data+"?pelarstoken="+pelarstoken;
	// 	  		// var captionDoc;
	// 	  		// func1(url1);
	// 			// console.log(dis.data);
	// 			// return dis.data;
	// 			var deferit = $.Deferred();
	// 			deferit
	// 			  .done(func1)
	// 			deferit.resolve();
	// 			function func1(url1){
	// 				$.get(url1, function(capt){
	// 					captionDoc = capt;
	// 					// return capt;
	// 				})
	// 			}
	// 				return captionDoc;
	// 		}
	// });


	// $('.commentIcon').tipsy({ 
	// 		gravity: 'nw', 
	// 		html: true, 
	// 		title: function() {
	// 			var dis = this.__data__;
	// 	  		var url1 = dis.data+"?pelarstoken="+pelarstoken;
	// 			console.log(dis);
	// 			var deferit = $.Deferred();
	// 			deferit
	// 			  .done(func1)
	// 			deferit.resolve();
	// 			function func1(){
	// 				$.get(url1, function(capt){
	// 					caption = capt;
	// 				})
	// 			}
	// 				return caption;
	// 		}
	// });
//BUTTON PRESSES                      
// console.log("d.properties"+d.properties)
// updateHoverbox(d.properties, "path");
}

function revealDoc(){
	d3.selectAll(".camIcon").transition().attr("opacity",1).attr("y",butY-30)
	d3.selectAll(".studCommentIcon").transition().attr("opacity",1).attr("y",butY-30)

	d3.selectAll(".vidIcon").attr("opacity",1).attr("y",butY-30)
	d3.selectAll(".vidIconLine").transition().attr("y2",butLineY2-15)

d3.selectAll("image.clip-rect").transition().attr("x", function(d){ return timeX(d.time)}).attr("opacity",1)


	d3.selectAll(".comL").transition().attr("y2",butLineY2-15)
	d3.selectAll(".docL").transition().attr("y2",butLineY2-15)
	// d3.selectAll(".comL")	
	// d3.selectAll(".docL")		
}

var faceY = yTop+2*maxTotal*faceRadius;
var faceColor = "#AB47BC";
function goFace(faceData){
	var minTotal, maxTotal;
	var thisMany = [];

	var yOffset = h/2;
	var mini = 4;
	var heightPanel = 100;

	var faceSpot = d3.scale.linear()
	  .domain([0, maxTotal])
	  .range([faceY+20, yTop-20]);

	rectFace = timeSVG.append("g").attr("class","facerect").selectAll(".facerect")
	    .data(faceData.values)
	  	.enter().append("rect")
	    .attr("class", "facerect")
	    .attr("x", function(d){
	    	faceNum.push(d.num);
	    	return timeX(d.time)
	    })
	    .attr("y", function(d,i){
	    	if(d.num>3){ console.log(d.num+"big") }
	    	return faceY-(d.num*faceRadius);
	    })
	    .attr("height", function(d,i){
	    	return 2*(d.num*faceRadius);
	    })
	    .attr("width",2)
	    .attr("fill", lightColor)
	    .attr("opacity",.6)
		.attr("stroke","none")
	var circFace = timeSVG.append("g").attr("class","facerect").selectAll(".facerect")
	    .data(faceData.values)
	  	.enter().append("circle")
	    .attr("class", "facerect")
	    .attr("cx", function(d){
	    	// faceNum.push(d.num);
	    	return timeX(d.time)
	    })
	    .attr("cy", function(d,i){
	    	if(d.num>2){
			return faceY-(d.num*faceRadius/4);
	    		// return faceY+(d.num*faceRadius)*2;
	    	} else{ return 0 }
	    })
	    .attr("r", function(d,i){
	    	if(d.num>2){
		    	return (d.num*faceRadius)*1.5;
	    	} else{ return 0 }
	    })
	    // .attr("width",2)
	    .attr("fill", lightColor)
	    .attr("opacity",.2)
		.attr("stroke","none");


	$("circle.facerect").tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				return "3 People Looking"
			}
	});

	maxFaces = d3.max(faceNum);

	timeSVG.append("g").append("image")
		.attr("class", "graphImage")
		.attr("id","face")
		.attr("x", leftMargin-iconW*2)
		.attr("y", faceY-iconW*1.5)
		.attr("width", iconW*3-10)
		.attr("height", iconW*3-10)
		.attr("xlink:href","assets/icons0/Faces.png")
		.attr("opacity",0)

	$("#face.graphImage").tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				return "Looking at the Screen"
			}
	});

	
	// d3.selectAll("#hands.graphImage").transition().attr("y",yBottom);
	// timeSVG.append("g").append("text")
	// 	.attr("class", "faceTitle")
	// 	.attr("x", leftMargin-3)
	// 	.attr("y", faceY)
	// 	.attr("text-anchor","end")
	// 	.attr("fill",seshCol)
	// 	.text("Faces at Screen");
	$(".faceTitle").hide();
}

function revealFaces(){

	$(".faceTitle").show();

	d3.selectAll(".faceLine")
	    .attr("x1", timeX(startTime))
	    .attr("x2", timeX(endTime))

	d3.selectAll(".pathLine")
		.transition()
	    .attr("x1", timeX(startTime))
	    .attr("x2", timeX(endTime))
	    .attr("opacity",1)
	    .attr("y1", faceY)
	    .attr("y2", faceY);

	d3.selectAll(".facerect")	
		.transition()
		.attr("fill", faceColor)
		.attr("x", function(d){
			return timeX(d.time);
		})
	d3.selectAll("circle.facerect")	
		.transition()
		.attr("fill", faceColor)
		.attr("cx", function(d){
			return timeX(d.time);
		})
}
function revealButton(){
	// timeX.range([leftMargin, w-rightMargin]);
	d3.selectAll(".button1").transition().attr("opacity",1).attr("y",butY)
	d3.selectAll(".button2").transition().attr("opacity",1).attr("y",butY)

	d3.selectAll(".button1L").transition().attr("y2",butLineY2)
	d3.selectAll(".button2L").transition().attr("y2",butLineY2)

}

function goIDE(ideData){
	ideData = ideData[0].values;
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
	// console.log(links)

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
	callOther(nodes, links)

	makeEdge(links,force.nodes(), force.links());
}

var circNode;
var drag;
var force2;
function callOther(nodes, links){
	var linkdist = w/10;

	var force2 = d3.layout.force()
	    .nodes(d3.values(nodes))
	    .links(links)
		    .size([forcewidth, forceheight-20])
	    .linkDistance(linkdist)
		    .charge(-100)
	    .on("tick", tick)
	    .start();

	var vis = svgMain //for the visualization
	    .append('svg:g')
	    .attr("class","movingNodes")
	    .attr("transform",
	      "translate("+ 0 + "," + 0 + ")");  

		drag = force2.drag() 
	    .on("dragstart", dragstart);   
	//new addition
	$("g.movingNodes").hide();


	path2 = vis.selectAll("path2")
	    .data(force2.links())
	    .enter().append("path")
	    .attr("class","link2") 
	    .attr("stroke", function(d,i){
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

	circNode = vis.selectAll("nodez")
	    .data(force2.nodes())
	    .enter().append("circle")
	    .attr("class",function(d){
	        return "nodez";
	    })  
    circNode
		.attr("r", 5)
	        .style("fill",  function(d, i) { 
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
		.on("dblclick", dblclick)
		.call(drag);
    function dblclick(d) {
        d3.select(this).classed("fixed", d.fixed = false);
    }
    function dragstart(d) {
        d3.select(this).classed("fixed", d.fixed = true);
    }
}
function tick() {
  path2
  .attr("d", linkArc);

  circNode
  .attr("transform", transform);
}
function transform(d) {
	var radius = 5;
  	d.x = Math.max(radius, Math.min(w - radius, d.x));
  	d.y = Math.max(radius, Math.min(h - radius, d.y));  
  	return "translate(" + d.x+ "," + d.y + ")";
}
function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
	return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}



function makeEdge(linkData, linkNodes, linkLinks){
	linkData = linkData;
	var linkNodes = linkNodes;
	var linkLinks = linkLinks;

	for(i=0; i<linkData.length; i++){
		linkData[i].parent = linkData[i].mod;
	}	

	var diameter = forcewidth;
	var radius = diameter / 2;
	var margin = 60;

	var linksSVG = svgT
		.append("g")
		.attr("class","buttonSVG")
		.attr("width",forcewidth)
		.attr("height",forceheight)  
		.style("border","1px solid white") 
		.attr("transform", "translate(" + (forcewidth) + "," + (0) + ")") //timeSVGH+topMargin-250

		// .attr("transform", "translate(" + (forcewidth) + "," + (timeSVGH+topMargin-250) + ")")

	d3.select(".buttonSVG").append("text")
		.attr("class","buttonCaption")
		.attr("x",0)
		.attr("y",15)
		// .attr("y",0) 
		.attr("text-anchor","middle")
		 .attr("transform", "translate(" + (w/2-12) + ", " + ((h/2)-radius-40-14) + ")")	
	 	.text("Links You Programmed")
		.attr("fill","#3d3d3c")
  // create plot area within svg image
    var plot = linksSVG.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + (w/2-(radius/2)+100) + ", " + ((h/2)-(radius/2)+36) + ")");
    function drawKey(){
		var kitColor3 = plot.append("g").attr("class","backlabels")
				.append("circle")
			    .attr("cx", forcewidth/3-6)
			    .attr("cy", forceheight-35)
			    .attr("r", 4)
			    .attr("fill","lightpink")
			    .attr("stroke","lightpink")
		var	kitNameColor3 = plot.append("g").attr("class","backlabels")
				.append("text")
			    .attr("x", forcewidth/3)
			    .attr("y", forceheight-33)
			    .text("Inputs")
			    .attr("font-size",8)

		var kitColor4 = plot.append("g").attr("class","backlabels")
				.append("circle")
			    .attr("cx", forcewidth/3-6)
			    .attr("cy", forceheight-20)
			    .attr("r", 4)
			    .attr("fill","#FF9800")
			    .attr("stroke","#FF9800")
		var	kitNameColor4 = plot.append("g").attr("class","backlabels")
				.append("text")
			    .attr("x", forcewidth/3)
			    .attr("y", forceheight-18)
			    .text("Outputs")
			    .attr("font-size",8)

		var kitColor5 = plot.append("g").attr("class","backlabels")
				.append("circle")
			    .attr("cx", forcewidth/3-6)
			    .attr("cy", forceheight-5)
			    .attr("r", 4)
			    .attr("fill","#C71549")
			    .attr("stroke","#C71549")
		var	kitNameColor5 = plot.append("g").attr("class","backlabels")
				.append("text")
			    .attr("x", forcewidth/3)
			    .attr("y", forceheight-3)
			    .text("Functions")
			    .attr("font-size",8)
	}

    // draw border around plot area
    plot.append("circle")
        .attr("class", "outline")
        .attr("fill","white")
        .attr("stroke", darkColor)
        .attr("stroke-width",.5)
        .attr("r", radius - margin+2);

    // // calculate node positions
    circleLayout(linkNodes);
 //    console.log("linkNodes")
	// console.log(linkNodes);
    // // draw edges first
    // drawLinks(graph.links);
    drawCurves(linkLinks);
    // console.log("linkLinks")
    // console.log(linkLinks)

    // draw nodes last
    drawNodes(linkNodes);

	function circleLayout(nodes) {
	    // sort nodes by group
	    nodes.sort(function(a, b) {
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

	function drawNodes(nodes) {
	    // used to assign nodes color by group
	    var color = d3.scale.category20();
		var radius = 5;
//new addition
// $("#plot").hide();

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
	        .attr("d", curve);
	}
    drawKey(); //should be in the right position

	var descripRect = descripSVG.append("rect")
		.attr("width",forcewidth)
		.attr("height",forceheight*1.5)
		.attr("class","descripRect")
		.attr("x",5)
		.attr("y",0)
		.attr("fill","none").attr("stroke","lightgrey")


	var clickLine = descripSVG.append("line")
		.attr("class","clickThis")
		.attr("x1",4)
		.attr("x2",forcewidth/2-forcewidth/8)
		.attr("y1",0)
		.attr("y2",forceheight-forceheight/4)
		.attr("stroke","grey");

	var clickLine2 = descripSVG.append("line")
		.attr("class","clickThis")
		.attr("x1",forcewidth)
		.attr("x2",forcewidth/2+forcewidth/8)
		.attr("y1",0)
		.attr("y2",forceheight-forceheight/4)
		.attr("stroke","grey");

	var clickRect = descripSVG.append("rect")
		.attr("class","clickThis")
		.attr("width",forcewidth/4)
		.attr("height",forceheight/4)
		.attr("x",forcewidth/2-forcewidth/8)
		.attr("y",forceheight-forceheight/4)
		.attr("fill","lightgray");

	var clickText = descripSVG.append("text")
		.attr("class","clickThis")
		.attr("x",forcewidth/2)
		.attr("y",forceheight-forceheight/8)
		.attr("fill","white")
		.attr("text-anchor","middle")
		.text("PROJECT SUMMARY");

	$(".clickThis").on("click", function(){
		showSummary();
		d3.selectAll(".clickThis").transition().attr("y2",0).remove()
		d3.selectAll(".clickThis").transition().attr("y",0).attr("height",0).remove()
		// $(".clickThis").hide();
	});
	// if(clickedSummary ==true){
	// 	$(".clickThis").hide();
	// }
}
function showSummary(){
	var moreOrLessHands;
	if(sessionHandProx> allProxMax){
		moreOrLessHands = "more";
	} else{
		moreOrLessHands = "less";
	}
	var moreOrLessFace;
	if(sessionFaceProx> allFaceProx){
		moreOrLessFace= "more";
	} else{
		moreOrLessFace = "less";
	}
	var descriptionCaption = descripSVG.append("text")
		.attr("id","description")
		.attr("class","descripCapt")
		descriptionCaption
	      .attr("x", forcewidth/4)
	      .attr("y", thisH/4)
	      .attr("font-size",12)
	      .attr("dy", "4.5em")
	      .attr("opacity",1)
	      .text("In this session, the PELARS system observed that you used the following hardware elements: "+uniqueHards+" and the following software elements: "+uniqueSofts+" . The difference in usage of these elements - that is, the items you used in only software, were "+diffSoftHard+ ". You pressed the lightbulb button a total of "+button1.length+" times"+" and pressed the stormcloud a total of "+button2.length+" times. In the system's observation of your hand movements, we noticed that your group's hands were "+moreOrLessHands+" usual proximity to one another. Your group's faces were "+moreOrLessFace+" close to one another. See below for further statistics on these averages.")
          .call(wrap2, forcewidth-40);
}

	function wrap2(text, width) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 1.5, // ems
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan").attr("x", 30).attr("y", y).attr("dy", dy + "em");
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan").attr("x", 30).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	      }
	    }
	  });
	}
var maxActiveOverall;
var maxActive1, maxActive2, maxActive3;
var pathActive1, lineActive1, pathActive2, lineActive2, pathActive3, lineActive3, pathActive0, lineActive0;
var gok;
function goHands(handData, summaryHands){
	var numPanels = handData.values.length;

	gok = timeSVG.selectAll(".hand")
		.data(handData.values.sort(d3.ascending))
		.enter()
	  	.append("g")
	  	.attr("transform",function(d,i) {
	  		handColor.domain([d.key])
	  		theseTotals.push(d.values.length);
			theseTotals.sort(d3.descending); 			
	  		// return "translate("+(cwidth*i)+",0)";
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
	  	});

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
	var interval = 160;
	// var interval = 500;
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
	for(i=0; i<cumu3.length; i++){
		if(i>interval){
			softS3.push((cumu3[i]-cumu3[i-interval])/(activeThree[i].thisTime-activeThree[i-interval].thisTime))
		}
	}
	console.log(softS3.length+"softspeedlength3")
	console.log(activeThree.length+"activelength3")

	}else{console.log("nothree")}

	if(softS1.length>0){
		maxActive1 = d3.max(softS1)//d3.max(justSpeed);//d3.max(justDelta);	
	}
	if(softS2.length>0){
		maxActive2 = d3.max(softS2)//d3.max(justSpeed);//d3.max(justDelta);	
	}
	if(softS3.length>0){
		maxActive3 = d3.max(softS3)//d3.max(justSpeed);//d3.max(justDelta);
	}
	// console.log(maxActive1+"maxactive1"+maxActive2);

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

//should the max just be represented as the max value for Y?
	var BigMax = overallVals.hand_speed.mean;

  	yActivePath = d3.scale.linear() 
		.domain([0,maxActiveOverall])
		.range([yBottom, yTop]); 

 	xActivePath = d3.scale.linear() 
		.domain([startTime, endTime])
		.range([leftMargin, w-rightMargin]);

	lineActiveZip = d3.svg.line()
		.x(function(d, i) { return leftMargin })
		.y(function(d, i) { return yActivePath(d) })
		.interpolate("bundle")

  	lineActive1 = d3.svg.line()
		.x(function(d, i) { return xActivePath(activeOne[i].thisTime); })
		.y(function(d, i) { return yActivePath(d); })
		.interpolate("bundle")
 	pathActive1 = timeSVG.append("g")
	    .append("path")
	    .attr("class","activepath1")
	    .attr("fill","none")
	    .attr("stroke",lightColor)
	    .attr("stroke-dasharray",1)
	    .attr("stroke-width",2);
  	pathActive1
  		.datum(softS1)
  		.attr("d", lineActive1);
	// draw the scatterplot
	// timeSVG.selectAll("dot")									
	// 	.data(softS1)											
	// .enter().append("circle")								
	// 	.attr("r", 3)	
	// 	.attr("cx", function(d,i) { return xActivePath(activeOne[i].thisTime); })	 
	// 	.attr("cy", function(d) { return yActivePath(d); })
	// Tooltip stuff after this
	  //   .on("mouseover", function(d) {		
   //          div.transition()
			// 	.duration(500)	
			// 	.style("opacity", 0);
			// div.transition()
			// 	.duration(200)	
			// 	.style("opacity", .9);	
			// div	.html(
			// 	'<a href= "http://google.com">' + // The first <a> tag
			// 	formatTime(d.date) +
			// 	"</a>" +                          // closing </a> tag
			// 	"<br/>"  + d.close)	 
			// 	.style("left", (d3.event.pageX) + "px")			 
			// 	.style("top", (d3.event.pageY - 28) + "px");
			// });





  	lineActive2 = d3.svg.line()
		.x(function(d, i) { return xActivePath(activeTwo[i].thisTime); })
		.y(function(d, i) { return yActivePath(d); })
		.interpolate("bundle");
	pathActive2 = timeSVG.append("g")
		.append("path")
		.attr("class","activepath2")
		.attr("fill","none")
		.attr("stroke",lightColor)
		.attr("stroke-dasharray",2)
		.attr("stroke-width",2);
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
	    .attr("stroke",lightColor)
	    .attr("stroke-width",2)
  	pathActive3
  		.datum(softS3)
  		.attr("d", lineActive3);

	timeSVG.append("g").append("image")
		.attr("class", "graphImage")
		.attr("id","hands")
		.attr("x", leftMargin-iconW*2)
		.attr("y", yBottom-iconW*2)
		.attr("width", iconW*2)
		.attr("height", iconW*2)
		.attr("xlink:href","assets/icons0/Hands.png")
		.attr("opacity",0);
	$("#hands.graphImage").tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				return "How Quickly Your Hands Move"
			}
	});
	// timeSVG.append("g").append("text")
	// 	.attr("class", "graphTitle")
	// 	.attr("x", leftMargin-3)
	// 	.attr("y", yTop)
	// 	.attr("text-anchor","end")
	// 	.attr("fill",seshCol)
	// 	.text("Hands Speed");
	timeSVG.append("g").append("circle")
		.attr("class", "graphImage")
		.attr("cx", leftMargin)
		.attr("cy", yBottom)
		.attr("r", 3)
		.attr("fill", seshCol)
		.attr("opacity",0);

	timeSVG.append("g").append("line")
		.attr("class", "graphImage")
		.attr("x1", leftMargin)
		.attr("x2", leftMargin)
		.attr("y1", yBottom)
		.attr("y2", yTop)
		.attr("stroke-width",1)
		.attr("stroke", "black")
		.attr("opacity",0);

	timeSVG.append("g").append("line")
		.attr("class", "faceLine")
	    .attr("x1", timeX(startTime))
	    .attr("x2", timeX(endTime))
	    .attr("y1", yBottom)
	    .attr("y2", yBottom)
	    .attr("fill", "none")
		.attr("stroke","grey")
		.attr("stroke-dasharray",1);
	// $("text.graphTitle").hide()
	// $("line.graphLine").hide()


	// var miniCirc1 = timeSVG.selectAll(".minC1")
	// 	.data(one)
	// 	.enter()
	// 	.append("circle")
	// 	.attr("class","minC1")
	// 	.attr("cx", function(d){
	// 		return w/2+d.rx;
	// 	})
	// 	.attr("cy", function(d){
	// 		return h/2+d.ry;
	// 	})
	// 	.attr("r", 3)
	// 	.attr("fill","pink");
}


function hideHands(){
	$("text.graphTitle").hide()
	$("line.graphLine").hide()

  	pathActive1 //.datum(softS1).
  		.transition().duration(durTrans)  
  		.attr("d", lineActiveZip)
  		.attr("stroke",lightColor);		

  	pathActive2
  		.datum(softS2).transition().duration(durTrans)  		
  		.attr("d", lineActiveZip)
  		.attr("stroke",lightColor);	
  	pathActive3
  		.datum(softS3).transition().duration(durTrans)  		
  		.attr("d", lineActiveZip)
  		.attr("stroke",lightColor);	
}
function showingHands(){
	$("text.graphTitle").show()
	$("line.graphLine").show()
var durTrans = 100;
	if(pathActive1)
  	pathActive1 //.datum(softS1).
  		// .transition().duration(durTrans)  
  		.attr("stroke",darkColor)		
  		// .attr("d", lineActive1);
	if(pathActive2)
  	pathActive2
  		// .datum(softS2).transition().duration(durTrans)  		
  		.attr("stroke",darkColor)		
  		// .attr("d", lineActive2);
	if(pathActive3)
  	pathActive3
  		// .datum(softS3).transition().duration(durTrans)  		
   		.attr("stroke",darkColor)		
  		// .attr("d", lineActive3);
}
function showingPhotos(){
	timeX
		.range([leftMargin, w-rightMargin]);
	overview
		.transition()
		.attr("x", function(d,i){
			return (timeX(d.time)-timelineImgWidth/4); 
		})	
}
// function showingFace(){
// 	timeX
// 		.range([leftMargin, w-rightMargin]);
// 	rectFace
// 		.transition()
// 		.attr("fill", faceColor)
// 		.attr("x", function(d,i){
// 			return timeX(d.time); 
// 		})		
// }

var yHPath, ySPath, minTotal, maxTotal, pathS, pathH, index, lineS, lineH, svgPath;
var ardRectSVG, ardPathSVG;
var arduinoRectangles;
var newSoft = [];
var newHard = [];
function showIDE(){

	// timeX2.domain([startTime, endTime]).range([forcewidth/4, forcewidth]);
	// timeX2
	// 	.domain([startTime, endTime])
	// 	.range([0,0]);
	// var timeXTrue = d3.scale.linear()
	// 	.domain([startTime, endTime])
	// 	.range([leftMargin, w-rightMargin]);

	ardRectSVG = svgMain.append("g")
        .attr("id", "arduinoRect")
        .attr("transform", "translate(" + (0) + ", " + (lineHY+3) + ")"); //yAxisBottom-forceheight+42

    console.log(startTime);
    console.log(endTime);

	ardPathSVG = svgMain.append("g")
        .attr("id", "arduinoPath")
        .attr("transform", "translate(" + (0) + ", " + (0) + ")");
//new addition
$("g#arduinoPath").hide();
$("g#arduinoRect").hide();

	var thisMax;
	// var pathHeight = lineHY - belowIcons;
	var maxLength = 32; //FIX THIS
	var possibleY = d3.scale.linear()
		.domain([0, maxLength])
		.range([0, lineHY]);

	arduinoRectangles = ardRectSVG.selectAll(".ide")
		.data(ide_nest2)
		.enter()
	  	.append("g")
	  	.attr("class","ide");
	arduinoRectangles.selectAll(".logs")
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
				thisMax = possibleY(bothHS.length);
				// console.log(thisMax+"THISMAX"+bothHS.length);
				yOther
					.domain(bothHS)
				    .rangePoints([topMarg, thisMax]); //lineHY
			}
			return d.name;
		})
		.attr("id","ardRectz")
		.attr("x", function(d){
			if(d.mod=="M" || d.mod=="B"){
				// return timeX2(d.time)
				return timeXTrue(d.time)
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
						return timeXTrue(d.end)-timeXTrue(d.time);
					}else{
						return timeXTrue(endTime)-timeXTrue(d.time);				
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

	var iconKeyX = leftMargin-53;
	var wordKeyX = leftMargin-28;
    var iconsHS;
    iconsHS = ardRectSVG.selectAll(".iconsHS")
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
           .attr("x", leftMargin-53)

	ardRectSVG.selectAll(".timeText")
		.data(bothHS)
		.enter()
		.append("text")
		.attr("class","timeText")
		.attr("x", leftMargin-28) //iconLMarg
        .attr("y", function(d, i) {
            return yOther(d)+5;
        })
		.attr("fill", darkColor)
		.text(function(d){
			return d;
		})
		.attr("font-size",8)
		.attr("text-anchor","start");

	arduinoRectangles.selectAll(".logCC")
		.data(function(d) {
			return d.values;				
		}) 
		.enter()
		.append("line")
		.attr("class","logCC")
		.attr("x1", function(d){
			if(d.mod=="C"){
				return timeXTrue(d.time)			
			} else{ }
		})
		.attr("x2", function(d){
			if(d.mod=="C"){
				return timeXTrue(d.time)			
			} else{ }		
		})
	    .attr("y1", topMarg) //check
	    .attr("y2", thisMax)  //check w photo
	    .attr("fill","none")
	    .attr("stroke",function(d){
			if(d.mod=="C"){
				return "lightgray"			
			} else{ return "none" }	    	
	    })
	    .attr("stroke-dasharray",2)
	    .attr("opacity", function(d){
	    	if(d.mod=="C"){
				return 1			
			} else{ return 0 }	    	
	    })
	$('.logCC').tipsy({ 
			gravity: 'sw', 
			html: true, 
			title: function() {
				return "Software Manipulation";
			}
	});




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

	softwareOnly.sort(function(x, y){
	   return d3.ascending(x.time, y.time);
	})
	uniqueSWOnly = 
	_.uniq(softwareOnly, function(sware) { return sware.timeEdit; })
	console.log(uniqueSWOnly.length+"in sw unique")
	console.log(uniqueHWOnly.length+"in hw unique")

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
    console.log("hardware in use"+uniqueHards);
    console.log("software in use"+uniqueSofts);
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

	softUseComp = cleanArray(softUseComp)
	newSoft = d3.nest()
		.key(function(d) { 
			return d.time; 
		})
		.sortKeys(d3.ascending)
		.entries(softUseComp); 
	// console.log(newSof/t+"newsoft")
	newHard = d3.nest()
		.key(function(d) { 
			return d.time; 
		})
		.sortKeys(d3.ascending)
		.entries(hardUseComp); 
	// console.log(newSoft+"newsoft")

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
	console.log(bothLength+"bothlength");
	console.log(maxHeight+"real max height")
	// xPath = d3.scale.linear()
	//       .domain([startTime,endTime])
	//       .range([leftMargin, w-rightMargin]);
	// var xPath0 = d3.scale.linear()
	//       .domain([startTime,endTime]).range([0, 0]);

	timeSVG.append("g").append("line")
		.attr("class", "pathLine")
	    .attr("x1", timeX(startTime))
	    .attr("x2", timeX(endTime))
	    .attr("y1", belowIcons+timelineImgWidth)
	    .attr("y2", belowIcons+timelineImgWidth)
	    .attr("fill", "none")
		.attr("stroke","grey")
		.attr("stroke-dasharray",1)
		.attr("opacity",0)
//PATHS
	yHPath = d3.scale.linear()
	      .domain([0,maxHeight+1]) //max hardware components
	      // .range([forceheight, 0]); //height of the little rectangles area
	      .range([lineHY, belowIcons+timelineImgWidth]);
	ySPath = d3.scale.linear()
	      .domain([0,maxHeight+1]) //max software components
	      .range([lineHY, belowIcons+timelineImgWidth]);

	lineH = d3.svg.area()
		.x(function(d, i) { 
			if(d==undefined){ console.log("no") }
				else{
		       	return timeXTrue(parseInt(d.key));      			
				}
		})
		.y0(lineHY)
		.y1(function(d, i) { 
			if(d==undefined){return 0;}
			if(d.total<0){ return 0}
				else{
					return yHPath(d.values[0].total); 
				}
		})
		.interpolate("linear");

	lineS = d3.svg.area()
		.x(function(d, i) { 
			if(d==undefined){ console.log("no") }
				else{
		       	return timeXTrue(parseInt(d.key));      			
				}
		})
		.y0(lineHY)
		.y1(function(d, i) { 
			if(d==undefined){return 0;}
			if(d.total<0){ return 0}
				else{
					return ySPath(d.values[0].total); 
				}
		})
		.interpolate("linear");

	var opacityPath = .5;
	pathH = ardPathSVG.append("g")
		.append("path")
		.attr("class","timepathH")
		.attr("fill",hardwareColor)
		.attr("opacity",opacityPath)
		.attr("stroke",hardwareColor);
	pathH
		.datum(newHard)
    	.attr("class","timepathH")
		.attr("d", lineH);

	pathS = ardPathSVG.append("g")
		.append("path")
		.attr("class","timepathS")
		.attr("fill",softwareColor)
		.attr("opacity",opacityPath)
		.attr("stroke",softwareColor);
	pathS
		.datum(newSoft) //softUseComp
    	.attr("class","timepathS")
		.attr("d", lineS);



	var iconKeyX = leftMargin-53;
	var wordKeyX = leftMargin-28;
	var hardwareKeyX = wordKeyX;//leftMargin-radiusKey*2;
	var softwareKeyX = hardwareKeyX;
	var circKeyX = iconKeyX+radiusKey*2;
	var hardwareKeyY = lineHY-radiusKey*4;//-33;//lineHY; 	    //.rangePoints([topMarg, forceheight]);
	var softwareKeyY = hardwareKeyY+(radiusKey*4); //lineHY

	var kitColor = ardPathSVG.append("g").attr("class","kitlabels")
		.append("circle").attr("class","hardware")
	    .attr("cx", circKeyX)
	    .attr("cy", hardwareKeyY-radiusKey)
	    .attr("r", radiusKey)
	    .attr("fill",hardwareColor)
	    .attr("stroke",hardwareColor)
	var	kitNameColor = ardPathSVG.append("g").attr("class","kitlabels")
		.append("text").attr("class","hardware")
	    .attr("x",hardwareKeyX)
	    .attr("y", hardwareKeyY)
	    .text("HW")
	    .attr("text-anchor","start")
	var kitColor2 = ardPathSVG.append("g").attr("class","kitlabels")
		.append("circle").attr("class","software")
	    .attr("cx", circKeyX)
	    .attr("cy", softwareKeyY-radiusKey)
	    .attr("r", radiusKey)
	    .attr("fill",softwareColor)
	    .attr("stroke",softwareColor)
	var	kitNameColor2 = ardPathSVG.append("g").attr("class","kitlabels")
		.append("text").attr("class","software")
	    .attr("x", softwareKeyX)
	    .attr("y", softwareKeyY)
	    .text("SW")
	    .attr("text-anchor","start")
	d3.selectAll(".kitlabels").attr("opacity",0)

	$('circle.hardware').tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				return "Hardware Activity";
			}
	});
	$('circle.software').tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				return "Programming Activity";
			}
	});

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

	// linksNames = Object.keys(nodes);
	// for (j = 0; j < linksNames.length; j++) {
	//     totalLinks[j] = ({
	//     		"totalFrom": linkTotalFrom(linksNames[j]),
	//     		"totalTo": linkTotalTo(linksNames[j]),
	//     		"linkName": linksNames[j]
	//     	})
	// }
	// function linkTotalFrom(name) {
	//     var total = 0;
	//     for (i = 0; i < links.length; i++) {
	//         if (links[i].source.name == name) {
	//             total++;
	//         } else {}
	//     }
	//     return total;
	// }
	// function linkTotalTo(name) {
	//     var total = 0;
	//     for (i = 0; i < links.length; i++) {
	//         if (links[i].target.name == name) {
	//             total++;
	//         } else {}
	//     }
	//     return total;
	// }
 //        console.log("total links made to and from")
 //        console.log(totalLinks)
}

////trying to get button to show nicely
function showPhases(phasesJSON){
	parseButton(firstData);
	console.log(phasesJSON.length+"phasesJSON length");

	console.log(phasesJSON)
	phaseData = phasesJSON;
	var phaseNum = 0;
	for(i=1; i<phaseData.length; i++){ //change this
		if(phaseData[i].phase!=phaseData[i-1].phase){
			if(phaseData[i].phase=="obs_rate" || phaseData[i].phase=="setup"){}
				else{
					phaseNum+=1;
					obs[phaseNum]=({
						"num":phaseNum,
						"phase": phaseData[i].phase,
						"start": phaseData[i].start,
						"end": phaseData[i].end
					})
					if(phaseData[i].phase=="obs_plan"){
						obsPlan.push(phaseData[i])
					}
					if(phaseData[i].phase=="obs_document"){
						obsDoc.push(phaseData[i])
					}
					if(phaseData[i].phase=="obs_reflect"){
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

	// var translateX = radius+margin;
	// var transl
	var netSVG = svgT
		.append("g")
		.attr("class","piePhase")
		.attr("width",forcewidth)
		.attr("height",forceheight)  
		.append("g")
		.style("border","1px solid white") 
		.style("margin-top","1px")
		.attr("transform", "translate(" + (radius+margin) + "," + (timeSVGH+radius+topMargin-100-147) + ")")
		// .attr("transform", "translate(" + radius+margin + "," + (timeSVGH+radius+topMargin) + ")")
	d3.select(".piePhase").append("text")
		.attr("class","pieCaption")
		.attr("x",0)
		.attr("y",0).attr("transform", "translate(" + (w/6) + ", " + ((h/4+80-149)) + ")")	
		.attr("text-anchor","middle")
	 	.text("How Long You Spent in Phases")
		.attr("fill","#3d3d3c")
		//new addition
// $("g.piePhase").hide()
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
	    		return "-.5em"
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
	    		return "Build"
	    	}
	    	if(i==2){
	    		return "Reflect"
	    	}
	    })
	    .attr("fill", function(d, i) { return color[i]; })

	obs = cleanArray(obs)
	var bottomHere = lineHY/1.5;
	console.log(obs);
	//draw a rectangle for each key
	var rectPhase = timeSVG.selectAll(".phase")
		.data(obs)
		.enter()
	  	.append("rect")
	  	.attr("class","phase")
		.attr("x", function(d){
			return timeX(d.start);
		})
		.attr("y",0)
		.attr("width",function(d,i){
			return timeX(d.end)-timeX(d.start);
		})
		.attr("height",bottomHere)//-2*cmargin)
		.attr("fill",function(d,i){
			if(d.num%2==0){
				return "none"
			} else{
				return "lightgray";
			}
		})
		.attr("opacity",0)
		.attr("stroke","grey")

	var textPhase = timeSVG.selectAll(".phaseText")
		.data(obs)
		.enter()
	  	.append("text")
	  	.attr("class","phaseText")
		.attr("x",function(d,i){
			var currentX = timeX(d.start)+(timeX(d.end)-timeX(d.start))/2;
			return currentX;	
		})
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
			if(d.phase=="obs_reflect"){
				return "REFLECT"
			}
			if(d.phase=="obs_document"){
				return "BUILD"
			}
			if(d.phase=="obs_plan"){
				return "PLAN"
			}
		})
		.attr("text-anchor","middle");
	//new addition
	$(".phaseText").hide();
}
function revealPhases(){
	var phaseY = smallY + smallHeight*2;
	timeX
		.range([leftMargin, w-rightMargin]);
	d3.selectAll(".phase")
		.transition()
		.attr("y", phaseY)
		.attr("height", yAxisBottom-phaseY)
		.attr("opacity",.2)

	d3.selectAll(".phaseText")
		.transition()
		.attr("y", phaseY);
	$(".phaseText").show();	
}

function overallStats(){

	console.log(seshSpeedMean+"stats"+seshSpeedMean/allSpeedMean)
		var impexbar = hovRectWidth;

		var proxScale = d3.scale.linear()
			.domain([0, allProxMax]) //fix this later and make it the real nice max
			.range([0, impexbar]);
		var allProxX = proxScale(allProxMean); 
		var seshProxX = proxScale(seshProxMean);
		hoverbox.select("rect.total2").attr("width", impexbar);
		hoverbox.select("rect.imports2").attr("x",seshProxX);
		hoverbox.select("rect.exports2").attr("x",allProxX);

		var speedScale = d3.scale.linear()
			.domain([0, allSpeedMax]) //fix this later and make it the real nice max
			.range([0, impexbar]);
		var allSpeedX = speedScale(allSpeedMean);
		var seshSpeedX = speedScale(seshSpeedMean);
		hoverbox.select("rect.total").attr("width", impexbar);
		hoverbox.select("rect.imports").attr("x",seshSpeedX);
		hoverbox.select("rect.exports").attr("x",allSpeedX);

		var totalLabelY = 20;		
		hoverbox.select("text.title")
			.attr("y", totalLabelY)
			.text(whichType);

		hoverbox.classed("hidden", false);
}
var statsR;
var seshCol = "red";
function showStats(){
var rectW = smallWidth;
// var leftThird = rectWidth;//center-(rectWidth/2);
// var rightThird = w-rectWidth*2; //center+(rectWidth/2);

	var statsNames = [];
	statsNames.push("Hands Speed","Hands Proximity", "Faces Proximity","Present at Table","Looking at Screen");	
	var stRectScale = d3.scale.ordinal()
		.domain(statsNames)
		.rangePoints([center-rectWidth, center+rectWidth])

	statsR = svgT.append("g").selectAll(".statsRects")
		.data(statsNames)
		.enter()
		.append("g")
		.attr("class", "statsRects") 
      	.attr("transform", function(d, i) { 
      		// console.log(d);
      		var x = stRectScale(d); //-leftMargin; //-rectWidth/2
			var y = belowIcons-100;//yAxisBottom+70; //specialHeight+specialHeight/2+4; //-topMargin/2;
      		return "translate(" + x + "," + y + ")"; 
      	});

    var origStroke = 2;
  	var statsRects = statsR.append("rect")
		.attr("id","statsRectangle")
		.attr("class",function(d,i){
			return i;
		})
		.attr("width", rectW)
		.attr("height", rectHeight/4)
		.attr("fill","none")
		.attr("stroke","none")  
		// .attr("stroke-width",1);

	// var statsName = statsR.append("text")
	// 	.attr("id","statsName")
	// 	.attr("class",function(d,i){
	// 		return "statsName"+i;
	// 	})
	//       .attr("y", 15)
	//       .attr("dy", ".35em")
	//       .text(function(d) { return d })
	//       .attr("x", function(d,i){
	//       	var adjust = $(".statsName"+i).width();
	//       	return 0;
	//       });	
	var statsName = statsR.append("text")
		.attr("id","statsName")
		.attr("class",function(d,i){
			return "statsName"+i;
		})
	      .attr("y", 15)
	      .attr("dy", ".35em")
			.attr("text-anchor","middle")
	      .attr("x", smallWidth/2)
	      .text(function(d) { return d })
	      // 	function(d,i){
	      // 	var adjust = $(".statsName"+i).width();
	      // 	return rectW/2-adjust/2;
	      // });	



	var statsX = d3.scale.linear()
		.range([10, rectW-20])

	var totY = 24;
	var totH = rectHeight/8;
	var statsTotal = statsR.append("rect")
		.attr("class","full")
		.attr("x", 10).attr("y",totY)
		.attr("width",rectW-20)
		.attr("height",totH)
		.attr("fill","none")
		.attr("stroke",darkColor);
	var statWidth = 5;
	var compOpa = .7;
	var seshStatRect = statsR.append("rect")
		.attr("class","session")
		.attr("x", function(d,i){
			if(d=="Hands Speed"){
				statsX.domain([0, allSpeedMax]);
				return statsX(sessionHandSpeed);
			}
			if(d=="Hands Proximity"){
				statsX.domain([0, allProxMax]);
				return statsX(sessionHandProx);
			}
			if(d=="Faces Proximity"){
				statsX.domain([0, allFaceMax]);
				return statsX(sessionFaceProx); 
			}
			if(d=="Present at Table"){
				statsX.domain([0, 100]); 
				return statsX(sessionPresence); 
			}
			if(d=="Looking at Screen"){
				statsX.domain([0, 100]); 
				return statsX(sessionScreen); 
			}
		})
		.attr("y", totY)
		.attr("height",totH)
		.attr("width",statWidth)
		.attr("fill", seshCol)
		.attr("opacity", compOpa);

	// var allCol = darkColor;
	var allStatRect = statsR.append("line")
		.attr("class", "mean")
		.attr("x1", function(d,i){
			if(d=="Hands Speed"){
				statsX.domain([0, allSpeedMax]);
				return statsX(allSpeedMean); 
			}
			if(d=="Hands Proximity"){
				statsX.domain([0, allProxMax]);
				return statsX(allProxMean);
			}
			if(d=="Faces Proximity"){
				statsX.domain([0, allFaceMax]);
				return statsX(allFaceProx); 
			}
			if(d=="Present at Table"){
				statsX.domain([0, 100]); 
				return statsX(allPresence); 
			}
			if(d=="Looking at Screen"){
				statsX.domain([0, 100]); 
				return statsX(allScreen); 
			}
		})
		.attr("x2", function(d,i){
			if(d=="Hands Speed"){
				statsX.domain([0, allSpeedMax]);
				return statsX(allSpeedMean); 
			}
			if(d=="Hands Proximity"){
				statsX.domain([0, allProxMax]);
				return statsX(allProxMean);
			}
			if(d=="Faces Proximity"){
				statsX.domain([0, allFaceMax]);
				return statsX(allFaceProx); 
			}
			if(d=="Present at Table"){
				statsX.domain([0, 100]); 
				return statsX(allPresence); 
			}
			if(d=="Looking at Screen"){
				statsX.domain([0, 100]); 
				return statsX(allScreen); 
			}
		})
		.attr("y1", totY)
		.attr("y2",totY+totH)
		.attr("stroke",darkColor)
		.attr("stroke-width",statWidth)
		.attr("opacity", compOpa/2);

	var allStatRect2 = statsR.append("line")
		.attr("class", "min")
		.attr("x1", function(d,i){
			if(d=="Hands Speed"){
				statsX.domain([0, allSpeedMax]);
				return statsX(allSpeedMin); 
			}
			if(d=="Hands Proximity"){
				statsX.domain([0, allProxMax]);
				return statsX(allProxMin);
			}
			if(d=="Faces Proximity"){
				statsX.domain([0, allFaceMax]);
				return statsX(allFaceMin); 
			}
			if(d=="Present at Table"){
				statsX.domain([0, 100]); 
				return statsX(allPresenceMin); 
			}
			if(d=="Looking at Screen"){
				statsX.domain([0, 100]); 
				return statsX(allScreenMin); 
			}
		})
		.attr("x2", function(d,i){
			if(d=="Hands Speed"){
				statsX.domain([0, allSpeedMax]);
				return statsX(allSpeedMin); 
			}
			if(d=="Hands Proximity"){
				statsX.domain([0, allProxMax]);
				return statsX(allProxMin);
			}
			if(d=="Faces Proximity"){
				statsX.domain([0, allFaceMax]);
				return statsX(allFaceMin); 
			}
			if(d=="Present at Table"){
				statsX.domain([0, 100]); 
				return statsX(allPresenceMin); 
			}
			if(d=="Looking at Screen"){
				statsX.domain([0, 100]); 
				return statsX(allScreenMin); 
			}
		})
		.attr("y1", totY)
		.attr("y2",totY+totH)
		.attr("stroke",darkColor)
		.attr("stroke-width",statWidth)
		.attr("stroke-dasharray", 1)
		.attr("opacity", compOpa/2);

	var allStatRect3 = statsR.append("line")
		.attr("class", "max")
		.attr("x1", function(d,i){
			if(d=="Hands Speed"){
				statsX.domain([0, allSpeedMax]);
				return statsX(allSpeedMax); 
			}
			if(d=="Hands Proximity"){
				statsX.domain([0, allProxMax]);
				return statsX(allProxMax);
			}
			if(d=="Faces Proximity"){
				statsX.domain([0, allFaceMax]);
				return statsX(allFaceMax); 
			}
			if(d=="Present at Table"){
				statsX.domain([0, 100]); 
				return statsX(allPresenceMax); 
			}
			if(d=="Looking at Screen"){
				statsX.domain([0, 100]); 
				return statsX(allScreenMax); 
			}
		})
		.attr("x2", function(d,i){
			if(d=="Hands Speed"){
				statsX.domain([0, allSpeedMax]);
				return statsX(allSpeedMax); 
			}
			if(d=="Hands Proximity"){
				statsX.domain([0, allProxMax]);
				return statsX(allProxMax);
			}
			if(d=="Faces Proximity"){
				statsX.domain([0, allFaceMax]);
				return statsX(allFaceMax); 
			}
			if(d=="Present at Table"){
				statsX.domain([0, 100]); 
				return statsX(allPresenceMax); 
			}
			if(d=="Looking at Screen"){
				statsX.domain([0, 100]); 
				return statsX(allScreenMax); 
			}
		})
		.attr("y1", totY)
		.attr("y2",totY+totH)
		.attr("stroke",darkColor)
		.attr("stroke-width",statWidth)
		.attr("stroke-dasharray", 1)
		.attr("opacity", compOpa/2);


	$('.mean').tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				return "Avg. Over All Sessions";
			}
	});

	$('.min').tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				return "Min. Over All Sessions";
			}
	});

	$('.max').tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				return "Max. Over All Sessions";
			}
	});
	$('.session').tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				return "Avg. This Session";
			}
	});

//new addition
$("g.statsRects").hide()
}






function activateHoverbox(whichType){
//not online
	// d3.json("data/content.json", function(json){
	// 	overallVals = json;
	// })
	// d3.json("data/handSpeed.json", function(json){
	// 	sessionHandSpeed = json;
	// })
	// d3.json("data/handProximity.json", function(json){
	// 	sessionHandProx = json;
	// })
	// console.log(overallVals+"overall summary")	

	if(whichType=="Hands"){
		console.log(seshSpeedMean+"stats"+seshSpeedMean/allSpeedMean)


		//Type is "port" or "path"

		// console.log(d+"d");
		// console.log(type+"type");
		//Special handling for ports
		// if (type == "port") {

		// 	var xy = proj([d.lon, d.lat]);
		// 	hoverbox.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");

		// 	hoverbox.select(".title").text("Port: "+d.port);

		// 	var hoverBoxScaleMax = hoverBoxPortScaleMax;
		
		// }
		// //Special handling for paths
		// else {
		// 	var xy = d3.mouse(svg.node());
		// 	hoverbox.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");

		// 	hoverbox.select(".title").text("Route: "+d.USPt + " ↔ " + d.FgnPort);

		// 	var hoverBoxScaleMax = hoverBoxPathScaleMax;
		// }

		//Calculate relative proportions for the import/export rects
		// var totalWidth = hoverboxMinWidth - 20;

	////////////////////////////////////////////////////
		var impexbar = hovRectWidth;

		var proxScale = d3.scale.linear()
			.domain([0, allProxMax]) //fix this later and make it the real nice max
			.range([0, impexbar]);
		var allProxX = proxScale(allProxMean); 
		var seshProxX = proxScale(seshProxMean);
		hoverbox.select("rect.total2").attr("width", impexbar);
		hoverbox.select("rect.imports2").attr("x", seshProxX);
		hoverbox.select("rect.exports2").attr("x", allProxX);

		var speedScale = d3.scale.linear()
			.domain([0, allSpeedMax]) //fix this later and make it the real nice max
			.range([0, impexbar]);
		var allSpeedX = speedScale(allSpeedMean);
		var seshSpeedX = speedScale(seshSpeedMean);
		hoverbox.select("rect.total").attr("width", impexbar);
		hoverbox.select("rect.imports").attr("x",seshSpeedX);
		hoverbox.select("rect.exports").attr("x",allSpeedX);


		// var exportsText = "Exports: ";
		// var exportsPerc = makePercentage(d.ExportMetTons, d.MetricTons);
		// var importsLabelWidth = hoverbox.select("text.imports").node().getBBox().width;
		// var exportsLabelWidth = hoverbox.select("text.exports").node().getBBox().width;
			// exportsText += exportsPerc+"%";

		// if (exportsPerc<10){
		// 	var exIs = totalWidth-70;
		// }
		// else {
		// 	var exIs = totalWidth-80;
		// }
		// var exportsLabelX = exIs;
		// var exportsLabelY = 85;


			/////////////////////////////////////////////
		var imIs = 	10;
		var importsLabelX = imIs;
		var importsLabelY = 80;//exportsLabelY;
		var importsText = "Speed: ";
			function makePercentage(number1, number2){
				return Math.floor((number1 / number2) * 100);
			}
			// importsText += makePercentage(seshSpeedMean, allSpeedMean)+"%";
			/////////////////////////////////////////////
		var totalLabelX = imIs;
		var totalLabelY = 20;
		// var totalText = "Total: ";
		// totalText += seshSpeedMean+"cm";			

		// totalText += makeNormal(allSpeedMean)+"cm";			
			// function makeNormal(number){
			// 	return Math.round(newNum);
			// }
			// function makeNormal(number){
			// 	if (number>1000000){
			// 		var newNum = number/1000000;
			// 		return Math.round(newNum);
			// 	}
			// 	else {
			// 		var newNum = number/1000;
			// 		return Math.round(newNum);
			// 	}
			// }
			// if (d.MetricTons>1000000){
			// 	totalText += makeNormal(d.MetricTons)+"mil";
			// }
			// else {
			// 	totalText += makeNormal(d.MetricTons)+"k";			
			// }
			// }
			////////////////////////////////////////////



		// hoverbox.select("text.exports")
		// 	.attr("x", exportsLabelX)
		// 	.attr("y", exportsLabelY)
		// 	.text(exportsText);

		// hoverbox.select("text.imports")
		// 	.attr("x", importsLabelX)
		// 	.attr("y", importsLabelY)
		// 	.text(importsText);
			//////////////////
		// hoverbox.select("text.total")
		// 	.attr("x", totalLabelX)
		// 	.attr("y", totalLabelY)
		// 	.text(totalText);
			//////////////////
		hoverbox.select("text.title")
			.attr("y", totalLabelY)
			.text(whichType);

		hoverbox.classed("hidden", false);
	}
}


function hideHoverbox(){
	hoverbox.classed("hidden", true);
};



















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

function moveAllToFront(){
	d3.selectAll(".button1").each(moveToFront);
	d3.selectAll(".button2").each(moveToFront);
	d3.selectAll(".commentIcon").each(moveToFront); 
	d3.selectAll(".studCommentIcon").each(moveToFront);
	// d3.selectAll(".Icon").each(moveToFront);	
	d3.selectAll(".camIcon").each(moveToFront);
}
var moveToFront = function() { 
    this.parentNode.appendChild(this); 
}


