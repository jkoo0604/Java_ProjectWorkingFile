//Set the transition duration
var transitionDuration = 100;
//Set the moveUp and moveDown distance
var verticalMoveDistance = 200;
//Define initial height of bars above bottom of svg container
var yAdjust = 300;
var finished = [];

function initialBars(data){
    // loadPseudocode("bubblesort",-1);// took out this line for now
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
    .attr('fill', '#475951');

    barChart.append("text")
    .attr("x",(barWidth-barPadding)/2)
    .attr("text-anchor", "middle")
    .style("fill","#80756f")
    .text(function(d) {return d;});
}

// resets the bars
function resetBars(data){
    ////// currently not used in 'reset'
    stopSort = true;
    var barChart = svg.selectAll("g")  
    .data(shuffle(data))
    .transition()
    .attr("transform", function(d, i){return "translate(" + (barWidth * i) + "," + (svgHeight-d-yAdjust) + ")";});
    
    barChart.select("rect")
    .attr("height",function(d) {return d;})
    .attr('fill', '#3c763d');

    barChart.select("text")
    .attr("x",(barWidth-barPadding)/2)
    .text(function(d) {return d;});
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
    if (stopSort) return;
    //Generate all the bars
    var barChart = svg.selectAll("g")  
    .data(data)
    .transition()
    .attr("transform", function(d, i){return "translate(" + (barWidth * i) + "," + (svgHeight-d-yAdjust) + ")";});
    
    barChart.select("rect")
    .attr("height",function(d) {return d;})

    barChart.select("text")
    .attr("x",(barWidth-barPadding)/2)
    .text(function(d) {return d;});
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
    let hRight = parseInt(gRight.select("rect").attr("height"));
    let hLeft = parseInt(gLeft.select("rect").attr("height"));
    gRight.transition().attr("transform", "translate(" + (barWidth * (num2)) + "," + (svgHeight-hRight-yAdjust) + ")");
    gLeft.transition().attr("transform", "translate(" + (barWidth * (num1)) + "," + (svgHeight-hLeft-yAdjust) + ")");
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
function changeColor(num, color){
    if (num===-1) {
        let bars = svg.selectAll("g")
        bars.select("rect").transition().attr("fill",color);
        return;
    }
    let bar = findElement(num);
    bar.select("rect").transition().attr("fill",color);
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
        newArray.push(Math.floor(Math.random()*((upperLimit+1) - 3 + 1)) + 3);
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

function emptyZeroArray() {
    finished.length=0;
}