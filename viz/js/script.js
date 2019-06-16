filter = "Mother";

    // array to hold image links
    cardImages = []

    // import data from csv, push s3_link to array if the category is "Boy"
    d3.csv("../data/hallmark_card_rgb_codes_sorted.csv", function(data){
      for (i=0;i<data.length;i++){
        if (data[i].category == filter){
        cardImages.push(data[i].s3_link);
        }
      }

    // this is because the D3 function always runs last - would be unnecessary if using sep JS file?
    drawCards();
    })


function drawCards(){

var numberOfCards = cardImages.length;

var body = d3.select("body");

// equal width and height so svg is a square
var width = document.getElementById('chart').clientHeight;
var height = document.getElementById('chart').clientHeight;

var svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);

var defs = svg.append('svg:defs');

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

  // add a rect, which will be filled with a card image
  svg.append("rect")
        .attr("x", x*config.card_size)
        .attr("y", y*config.card_size)
        .attr("width", config.card_size)
        .attr("height",config.card_size)
        .style("fill", "#fff")
        .attr("id",i)
        .style("fill", "url(#" + i.toString() +")"); // calls a defs by id to determine image
    
    // defs for images
    defs.append("svg:pattern")
    .attr("id", i) // this id is what rect.style("fill") uses to pull in the right image
    .attr("width", config.card_size)
    .attr("height", config.card_size)
    .attr("patternUnits", "userSpaceOnUse")
    .append("svg:image")
    .attr("xlink:href", cardImages[i])
    .attr("width", config.card_size)
    .attr("height", config.card_size)
    .attr("x", 0)
    .attr("y", 0);

  // increment x to move to next column
  x = x + 1;
  counter = counter + 1
}

} // closes drawCards() function