var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CourseStudentSchema = new Schema({
    course_name : { type: String, required: true},
    nr_students: {type: Number,  required: true},
    section : { type: String, required: true},
    semester : { type: String, required: true},
    year : { type: String, required: true}
},{ collection: 'course_stats' });
module.exports = mongoose.model('course_stats', CourseStudentSchema);
