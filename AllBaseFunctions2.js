//Define the main container size
var minWidth = 500;
var minHeight = minWidth * .6;
console.log(document.getElementsByClassName("container")[0].clientWidth)
// var svgWidth = Math.max(minWidth, document.getElementById("leftpane").clientWidth*0.9);
var svgWidth = Math.max(minWidth, document.getElementsByClassName("container")[0].clientWidth*.9*.66);
var svgHeight = Math.max(minHeight,svgWidth*.6);

//Define initial height of bars above bottom of svg container
var yAdjust = (svgHeight)/2;
//Set the moveUp and moveDown distance
var verticalMoveDistance = yAdjust*.9;
var scalerPadding=50;

//Define colors
var colors = {
    "default" : {
        "selected": "#f9c74f",//yellow
        "compare" : "#f94144",//red
        "lower": "#90be6d",//green
        "higher": "#6930c3",//purple
        "finished": "#f3722c",//orange
        "default": "#577590",//bluish gray
        "black": "black",
        "white": "white"
    },   
    "colorblind": {
        "selected": "#F0E442",//yellow
        "compare" : "#D55E00",//red
        "lower": "#009E73",//green
        "higher": "#CC79A7",//pink
        "finished": "#E69F00",//orange
        "default": "#0072B2",//bluish gray
        "black": "black",
        "white": "white"
    }
};

//Select color theme
var selectedTheme = "default";
var currentTheme = colors[selectedTheme];
$("#colorTheme").click(function(){
    if(selectedTheme != $(this).val()){
        selectedTheme = $(this).val();
        console.log("theme changed");
        currentTheme = colors[selectedTheme];
        console.log(originalData);
        resetBars(originalData);
    }
});

function initialBars(data){
    // maxData = Math.max.apply(false,data);
    // barHeight = d3.scaleLinear().domain([0,maxData]).range([0,yAdjust-scalerPadding]);
    // loadPseudocode("bubblesort",-1);// took out this line for now
    ////// create a g tag first to group rect and text
    console.log(barHeight(150));
    svg.attr("width", svgWidth)
    .attr("height", svgHeight);
    var barChart = svg.selectAll("g")  
    .data(data)
    .enter()
    .append("g")
    // .attr("id", function(d,i){return 'item'+i;})
    .attr("transform", function(d, i){return "translate(" + (barWidth * i) + "," + (svgHeight-barHeight(d)-yAdjust) + ")";})               
    .attr("positionID", function(d,i){return "p"+(i+1);});
    
    barChart.append("rect")
    .attr("height",function(d) {return barHeight(d);})
    .attr("width",barWidth-barPadding)
    .attr("rx",5)
    .attr('fill', currentTheme['default']);

    barChart.append("text")
    .attr("x",(barWidth-barPadding)/2)
    .attr("y", "-10")
    .attr("class", "barValue")
    .attr("text-anchor", "middle")
    .style("fill",currentTheme["black"])
    .text(function(d) {return d;});
}

// resets the bars
function resetBars(data){
    ////// currently not used in 'reset'
    stopSort = true;
    var barChart = svg.selectAll("g").remove();  
    initialBars(data);
}

//Randomizes input data set
function shuffle(dataset){
    for(var i = 0; i < dataset.length; i++){
        var j = Math.floor(Math.random()*dataset.length)
        var temp = dataset[i];
        dataset[i] = dataset[j];
        dataset[j] = temp;
    }
    return dataset;
}

//Function to show all the bars  -- not sure if we need this one anymore
function generateBars(data){
    // maxData = Math.max.apply(false,data);
    // barHeight = d3.scaleLinear().domain([0,maxData]).range([0,yAdjust-scalerPadding]);
    if (stopSort) return;
    //Generate all the bars
    var barChart = svg.selectAll("g")  
    .data(data)
    .transition()
    .attr("transform", function(d, i){return "translate(" + (barWidth * i) + "," + (svgHeight-barHeight(d)-yAdjust) + ")";});
    
    barChart.select("rect")
    .attr("height",function(d) {return barHeight(d);})

    barChart.select("text")
    .attr("x",(barWidth-barPadding)/2)
    .text(function(d) {return d;});
}

// basically generate bars without the transition
function refreshPositionIds(data){
    // maxData = Math.max.apply(false,data);
    // barHeight = d3.scaleLinear().domain([0,maxData]).range([0,yAdjust-scalerPadding]);
    //Generate all the bars
    var barChart = svg.selectAll("g")  
    .data(data)
    .attr("transform", function(d, i){return "translate(" + (barWidth * i) + "," + (svgHeight-barHeight(d)-yAdjust) + ")";})
    .attr("positionID", function(d,i){return "p"+(i+1);});
    barChart.select("rect")
    .attr("height",function(d) {return barHeight(d);})

    barChart.select("text")
    .attr("x",(barWidth-barPadding)/2)
    .text(function(d) {return d;});
}

//Swaps position IDs of the elements at the two given position IDs
function swapPositionID(item1, item2){
    var item1 = findElement(item1);
    var item2 = findElement(item2);
    var temp = item1.attr("positionID");
    item1.attr("positionID", item2.attr("positionID"));
    item2.attr("positionID", temp);
}

