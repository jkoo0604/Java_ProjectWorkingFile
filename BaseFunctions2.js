//Set the transition duration
var transitionDuration = 500;
//Set the moveUp and moveDown distance
var verticalMoveDistance = 200;
//Define initial height of bars above bottom of svg container
var yAdjust = 300;
var finished = [];


var colors = {
    "selected": "yellow",
    "compare" : "red",
    "lower": "green",
    "higher": "purple",
    "finished": "orange",
    "default": "gray",
    "black": "black",
    "white": "white"
};

var colors2 = {
    "default" : {
        "selected": "#ffb83d",
        "compare" : "#7e848f",
        "lower": "green",
        "higher": "purple",
        "finished": "#db5e4d",
        "default": "#475951",
        "black": "black",
        "white": "white",
        "complete": "#DD9C90"
    },   
    "custom": {
        "selected": "#f9c74f",
        "compare" : "#f94144",
        "lower": "#90be6d",
        "higher": "#6930c3",
        "finished": "#f3722c",
        "default": "#577590",
        "black": "black",
        "white": "white"
    }
};

var currentTheme = colors2['custom-navbar'];

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

//Swaps position IDs of the elements at the two given position IDs
function swapPositionID(item1, item2){
    var item1 = findElement(item1);
    var item2 = findElement(item2);
    var temp = item1.attr("positionID");
    item1.attr("positionID", item2.attr("positionID"));
    item2.attr("positionID", temp);
}

//Function to show initial data in graph and generate initial elements
function initialBars(data){
    
    loadPseudocode("bubblesort",-1);
    ////// create a g tag first to group rect and text
    var barChart = svg.selectAll("g")  
    .data(data)
    .enter()
    .append("g")
    // .attr("id", function(d,i){return 'item'+i;})
    .attr("transform", function(d, i){return "translate(" + (barWidth * i) + "," + (svgHeight-d-yAdjust) + ")";})               
    .attr("positionID", function(d,i){return "p"+(i+1);});
    
    barChart.append("rect")
    .attr("height",function(d) {return d;})
    .attr("width",barWidth-barPadding)
    .attr("rx",5)
    .attr('fill', currentTheme['default']);

    barChart.append("text")
    .attr("x",(barWidth-barPadding)/2)
    .attr("text-anchor", "middle")
    .style("fill","#80756f")
    .text(function(d) {return d;});

}

function swapPosition(num1, num2) { 
    let gRight = findElement(num1);
    let gLeft = findElement(num2);
    let hRight = parseInt(gRight.select("rect").attr("height"));
    let hLeft = parseInt(gLeft.select("rect").attr("height"));
    gRight.transition().attr("transform", "translate(" + (barWidth * (num2)) + "," + (svgHeight-hRight-yAdjust) + ")");
    gLeft.transition().attr("transform", "translate(" + (barWidth * (num1)) + "," + (svgHeight-hLeft-yAdjust) + ")");
    swapPositionID(num1, num2);
}

//Sleep function so that you can see transitions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

//Create new array
function randomArray(length, upperLimit) {
    originalData.length = 0;
    for (var x = 0; x < length; x++) {
        originalData.push(Math.floor(Math.random()*((upperLimit+1) - 3 + 1)) + 3);
    }
    return originalData;
}

function loadTitle(sortType) {
    if (sortType == "reset") {
        d3.select(".title-p").transition().text("").style("display","none");
        return;
    }
    d3.select(".title-p").transition().text(sortType).style("display","inline");
}

//Move bar at index, delas are given in units of how many indexes to move(negative = left or down, positive = right or up)
function move(index, deltaX, deltaY){
    var item = findElement(index);
    var coord = parseTransform(item);
    coord[0] = coord[0] + barWidth*deltaX;
    coord[1] = coord[1] - verticalMoveDistance*deltaY;
    item.transition().duration(transitionDuration).attr("transform", "translate(" + coord[0] + "," + coord[1] + ")");
}

// basically generate bars without the transition
function refreshPositionIds(data){
    var yAdjust = 300;
    //Generate all the bars
    var barChart = svg.selectAll("g")  
    .data(data)
    .attr("transform", function(d, i){return "translate(" + (barWidth * i) + "," + (svgHeight-d-yAdjust) + ")";})
    .attr("positionID", function(d,i){return "p"+(i+1);});
    
    barChart.select("rect")
    .attr("height",function(d) {return d;})

    barChart.select("text")
    .attr("x",(barWidth-barPadding)/2)
    .text(function(d) {return d;});
}

function createZeroArray(length){
    var arr = [];
    for(var i = 0; i < length; i++){
        arr.push(0);
    }
    return arr;
}
