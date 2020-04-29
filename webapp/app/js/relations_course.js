// Giving a course return a graph with the relations between courses taken also from other students
// https://observablehq.com/@d3/chord-diagram
// Construct matrix for storing data
var courseConnections = [{"name": "A", "connects": [{"B" : 2}, {"C": 1}]}, {"name": "B", "connects": [{"A": 2}, {"C": 40}]}, {name: "C", "connects": [{"A": 10}, {"B": 40}]}];
var coursesNames = ["ML", "Deep Learning", "ADA"];

var indexByName = new Map;
var matrix = [];

let num_courses = courseConnections.length;

// structures: [Array(0, 0, 0), Array(0, 0, 0), Array(0, 0, 0)]; 
for(var i = 0; i < num_courses; i++){
    matrix.push(new Array(num_courses));
}

let n = 0;

// name A B C
// A    1 0.6 0.9
// B    0.4 1 0.4
// C    0.2 0.4 1

// Create {"A" => 0, "B" => 1, "C" => 2}
courseConnections.forEach(d => {
  if (!indexByName.has(d = d.name)) {
    indexByName.set(d, n++);
  }
})

courseConnections.forEach(d => {
  var from = indexByName.get(d.name);
  var connections_vect = matrix[from]
  connections_vect[from] = 1

  d.connects.map(c => {
    nameCourse = Object.keys(c)[0];
    var idx = indexByName.get(nameCourse);
    connections_vect[idx] = c[nameCourse];
  })
})

var color = d3.scaleOrdinal()
    .domain(d3.range(10))
    .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd"])

// var color = ["#8dd3c7"
// , "#ffffb3"
// , "#bebada"
// , "#fb8072"
// , "#80b1d3"
// , "#fdb462"
// , "#b3de69"
// , "#fccde5"
// , "#d9d9d9"
// , "#bc80bd"
//   , "#ccebc5"
//   , "#ffed6f"
// ]

var outerRadius = Math.min(width, height) * 0.5 - 30
var innerRadius = outerRadius - 20
var height = Math.min(640, width)
var data = matrix;



function groupTicks(d, step) {
  const k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, step).map(value => {
    return {value: value, angle: value * k + d.startAngle};
  });
}

var formatValue = d3.formatPrefix(",.0", 1e3)

var chord = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending)


var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)


var ribbon = d3.ribbon()
    .radius(innerRadius)




var svg = d3.select("#relationsCourse")
          .append("svg")
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("font-size", 10)
          .attr("font-family", "sans-serif");
    
var chords = chord(data);
    
var group = svg.append("g")
        .selectAll("g")
        .data(chords.groups)
        .enter().append('g')
        .attr("class", "group")
        .on("mouseover", mouseover);

        var paths = group.append("path")
      .attr("fill", d => color(d.index))
      .attr("stroke", d => d3.rgb(color(d.index)).darker())
      .attr("id", function(d, i) { return "group" + i; })
      .attr("d", arc);
    
      // group.append("path")
      //     .attr("fill", d => color(d.index))
      //     .attr("stroke", d => d3.rgb(color(d.index)).darker())
      //     .attr("d", arc);
    
var groupTick = group.append("g")
        .selectAll("g")
        .data(d => groupTicks(d, 2e4))
        .enter().append('g')
        .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);
    
      groupTick.append("line")
          .attr("stroke", "#000")
          .attr("x2", 6);
    
      groupTick
        .filter(d => d.value % 5e3 === 0)
        .append("text")
          .attr("x", 8)
          .attr("dy", ".35em")
          .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
          .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
          .text(d => formatValue(d.value));
   
          var groupText = group.append("text")
          .attr("x", 6)
          .attr("dy", 13);   
          
          groupText.append("textPath")
    .attr("xlink:href", function(d, i) { return "#group" + i; })
    .text(function(d, i) { return coursesNames[i]; });
  
    const ribbons = svg.append("g")
          .attr("fill-opacity", 0.67)
        .selectAll("path")
        .data(chords)
        .enter().append('path')
          .attr("d", ribbon)
          .attr("fill", d => color(d.target.index))
          .attr("stroke", d => d3.rgb(color(d.target.index)).darker());
    

          function mouseover(d, i) {
            ribbons.classed("fade", function(p) {
              return p.source.index != i
                  && p.target.index != i;
            });
          }


          function rbmouse(d, i) {
            if (!this.classList.contains("fade")) {
              var t = d.target.index + " -> " + d.source.index + ": " + d.source.value;
              t += d.source.index + " -> " + d.target.index + ": " + d.target.value;
              textbox.text(t);
            }
          }
          
          var textbox = svg.append("text")
            .attr("x", -outerRadius)
            .attr("y", -outerRadius)
            .text("");