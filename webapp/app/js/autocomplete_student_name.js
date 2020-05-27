import { removeCourse } from "./statistics.js";
import { generate_statistics  } from "./statistics.js";
import { course_network  } from "./statistics.js";

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

                showLoaderBadges();
                course_network( host + "/course_network/?student=" + name_student);
                //q.defer(course_network);
            }
        });
    });
});
