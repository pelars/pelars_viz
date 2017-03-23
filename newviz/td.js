// for vidIcon
revealDocu(){
	d3.select(".vidicon").attr("opacity",1)
}
//phase pie
$("g.piePhase").hide()

	var netSVG = behindSVG
	var linksSVG = behindSVG
d3.select(".behind").each(moveToFront)
// [Array[1]]


resNote = timeSVG.selectAll(".commentIcon")
studCommentDoc = timeSVG.selectAll(".studCommentIcon")
studImgDoc = timeSVG.selectAll(".camIcon")
var docImg = svgMain.selectAll(".clip-circ"+lIndex+"SD")
    .attr("id","clip-circ")


//for network node moving viz
var vis = svgMain //for the visualization
    .append('svg:g')
	path2 = vis.selectAll("path2")
	    .attr("class","link2") 
	circNode = vis.selectAll("nodez")
//for links non-moving viz
var plot = svgMain.append("g")
    .attr("id", "plot")
d3.select("#plot").selectAll(".link")





//for a radial approach
 var thetaAxes = d3.time.scale()
        .domain([startTime, endTime])
        .range([-Math.PI / 2, Math.PI * 1.5 ])
dayRadii = 100;
var buttonUse = d3.selectAll(".button1");
var camIcon = d3.selectAll(".camIcon");
camIcon
	.attr("transform","translate(600,500)")
	.attr('x',function(d){ return (Math.cos( thetaAxes( d.time ) ) * dayRadii)  })
    .attr('y',function(d){ return (Math.sin( thetaAxes( d.time ) ) * dayRadii) })

















function miniOne(){
// #1
//to transition the hand paths
	yBottom = belowIcons*2;
	yTop = lineHY;

 	yActivePath 
		.range([yBottom, yTop]); 
//hand1
 	lineActive1 
		.y(function(d, i) { return yActivePath(d); })
		.interpolate("bundle")
  	pathActive1
  		.transition().duration(durTrans)  
  		.attr("d", lineActive1);
//hand2
 	lineActive2
		.y(function(d, i) { return yActivePath(d); })
		.interpolate("bundle")
  	pathActive2
  		.transition().duration(durTrans)  
  		.attr("d", lineActive2);
//hand3
 	lineActive3
		.y(function(d, i) { return yActivePath(d); })
		.interpolate("bundle")
  	pathActive3
  		.transition().duration(durTrans)  
  		.attr("d", lineActive3);
	
	d3.selectAll("circle.graphImage").transition().attr("cy",yBottom);
	d3.selectAll("line.graphImage").transition().attr("y1",yBottom);
	d3.selectAll("#hands.graphImage").transition().attr("y",yBottom);
}
function miniTwo(){
// #2
//TO TRANSITION THE FACES
// faceY=yTop+2*maxTotal*faceRadius;
	faceY=yBottom-2*maxTotal*faceRadius;
	d3.selectAll(".facerect")	
		.transition()
	    .attr("y", function(d,i){
	    	return faceY-(d.num*faceRadius);
	    })
	d3.selectAll("#face.graphImage").transition().attr("y",faceY-iconW);

	var faceHeight = 2*maxTotal*faceRadius;
	d3.selectAll(".faceLine")
		.transition()
	    .attr("y1", yBottom-faceHeight)
	    .attr("y2", yBottom-faceHeight);
}
function miniThree(){
	// #3
	//for the arduino paths
	faceY=yBottom-4*maxTotal*faceRadius;

	yHPath.range([faceY, belowIcons]);

	//CHANGE THE Y PLACEMENT ACCORDINGLY
		d3.selectAll("circle.hardware")
			.transition().attr("cy", faceY)
		d3.selectAll("circle.software")
			.transition().attr("cy", faceY-(radiusKey*4))
		d3.selectAll("text.hardware")
			.transition().attr("y", faceY)
		d3.selectAll("text.software")
			.transition().attr("y", faceY-(radiusKey*4))

		d3.selectAll(".pathLine")
			.transition()
		    .attr("y1", faceY)
		    .attr("y2", faceY);

	lineH = d3.svg.area()
			.x(function(d, i) { 
				if(d==undefined){ console.log("no") }
					else{
			       	return timeXTrue(parseInt(d.key));      			
					}
			})
			.y0(faceY)
			.y1(function(d, i) { 
				if(d==undefined){return 0;}
				if(d.total<0){ return 0}
					else{
						return yHPath(d.values[0].total); 
					}
			})
			.interpolate("linear");
	pathH
		.transition().attr("class","timepathH")
		.attr("d", lineH);

	ySPath.range([faceY, belowIcons]);
	lineS = d3.svg.area()
			.x(function(d, i) { 
				if(d==undefined){ console.log("no") }
					else{
			       	return timeXTrue(parseInt(d.key));      			
					}
			})
			.y0(faceY)
			.y1(function(d, i) { 
				if(d==undefined){return 0;}
				if(d.total<0){ return 0}
					else{
						return ySPath(d.values[0].total); 
					}
			})
			.interpolate("linear");
	pathS
		.transition().attr("class","timepathS")
		.attr("d", lineS);	
}
function miniFour(){
// #4?
//to transition the logs
	// var lineHY = h/4;
	yOther
	    .rangePoints([topMarg, lineHY/2]);

	d3.selectAll(".iconsHS").transition().attr("y", function(d, i) {
		return yOther(d)-7
    })
	d3.selectAll(".timeText").transition().attr("y", function(d, i) {
        return yOther(d)+5;
    })
	d3.selectAll("#ardRectz").transition().attr("y", function(d, i) {
		if(d.mod=="M" || d.mod=="B"){
            return yOther(d.name);
		}
    })
	d3.selectAll(".logCC").transition()
			.attr("y1", topMarg) 
		    .attr("y2", lineHY/2) 	
}
if((prevName[prevName.length-1]=="Body")&&(prevName[prevName.length-2]=="Kit")||(prevName[prevName.length-1]=="Kit")&&(prevName[prevName.length-2]=="Body")){
	miniOne();
	miniTwo();
	miniThree();
	miniFour();
}