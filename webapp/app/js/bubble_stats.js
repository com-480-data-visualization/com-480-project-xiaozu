export function bubble_statistics(node, id) {
    var div = document.getElementById(id);
    div.innerHTML = `
                    <div class="showStatistics" style="width: 30rem;">
                    <div style="font-size:20px;" id="${id}-section_total"></div>
                    <div style="font-size:20px;" id="${id}-course_total"></div>
                    <div style="font-size:20px;" id="${id}-course_l"></div>
                    <div id="${id}-course_section"></div>
                      `;
    course_l(node, id)
    section_total(node, id)
    course_total(node, id);
    course_section(node, id);
}
function course_l(node, id) {
//TODO: should return just a json
    var div = document.getElementById(id+"-course_l");
    div.innerHTML = `
    <div> Details of sections: <div>
    `;
}
function course_total(node, id) {
//TODO: should return just a json
    var div = document.getElementById(id+"-course_total");
    div.innerHTML = `
    <div> Total number of courses in the sections: <i> ${node.length} </i>  <div>
    `;
}
function section_total(node, id) {
//TODO: should return just a json
var section_list = new Set()

for(var i = 0;i<node.length;i++){
  section_list.add(node[i].section)
}
    var div = document.getElementById(id+"-section_total");
    div.innerHTML = `
    <div> Number of section you choose: <i> ${section_list.size} </i>  <div>
    `;
}
function course_section(node, id){
  var div = document.getElementById(id+"-course_section");
  div.innerHTML = `
    <label><input type="radio" class="dataset" name="dataset" id="dataset" value="Course" checked> Number of courses</label>
    <label><input type="radio" class="dataset" name="dataset" id="dataset" value="Enrollments"> Average number of enrollments</label>`;

  // Set margin and dimesion
  var margin = {top: 20, right: 10, bottom: 10, left: 60};
  var width = 300 - margin.left - margin.right;
  var height =400 - margin.top - margin.bottom;

  var svg = d3.select(`#${id}-course_section`)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

var section_list = new Set()
for(var i = 0;i<node.length;i++){
  section_list.add(node[i].section)
}

var datasetCourse = []
var datasetEnroll = []
var node_course = new Array(section_list.size).fill(0)
var node_enrol = new Array(section_list.size).fill(0)
for(var i=0;i<node_course.length;i++){
  node_course[i] = 0
}
for(var i=0;i<node_enrol.length;i++){
  node_enrol[i] = 0
}

for(var i=0; i < node.length; i++){
  var idx = Array.from(section_list).indexOf(node[i].section)
  var aaa=node_course[idx]
  node_course[idx]=aaa + 1
  var bbb = node_enrol[idx]
  node_enrol[idx]= bbb + parseInt(node[i].enrol)
}

for(var i=0;i<section_list.size;i++){
  var d = {label:Array.from(section_list)[i], value: node_course[i]}
  datasetCourse.push(d)
  var b = {label:Array.from(section_list)[i], value: Math.floor(node_enrol[i]/node_course[i])}
  datasetEnroll.push(b);
}

    // Initialize the X axis
    d3.selectAll(".dataset").on("change", selectDataset);

      function selectDataset()
      {

          var value = this.value;

          if (value == "Course")
          {
              change(datasetCourse);
          }
          else if (value == "Enrollments")
          {

              change(datasetEnroll);
          }

      }
      var x = d3.scaleLinear()
        .domain([0, 500])
        .range([ 0, width ]);
      var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "start")
          .style("font-size", "5px");

      // Initialize the Y axis

//.tickFormat(formatPercent);
var y = d3.scaleBand()
  .range([ 0, height])
  .padding(0.1);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

// d3.select("input[value=\"Course\"]").property("checked", true);
change(datasetCourse);

   function change(dataset) {

    y.domain(dataset.map(function(d) { return d.label; }));
    x.domain([0, d3.max(dataset, function(d) { return d.value; })]);
    xAxis.call(d3.axisBottom(x))
    yAxis.transition().duration(1000).call(d3.axisLeft(y));
    var bar = svg.selectAll(".bar")
                    .data(dataset)
    bar.enter().append("rect")
      .attr("class", "bar") // Add a new rect for each new elements
      .transition() // and apply changes to all of them
      .duration(1000)
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.value); })
        .attr("height", y.bandwidth() )
        .attr("fill", "#2699b2")


    var t =  svg.selectAll(".text")
           .data(dataset)

      t.enter()
           .append("text")
           .attr("class", "text")
           .transition()
           .text(function(d) {  return d.value; })
           .attr("x", function(d){
              return x(d.value)-10;
           })
           .attr("y", function(d){
              return y(d.label)+ y.bandwidth()/2+2;
           })
           .attr("font-family" , "sans-serif")
           .attr("font-size" , "11px")
           .attr("fill" , "white")
          .attr("text-anchor", "middle");

bar.exit().remove();
t.exit().remove();
        // updated data:
  bar.transition()
          .duration(750)
          .attr("x", function(d) { return 0; })
          .attr("y", function(d) { return y(d.label); })
          .attr("width", function(d) { return x(d.value); })
          .attr("height", y.bandwidth());

          t.transition()
                .duration(750)
                .text(function(d) {return d.value; })
                 .attr("x", function(d){
                    return x(d.value)-10;
                 })
                 .attr("y", function(d){
                    return y(d.label)+ y.bandwidth()/2+2;
                 })

}
}
