ccItems = ardEntry.filter(function(d) {
    return d.start < maxExtent && d.sF == "1" && d.mod == "CC";
});
// var ccLinez;
// ccLinez = itemArdz.selectAll("ccline")
//     .data(ccItems, function(d) {
//         return d.specialID;
//     })
//     .attr("x1", function(d) {
//         return x1(d.start);
//     })
//     .attr("x2", function(d) {
//         return x1(d.start);
//     })
// ccLinez.enter().append("line")
//     .attr("class", "ccline")
//     .attr("x1", function(d) {
//         return x1(d.start);
//     })
//     .attr("x2", function(d) {
//         return x1(d.start);
//     })
//     .attr("y1", function(d, i) {
//         return yis(d.from);
//     })
//     .attr("y2", function(d, i) {
//         return yis(d.from)+10;
//     })
//     .attr("fill", function(d) {
//         return oColor(d.from);
//     })
//     .attr("stroke", function(d) {
//         return oColor(d.from);
//     })
//     .attr("stroke-width",2)
//     .attr("opacity", 1)
// ccLinez.exit().remove();


var parseSeshDate = d3.time.format('%Y/%m/%d %H:%M:%S').parse;
var parseDate = d3.time.format('%X_%d-%m-%Y').parse;
var minExtTime = timeFormat2(new Date(minExtent));
var maxExtTime = timeFormat2(new Date(maxExtent));

var minHeadline = timeFormat1(new Date(minExtent));
// m[3], w
var timeText1 = main.selectAll("wodry1")
    .data(d3.range(1))
    .enter()
    .append("text").attr("class", "wodry1")
    .attr("x", 0)//x1(minExtent) - 10)
    .attr("y", yis(options[0]) - 67)
    .attr("text-anchor", "end")
    .text(minHeadline);
var timeText = main.selectAll("wodry")
    .data(d3.range(1))
    .enter()
    .append("text").attr("class", "wodry")
    .attr("x", 0)//-45//x1(minExtent) - 10)
    .attr("y", yis(options[0]) - 50)
    .attr("text-anchor", "end")
    .text("@" + minExtTime);

var timeText2;
timeText2 = main.selectAll("wodry2")
    .data(d3.range(1))
    .attr("x", x1(maxExtent));
timeText2.enter().append("text")
    .attr("class", "wodry2")
    .attr("x", x1(maxExtent))
    .attr("y", yis(options[0]) - 50)
    .attr("text-anchor", "end")
    .attr("opacity", function(d) {
        if (x1(maxExtent) > x1(minExtent)) {
            return 1;
        } else {
            return 0;
        }
    })
    .text(maxExtTime);