// array to hold image links
cardImages = {}

// currently, the data is re-read everytime the chart is updated
// need to figure out how to read the data once and only once, to make more efficient
function readDataAndDrawCards(filter){

  cardImages[filter] = []

  // import data from csv, push s3_link to array if the category is = filter
  d3.csv("../data/hallmark_card_rgb_codes_sorted.csv", function(data){
    for (i=0;i<data.length;i++){
      if (data[i].category == filter){
      cardImages[filter].push(data[i].s3_link);
      }
    }

  drawCards(filter);
  })

}

function drawCards(idName){

  var numberOfCards = cardImages[idName].length;

  var body = d3.select("body");

  // equal width and height so svg is a square
  var width = document.getElementById('chart').clientHeight;
  var height = document.getElementById('chart').clientHeight;

  var svg = d3.select("#chart").append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("id",idName);
  
  var defs = svg.append('svg:defs')

  var config = {
      "card_size" : width / Math.ceil(Math.sqrt(numberOfCards)) // sqrt (rounded up) of numberOfCards is # of rows and columns for the grid
  }

  var body = d3.select("body");

  var y = 0; // y placement on svg for rects
  var x = 0; // x placement on svg for rects
  var counter = 0;

  for (i=0;i<numberOfCards;i++) {

    // once we've added enough cards to fill the row, increment y (to start the next row) and reset x
    if (counter > Math.ceil(Math.sqrt(numberOfCards)-1)){
      counter = 0;
      y = y + 1; // move down a row
      x = 0; // move back to the beginning column
    }

    // defs for images
    defs.append("svg:pattern")
    .attr("id", idName+i) // this id is what rect.style("fill") uses to pull in the right image
    .attr("width", config.card_size)
    .attr("height", config.card_size)
    .attr("patternUnits", "userSpaceOnUse")
    .append("svg:image")
    .attr("xlink:href", cardImages[idName][i])
    .attr("width", config.card_size)
    .attr("height", config.card_size)
    .attr("x", 0)
    .attr("y", 0);

    var div = d3.select("body").append("div")
      .attr("class", "tooltip");

    // add a rect, which will be filled with a card image
    svg.append("rect")
          .attr("class", "card")
          .attr("x", x*config.card_size)
          .attr("y", y*config.card_size)
          .attr("width", config.card_size)
          .attr("height",config.card_size)
          .attr("id",i)
          .style("fill", "url(#" + idName+i.toString() +")") // calls a defs by id to determine image
          .on("mouseover", function(){ 
              div.html("<img class='onHoverFirst' style='height: " + config.card_size * 1 + "px; width: " + config.card_size * 1 + "px;' src=" + cardImages[idName][d3.select(this).attr('id')] + ">")
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY) + "px")
              div.transition()
                    .duration(500)		
                    .style("opacity", 1)
              div.html("<img class='onHoverSecond' style='height: " + config.card_size * 4 + "px; width: " + config.card_size * 4 + "px;' src=" + cardImages[idName][d3.select(this).attr('id')] + ">")
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY) + "px")
              img.onHoverFirst.transition()
                .style("height","100px")
                .style("width","200px")
            })
        .on("mouseout", function() {		
          div.transition()		
              .duration(500)		
              .style("opacity", 0);	
          });
      
    // increment x to move to next column
    x = x + 1;
    counter = counter + 1
  }

} // closes drawCards() function


// currently, the data is re-read everytime the chart is updated
// need to figure out how to read the data once and only once, to make more efficient
// var filter = document.getElementById('group-selection').value;

// readDataAndDrawCards('Girl'); 

// dropdown - every time a new group is selected, remove the current svg and defs and call readDataAndDrawCards()
// d3.select("#group-selection").on("change", function() {
//   d3.select("svg").remove()
//   d3.select("defs").remove()
//   var selectedOption = d3.select(this).property("value")
//   readDataAndDrawCards(selectedOption)
// })
// every time a new group is selected, remove the current svg and defs and call readDataAndDrawCards()

// if(d3.select("#girlCheckbox").property("checked")){
//   readDataAndDrawCards('Girl');
// } else {
//   d3.select("svg").remove();
//   d3.select("defs").remove();
// }

// d3.selectAll("#girlCheckbox").on("change", function() {
//   var selected = this.value;
//   opacity = this.checked ? 1 : 0;

// svg.selectAll("svg")
//   .filter(function(d) {return selected == d.category;})
//   .style("opacity", opacity);
//   });

// when a checkbox value changes, add group svg if being checked or delete group svg if being unchecked
d3.selectAll("input").on("change", function() {
  if (this.checked == false){
    document.getElementById(this.value).remove()
  }
  else if (this.checked == true){
    readDataAndDrawCards(this.value)
  }

  numChecked = 0;

  // count how many checkboxes are checked
  for (i=0;i<d3.selectAll("input")._groups[0].length;i++){
    if (d3.selectAll("input")._groups[0][i].checked) {
      numChecked = numChecked + 1;
    }
  }

  console.log(numChecked);

  // original width and height of svgs
  var width = document.getElementById('chart').clientHeight;
  var height = document.getElementById('chart').clientHeight;

  // for every existing svg, resize depending of number of checked boxes - THIS ISN'T WORKING :(
  for (i=0;i<d3.selectAll("input")._groups[0].length;i++){
    if (d3.selectAll("input")._groups[0][i].checked) {
      document.getElementById(d3.selectAll("input")._groups[0][i].value).width = width / numChecked;
      document.getElementById(d3.selectAll("input")._groups[0][i].value).height = height / numChecked;
    }
  }

})

// examples old functions
//d3.select("#girlCheckbox").on("change", function() {
  //if (this.checked == false){
    //document.getElementById('Girl').remove()
 // }
  //else if (this.checked == true){
    //readDataAndDrawCards('Girl')
 // }
//})

//d3.select("#boyCheckbox").on("change", function() {
  //if (this.checked == false){
   // document.getElementById('Boy').remove()
  //}  
  //else if (this.checked == true){
    //readDataAndDrawCards('Boy')
  //}
//})



// preload the page with Girl cards
readDataAndDrawCards('Girl')