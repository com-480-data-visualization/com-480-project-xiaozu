var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CourseEnrollmentSchema = new Schema({
    year : { type: String, required: true },
    course_name : { type: String, required: true},
    section: {type: String, required: true},
    enrollments: {type: Number, required: true}
},{ collection: 'course_bubble' });
module.exports = mongoose.model('course_bubble', CourseEnrollmentSchema);
