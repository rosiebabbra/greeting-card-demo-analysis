function readData(){ // reads csv, save all to a dictionary for later use

  // import data from csv, push s3_link to array if the category is = filter
  d3.csv("../data/hallmark_card_with_rgb.csv", function(data){
    for (i=0;i<data.length;i++){
      if (typeof cardImages[data[i].category] == "undefined"){
        cardImages[data[i].category] = []
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

function drawCardsLeft(idName){ // activated every time selector is changed; draws new cards for given 'idName' group

  var numberOfCards = cardImages[idName].length;

  // The way the grid format is being created does not allow
  // obtaining of the each "squares" within the div, which means
  // there is no identifier which to select each square and add an image
  // absent of the for loop 
  var grid = document.getElementById('galleryDiv');
  grid.setAttribute('style','grid-template-columns: repeat('+Math.sqrt(numberOfCards)+', 2.5vw)')
  grid.setAttribute('style','grid-template-rows: repeat('+Math.sqrt(numberOfCards)+', 2.5vw)');

  //d3.select(grid).style('margin', 'auto');

  // //Start card population
  for (i=1;i<numberOfCards;i++) {
    var img = document.createElement('img');
    img.src = cardImages[idName][i]
    img.classList.add("gallery__img")
    grid.appendChild(img)
  }


  // Using d3 to populate the cards instead
  // d3.select(grid).selectAll('img')
  //     .data(cardImages[idName])
  //     .enter()
  //     .append('img')
  //     .attr("src", function(d){ return d})
  //     .attr('height', '25px')
  //     .attr('weight', '25px')

  
} 

function drawCardsRight(idName){ // activated every time selector is changed; draws new cards for given 'idName' group

  var numberOfCards = cardImages[idName].length;

  var grid = document.getElementById('galleryDiv2');
  grid.setAttribute('style','grid-template-columns: repeat('+Math.sqrt(numberOfCards)+', 2.5vw)');
  grid.setAttribute('style','grid-template-rows: repeat('+Math.sqrt(numberOfCards)+', 2.5vw)');

  //d3.select(grid).style('margin', 'auto');

  for (i=1;i<numberOfCards;i++) {
    var img = document.createElement('img');
    img.src = cardImages[idName][i];
    img.classList.add("gallery__img");
    grid.appendChild(img);

  //   d3.select('img').on("mouseover", function(){ 

  //     var style_min = "'height: " + config.card_size + "px; width: " + config.card_size + "px;'"
  //     var style_max = "'height: " + height / 4 + "px; width: " + width / 4 + "px;'"
  //     var src = cardImages[idName][d3.select(this).attr('id')]

  //     div.html("<img class='onHoverFirst' style='height: "+style_min+"' src="+src+">")
  //           .style("left", (d3.event.pageX) + "px")		
  //           .style("top", (d3.event.pageY) + "px")
  //     div.transition()
  //           .duration(500)		
  //           .style("opacity", 1)
  //     div.html("<img class='onHoverSecond' style="+style_max+" src="+src+">")
  //           .style("left", (d3.event.pageX) + "px")		
  //           .style("top", (d3.event.pageY) + "px")
  //   })
  // .on("mouseout", function() {		
  //     div.transition()		
  //         .style("opacity", 0);	
  //     });
  }

}

function drawHueViz(){
  var width = document.getElementById('chart2').clientHeight;
  var height = document.getElementById('chart2').clientHeight * .9;

  var huesvg = d3.select("#chart2").append("svg")
    .attr("width", width)
    .attr("height", height)
  
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
          .style("fill", "hsl(" + cardHues[group][i][0] + ",50% , 50%)")

      }

      // Appending text to the huesvg elements append text to each individual color.
      // Setting static labels since the viz is not dynamic.


  }

  for (z=0;z<groups.length;z++){
      drawOneGroupBar(groups[z])

      // huesvg.append('text')
      //     //.attr("x", z * (width / groups.length) + (width/groups.length/2))
      //     .attr("x", width / 2)
      //     .attr("y", height / 2)
      //     .text(groups[z])
      //     .style("font-size","12px")
      //     .style("fill","black")
      //     .attr('text-alignment','center')
      //     .style("text-anchor", "middle")
      //     .attr("transform", "translate("+width+","+height/8+") rotate(90)")

  }

  // Append Labels (THANK YOU https://observablehq.com/@weitinglin/d3-rotating-text-labels)
  huesvg.selectAll('text.rotation')
   .data(groups)
   .enter()
   .append('text')
   .text((d)=>d.replace("+"," "))
   .classed('rotation', true)
   .attr('fill', 'black')
   .attr('transform', (d,i)=>{
       return 'translate( '+ (i* (width / groups.length)  + (width / groups.length / 4)) +' , '+height/2+'),'+ 'rotate(90)';})
   .attr('x', 0)
   .attr('y', 0)
   .attr('text-alignment','center')
   .style("text-anchor", "middle")
   .style("font-size","24px")
   .style('fill',"black")
   //.style("font-weight","bold")

  
}

// change right selector to 'Boy'
document.querySelector('#selectorRight').value="Boy"
// create dictionary and fill with data using readData() function
cardImages = {}
readData() // this also preloads the page with the 'Girl vs Boy' category

// for 2nd viz
cardHues = {};
readHueData();

// if selector changes, clears the gridvbox and redraws cards with new category
d3.select("#selectorLeft").on("change", function() {
  const parent = document.getElementById("galleryDiv");
  while (parent.firstChild) {
      parent.firstChild.remove();
  }
  var newGroup = d3.select(this).property("value")
  drawCardsLeft(newGroup)
})

// if selector changes, clears the gridbox and redraws cards with new category
d3.select("#selectorRight").on("change", function() {
  const parent = document.getElementById("galleryDiv2");
  while (parent.firstChild) {
      parent.firstChild.remove();
  }
  var newGroup = d3.select(this).property("value")
  drawCardsRight(newGroup)
})