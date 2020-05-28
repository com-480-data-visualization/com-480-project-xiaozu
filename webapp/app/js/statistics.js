import { all_sections } from "./section_colors.js";
import { section_colors } from "./section_colors.js";
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

export function load_side_bar(student_name){

  var courses_by_student_url = getHostUrl() + "/courses/?student=" + encodeURI(student_name);

  $.ajax({
      url: courses_by_student_url, success: function (courses_by_stud) {
          // show btn
          $("#slide-courses").css("visibility", "visible");

          // hideLoaderBadges();
          document.getElementById("coursesbadges").innerHTML = ""; // reset

          // show badges
          courses_by_stud.forEach((course, idx) => {
              $("#coursesbadges").append(
                  `<li style="margin-bottom: 10px;">
                      <div class="row">
                          <div class="col-1">
                              <button type="button" id="small_lock_button_${idx}" class="btn buttons-icon-lock"
                              value="${course.course_name}">
                                  <i class="fas ${locked_courses.indexOf(course.course_name) == -1 ? "fa-lock-open": "fa-lock"}"></i>
                              </button>
                          </div>
                          <div class="col-11">
                              ${course.course_name}
                          </div>
                      </div>
                  </li>`
                  );
          });
          courses_by_stud.forEach((_, idx) => {
            var lockButton = document.getElementById("small_lock_button_" + idx.toString());
            lockButton.addEventListener("click", function(event) {
              removeCourse(event.target);
            })
          });

      }
  });

}
// Concatenate courses name for the URL
// We put $ in the middle as we are sure it is not contained in any course name
function extract_query_courses(course_lst){
  var str_lst = ""
  course_lst.forEach(item => {
    if(item)
      str_lst = str_lst + "$" + encodeURI(item.replace("&", "%26"));
  });
  return str_lst.substring(1, str_lst.length)
}


export function course_network(student_name) {
    var personal_url = getHostUrl() + "/course_network/";
    if(student_name != ""){
      personal_url = personal_url + "?student=" + student_name;
    }
    else {
      personal_url = personal_url + "?courses=" + extract_query_courses(locked_courses);
      console.log("MAD")
    }
    console.log(personal_url)

    d3.json(personal_url, function (error, graph) {
    if (error) throw error;

    if(student_name != ""){
      saved_student_name = student_name;
      locked_courses = [];
      graph.nodes.forEach(function(node){
        if(node.taken == 1){
          locked_courses[locked_courses.length] = node.name;
        }
      })
    }
    console.log(student_name)
    console.log("locked", locked_courses)

    var width = 800;//$(window).width();
    var height = 800; //$(window).height();

    document.getElementById("course_network").innerHTML = "";

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#course_network")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")
      .style("position", "fixed")


    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function (d) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html([d.name])
        .style("left", (d3.event.pageX  + radius * 2) +"px")
        .style("top",  (d3.event.pageY  + radius * 2) + "px")
    }
    var moveTooltip = function (d) {
      tooltip
      .style("left",  (d3.event.pageX  + radius * 2) + "px")
      .style("top",  (d3.event.pageY  + radius * 2) + "px")
    }
    var hideTooltip = function (d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }

    var radius = 5
    var svg = d3.select("#course_network")
        .append("svg")
        //.attr("style", "height: 100%;")
        .attr("viewBox", [20, 20, width-20, height-20])
        .attr("font-size", 8)
        .attr("font-family", "sans-serif")
    //     .call(d3.zoom().on("zoom", function () {
    //         svg.attr("transform", d3.event.transform)
    //      }))
    //    .append("g")

    // var color = d3.scaleOrdinal(d3.schemeCategory20);
    var color = d3.scaleOrdinal()
        .domain(d3.range(20))
        .range(section_colors)

    console.log("grafo", graph)
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(radius * 15))
        .force("x", d3.forceX().strength(0.005))
        .force("y", d3.forceY().strength(0.005))
        .force("charge", d3.forceManyBody().distanceMax(height/2).strength(-60))
        .force("collide", d3.forceCollide(radius).iterations(45))
        .force("center", d3.forceCenter(width / 2, height / 2))

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g")


    var circle = node.append("circle")
        .attr("r", radius)
        .attr("fill", function (d) {
          if(!d.short_name) return color(20);
          return color(all_sections.indexOf(d.short_name.substring(0, d.short_name.indexOf("-"))))
        })
        .style("stroke", function (d) {
          return "green";
        })
        .style("stroke-width", function (d) {
          if(d.taken == 1) return "1.5"
          return false
        })
        .style("stroke-opacity", function (d) {
          if(d.taken == 1) return 1
          return 0.1
        })
        .attr("opacity", 1)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var lables = node.append("text")
        .text(function (d) { if(!d.short_name) return d.name;
          else return "\n" + d.short_name;})
        .attr('text-anchor', 'middle')
        .attr('x', radius)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.25)
        .attr('y', radius * 3);

    node.append("title")
        .text(function (d) { return d.name; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);


    // Registering click to show statistics for the course/node
    node.on("click", showStatistics)
    // -3- Trigger the functions for hovering
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)


    if(student_name != "")
      load_side_bar(student_name);
    else
      load_side_bar(saved_student_name);

    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .attr("cx", function(d) { return d.x = Math.max(8 * radius, Math.min(width - 8 * radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(6 * radius, Math.min(height - 8 * radius, d.y)); });
    }

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

    function showStatistics(d) {
      generate_statistics(d, "statistics-network");
    }

    //hideLoaderBadges();
    //showLoader2();

});
}

