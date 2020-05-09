var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CourseEnrollmentSchema = new Schema({
    course_id : { type: String, required: true },
    course_name : { type: String, required: true},
    year: {type: String, required: true},
    count: {type: Number, required: true}
},{ collection: 'courseenrol' });
module.exports = mongoose.model('courseenrol', CourseEnrollmentSchema);

