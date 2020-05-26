/********************************************************
*****************  COURSE STATISTIC *********************
********************************************************/


function getHostUrl() {
  var host = window.location.hostname;
  if (host.indexOf('localhost') > -1) {
      //is development
      host = "http://" + host + ":3000";
  } else {
      // is production
      host = "https://" + host;
  }
  return host
}

function fill_course_prof(course_name, id) {
  var course_prof_url = getHostUrl() + "/course_prof/?course_name=" + course_name;
  d3.json(course_prof_url, function (error, res) { //TODO: should return just a json
    if (error) throw error;
    var div = document.getElementById(id+"-course_prof");
    var lst_prof = res[0].prof.substring(1, res[0].prof.length - 1).split(",")
    var prof_str = "";
    var padding = 1;
    for (var i = 0; i < lst_prof.length; i++) {
      prof_str = prof_str.concat(lst_prof[i].substring(padding, lst_prof[i].length - 1))
      if(i < lst_prof.length - 1)
        prof_str = prof_str.concat(", ");
      padding = 2;
    }
    div.innerHTML = `
    <p> Prof: <i> ${prof_str} </i>  <p>
    `;

  });

}

function get_max_nr_students(data) {
  var max_enrolled = 10;
  for (var i = 0; i < data.length; i++) {
    var nr_students = parseInt(data[i].nr_students);
    if( nr_students > max_enrolled)
      max_enrolled = nr_students;
  }
  // Set the max to the 110% of the original one to avoid points at the very top of the plot
  max_enrolled = max_enrolled + Math.trunc(max_enrolled/10);
  return max_enrolled;
}

function fill_stud_by_major(course_name, course_year, id){
  // Set text content
  var html_year = "in " + course_year
  if(html_year.indexOf("cumulative") != -1)
    html_year = ""
  var div = document.getElementById(id+"-stud_by_major");
  div.innerHTML = `
  <p> Number of enrolled students by major ${html_year} <p>
  `;

  // Set margin and dimesion
  var margin = {top: 10, right: 30, bottom: 30, left: 60};
  var width = 460 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var svg = d3.select(`#${id}-stud_by_major`)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  var stud_by_year_url = getHostUrl() + "/course_stats/?course_name=" + course_name + "&year=" + course_year + "&major=1";
  d3.json(stud_by_year_url, function (error, data) {
    if (error) throw error;
    console.log(data)

    var max_enrolled = get_max_nr_students(data);
    console.log(max_enrolled)

    // Sorting majors form themost common (on top)
    data.sort(function(a,b) {
      return b.nr_students - a.nr_students;
    })

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, max_enrolled])
      .range([ 0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
      .range([ 0, height ])
      .domain(data.map(function(d) { return d.major; }))
      .padding(.1);
    svg.append("g")
      .call(d3.axisLeft(y))

    //Bars
    svg.selectAll("myRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0) )
      .attr("y", function(d) { return y(d.major); })
      .attr("width", function(d) { return x(d.nr_students); })
      .attr("height", y.bandwidth() )
      .attr("fill", "#2699b2")

  });

}

function fill_stud_by_year(course_name, id) {
  // Set text content
  var div = document.getElementById(id+"-stud_by_year");
  div.innerHTML = `
  <p> Number of enrolled students by year<p>
  `;

  // Set margin and dimesion
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  var svg = d3.select(`#${id}-stud_by_year`)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Dra the scatter plot
  var stud_by_year_url = getHostUrl() + "/course_stats/?course_name=" + course_name + "&year=cumulative&major=0";
  d3.json(stud_by_year_url, function (error, data) {
    if (error) throw error;

    // Get max number of students enrolled
    var max_enrolled = get_max_nr_students(data)

    // Sorting by year
    var sort_by_year = function (a,b){
      var year_a = parseInt(a.year.substring(0,4))
      var year_b = parseInt(b.year.substring(0,4))
      return year_a - year_b;
    }
    data.sort(sort_by_year);

    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { var k = parseInt(d.year.substring(0,4)); console.log(k);return k; }))
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, max_enrolled])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#2699b2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) {console.log(x(parseInt(d.year.substring(0,4)))); return x(parseInt(d.year.substring(0,4))) })
        .y(function(d) { return y(parseInt(d.nr_students)) })
      )

      var tooltip = d3.select(`#${id}-stud_by_year`)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

      var mouseover = function(d) {
        tooltip
          .style("opacity", 1)
      }
      var mousemove = function(d) {
        tooltip
          .html( "" + d.nr_students + " students")
          .style("left", (d3.mouse(this)[0]+ 40) + "px")
          .style("top", (d3.mouse(this)[1] + 300) + "px")
      }
      var mouseleave = function(d) {
        tooltip
          .style("opacity", 0)
      }

    // Add the points
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(parseInt(d.year.substring(0,4))) } )
        .attr("cy", function(d) { return y(parseInt(d.nr_students)) } )
        .attr("r", 5)
        .attr("fill", "#2699b2")
        .attr("stroke","black")
        .attr("stroke-width", 0.25)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", function(d) { // Selecting deselecting and updating bars
          if(!d3.select(this).classed("selected")){
            d3.selectAll(".selected").classed("selected", false).attr("stroke","black");
            d3.select(this).classed("selected", true);
            d3.select(this).transition().attr("stroke","red").attr("stroke-width", 2);
            fill_stud_by_major(course_name, d.year)
          }
          else {
            d3.select(this).classed("selected", false);
            d3.select(this).transition().attr("stroke","black").attr("stroke-width", 0.25);
            fill_stud_by_major(course_name, "cumulative")
          }
        })


    fill_stud_by_major(course_name, "cumulative")



  });
}


export function generate_statistics(d, id) {
    var div = document.getElementById(id);
    div.innerHTML = `
                      <div class="showStatistics" style="width: 18rem;">
                        <h5> ${d.name} </h5>
                        <div id="${id}-course_prof"></div>
                        <div id="${id}-stud_by_year"></div>
                        <div id="${id}-stud_by_major"></div>
                      </div>
                      `;

    fill_course_prof(d.name, id);
    fill_stud_by_year(d.name, id);
}
