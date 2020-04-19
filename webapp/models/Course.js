var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CourseSchema = new Schema({
    course_id : { type: String, required: true },
    course_name : { type: String, required: true},
    year: {type: String,  required: true}
});
module.exports = mongoose.model('Course', CourseSchema);