/********************************************************
*****************  COURSE STATISTIC *********************
********************************************************/


export function removeCourse(e){
    var course = e.parentNode.value; // TODO: name of the course for information
    var icon = e;
    console.log(locked_courses)
    if(icon.classList.contains("fa-lock-open")){ // course is removed and need to be readded
        icon.classList.remove("fa-lock-open");
        icon.classList.add("fa-lock");
        e.style.color = "#1993AE"; // hide tag
        if(locked_courses.indexOf(course) == -1)
          locked_courses[locked_courses.length] = course;
    } else {
        icon.classList.remove("fa-lock");
        icon.classList.add("fa-lock-open");
        e.style.color = "gray"; // hide tag

        if(locked_courses.indexOf(course) != -1){
          var new_locked_courses = [];
          locked_courses.forEach(item => {
            if(item != course)
              new_locked_courses[new_locked_courses.length] = item;
          })
          locked_courses = new_locked_courses;
        }
    }
    console.log("qua", locked_courses)
    course_network("")
}



/********************************************************
*****************  COURSE STATISTIC *********************
********************************************************/



function fill_course_prof(course_name, id) {
  var course_prof_url = getHostUrl() + "/course_prof/?course_name=" + course_name;
  d3.json(course_prof_url, function (error, res) { //TODO: should return just a json
    if (error) throw error;
    if (res.length < 1) return;
    var div = document.getElementById(id+"-course_prof");
    var lst_prof = res[0].prof.substring(1, res[0].prof.length - 1).split(",")
    var prof_str = ""
    var padding = 1
    for (var i = 0; i < lst_prof.length; i++) {
      prof_str = prof_str.concat(lst_prof[i].substring(padding, lst_prof[i].length - 1))
      if(i < lst_prof.length - 1)
        prof_str = prof_str.concat(", ")
      padding = 2
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
  var div = document.getElementById(id+"-stud_by_major");
  div.innerHTML = "";

  // Set margin and dimesion
  var margin = {top: 20, right: 40, bottom: 40, left: 200};
  var width = 300 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;

  var svg = d3.select(`#${id}-stud_by_major`)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Initialize the X axis
  var x = d3.scaleLinear()
    .domain([0, 1000])
    .range([ 0, width ]);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "start")
      .style("font-size", "5px");

  // Initialize the Y axis
  var y = d3.scaleBand()
    .range([ 0, height])
    .padding(0.1);
  var yAxis = svg.append("g")
    .attr("class", "myYaxis")

  var stud_by_year_url = getHostUrl() + "/course_stats/?course_name=" + course_name + "&year=" + course_year + "&major=1";
  d3.json(stud_by_year_url, function (error, data) {
    if (error) throw error;

    if(data.length < 1){
      return;
    }

    // Set text content
    var html_year = "in " + course_year
    if(html_year.indexOf("cumulative") != -1)
      html_year = "over all years"

    svg.append("text")
        .attr("x", 10 - margin.left)
        .attr("y", 0 - (margin.top - 10))
        .attr("text-anchor", "right")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .text("Most represented majors " + html_year);


    // Sorting majors form themost common (on top)
    data.sort(function(a,b) {
      return b.nr_students - a.nr_students;
    })

    if(data.length > 5){
      var top_5 = []
      for(var i = 0; i < 5; i++)
        top_5[top_5.length] = data[i]
      data = top_5
    }

    var max_enrolled = get_max_nr_students(data);

    for(var i = 0; i < data.length; i++){
      if(data[i].major && data[i].major.length > 30){
        data[i].major = data[i].major.substring(0,27) + "...";
      }
    }
    // Update the X axis
    x.domain([0, d3.max(data, function(d) { return d.nr_students }) ]);
    xAxis.call(d3.axisBottom(x))

    // Update the Y axis
    y.domain(data.map(function(d) { return d.major; }));
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create the u variable
    var u = svg.selectAll("rect")
      .data(data)

    u
      .enter()
      .append("rect") // Add a new rect for each new elements
      .merge(u) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.major); })
        .attr("width", function(d) { return x(d.nr_students); })
        .attr("height", y.bandwidth() )
        .attr("fill", "#2699b2")

    // If less group in the new dataset, I delete the ones not in use anymore
    u
      .exit()
      .remove()

  });

}

