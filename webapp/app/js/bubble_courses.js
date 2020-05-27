import { generate_statistics } from "./statistics.js";
import { chord } from "./relations_course.js";
let default_year = [2019, 2020];
let num_courses_to_show = 5;

function showLoaderBubble() {
  $('#loading1').css("visibility", "visible");
}
// Math.seedrandom(0);
function hideLoaderBubble() {
  $('#loading1').hide();
}
var node_list = new Map();
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
    default_year = [data.from, data.to];
    showLoaderBubble();
    q.defer(bubbleGraph);
    courses_url = host + `/course_bubble/?year=${default_year[0]}-${default_year[1]}`
  }
});

$("span.irs-grid-pol.small").hide(); //hide ticks ionRangeSlider
var host = window.location.hostname;
if (host.indexOf('localhost') > -1) {
  //is development
  host = "http://" + host + ":3000";
} else {
  // is production
  host = "https://" + host;
}
var cs = [];
 let courses_url = host + `/course_bubble/?year=${default_year[0]}-${default_year[1]}`

 function bubbleGraph() {
   Math.seedrandom = 0
  //console.log("new", node_list); //output is correct
  d3.json(courses_url, function (error, data) {
    hideLoaderBubble(); // hide loading
    document.getElementById("bubbleCourses").innerHTML = "";
    const margin = { top: 10, right: 20, bottom: 30, left: 30 };
    var width = 1000 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    var padding = 1.5, // separation between same-color nodes
        clusterPadding = 6, // separation between different-color nodes
        maxRadius = 12;
        var tooltip = d3.select("#bubbleCourses")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "black")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .style("color", "white")
      var showTooltip = function (d) {
        tooltip
          .transition()
          .duration(200)
        tooltip
          .style("opacity", 1)
          .html([d.name + "\n"+ "enrollments: " + d.enrol])
          .style("left", d.x + "px")
          .style("top", d.y + "px")
      }
      var moveTooltip = function (d) {
        tooltip
        .style("left", (d.x  + d.vx) + "px")
          .style("top", (d.y + d.vy) + "px")
      }
      var hideTooltip = function (d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      }

      var svg = d3.select("#bubbleCourses").append("svg")
          .attr("width", width)
          .attr("height", height)
        .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')


      if(node_list.size==0){
        data.forEach(function(d){
              if(cs.indexOf(d.section)<0) {
                  cs.push(d.section);
              }
        });
      }
      var css =[]
      data.forEach(function(d){
            if(css.indexOf(d.section)<0) {
                css.push(d.section);
            }
      });
      console.log(css);
      var n = data.length, // total number of nodes
          m = css.length; // number of distinct clusters
      //create clusters and nodes
      var clusters = new Array(m);
      var nodes = [];
      for (var i = 0; i<n; i++){
          nodes.push(create_nodes(data,i));
      }
      var colors = d3.scaleOrdinal(d3.schemeCategory20)
          .domain(d3.range(m));

    function create_nodes(data, node_counter) {
      var i = cs.indexOf(data[node_counter].section),
          r = Math.sqrt((i + 1) / 21 * -Math.log(Math.random())) * maxRadius,
          id = data[node_counter].section + "-" + data[node_counter].id,
          d = {
              section: data[node_counter].section,
              cluster: i,
              enrol: data[node_counter].enrollments,
              radius: 1.2*Math.sqrt(data[node_counter].enrollments),
              text: id,
              name: data[node_counter].course_name,
              x: Math.cos(i / 21 * 2 * Math.PI) * 100 + width/10 ,
              y: Math.sin(i / 21 * 2 * Math.PI) * 100 + height/10,
            }
      // if(node_list.size != 0 & node_list.has(id)){
      //         d ={
      //         cluster: node_list.get(id)[2],
      //         radius: Math.sqrt(data[node_counter].enrollments),
      //         text: id,
      //         x: node_list.get(id)[0],
      //         y: node_list.get(id)[1],
      //       }};
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    };

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
        .force("gravity", d3.forceManyBody(10))
        .force("x", d3.forceX().strength(.3))
        .force("y", d3.forceY().strength(.9))
        .on("tick", tick);
    var showStatistics = function (d){
      // clean selections
      d3.selectAll(".bubbles").classed('selectedBubble', false);

      // highlight selected bubble
      this.classList.add("selectedBubble");
      var div = document.getElementById("showStatisticCourse");
      div.innerHTML = "";
      div.innerHTML = `
      <div class="card" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">${d.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Number of enrollments: ${d.enrol}</h6>
        <!--  <div id="chord-course-loading"></div> -->
          <div id="chord-course"></div>
        </div>
      </div>
      `;
    generate_statistics(d, "chord-course");
      // call chord code it will be inserted in id: chord-course (defined above)
    //  chord(d.name, "chord-course");
    }
    // function showStatistics(d) {
    //   generate_statistics(d, "statistics-network");
    // }
          var highlight = function (d) {
            // reduce opacity of all groups
            d3.selectAll(".bubbles").style("opacity", .05)
            // expect the one that is hovered
            d3.selectAll("." + d).style("opacity", 1)
          }

          // And when it is not hovered anymore
          var noHighlight = function (d) {
            d3.selectAll(".bubbles").style("opacity", 1)
          }
  var circle = svg.selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("r", function(d) { return d.radius; })
      .style("fill", function(d) { return colors(d.cluster); })
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)
      .on("click", showStatistics)

  var a = new Array(21);
  for(var i =0;i<a.length;i++){
    a[i]=0
  }
  var b = new Array(21);

  for(var i=0;i<nodes.length;i++){
    var j = cs.indexOf(nodes[i].section)
    if(a[j] < nodes[i].radius){
      a[j] = nodes[i].radius
      b[j] = nodes[i].text
    }
  } //Doesn't not have to be a hash map, any key/value map is fine
    let texts = svg.selectAll('texts')
        .data(nodes)
        .enter()
        .append('text')
       .text(function(d) {if(b.includes(d.text)){
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
// }else{
//     svg.append('g')
//       .selectAll("dot")
//       .data(nodes)
//       .enter()
//       .append("circle")
//       .attr("class", "bubbles")
//       .attr("cx", function (d) {
//         return d.x;
//       })
//       .attr("cy", function (d) {
//         return d.y;
//       })
//       .attr("r", function (d) {
//         return d.radius;
//       })
//       .style("fill", function (d) {
//         return colors(d.cluster);
//       })
//       // -3- Trigger the functions
//       .on("mouseover", showTooltip)
//       .on("mousemove", moveTooltip)
//       .on("mouseleave", hideTooltip)
// }
        // var res = []
        // data.map(d => res.push(d.section))
        //   var size = 20
        //   var allgroups = res
        //
        //   var start_legend = 0;
        //   var start_legend_y = height - 100;
        //   svg.selectAll("myrect")
        //     .data(allgroups)
        //     .enter()
        //     .append("circle")
        //     .attr("cx", start_legend)
        //     .attr("cy", function (d, i) {
        //       return start_legend_y + 5 + i * (size + 5)
        //     })
        //     .attr("r", 7)
        //     .style("fill", function (d) {
        //       return color(d)
        //     })
        //
        //   svg.selectAll("mylabels")
        //     .data(allgroups)
        //     .enter()
        //     .append("text")
        //     .attr("x", start_legend + size * .8)
        //     .attr("y", function (d, i) {
        //       return start_legend_y + i * (size + 5) + (size / 2)
        //     })
        //     .style("fill", function (d) {
        //       return color(d)
        //     })
        //     .text(function (d) {
        //       return d
        //     })
        //     .attr("text-anchor", "left")
        //     .style("alignment-baseline", "middle")
            // .on("mouseover", highlight)
            // .on("mouseleave", noHighlight)
      if(node_list.size ==0){
        for(var i=0;i<nodes.length;i++){
          node_list.set(nodes[i].text, [nodes[i].x, nodes[i].y, nodes[i].cluster]);
        } //Doesn't not have to be a hash map, any key/value map is fine
      }
   //Repeat n times
 })};

  q.defer(bubbleGraph);






  //   // console.log(res);
  //   // Add X axis
  //   var x = d3.scaleLinear()
  //     .domain([0, 500])
  //     .range([0, width]);
  //   // svg.append("g")
  //   //   .attr("transform", "translate(0," + height + ")")
  //   //   .call(d3.axisBottom(x));
  //
  //   // Add Y axis
  //   var y = d3.scaleLinear()
  //     .domain([0, 500])
  //     .range([height, 0]);
  //   // svg.append("g")
  //   //   .call(d3.axisLeft(y));
  //
  //   // Add a scale for bubble size
  //   var z = d3.scaleSqrt()
  //     .domain([0, 500])
  //     .range([0, 250]);
  //
  //   // Add a scale for bubble color

  //
  //   var myColor = d3.scaleOrdinal()
  //     .domain(d3.range(10))
  //     .range(["#157A6E", "#499F68", "#77B28C", "#B4654A", "#A63D40", "#E9B872", "#331832", "#FFE8D1", "#61210F", "#C7DFC5"])
  //
  //   // -1- Create a tooltip div that is hidden by default:

  //
  //   // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip

  //
  //   // TODO: Maybe we should show a course always open as preview?


  //
  //   var points = Array(500).fill(0).map(() => Array(500).fill(0));
  //   var centers = [];
  //   var max = 400;
  //   var min = 140;
  //
  //
  //   data.forEach(d => {
  //     var flag = 0;
  //     // console.log(d.count)
  //
  //     while (true) {
  //       var a = Math.round(Math.random() * (max - min + 1)) + min;
  //       var b = Math.round(Math.random() * (max - min + 1)) + min;
  //       for (var i = Math.max(0, (a - r)); i < Math.min((a + r), 500); i++) {
  //         for (var j = Math.max(0, (b - r)); j < Math.min(500, (b + r)); j++) {
  //           if (points[i][j] == 1) {
  //             flag = 1;
  //           }
  //         }
  //       }
  //       if (flag == 0) {
  //         break;
  //       }
  //     }
  //
  //     var r = 3 * Math.round(d.enrollments);
  //     centers.push([a, b])
  //
  //     for (var i = Math.max(0, (a - r)); i < Math.min((a + r), 500); i++) {
  //       for (var j = Math.max(0, (b - r)); j < Math.min(500, (b + r)); j++) {
  //         points[i][j] = 1;
  //       }
  //     }
  //
  //
  //   });
  //   var p = 0;
  //   var q = 0;
  //   // Add dots
  //   svg.append('g')
  //     .selectAll("dot")
  //     .data(data)
  //     .enter()
  //     .append("circle")
  //     .attr("class", "bubbles")
  //     .attr("cx", function (d) {
  //       return x(centers[q++][0]);
  //     })
  //     .attr("cy", function (d) {
  //       return y(centers[p++][1]);
  //     })
  //     .attr("r", function (d) {
  //       return z(Math.round(Math.sqrt(d.enrollments)));
  //     })
  //     .style("fill", function (d) {
  //       return myColor(d.course_name);
  //     })
  //     // -3- Trigger the functions
      // .on("mouseover", showTooltip)
      // .on("mousemove", moveTooltip)
      // .on("mouseleave", hideTooltip)
      // .on("click", showStatistics)
  //
  //
  //   // var highlight = function (d) {
  //   //   // reduce opacity of all groups
  //   //   d3.selectAll(".bubbles").style("opacity", .05)
  //   //   // expect the one that is hovered
  //   //   d3.selectAll("." + d).style("opacity", 1)
  //   // }
  //
  //   // // And when it is not hovered anymore
  //   // var noHighlight = function (d) {
  //   //   d3.selectAll(".bubbles").style("opacity", 1)
  //   // }
  //
  //
  //   // Add one dot in the legend for each name.
  //   var size = 20
  //   var allgroups = res
  //
  //   var start_legend = 0;
  //   var start_legend_y = height - 100;
  //

  //
  // });






 // hide loading

    // append the svg object to the body of the page
    // var svg = d3.select("#bubbleCourses")
    //   .append("svg")
    //   .attr("width", width + margin.left + margin.right + 300)
    //   .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //   .attr("transform",
    //     "translate(" + margin.left + "," + margin.top + ")");
    //     var color = d3.scale.ordinal()
    //           .range(["#7A99AC", "#E4002B"]);






  // res = []
  // data.map(d => res.push(d.course_name))
  //   // console.log(res);
  //   // Add X axis
  //   var x = d3.scaleLinear()
  //     .domain([0, 500])
  //     .range([0, width]);
  //   // svg.append("g")
  //   //   .attr("transform", "translate(0," + height + ")")
  //   //   .call(d3.axisBottom(x));
  //
  //   // Add Y axis
  //   var y = d3.scaleLinear()
  //     .domain([0, 500])
  //     .range([height, 0]);
  //   // svg.append("g")
  //   //   .call(d3.axisLeft(y));
  //
  //   // Add a scale for bubble size
  //   var z = d3.scaleSqrt()
  //     .domain([0, 500])
  //     .range([0, 250]);
  //
  //   // Add a scale for bubble color
  //   // var myColor = d3.scaleOrdinal()
  //   //   .domain(res)
  //   //   .range(d3.schemeSet2);
  //
  //   var myColor = d3.scaleOrdinal()
  //     .domain(d3.range(10))
  //     .range(["#157A6E", "#499F68", "#77B28C", "#B4654A", "#A63D40", "#E9B872", "#331832", "#FFE8D1", "#61210F", "#C7DFC5"])
  //
  //   // -1- Create a tooltip div that is hidden by default:
  //   var tooltip = d3.select("#bubbleCourses")
  //     .append("div")
  //     .style("opacity", 0)
  //     .attr("class", "tooltip")
  //     .style("background-color", "black")
  //     .style("border-radius", "5px")
  //     .style("padding", "10px")
  //     .style("color", "white")
  //
  //   // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  //   var showTooltip = function (d) {
  //     tooltip
  //       .transition()
  //       .duration(200)
  //     tooltip
  //       .style("opacity", 1)
  //       .html(["Course: " + d.course_name, " Number of enrollments: " + d.count])
  //       .style("left", (d3.mouse(this)[0] + 30) + "px")
  //       .style("top", (d3.mouse(this)[1] + 30) + "px")
  //   }
  //   var moveTooltip = function (d) {
  //     tooltip
  //       .style("left", (d3.mouse(this)[0] + 30) + "px")
  //       .style("top", (d3.mouse(this)[1] + 30) + "px")
  //   }
  //   var hideTooltip = function (d) {
  //     tooltip
  //       .transition()
  //       .duration(200)
  //       .style("opacity", 0)
  //   }
  //   var points = Array(500).fill(0).map(() => Array(500).fill(0));
  //   var centers = [];
  //   var max = 450;
  //   var min = 50;
  //
  //
  //   data.forEach(d => {
  //     var flag = 0;
  //     // console.log(d.count)
  //
  //     while (true) {
  //       var a = Math.round(Math.random() * (max - min + 1)) + min;
  //       var b = Math.round(Math.random() * (max - min + 1)) + min;
  //       for (var i = Math.max(0, (a - r)); i < Math.min((a + r), 500); i++) {
  //         for (var j = Math.max(0, (b - r)); j < Math.min(500, (b + r)); j++) {
  //           if (points[i][j] == 1) {
  //             flag = 1;
  //           }
  //         }
  //       }
  //       if (flag == 0) {
  //         break;
  //       }
  //     }
  //
  //     var r = 3 * Math.round(d.count);
  //     centers.push([a, b])
  //
  //     for (var i = Math.max(0, (a - r)); i < Math.min((a + r), 500); i++) {
  //       for (var j = Math.max(0, (b - r)); j < Math.min(500, (b + r)); j++) {
  //         points[i][j] = 1;
  //       }
  //     }
  //
  //
  //   });
  //   var p = 0;
  //   var q = 0;
  //   // Add dots
  //   svg.append('g')
  //     .selectAll("dot")
  //     .data(data)
  //     .enter()
  //     .append("circle")
  //     .attr("class", "bubbles")
  //     .attr("cx", function (d) {
  //       return x(centers[q++][0]);
  //     })
  //     .attr("cy", function (d) {
  //       return y(centers[p++][1]);
  //     })
  //     .attr("r", function (d) {
  //       return z(Math.round(Math.sqrt(d.count)));
  //     })
  //     .style("fill", function (d) {
  //       return myColor(d.course_name);
  //     })
  //     // -3- Trigger the functions
  //     .on("mouseover", showTooltip)
  //     .on("mousemove", moveTooltip)
  //     .on("mouseleave", hideTooltip)
  //
  //
  //   var highlight = function (d) {
  //     // reduce opacity of all groups
  //     d3.selectAll(".bubbles").style("opacity", .05)
  //     // expect the one that is hovered
  //     d3.selectAll("." + d).style("opacity", 1)
  //   }
  //
  //   // And when it is not hovered anymore
  //   var noHighlight = function (d) {
  //     d3.selectAll(".bubbles").style("opacity", 1)
  //   }
  //
  //
  //
  //   // Add one dot in the legend for each name.
  //   var size = 20
  //   var allgroups = res
  //   svg.selectAll("myrect")
  //     .data(allgroups)
  //     .enter()
  //     .append("circle")
  //     .attr("cx", 390)
  //     .attr("cy", function (d, i) {
  //       return 10 + i * (size + 5)
  //     }) // 100 is where the first dot appears. 25 is the distance between dots
  //     .attr("r", 7)
  //     .style("fill", function (d) {
  //       return myColor(d)
  //     })
  //     .on("mouseover", highlight)
  //     .on("mouseleave", noHighlight)
  //
  //   // Add labels beside legend dots
  //   svg.selectAll("mylabels")
  //     .data(allgroups)
  //     .enter()
  //     .append("text")
  //     .attr("x", 390 + size * .8)
  //     .attr("y", function (d, i) {
  //       return i * (size + 5) + (size / 2)
  //     }) // 100 is where the first dot appears. 25 is the distance between dots
  //     .style("fill", function (d) {
  //       return myColor(d)
  //     })
  //     .text(function (d) {
  //       return d
  //     })
  //     .attr("text-anchor", "left")
  //     .style("alignment-baseline", "middle")
  //     .on("mouseover", highlight)
  //     .on("mouseleave", noHighlight)
  //
  // });
// }
//
// q.defer(bubbleGraph);
// <!DOCTYPE html>
// <meta charset="utf-8">
// <style type="text/css">
// text {
//   font: 10px sans-serif;
// }
// circle {
//     stroke: #565352;
//     stroke-width: 1;
// }
// </style>
// <body>
// <script src="https://d3js.org/d3.v3.min.js"></script>
// <script>




// var width = 960,
//     height = 500,
//     padding = 1.5, // separation between same-color nodes
//     clusterPadding = 6, // separation between different-color nodes
//     maxRadius = 12;
//
// var color = d3.scaleOrdinal()
//       .range(["#7A99AC", "#E4002B"]);
//
//
//
// d3.text("/home/wei/com-480-project-xiaozu/data/csv/section_enrollment.csv", function(error, text) {
//   if (error) throw error;
//   var colNames = "year, course_name, section, enrollments\n" + text;
//   var data = d3.csv.parse(colNames);
//   consol.log(data)
//   data.forEach(function(d) {
//     d.size = +d.enrollments;
//   });
//   data.forEach(function(d) {
//     d.group = +d.section;
//   });
//
// //unique cluster/group id's
// var cs = [];
// data.forEach(function(d){
//         if(!cs.contains(d.group)) {
//             cs.push(d.group);
//         }
// });
//
// var n = data.length, // total number of nodes
//     m = cs.length; // number of distinct clusters
//
// //create clusters and nodes
// var clusters = new Array(m);
// var nodes = [];
// for (var i = 0; i<n; i++){
//     nodes.push(create_nodes(data,i));
// }
//
// var force = d3.layout.force()
//     .nodes(nodes)
//     .size([width, height])
//     .gravity(.02)
//     .charge(0)
//     .on("tick", tick)
//     .start();
//
// var svg = d3.select("#bubbleCourses").append("svg")
//     .attr("width", width)
//     .attr("height", height);
//
//
// var node = svg.selectAll("circle")
//     .data(nodes)
//     .enter().append("g").call(force.drag);
//
//
// node.append("circle")
//     .style("fill", function (d) {
//     return color(d.cluster);
//     })
//     .attr("r", function(d){return d.radius})
//
//
// node.append("text")
//       .attr("dy", ".3em")
//       .style("text-anchor", "middle")
//       .text(function(d) { return d.course_name.substring(0, d.radius / 3); });
//
//
//
//
// function create_nodes(data,node_counter) {
//   var i = cs.indexOf(data[node_counter].group),
//       r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
//       d = {
//         cluster: i,
//         radius: data[node_counter].size*1.5,
//         text: data[node_counter].course_name,
//         x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
//         y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
//       };
//   if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
//   return d;
// };
//
//
//
// function tick(e) {
//     node.each(cluster(10 * e.alpha * e.alpha))
//         .each(collide(.5))
//     .attr("transform", function (d) {
//         var k = "translate(" + d.x + "," + d.y + ")";
//         return k;
//     })
//
// }
//
// // Move d to be adjacent to the cluster node.
// function cluster(alpha) {
//     return function (d) {
//         var cluster = clusters[d.cluster];
//         if (cluster === d) return;
//         var x = d.x - cluster.x,
//             y = d.y - cluster.y,
//             l = Math.sqrt(x * x + y * y),
//             r = d.radius + cluster.radius;
//         if (l != r) {
//             l = (l - r) / l * alpha;
//             d.x -= x *= l;
//             d.y -= y *= l;
//             cluster.x += x;
//             cluster.y += y;
//         }
//     };
// }
//
// // Resolves collisions between d and all other circles.
// function collide(alpha) {
//     var quadtree = d3.geom.quadtree(nodes);
//     return function (d) {
//         var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
//             nx1 = d.x - r,
//             nx2 = d.x + r,
//             ny1 = d.y - r,
//             ny2 = d.y + r;
//         quadtree.visit(function (quad, x1, y1, x2, y2) {
//             if (quad.point && (quad.point !== d)) {
//                 var x = d.x - quad.point.x,
//                     y = d.y - quad.point.y,
//                     l = Math.sqrt(x * x + y * y),
//                     r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
//                 if (l < r) {
//                     l = (l - r) / l * alpha;
//                     d.x -= x *= l;
//                     d.y -= y *= l;
//                     quad.point.x += x;
//                     quad.point.y += y;
//                 }
//             }
//             return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//         });
//     };
// }
// });
//
// Array.prototype.contains = function(v) {
//     for(var i = 0; i < this.length; i++) {
//         if(this[i] === v) return true;
//     }
//     return false;
// };
//
// </script>