function swapPosition(num1, num2) { 
    let gRight = findElement(num1);
    let gLeft = findElement(num2);
    let hRight = parseTransform(gRight);
    let hLeft = parseTransform(gLeft);
    gRight.transition().attr("transform", "translate(" + (barWidth * (num2)) + "," + hRight[1] + ")");
    gLeft.transition().attr("transform", "translate(" + (barWidth * (num1)) + "," + hLeft[1] + ")");
    // let hRight = parseInt(gRight.select("rect").attr("height"));
    // let hLeft = parseInt(gLeft.select("rect").attr("height"));
    // gRight.transition().attr("transform", "translate(" + (barWidth * (num2)) + "," + (svgHeight-barHeight(hRight)-yAdjust) + ")");
    // gLeft.transition().attr("transform", "translate(" + (barWidth * (num1)) + "," + (svgHeight-barHeight(hLeft)-yAdjust) + ")");
    swapPositionID(num1, num2);
}

//Move bar at index, delas are given in units of how many indexes to move(negative = left or down, positive = right or up)
function move(index, deltaX, deltaY){
    var item = findElement(index);
    var coord = parseTransform(item);
    coord[0] = coord[0] + barWidth*deltaX;
    coord[1] = coord[1] - verticalMoveDistance*deltaY;
    item.transition().duration(transitionDuration).attr("transform", "translate(" + coord[0] + "," + coord[1] + ")");
}


// we might want to refactor all the code to just use the move function if we have time,
//Move item down
function moveDown(index){
    //Set how far we move the item down
    var item = findElement(index);
    var coord = parseTransform(item);
    coord[1] = coord[1] + verticalMoveDistance;
    item.transition().duration(transitionDuration).attr("transform", "translate(" + coord[0] + "," + coord[1] + ")");
}

//Move item up
function moveUp(index){
    //Set how far we move the item down
    var item = findElement(index);
    var coord = parseTransform(item);
    coord[1] = coord[1] - verticalMoveDistance;
    item.transition().duration(transitionDuration).attr("transform", "translate(" + coord[0] + "," + coord[1] + ")");
}

//Move item left
function moveLeft(index){
    //Set how far we move the item down
    var leftDistance = barWidth;
    var item = findElement(index);
    var coord = parseTransform(item);
    coord[0] = coord[0] - leftDistance;
    item.transition().duration(transitionDuration).attr("transform", "translate(" + coord[0] + "," + coord[1] + ")");
}

//Move item right
function moveRight(index){
    //Set how far we move the item down
    var rightDistance = barWidth;
    var item = findElement(index);
    var coord = parseTransform(item);
    coord[0] = coord[0] + rightDistance;
    item.transition().duration(transitionDuration).attr("transform", "translate(" + coord[0] + "," + coord[1] + ")");
}

//Pass in entire element and output is an array with the [x, y] of the transform attribute
function parseTransform(element){
    if(element == null) return null;
    var transform = element.attr("transform");
    var coord = transform.match(/[+-]?\d+(?:\.\d+)?/g);
    return [parseInt(coord[0]), parseInt(coord[1])];
}

//swap color function, takes bar num and color
//color should be one of the color keys
function changeColor(num, color){
    if (num===-1) {
        let bars = svg.selectAll("g")
        bars.select("rect").transition().attr("fill",currentTheme[color]);
        return;
    }
    let bar = findElement(num);
    bar.select("rect").transition().attr("fill",currentTheme[color]);
}


//Finds by position ID and returns the entire element
function findElement(position){
    position += 1;
    return svg.selectAll("g").filter(function() {return d3.select(this).attr("positionID") == "p" + position;});
}

//Sleep function so that you can see transitions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Create new array
function randomArray(length, upperLimit) {
    var newArray = [];
    for (var x = 0; x < length; x++) {
        newArray.push(Math.floor(Math.random()*(upperLimit - 3 + 1)) + 3);
    }
    return newArray;
}

function loadTitle(sortType) {
    if (sortType == "reset") {
        d3.select(".title-p").transition().text("").style("display","none");
        return;
    }
    d3.select(".title-p").transition().text(sortType).style("display","inline");
}

function createZeroArray(length){
    var arr = [];
    for(var i = 0; i < length; i++){
        arr.push(0);
    }
    return arr;
}

function openRightPane() {
    if (document.getElementsByClassName("container")[0].clientWidth < 992) {
        d3.select("#rightpane").style("width","100%");
        return;
    }
    $("#leftpane").animate({
        width: '66%'
    }, 800);
    $("#rightpane").animate({opacity:0},0).animate({
        width: '30%'
    }, 700).animate({opacity:1},1000);
    
}

function closeRightPane(speed) {
    if (document.getElementsByClassName("container")[0].clientWidth < 992) {
        return;
    }
    speed = speed || "default"
    if (speed == "quick") {
        $("#leftpane").animate({
            width: '99%'
        }, 0);
        $("#rightpane").animate({
            width: '0%'
        }, 0);
        return;
    }
    $("#leftpane").animate({
        width: '99%'
    }, 800);
    $("#rightpane").animate({
        width: '0%'
    }, 400);
}

function resetDimension() {
    svgWidth = Math.max(minWidth, document.getElementsByClassName("container")[0].clientWidth*.9*.66);
    svgHeight = Math.max(minHeight,svgWidth*.6);
    barWidth = Math.floor((svgWidth - barPadding) / originalData.length);
    verticalMoveDistance = yAdjust*.9;
    yAdjust = (svgHeight)/2;
}

function barHeight(d) {
    var maxData = Math.max.apply(false,originalData);
    var scaler = d3.scaleLinear().domain([0,maxData]).range([0,yAdjust-scalerPadding]);
    return scaler(d);
}