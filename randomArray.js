function randomArray(length, upperLimit) {
    originalData.length = 0;
    for (var x = 0; x < length; x++) {
        originalData.push(Math.floor(Math.random()*upperLimit));
    }
}

// *******************************************************************************************
// called inside 'reset' to generate new random values and load them into originalData array
// *******************************************************************************************

// $("#reset").click(function(){
//     stopSort = true;
//     loadPseudocode(-1);
//     var currentchart = svg.selectAll("g").remove();
//     randomArray(15,150);
//     initialBars(originalData);

// });