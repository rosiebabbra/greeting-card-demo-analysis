function readData(){ // reads csv, save all to a dictionary for later use

  // import data from csv, push s3_link to array if the category is = filter
  d3.csv("../data/hallmark_card_sorted_by_hue.csv", function(data){
    for (i=0;i<data.length;i++){
      if (typeof cardImages[data[i].category] == "undefined"){ // first time seeing this category
        cardImages[data[i].category] = [] // intialize the dictionary key and pair with an empty list
      }
      else { // category is already in dictionary
        cardImages[data[i].category].push(data[i].s3_link); // add card link
      }
    }

  // preload the page with Girl cards
  drawCards("Girl");
  })

}

function drawCards(idName){ // activated every time a box is checked; draws new svg + cards for given 'idName' group

  var numberOfCards = cardImages[idName].length;

  var body = d3.select("body");

  // equal width and height so svg is a square

  var width = document.getElementById('chart').clientHeight * .75; // testing smaller svg size; height currently not adjusted as cards become truncated
  var height = document.getElementById('chart').clientHeight;
    
  var svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", idName);

  // d3.select('#'+ idName).append("text")
  //       .attr("x", (width / 2))             
  //       .attr("y", 0)
  //       .attr("text-anchor", "middle")  
  //       .style("font-size", "16px") 
  //       .text(idName.replace("+"," "));

  // svg.append("text")
  //       .attr("x", (width / 2))             
  //       .attr("y", 0)
  //       .attr("text-anchor", "middle")  
  //       .style("font-size", "16px") 
  //       .text(idName.replace("+"," "));

  var defs = svg.append('svg:defs')

  var config = {
      "card_size" : width / Math.ceil(Math.sqrt(numberOfCards)) // sqrt (rounded up) of numberOfCards is # of rows and columns for the grid
  }

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
    svg.append("rect")
          .attr("class", "card")
          .attr("x", x*config.card_size)
          .attr("y", y*config.card_size) // <--
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

function limitCheckboxSelection() {

  var checkboxes = document.getElementsByTagName('input');
  var numChecked = 0;
  var count;

  for(count=0; count<checkboxes.length; count++){
    if(checkboxes[count].checked==true){
      numChecked = numChecked + 1;
    }
  }

  if(numChecked<1){
    
    document.getElementById('invalid').style.visibility = "visible"
    document.getElementById('invalid').innerHTML = 'Please select at least one category.'
    return false;
  }
  else if(numChecked>=3){

    document.getElementById('invalid').style.visibility = "visible"
    document.getElementById('invalid').innerHTML = 'Please select a maximum of two categories.'

    setTimeout(function(){
      document.getElementById('invalid').style.visibility = "hidden"
  }, 5000);

  return false;

  }
  else{
    document.getElementById('invalid').style.visibility = "hidden"
    //return false;
  }

}


// when a checkbox value changes, add group svg if being checked or delete group svg if being unchecked
d3.selectAll("input").on("change", function() {
  if (this.checked == false){
    document.getElementById(this.value).remove()
  }
  else if (this.checked == true){
    drawCards(this.value)
  }

})

// create dictionary and fill with data using readData() function
cardImages = {}
readData() // this also preloads the page with the 'Girl' category