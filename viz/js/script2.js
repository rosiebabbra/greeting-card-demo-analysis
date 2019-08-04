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
  
  
  //drawHueViz();
  })

}

function drawCardsLeft(idName){ // activated every time selector is changed; draws new cards for given 'idName' group

  var numberOfCards = cardImages[idName].length;

  for (i=1;i<numberOfCards;i++) {
    
    var img = document.createElement('img');
    img.src = cardImages[idName][i]
    img.classList.add("gallery__img");
    document.getElementById('galleryDiv').appendChild(img)

  }

} 

function drawCardsRight(idName){ // activated every time selector is changed; draws new cards for given 'idName' group

  var numberOfCards = cardImages[idName].length;

  var grid = document.getElementById('galleryDiv2');
  grid.setAttribute('style','grid-template-columns: repeat(5, 2.5vw)');
  grid.setAttribute('style','grid-template-rows: repeat(5, 2.5vw)');

  for (i=1;i<numberOfCards;i++) {
    var img = document.createElement('img');
    img.src = cardImages[idName][i]
    img.classList.add("gallery__img");
    grid.appendChild(img)
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


