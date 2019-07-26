function readData(){ // reads csv, save all to a dictionary for later use

  // import data from csv, push s3_link to array if the category is = filter
  d3.csv("../data/hallmark_card_with_rgb.csv", function(data){
    for (i=0;i<data.length;i++){
      if (typeof cardImages[data[i].category] == "undefined"){ // first time seeing this category
        cardImages[data[i].category] = [] // intialize the dictionary key and pair with an empty list
      }
      else { // category is already in dictionary
        cardImages[data[i].category].push(data[i].s3_link); // add card link
      }
    }

  // preload svg1 with Girl cards
  drawCardsLeft("Girl");
  // preload svg2 with Boy cards
  drawCardsRight("Boy");
  })

}

function readHueData(){ // reads csv, save all to a dictionary for later use

  // import data from csv, push s3_link to array if the category is = filter
  d3.csv("../data/hallmark_card_with_rgb.csv", function(data){
    for (i=0;i<data.length;i++){
      if (typeof cardHues[data[i].category] == "undefined"){ // first time seeing this category
          cardHues[data[i].category] = [] // intialize the dictionary key and pair with an empty list
      }
      else { // category is already in dictionary
          cardHues[data[i].category].push([data[i].hue,data[i].lightness]); // add card link
      }
    }
  
  
  drawHueViz();
  })

}

var width = document.getElementById('chart').clientHeight * .75; // testing smaller svg size; height currently not adjusted as cards become truncated
var height = document.getElementById('chart').clientHeight;

var svg1 = d3.select("#chart").append("svg")
.attr("width", width)
.attr("height", height)
.attr("id", "svg1");

var svg2 = d3.select("#chart").append("svg")
.attr("width", width)
.attr("height", height)
.attr("id", "svg2");

function drawCardsLeft(idName){ // activated every time selector is changed; draws new cards on svg1 for given 'idName' group

  var numberOfCards = cardImages[idName].length;

  var width = document.getElementById('chart').clientHeight * .75; // testing smaller svg size; height currently not adjusted as cards become truncated
  var height = document.getElementById('chart').clientHeight;

  var config = {
    "card_size" : width / Math.ceil(Math.sqrt(numberOfCards)) // sqrt (rounded up) of numberOfCards is # of rows and columns for the grid
  }

  var defs = svg1.append('svg:defs');
  
  var y = 0; // y placement on svg for rects
  var x = 0; // x placement on svg for rects
  var counter = 0;

  for (i=1;i<numberOfCards;i++) {

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
    svg1.append("rect")
          .attr("class", "card")
          .attr("x", x*config.card_size)
          .attr("y", y*config.card_size) 
          .attr("width", config.card_size)
          .attr("height",config.card_size)
          .attr("id",i)
          .style("fill", "url(#" + idName+i.toString() +")") // calls a defs by id to determine image
          .on("mouseover", function(){ 

              var style_min = "'height: " + config.card_size + "px; width: " + config.card_size + "px;'"
              var style_max = "'height: " + height / 4 + "px; width: " + width / 4 + "px;'"
              var src = cardImages[idName][d3.select(this).attr('id')]

              div.html("<img class='onHoverFirst' style='height: "+style_min+"' src="+src+">")
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY) + "px")
              div.transition()
                    .duration(500)		
                    .style("opacity", 1)
              div.html("<img class='onHoverSecond' style="+style_max+" src="+src+">")
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY) + "px")
            })
            .on("mouseout", function() {		
              div.transition()		
                  .style("opacity", 0);	
              });

      
    // increment x to move to next column
    x = x + 1;
    counter = counter + 1
  }

} 

