import { generate_statistics } from "./statistics.js";
import { bubble_statistics } from "./bubble_stats.js";
let default_year = [2019, 2020];
let num_courses_to_show = 5;

function showLoaderBubble() {
  $('#loading1').css("visibility", "visible");
}
// Math.seedrandom(0);
function hideLoaderBubble() {
  $('#loading1').hide();
}

// Dropdown + checkbox
$('body').on("click", ".dropdown-menu", function (e) {
  $(this).parent().is(".open") && e.stopPropagation();
});


$(".js-range-slider").ionRangeSlider({
  type: "double", //2 handlers
  skin: "flat",
  prettify_enabled: false, // 2 000 --> 2000
  min: 2004,
  max: 2020,
  from: default_year[0],
  to: default_year[1],
  grid: true,
  grid_snap: true,
  drag_interval: true,
  min_interval: 1,
  max_interval: 1,
  onFinish: function(data){
    showLoaderBubble();
    courses_url = host + `/course_bubble/?year=${default_year[0]}-${default_year[1]}`
    q.defer(bubbleGraph);
  }
});

var css = new Set()
$("span.irs-grid-pol.small").hide(); //hide ticks ionRangeSlider
var host = window.location.hostname;
if (host.indexOf('localhost') > -1) {
  //is development
  host = "http://" + host + ":3000";
} else {
  // is production
  host = "https://" + host;
}
var cs = new Set();
let courses_url = host + `/course_bubble/?year=${default_year[0]}-${default_year[1]}`
var aaaa = 0
 function bubbleGraph() {
   Math.seedrandom = 0
  d3.json(courses_url, function (error, data) {
    hideLoaderBubble(); // hide loading
    document.getElementById("bubbleCourses").innerHTML = "";
    const margin = { top: 10, right: 10, bottom: 0, left: 0 };
    var width = 1000 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;
    var padding = 1.2, // separation between same-color nodes
        clusterPadding = 6, // separation between different-color nodes
        maxRadius = 12;
      var tooltip = d3.select("#bubbleCourses")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "fixed")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

      var mouseover = function(d) {
        svg.selectAll("."+d.section).transition().duration(50).style("opacity", 1).attr("r", function(d){

            return 1.3*d.radius}
)
        tooltip
          .transition()
          .duration(200)
        tooltip
          .style("opacity", 1)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
      }
      var mousemove = function(d) {
        tooltip
          .html( d.text + " "+d.name + "\n"+ ": " + d.enrol)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
      }
      var mouseleave = function(d) {
        svg.selectAll("."+d.section).transition().duration(3000).style("opacity", 1).attr("r", function(d){ return d.radius })
        tooltip
          .transition()
          .duration(200)
        tooltip
          .style("opacity", 0)
          .style("transition", "opacity 5s ease-in-out;")
      }
      if(aaaa==0){
        data.forEach(function(d){
        cs.add(d.section);
        css.add(d.section);
        });
        aaaa=1
      }
      var n = data.length, // total number of nodes
          m = cs.size; // number of distinct clusters
      //create clusters and nodes
      var clusters = new Array(m);
      var nodes = [];
      for (var i = 0; i<n; i++){

        nodes.push(create_nodes(data,i));

      }

      var colors = d3.scaleOrdinal(d3.schemeCategory20)
          .domain(d3.range(18));

    function create_nodes(data, node_counter) {

      var i = Array.from(css).indexOf(data[node_counter].section),
          r = Math.sqrt((i + 1) / 21 * -Math.log(Math.random())) * maxRadius,
          id = data[node_counter].section + "-" + data[node_counter].id,
          d = {
              section: data[node_counter].section,
              cluster: i,
              enrol: data[node_counter].enrollments,
              radius: Math.sqrt(data[node_counter].enrollments),
              text: id,
              short_name: id,
              name: data[node_counter].course_name,
              x: Math.cos(i / 21 * 2 * Math.PI) * 100 + width/10 + Math.random(),
              y: Math.sin(i / 21 * 2 * Math.PI) * 100 + height/10+ Math.random(),
            }

      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    };
    function drag(simulation){
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
    }
    var forceCollide = d3.forceCollide()
        .radius(function(d) { return d.radius + 1.5;})
        .iterations(1);

    function forceCluster(alpha) {
      for (var i = 0, n = nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
        node = nodes[i];
        cluster = clusters[node.cluster];
        node.vx -= (node.x - cluster.x) * k;
        node.vy -= (node.y - cluster.y) * k;
      }
    }

    var force = d3.forceSimulation()
        .nodes(nodes)
        .force("center", d3.forceCenter())
        .force("collide", forceCollide)
        .force("cluster", forceCluster)
        .force("gravity", d3.forceManyBody(50))
        .force("x", d3.forceX().strength(.3))
        .force("y", d3.forceY().strength(1.1))
        .on("tick", tick);
        var svg = d3.select("#bubbleCourses").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  var circle = svg.selectAll("circle")
      .data(nodes)
    .enter().append("circle")
    .attr("class" , function(d){ return d.section; })
      .attr("r", function(d) { return d.radius; })
      .style("fill", function(d) { return colors(d.cluster); })
      .attr("fill-opacity", .8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
       .on("click", function(d) { // Selecting deselecting and updating bars
        if(!d3.select(this).classed("selected")){
          d3.selectAll(".selected").classed("selected", false).attr("stroke", false);
          d3.select(this).classed("selected", true);
          d3.select(this).transition().attr("stroke", colors(d.cluster)).attr("stroke-width", 2);
          generate_statistics(d, "showStatisticCourse", false);
        }
        else {
          d3.select(this).classed("selected", false);
          d3.select(this).transition().attr("stroke", false).attr("stroke-width", 0.5);
          generate_statistics(d, "showStatisticCourse", false);
        }})


  var a = new Array(20);
  for(var i =0;i<a.length;i++){
    a[i]=0
  }
  var b = new Array(20);
  for(var i=0;i<nodes.length;i++){
    var j = Array.from(css).indexOf(nodes[i].section)
    if(a[j] < nodes[i].radius){
      a[j] = nodes[i].radius
      b[j] = nodes[i].text
    }
  }

    let texts = svg.selectAll('texts')
        .data(nodes)
        .enter()
        .append('text')
        .attr("class" , function(d){ return d.section; })
       .text(function(d) {if(b.includes(d.text)|d.radius>15){
     var aa = b.indexOf(d.text);
     delete b[aa];
     return d.text}} )
    .attr('color', 'black')
    .attr('font-size', 15)
    .attr('text-anchor', 'middle')
                    .attr('x',function(d) {d.x} )
                    .attr("stroke", "#ffffff")
                    .attr("stroke-width", 0.25)
                    .attr('y', function(d) {d.y} );

  function tick() {
    circle.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
    texts.attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; });
  }

function update(){
  d3.selectAll(".checkbox").each(function(d){
  var cb = d3.select(this);
  var grp = cb.property("value")

if(cb.property("checked")){
    cs.add(grp)
    svg.selectAll("."+grp).transition().duration(1000).style("opacity", 1).attr("r", function(d){ return d.radius })
    var new_nodes = nodes.filter(d=>cs.has(d.section));
    bubble_statistics(new_nodes, "showStatisticCourse");
}else{
  cs.delete(grp)
  svg.selectAll("."+grp).transition().duration(1000).style("opacity", 0).attr("r", 0);
  var new_nodes = nodes.filter(d=>cs.has(d.section));
  bubble_statistics(new_nodes, "showStatisticCourse");
}
})}


d3.selectAll(".checkbox").on("change",update);
update()

});}

  q.defer(bubbleGraph);
