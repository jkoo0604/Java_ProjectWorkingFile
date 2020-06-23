function swap(num1, num2) { 
    let gRight = svg.selectAll("g").filter(function() {return d3.select(this).attr("positionID") == "p" + num1;})
    let gLeft = svg.selectAll("g").filter(function() {return d3.select(this).attr("positionID") == "p" + num2;})
    let hRight = parseInt(gRight.select("rect").attr("height"));
    let hLeft = parseInt(gLeft.select("rect").attr("height"));
    gRight.transition().attr("transform", "translate(" + (barWidth * (num2-1)) + "," + (svgHeight-hRight) + ")");
    gLeft.transition().attr("transform", "translate(" + (barWidth * (num1-1)) + "," + (svgHeight-hLeft) + ")");
    gRight.attr("positionID","p" + num2);
    gLeft.attr("positionID","p" + num1);
}
// **********************************************************************************
// in bubble sort, called when left value > right value
// **********************************************************************************

// let vRight = parseInt(svg.selectAll("g").filter(function() {return d3.select(this).attr("positionID") == "p" + (i+1);}).select("text").text());
// let vLeft = parseInt(svg.selectAll("g").filter(function() {return d3.select(this).attr("positionID") == "p" + (i);}).select("text").text());
// if (vLeft > vRight) {
//     switched = true;
//     swap(i+1, i);
//     await sleep(sleepTime-100);
// }

// **********************************************************************************
// uses 'positionID' as reference (which is created for each g tag in initialBars)
// **********************************************************************************

// var barChart = svg.selectAll("g")  
//     .data(data)
//     .enter()
//     .append("g")
//     // .attr("id", function(d,i){return 'item'+i;})
//     .attr("transform", function(d, i){return "translate(" + (barWidth * i) + "," + (svgHeight-d) + ")";})               
//     .attr("positionID", function(d,i){return "p"+(i+1);});

// **********************************************************************************
// color functions in bubble sort changed accordingly
// **********************************************************************************

// function changeBarColor(num) {
//     let gRight = svg.selectAll("g").filter(function() {return d3.select(this).attr("positionID") == "p" + num;})
//     let gLeft = svg.selectAll("g").filter(function() {return d3.select(this).attr("positionID") == "p" + (num-1);})
//     gRight.select("rect").transition().attr("fill","red");
//     gLeft.select("rect").transition().attr("fill","red");
// }

// function returnBarColor(num) {
//     let gRight = svg.selectAll("g").filter(function() {return d3.select(this).attr("positionID") == "p" + num;})
//     let gLeft = svg.selectAll("g").filter(function() {return d3.select(this).attr("positionID") == "p" + (num-1);})
//     gRight.select("rect").transition().attr("fill","#3c763d");
//     gLeft.select("rect").transition().attr("fill","#3c763d");
// }

// function finishBarColor(num) {
//     if (num===-1) {
//         let bars = svg.selectAll("g")
//         bars.select("rect").transition().attr("fill","blue");
//     }
//     let bar = svg.selectAll("g").filter(function() {return d3.select(this).attr("positionID") == "p" + num;})
//     bar.select("rect").transition().attr("fill","blue");
// }