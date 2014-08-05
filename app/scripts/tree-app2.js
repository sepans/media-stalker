console.log('tree app 2');

//console.log(interact);

//$('#main-image').css('background-image',"http://upload.wikimedia.org/wikipedia/commons/b/bf/Construction_tour_eiffel7.JPG");

var WM_URL = 'http://www.corsproxy.com/'+'wikipedia-miner.cms.waikato.ac.nz/services/exploreArticle?outLinks=true&definition=true&linkFormat=plain&parentCategories=true&linkRelatedness=true&responseFormat=json&title=';
var MG_KG_URL = 'http://www.corsproxy.com/'+'mediagraph.jit.su/knowledge-graph?q=';

var chartEl = document.getElementById('chart');

var wikidata = {};
var sortedLinks = {};

var areaItemRatio = 0.00004;

console.log(chartEl);

interact(chartEl)
.resizeable(true)
.on('resizemove', function (event) {


 var target = event.target;

    // add the change in coords to the previous width of the target element
    var
      newWidth  = parseFloat(target.style.width ) + event.dx,
      newHeight = parseFloat(target.style.height) + event.dy;


    // update the element's style
    target.style.width  = newWidth + 'px';
    target.style.height = newHeight + 'px';

    var items = Math.round(newWidth * newHeight * areaItemRatio);

    updateTreeMap(items, newWidth, newHeight);

   // target.textContent = newWidth + '×' + newHeight;
});

$('#push').on('click', function() {

  updateTreeMap(15, 960, 500);

});

interact(chartEl).restrict({resize: 'parent'});



var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 250 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

var color = d3.scale.category20c();

var min = 0,
    max = 0;

var treemap = d3.layout.treemap()
    .size([width, height])
    //.sticky(true)
    .ratio(1)//width/height)
    .value(function(d) { return d.relatedness - min*0.9; });

var div = d3.select("#chart")//.append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px");
    //.style("left", margin.left + "px")
    //.style("top", margin.top + "px");


var concept = "wedding dress";
 
var url = WM_URL+concept;
console.log(url);

$.getJSON(MG_KG_URL+concept, function(data) {
    console.log(data);
    if(data.results.length>0) {
      console.log(data.results[0].thumbnail);
      $('#main-image').css('background-image','url('+data.results[0].thumbnail+')');
    }
});

d3.json(url, function(error, data) {

  console.log(error);
  console.log(data);


  wikidata = data;

  sortedLinks = wikidata.outLinks;

  sortedLinks.sort(function(a, b) {
      return b.relatedness - a.relatedness;  // descending
   });

  //console.log(sortedLinks);

  var items = Math.round(width * height * areaItemRatio);

  drawTreeMap(items , width, height);

  

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

function updateTreeMap(tileCount, mywidth, myheight) {


  var temp = wikidata.outLinks; // //$.extend({}, sortedLinks);

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




  var node = div.datum(root).selectAll(".node")
          .data(treemap.nodes);
            node.enter().append("div")
      .attr("class", "node")
      .style('opacity', 0)
      .call(addImage)
      .call(addText);

      node.exit().transition().duration(200).style('opacity', 0).remove();

      node.call(position);

      node.transition().duration(500).style('opacity', 1);
            
          //  node.transition().duration(1500).call(position);

      //.style("background", function(d) { return d.color ? d.color : "#ffffff"; })
      //.text(function(d) { return d.children ? "blue" : d.keytable + "(" + d.anzahl + "-" + Math.max(0, d.dx) + "-" + Math.max(0, d.dy) + ")"; });
      
    

  }


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

  // get 20 first images
  getImages(temp);

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

  
/*
    treemap = d3.layout.treemap()
    .size([mywidth, myheight])
.ratio(1.5)
    .value(function(d) { return d.relatedness - min*0.8; });
*/
  var node = div.datum(root).selectAll(".node")
      .data(treemap.nodes);

   // node.exit().remove();

    node.enter().append("div")
      .attr("class", "node")
      .call(position)
      .style("background", function(d) { return '#E5E5E5';})//d.children ? color(d.title) : null; })
      .call(addImage)
      .call(addText);

      
}


function position() {

  // this.style("left", function(d) { return  d.x + "px"; })
  //     .style("top", function(d) { return d.y + "px"; })
  //     .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
  //     .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });

  this.style("left", function(d) { return  (d.x / width * 100) + "%"; }) //d.x + "px"; })
      .style("top", function(d) { return (d.y / height * 100) + "%"; }) //d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) / width * 100 + "%"; })  //Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) / height * 100 + "%";}) //Math.max(0, d.dy - 1) + "px"; });


}

function addText(el) {
  el.append("div")
      .attr("class","text")
      .text(function(d) {  return d.children ? null : d.title; });
}

function addImage(el) {
  //el.style('left', function(d) { return 0;})
  el.style('background-image', function(d) {   return d.image ? 'url('+d.image+')' : 'none';})//'url(http://upload.wikimedia.org/wikipedia/commons/b/bf/Construction_tour_eiffel7.JPG)';})
  el.style('background-size', '180% auto')
  el.style('background-position', '40% 10%')
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

function getImages() {
  var IMAGE_COUNT = 20;
  for(var i=0; i<IMAGE_COUNT; i++ ) {

      var knowledge_graph_url = MG_KG_URL+sortedLinks[i].title;
      console.log(knowledge_graph_url);

        (function() {
          var index = i;
          $.getJSON(knowledge_graph_url, function(data) {
            //console.log(data);
              if(data.results.length>0) {
                //console.log(sortedLinks[index].title);
                
                //console.log(data.results[0]);
                sortedLinks[index].image = data.results[0].thumbnail;
                d3.selectAll(".node")
                .call(addImage);
              }

          });
        })();
  }


}