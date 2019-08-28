function IsMobileCard()
  {
  var check =  false;

  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);

  return check;   
  }

function readData(){ // reads csv, save all to a dictionary for later use

  // import data from csv, push s3_link to array if the category is = filter
  d3.csv("./final_hallmark_card_data.csv", function(data){
    for (i=0;i<data.length;i++){
      if (typeof cardImages[data[i].category] == "undefined"){
        cardImages[data[i].category] = []
      }
      else { // category is already in dictionary
        cardImages[data[i].category].push(data[i].s3_resized_link); // add card link
      }
    }

  // preload svg1 with Girl cards
  drawCards("Girl");

  })

}

function readHueData(){ // reads csv, save all to a dictionary for later use

  // import data from csv, push s3_link to array if the category is = filter
  d3.csv("./final_hallmark_card_data.csv", function(data){
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

// activated every time selector is changed; draws new cards for given 'idName' group
function drawCards(idName){ 

  var numberOfCards = cardImages[idName].length;

  // The way the grid format is being created does not allow
  // obtaining of the each "squares" within the div, which means
  // there is no identifier which to select each square and add an image
  // absent of the for loop 
  var grid = document.getElementById('galleryDiv');
  grid.setAttribute('style','grid-template-columns: repeat('+Math.sqrt(numberOfCards)+', 2.5vw)')
  grid.setAttribute('style','grid-template-rows: repeat('+Math.sqrt(numberOfCards)+', 2.5vw)');

  // //Start card population
  for (i=1;i<numberOfCards;i++) {
    var img = document.createElement('img');
    img.src = cardImages[idName][i]
    img.classList.add("gallery__img")
    grid.appendChild(img)
  }

} 

function drawHueViz(){

  if (IsMobileCard()){ // if device is mobile
    var width = document.getElementById('chart2').clientWidth;
    var height = document.getElementById('chart2').clientWidth * .9;
    var labelSize = "12px";
    var barGap = 2.5;
  }
  else {
    var width = document.getElementById('chart2').clientHeight;
    var height = document.getElementById('chart2').clientHeight * .9;
    var labelSize = "24px";
    var barGap = 5;
  }

  d3.select("#chart2").style("height",height+10+"px")

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
          .attr("y", (i * (height / cardHues[group].length)))
          .attr("width", width / groups.length - barGap)
          .attr("height", height / cardHues[group].length * 1.5)
          .style("fill", "hsl(" + cardHues[group][i][0] + ",50% , 50%)")

      }
  }

  for (z=0;z<groups.length;z++){
      drawOneGroupBar(groups[z])
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
   .style("font-size",labelSize)
   .style('fill',"black")
  
}

// create dictionary and fill with data using readData() function
cardImages = {}
readData() // this also preloads the page with the 'Girl' category

// for 2nd viz
cardHues = {};
readHueData();

// if selector changes, clears the gridvbox and redraws cards with new category
d3.select("#selector").on("change", function() {
  const parent = document.getElementById("galleryDiv");
  while (parent.firstChild) {
      parent.firstChild.remove();
  }
  var newGroup = d3.select(this).property("value")
  drawCards(newGroup)
})