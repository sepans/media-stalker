console.log('tree app 2');

//console.log(interact);

//$('#main-image').css('background-image',"http://upload.wikimedia.org/wikipedia/commons/b/bf/Construction_tour_eiffel7.JPG");

var chartEl = document.getElementById('chart');

var wikidata = {};

console.log(chartEl);

interact(chartEl)
.resizeable(true)
.on('resizemove', function (event) {

  console.log('resizemove');

 var target = event.target;

    // add the change in coords to the previous width of the target element
    var
      newWidth  = parseFloat(target.style.width ) + event.dx,
      newHeight = parseFloat(target.style.height) + event.dy;


    // update the element's style
    target.style.width  = newWidth + 'px';
    target.style.height = newHeight + 'px';

    drawTreeMap(10, newWidth, newHeight);

   // target.textContent = newWidth + '×' + newHeight;
});



var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.category20c();

var min = 0,
    max = 0;

var treemap = d3.layout.treemap()
    .size([width, height])
    //.sticky(true)
    .ratio(1.8)
    .value(function(d) { return d.relatedness - min*0.9; });

var div = d3.select("#chart")//.append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");


d3.json("data/eiffel.json", function(error, data) {


  wikidata = data;


  drawTreeMap(15, width, height);

  

  //node.call(addImage);

/*
  d3.selectAll("input").on("change", function change() {
    var value = this.value === "count"
        ? function() { return 1; }
        : function(d) { return d.size; };

    node
        .data(treemap.value(value).nodes)
      .transition()
        .duration(1500)
        .call(position);
  });

*/
});


function drawTreeMap(tileCount, mywidth, myheight) {

  var temp = wikidata.outLinks;

  temp.sort(function(a, b) {
      return b.relatedness - a.relatedness;  // descending
   });

  //console.log(temp);

  temp=temp.filter(function(element) { 
    return element.title.indexOf('List of ')<0;
  });

  //temp = temp.slice(0,10);

  temp = temp.slice(0,tileCount);

 // console.log(temp);

  temp.forEach(function(el) {

      el.value = el.relatedness;
      //console.log(el);
      
  });

  min = d3.min(temp, function(d) { return d.relatedness;});
  max = d3.max(temp, function(d) { return d.relatedness;});
  //console.log(min);


 // console.log(temp);

  var root = {'name': 'Eiffel', 'children': temp};

  console.log(root);

    treemap = d3.layout.treemap()
    .size([mywidth, myheight])
.ratio(1.5)
    .value(function(d) { return d.relatedness - min*0.8; });

  var node = div.datum(root).selectAll(".node")
      .data(treemap.nodes);

   // node.exit().remove();

    node.enter().append("div")
      .attr("class", "node")
      .call(position)
      .style("background", function(d) { return d.children ? color(d.title) : null; })
      .call(addImage);

      node
      .append("div")
      .attr("class","text")
      .text(function(d) { return d.children ? null : d.title; });
}


function position() {

  this.style("left", function(d) { return  (d.x / width * 100) + "%"; }) //d.x + "px"; })
      .style("top", function(d) { return (d.y / height * 100) + "%"; }) //d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) / width * 100 + "%"; })  //Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) / height * 100 + "%";}) //Math.max(0, d.dy - 1) + "px"; });


}

function addImage(el) {
  //el.style('left', function(d) { return 0;})
  el.style('background-image', function(d) {   return d.image ? 'url('+d.image+')' : 'url(http://upload.wikimedia.org/wikipedia/commons/b/bf/Construction_tour_eiffel7.JPG)';})
  el.style('background-size', '130% auto')
  el.style('background-position', '10% 10%')
  el.style('background-repeat', 'no-repeat');
/*
el.append('div');

  el.append('img')
      .attr('class', 'image')
      .attr('src', function(d) { console.log(d); return 'http://upload.wikimedia.org/wikipedia/commons/b/bf/Construction_tour_eiffel7.JPG';})
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });

*/
}