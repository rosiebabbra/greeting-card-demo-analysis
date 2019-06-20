// currently, the data is re-read everytime the chart is updated
// need to figure out how to read the data once and only once, to make more efficient
function readDataAndDrawCards(filter){

  // array to hold image links
  cardImages = []

  // import data from csv, push s3_link to array if the category is = filter
  d3.csv("../data/hallmark_card_rgb_codes_sorted.csv", function(data){
    for (i=0;i<data.length;i++){
      if (data[i].category == filter){
      cardImages.push(data[i].s3_link);
      }
    }

  drawCards();
  })

}

function drawCards(){

  var numberOfCards = cardImages.length;

  var body = d3.select("body");

  // equal width and height so svg is a square
  var width = document.getElementById('chart').clientHeight;
  var height = document.getElementById('chart').clientHeight;

  var svg = d3.select("#chart").append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("id","cardHolder");

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

    // add a rect, which will be filled with a card image
    svg.append("rect")
          .attr("class", "card")
          .attr("x", x*config.card_size)
          .attr("y", y*config.card_size)
          .attr("width", config.card_size)
          .attr("height",config.card_size)
          .attr("id",i)
          .style("fill", "url(#" + i.toString() +")"); // calls a defs by id to determine image
      
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


d3.select("#girlCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Girl')
})

d3.select("#boyCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Boy')
})

d3.select("#daughterCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Daughter')
})

d3.select("#sonCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Son')
})

d3.select("#granddaughterCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Granddaughter')
})

d3.select("#grandsonCheckboxCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Grandson')
})

d3.select("#nieceCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Niece')
})

d3.select("#nephewCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Nephew')
})

d3.select("#sisterCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Sister')
})

d3.select("#brotherCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Brother')
})

d3.select("#wifeCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Wife')
})

d3.select("#husbandCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Husband')
})

d3.select("#motherCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Mother')
})

d3.select("#fatherCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Father')
})

d3.select("#auntCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Aunt')
})

d3.select("#uncleCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Uncle')
})

d3.select("#grandmotherCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Grandmother')
})

d3.select("#grandfatherCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Grandfather')
})

d3.select("#anyWomanCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Any+Woman')
})

d3.select("#anyManCheckbox").on("change", function() {
  d3.select("svg").remove()
  d3.select("defs").remove()
  var selectedOption = d3.select(this).property("value")
  readDataAndDrawCards('Any+Man')
})