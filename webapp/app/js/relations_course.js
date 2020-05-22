// Giving a course return a graph with the relations between courses taken also from other students
// https://observablehq.com/@d3/chord-diagram and https://observablehq.com/@adrianpearl/migration-between-states#height
// Construct matrix for storing data
export function chord(course, idDiv) {
  function hideLoader2() {
    $('#loading2').hide();
  }
  var host = window.location.hostname;
  
  if (host.indexOf('localhost') > -1) {
    //is development
    host = "http://" + host + ":3000";
  } else {
    // is production
    host = "https://" + host;
  }

  var course_parsed = course.replace(/\s/g, '%20');
  
  var course_related_url = host + `/courses_related/?course=${course_parsed}&max=5`
  
  function relationGraph() {
    d3.json(course_related_url, function (error, courseConnections) {
      hideLoader2();
  
      var width = 500;
      var height = 500;
  
      // Example format
      // var courseConnections = [{ "name": "A", "connects": [{ "B": 2 }, { "C": 1 }] }, { "name": "B", "connects": [{ "A": 2 }, { "C": 40 }] }, { name: "C", "connects": [{ "A": 10 }, { "B": 40 }] }];
      // var coursesNames = ["ML", "Deep Learning", "ADA"];
      var coursesNames = courseConnections.map(d => d.name);
  
      var indexByName = new Map;
      var matrix = [];
  
      let num_courses = courseConnections.length;
  
      // structures: [Array(0, 0, 0), Array(0, 0, 0), Array(0, 0, 0)]; 
      for (var i = 0; i < num_courses; i++) {
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
        connections_vect[from] = 0
  
        d.connects.map(c => {
          var nameCourse = Object.keys(c)[0];
          var idx = indexByName.get(nameCourse);
          connections_vect[idx] = c[nameCourse];
        })
      })
  
      var color = d3.scaleOrdinal()
        .domain(d3.range(10))
        .range(["#157A6E", "#499F68", "#77B28C", "#B4654A", "#A63D40", "#E9B872", "#331832", "#FFE8D1", "#61210F", "#C7DFC5"])
  
      var outerRadius = Math.min(width, height) * 0.5 - 30;
      var innerRadius = outerRadius - 20
      var height = Math.min(640, width)
      var data = matrix;
  
      var chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)
  
  
      var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
  
  
      var ribbon = d3.ribbon()
        .radius(innerRadius)
  
        console.log(outerRadius)

      document.getElementById(idDiv).innerHTML = ""; // remove all
  
      var svg = d3.select(`#${idDiv}`)
        .append("svg")
        .attr("style", "height: 150px;")
        .attr("viewBox", [-400,-250,900,500])
        .attr("font-size", 8)
        .attr("font-family", "sans-serif");
  
      var chords = chord(data);
  
      var group = svg.append("g")
        .selectAll("g")
        .data(chords.groups)
        .enter().append('g')
        .attr("class", "group")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
  
      var paths = group.append("path")
        .attr("fill", d => color(d.index))
        .attr("stroke", d => d3.rgb(color(d.index)).darker())
        .attr("id", function (d, i) { return "group" + i; })
        .attr("d", arc);
  
      var groupText = group.append("text")
        .attr("x", 10)
        .attr("dy", -5);
  
      groupText.append("textPath")
        .attr("xlink:href", function (d, i) { return "#group" + i; })
        .text(function (d, i) { 
          return coursesNames[i]; 
        });
  
      const ribbons = svg.append("g")
        .attr("fill-opacity", 0.67)
        .selectAll("path")
        .data(chords)
        .enter().append('path')
        .attr("d", ribbon)
        .attr("fill", d => color(d.target.index))
        .attr("stroke", d => d3.rgb(color(d.target.index)).darker());
  
  
      function mouseover(d, i) {
        ribbons.classed("fade", function (p) {
          return p.source.index != i
            && p.target.index != i;
        });
      }

      function mouseout(d, i){
        // show chord without hide ribbons
        ribbons.classed("fade", false); //remove effect
      }
    });
  }
  
  q.defer(relationGraph);
}


