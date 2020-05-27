import { generate_statistics } from "./statistics.js";
import { section_colors } from "./section_colors.js";
import { all_sections } from "./section_colors.js";

$.get('app/students.txt',{},function(content){

    var students = content.split('\n');


function hideLoaderBadges() {
    $('#loading-badges').hide();
}

function showLoaderBadges() {
    $('#loading-badges').css("visibility", "visible");
}


function showLoader2() {
    $('#loading2').css("visibility", "visible");
}

function removeCourse(e){
    var course = e.getAttribute("value"); // TODO: name of the course for information
    var icon = e.children[0];


    if(icon.classList.contains("fa-lock-open")){ // course is removed and need to be readded
        icon.classList.remove("fa-lock-open");
        icon.classList.add("fa-lock");
        e.style.color = "#1993AE"; // hide tag
    } else {
        icon.classList.remove("fa-lock");
        icon.classList.add("fa-lock-open");
        e.style.color = "gray"; // hide tag
    }
}

/********************************************************
*****************  COURSE STATISTIC *********************
********************************************************/

// Constructing the suggestion engine
var students = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: students
});

// Initializing the typeahead
$('.typeahead').typeahead({
    hint: true,
    highlight: true, /* Enable substring highlighting */
    minLength: 1 /* Specify minimum characters required for showing result */
},
    {
        name: 'students',
        source: students
    }).bind("typeahead:selected", function (obj, datum, name) {
        showLoaderBadges();
        var name_student = datum.replace(/ /g, "%20");

        // Send query and return courses done by a student
        var host = window.location.hostname;

        if (host.indexOf('localhost') > -1) {
            //is development
            host = "http://" + host + ":3000";
        } else {
            // is production
            host = "https://" + host;
        }

        var courses_by_student_url = host + "/courses/?student=" + name_student;


        $.ajax({
            url: courses_by_student_url, success: function (courses_by_stud) {

                // show btn
                $("#slide-courses").css("visibility", "visible");

                // hideLoaderBadges();
                document.getElementById("coursesbadges").innerHTML = ""; // reset

                // show badges
                courses_by_stud.forEach(course => {
                    $("#coursesbadges").append(
                        `<li style="margin-bottom: 10px;">
                            <div class="row">
                                <div class="col-1">
                                    <button type="button" class="btn buttons-icon-lock"
                                    value="${course.course_name}" onclick="removeCourse(this);">
                                        <i class="fas fa-lock"></i>
                                    </button>
                                </div>
                                <div class="col-11">
                                    ${course.course_name}
                                </div>
                            </div>
                        </li>`
                        );
                });

                var host = window.location.hostname;
                if (host.indexOf('localhost') > -1) {
                    //is development
                    host = "http://" + host + ":3000";
                } else {
                    // is production
                    host = "https://" + host;
                }

                var personal_url = host + "/course_network/?student=" + name_student;

                console.log(personal_url)


                showLoaderBadges();

                function course_network() {
                    d3.json(personal_url, function (error, graph) {
                    if (error) throw error;

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

                    console.log(graph)
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

                    hideLoaderBadges();
                    showLoader2();

                });
            }

                q.defer(course_network);
            }
        });
    });
});
