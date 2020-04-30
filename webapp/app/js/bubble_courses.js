function hideLoader() {
  $('#loading').hide();
}

// set the dimensions and margins of the graph
var margin = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 50
};

var width = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

let courses_url = "http://localhost:3000/top_courses/?max=5&year=2008-2009"

d3.json(courses_url, function (error, data) {
  hideLoader(); // hide loading

  // append the svg object to the body of the page
  var svg = d3.select("#bubbleCourses")
  .append("svg")
  .attr("width", width + margin.left + margin.right + 300)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

  

  console.log(data)
  res = []
  data.map(d => res.push(d.course_name))
  console.log(res);
  // TODO: adapt the following data to graph, see console for data

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 500])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 500])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleSqrt()
    .domain([0, 500])
    .range([0, 250]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(res)
    .range(d3.schemeSet2);

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#bubbleCourses")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function (d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html(["Course: " + d.course_name, "Number of enrollments: " + d.count])
      .style("left", (d3.mouse(this)[0] + 30) + "px")
      .style("top", (d3.mouse(this)[1] + 30) + "px")
  }
  var moveTooltip = function (d) {
    tooltip
      .style("left", (d3.mouse(this)[0] + 30) + "px")
      .style("top", (d3.mouse(this)[1] + 30) + "px")
  }
  var hideTooltip = function (d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }
  var points = Array(500).fill(0).map(() => Array(500).fill(0));
  var centers = [];
  var max = 450;
  var min = 50;
  console.log(data)
  data.forEach(d => {
    var flag = 0;
    while (true) {
      var a = Math.round(Math.random() * (max - min + 1)) + min;
      var b = Math.round(Math.random() * (max - min + 1)) + min;
      for (var i = Math.max(0, (a - r)); i < Math.min((a + r), 500); i++) {
        for (var j = Math.max(0, (b - r)); j < Math.min(500, (b + r)); j++) {
          if (points[i][j] == 1) {
            flag = 1;
          }
        }
      }
      if (flag == 0) {
        break;
      }
    }


    centers.push([a, b])
    var r = 3 * Math.round(d.count);
    for (var i = Math.max(0, (a - r)); i < Math.min((a + r), 500); i++) {
      for (var j = Math.max(0, (b - r)); j < Math.min(500, (b + r)); j++) {
        points[i][j] = 1;
      }
    }


  });
  console.log(centers);
  var p = 0;
  var q = 0;
  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "bubbles")
    .attr("cx", function (d) {
      return x(centers[q++][0]);
    })
    .attr("cy", function (d) {
      return y(centers[p++][1]);
    })
    .attr("r", function (d) {
      return z(Math.round(Math.sqrt(d.count)));
    })
    .style("fill", function (d) {
      return myColor(d.course_name);
    })
    // -3- Trigger the functions
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip)


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



  // Add one dot in the legend for each name.
  var size = 20
  var allgroups = res
  svg.selectAll("myrect")
    .data(allgroups)
    .enter()
    .append("circle")
    .attr("cx", 390)
    .attr("cy", function (d, i) {
      return 10 + i * (size + 5)
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) {
      return myColor(d)
    })
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

  // Add labels beside legend dots
  svg.selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
    .attr("x", 390 + size * .8)
    .attr("y", function (d, i) {
      return i * (size + 5) + (size / 2)
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d) {
      return myColor(d)
    })
    .text(function (d) {
      return d
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

});