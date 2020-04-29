// Giving a course return a graph with the relations between courses taken also from other students

// Construct matrix for storing data
var imports = [{"name": "A", "connects": [{"B" : 2}, {"C": 1}]}, {"name": "B", "connects": [{"A": 2}, {"C": 40}]}, {name: "C", "connects": [{"A": 10}, {"B": 40}]}];

var indexByName = new Map;
var nameByIndex = new Map;
var matrix = [];
let n = 0;

  // // Returns the Flare package name for the given class name.
  // function name(name) {
  //   return name.substring(0, name.lastIndexOf(".")).substring(6);
  // }

  // Compute a unique index for each package name.
imports.forEach(d => {
    if (!indexByName.has(d = d.name)) {
      nameByIndex.set(n, d);
      indexByName.set(d, n++);
    }
});

  // Construct a square matrix counting package imports.
  imports.forEach(d => {
    const source = indexByName.get(d.name);
    let row = matrix[source];
    if (!row) row = matrix[source] = Array.from({length: n}).fill(0);
    d.connects.forEach(d => row[indexByName.get(d)]++);
  });


var width = 954;
var height = 954;

var chord = d3.chord()
    .padAngle(.04)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(innerRadius + 20)

var ribbon = d3.ribbon()
    .radius(innerRadius)

var color = d3.scaleOrdinal(d3.schemeCategory10)
var outerRadius = Math.min(width, height) * 0.5
var innerRadius = outerRadius - 124

var svg = d3.select("#relationsCourse")
  .append("svg")
  .attr("viewBox", [-width / 2, -height / 2, width, height])
  .attr("font-size", 10)
  .attr("font-family", "sans-serif")
  .style("width", "100%")
  .style("height", "auto");

var chords = chord(matrix);
console.log(chords.groups)

const group = svg.append("g")
    .selectAll("g")
    .data(chords.groups)
    .append("g");

group.append("path")
      .attr("fill", d => color(d.index))
      .attr("stroke", d => color(d.index))
      .attr("d", arc);

group.append("text")
      .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("transform", d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${innerRadius + 26})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => data.nameByIndex.get(d.index));

svg.append("g")
    .attr("fill-opacity", 0.67)
    .selectAll("path")
    .data(chords)
    .append("path")
      .attr("stroke", d => d3.rgb(color(d.source.index)).darker())
      .attr("fill", d => color(d.source.index))
      .attr("d", ribbon);

// console.log(svg.node());