function drawCardsRight(idName){ // activated every time selector is changed; draws new cards on svg2 for given 'idName' group

  var numberOfCards = cardImages[idName].length;

  var width = document.getElementById('chart').clientHeight * .75; // testing smaller svg size; height currently not adjusted as cards become truncated
  var height = document.getElementById('chart').clientHeight;

  var config = {
    "card_size" : width / Math.ceil(Math.sqrt(numberOfCards)) // sqrt (rounded up) of numberOfCards is # of rows and columns for the grid
  }

  var defs = svg2.append('svg:defs');
  
  var y = 0; // y placement on svg for rects
  var x = 0; // x placement on svg for rects
  var counter = 0;

  for (i=1;i<numberOfCards;i++) {

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
    svg2.append("rect")
          .attr("class", "card")
          .attr("x", x*config.card_size)
          .attr("y", y*config.card_size) 
          .attr("width", config.card_size)
          .attr("height",config.card_size)
          .attr("id",i)
          .style("fill", "url(#" + idName+i.toString() +")") // calls a defs by id to determine image
          .on("mouseover", function(){ 

              var style_min = "'height: " + config.card_size + "px; width: " + config.card_size + "px;'"
              var style_max = "'height: " + height / 4 + "px; width: " + width / 4 + "px;'"
              var src = cardImages[idName][d3.select(this).attr('id')]

              div.html("<img class='onHoverFirst' style='height: "+style_min+"' src="+src+">")
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY) + "px")
              div.transition()
                    .duration(500)		
                    .style("opacity", 1)
              div.html("<img class='onHoverSecond' style="+style_max+" src="+src+">")
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY) + "px")
            })
            .on("mouseout", function() {		
              div.transition()		
                  .style("opacity", 0);	
              });

      
    // increment x to move to next column
    x = x + 1;
    counter = counter + 1
  }

}

function drawHueViz(){
  var width = document.getElementById('chart2').clientHeight;
  var height = document.getElementById('chart2').clientHeight * .9;

  var huesvg = d3.select("#chart2").append("svg")
  .attr("width", width)
  .attr("height", height)

  //groups = Object.keys(cardHues);
  
  groups = ["Any+Man", "Father", "Grandfather", "Brother", "Son",
              "Husband", "Grandson", "Any+Woman", "Boy", "Daughter", "Mother",
              "Wife", "Grandmother", "Sister", "Granddaughter", "Girl"]

  function drawOneGroupBar(group){
      for (i=0;i<cardHues[group].length;i++){

        huesvg.append("rect")
          .attr("x", z * (width / groups.length))
          .attr("y", height - (i * (height / cardHues[group].length))) 
          .attr("width", width / groups.length - 5)
          .attr("height", height / cardHues[group].length * 1.5)
          .style("fill", "hsl(" + cardHues[group][i][0] + ",50% ," + cardHues[group][i][1] +"%)");
          
      }
  }

  for (z=0;z<groups.length;z++){
      drawOneGroupBar(groups[z])

      huesvg.append('text')
          .attr("x", z * (width / groups.length) + (width/groups.length/2))
          .attr("y", height / 2)
          .text(groups[z])
          .style("font-size","8px")
          .style("fill","white")
          .attr('text-alignment','center')
          .style("text-anchor", "middle")
          //.attr("transform", "translate(" + z * (width / groups.length) + "," + height / 2 + ")")
          //.attr("transform", "rotate(-90)")
  }
}

// change right selector to 'Boy'
document.querySelector('#selectorRight').value="Boy"
// create dictionary and fill with data using readData() function
cardImages = {}
readData() // this also preloads the page with the 'Girl vs Boy' category

// for 2nd viz
cardHues = {};
readHueData();

// if selector changes, clears svg1 and redraws cards with new category
d3.select("#selectorLeft").on("change", function() {
  svg1.selectAll("*").remove()
  var newGroup = d3.select(this).property("value")
  drawCardsLeft(newGroup)
})

// if selector changes, clears svg2 and redraws cards with new category
d3.select("#selectorRight").on("change", function() {
  svg2.selectAll("*").remove()
  var newGroup = d3.select(this).property("value")
  drawCardsRight(newGroup)
})