function fill_stud_by_year(course_name, id) {

  // Set margin and dimesion
  var margin = {top: 40, right: 40, bottom: 70, left: 40},
  width = 300 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

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

    if (data.length < 1) {
      return;
    }

    svg.append("text")
        .attr("x", 0)
        .attr("y", 0 - (margin.top - 10))
        .attr("text-anchor", "right")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .text("Number of enrolled students by year");

    // Get max number of students enrolled
    var max_enrolled = get_max_nr_students(data)

    // Sorting by year
    var sort_by_year = function (a,b){
      var year_a = parseInt(a.year.substring(0,4))
      var year_b = parseInt(b.year.substring(0,4))
      return year_a - year_b;
    }
    data.sort(sort_by_year);

    // Domain for x-axis
    if(data.length < 1) return;
    var min_year = parseInt(data[0].year.substring(0,4))
    var max_year = parseInt(data[data.length - 1].year.substring(0,4))
    var year_lst = []
    for(var i = min_year; i <= max_year; i++) {
      year_lst[year_lst.length] = i;
    }

    var x = d3.scaleLinear()
      .domain(d3.extent(year_lst, function(d) { return d; }))
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .tickFormat(function(d, i) {
        //Reformat as academic year
        if(d.toString(10).indexOf(".") > -1) return null;
        var year = parseInt(d.toString(10).substring(0,4));
        if(year_lst.length > 5 && year_lst.length < 10) {
          if(year_lst.indexOf(year) % 2 != 0) return null
        }
        else if(year_lst.length > 10){
          if(year_lst.indexOf(year) % 3 != 0) return null
        }
        return year.toString(10) + "-" + (year+1).toString(10);
      }))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, max_enrolled])
      .range([ height, 0 ]);

                    ;
    svg.append("g")
      .call(d3.axisLeft(y).tickFormat(function(d, i) {
        return i % 3 === 0 ? d : null;
      }))

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#9FD1DE")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(parseInt(d.year.substring(0,4))); })
        .y(function(d) { return y(parseInt(d.nr_students)); })
      )

      var tooltip = d3.select(`#${id}-stud_by_year`)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "fixed")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

      var mouseover = function(d) {
        tooltip
          .style("opacity", 1)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
      }
      var mousemove = function(d) {
        tooltip
          .html( "" + d.nr_students + " students")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
      }
      var mouseleave = function(d) {
        tooltip
          .style("opacity", 0)
          .style("transition", "opacity 5s ease-in-out;")
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
        .attr("fill", "#2699b2") // path 72B4C4
        .attr("stroke", false)
        .attr("stroke-width", 0.25)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", function(d) { // Selecting deselecting and updating bars
          if(!d3.select(this).classed("selected")){
            d3.selectAll(".selected").classed("selected", false).attr("stroke", false);
            d3.select(this).classed("selected", true);
            d3.select(this).transition().attr("stroke","#1911F0").attr("stroke-width", 2);
            fill_stud_by_major(course_name, d.year, id);
          }
          else {
            d3.select(this).classed("selected", false);
            d3.select(this).transition().attr("stroke", false).attr("stroke-width", 0.25);
            fill_stud_by_major(course_name, "cumulative", id);
          }
        })
    fill_stud_by_major(course_name, "cumulative", id);

  });
}


export function generate_statistics(d, id, network_stats=true) {
    var div = document.getElementById(id);
    console.log("D", d)
    div.innerHTML = `
                    <div class="showStatistics" style="width: 18rem;">
                    <h5> ${d.short_name}  ${d.name}
                    ${network_stats ? `
                    <button type="button" class="btn buttons-icon-lock"
                            value="${d.name}" id="lock_button">
                            <i class="fas ${locked_courses.indexOf(d.name) == -1? "fa-lock-open": "fa-lock"}"></i>

                    </button>
                    ` : ""}
                    </h5>

                    <div id="${id}-course_prof"></div>
                    <div id="${id}-stud_by_year"></div>
                    <br>
                    <div id="${id}-stud_by_major"></div>
                      `;

    fill_course_prof(d.name, id);
    fill_stud_by_year(d.name, id);

    var lockButton = document.getElementById("lock_button");
    lockButton.addEventListener("click", function(event) {
      removeCourse(event.target);
    });


}
