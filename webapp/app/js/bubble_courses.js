let default_year = [2019, 2020];
let num_courses_to_show = 10;

function showLoaderBubble() {
  $('#loading1').css("visibility", "visible");
}

function hideLoaderBubble() {
  $('#loading1').hide();
}

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

  onFinish: function(data){
    default_year = [data.from, data.to];
    showLoaderBubble();
    q.defer(bubbleGraph);
    courses_url = host + `/top_courses/?max=${num_courses_to_show}&year=${default_year[0]}-${default_year[1]}`
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

let courses_url = host + `/top_courses/?max=${num_courses_to_show}&year=${default_year[0]}-${default_year[1]}`

function bubbleGraph() {
  d3.json(courses_url, function (error, data) {
    hideLoaderBubble(); // hide loading

    console.log(courses_url)
    document.getElementById("bubbleCourses").innerHTML = "";

    const margin = { top: 10, right: 20, bottom: 30, left: 30 };

    // the exact dimensions of 400 x 400
    // will only be used for the initial render
    // but the width to height proportion 
    // will be preserved as the chart is resized
    var width = 900 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    

    // append the svg object to the body of the page
    var svg = d3.select("#bubbleCourses")
      .append("svg")
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      // .append("g")
      .call(responsivefy)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
      // .attr("transform",
      //   "translate(" + margin.left + "," + margin.top + ")");


    res = []
    data.map(d => res.push(d.course_name))
    // console.log(res);
    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 500])
      .range([0, width]);
    // svg.append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 500])
      .range([height, 0]);
    // svg.append("g")
    //   .call(d3.axisLeft(y));

    // Add a scale for bubble size
    var z = d3.scaleSqrt()
      .domain([0, 500])
      .range([0, 250]);

    // Add a scale for bubble color
    // var myColor = d3.scaleOrdinal()
    //   .domain(res)
    //   .range(d3.schemeSet2);

    var myColor = d3.scaleOrdinal()
      .domain(d3.range(10))
      .range(["#157A6E", "#499F68", "#77B28C", "#B4654A", "#A63D40", "#E9B872", "#331832", "#FFE8D1", "#61210F", "#C7DFC5"])

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
        .html(["Course: " + d.course_name, " Number of enrollments: " + d.count])
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

    var showStatistics = function (d){
      // clean selections
      d3.selectAll(".bubbles").classed('selectedBubble', false);
      console.log(this)

      // highlight selected bubble
      this.classList.add("selectedBubble");
      var div = document.getElementById("showStatisticCourse");
      div.innerHTML = "";
      div.innerHTML = `
      <div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${d.course_name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="card-link">Card link</a>
          <a href="#" class="card-link">Another link</a>
        </div>
      </div>
      `;
      console.log(d.course_name, " Number of enrollments: " + d.count);
    }
    var points = Array(500).fill(0).map(() => Array(500).fill(0));
    var centers = [];
    var max = 450;
    var min = 50;


    data.forEach(d => {
      var flag = 0;
      // console.log(d.count)
      
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

      var r = 3 * Math.round(d.count);
      centers.push([a, b])
      
      for (var i = Math.max(0, (a - r)); i < Math.min((a + r), 500); i++) {
        for (var j = Math.max(0, (b - r)); j < Math.min(500, (b + r)); j++) {
          points[i][j] = 1;
        }
      }


    });
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
      .on("click", showStatistics)


    // var highlight = function (d) {
    //   // reduce opacity of all groups
    //   d3.selectAll(".bubbles").style("opacity", .05)
    //   // expect the one that is hovered
    //   d3.selectAll("." + d).style("opacity", 1)
    // }

    // // And when it is not hovered anymore
    // var noHighlight = function (d) {
    //   d3.selectAll(".bubbles").style("opacity", 1)
    // }


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
      // TODO: avoid overlap bubbles and legend (same below)
      // the following command is used to hide bubbles when we hover legend however, it looks strange
      // because it seems a bug (personal opnion)
      // .on("mouseover", highlight)
      // .on("mouseleave", noHighlight)

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
      // .on("mouseover", highlight)
      // .on("mouseleave", noHighlight)


      function responsivefy(svg) {
        // container will be the DOM element
        // that the svg is appended to
        // we then measure the container
        // and find its aspect ratio
        const container = d3.select(svg.node().parentNode);
        var width = parseInt(svg.style('width'), 10);
        var height = parseInt(svg.style('height'), 10);
        var  aspect = width / height;
       
        // set viewBox attribute to the initial size
        // control scaling with preserveAspectRatio
        // resize svg on inital page load
        svg.attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMinYMid')
            .call(resize);
       
        // add a listener so the chart will be resized
        // when the window resizes
        // multiple listeners for the same event type
        // requires a namespace, i.e., 'click.foo'
        // api docs: https://goo.gl/F3ZCFr
        d3.select(window).on(
            'resize.' + container.attr('id'), 
            resize
        );
       
        // this is the code that resizes the chart
        // it will be called on load
        // and in response to window resizes
        // gets the width of the container
        // and resizes the svg to fill it
        // while maintaining a consistent aspect ratio
        function resize() {
            const w = parseInt(container.style('width'));
            svg.attr('width', w);
            svg.attr('height', Math.round(w / aspect));
        }
      }

  });
}

q.defer(bubbleGraph);
