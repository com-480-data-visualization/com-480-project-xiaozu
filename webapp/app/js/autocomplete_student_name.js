import { removeCourse } from "./statistics.js";
import { generate_statistics  } from "./statistics.js";
import { course_network  } from "./statistics.js";
import { load_side_bar  } from "./statistics.js";

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
    }).bind("typeahead:selected", function (obj, student_name, name) {
        showLoaderBadges();

        course_network(student_name);

    });
});
