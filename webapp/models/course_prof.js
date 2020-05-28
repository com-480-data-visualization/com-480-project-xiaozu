var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CourseProfSchema = new Schema({
    course_name : { type: String, required: true},
    prof: {type: String,  required: true}
},{ collection: 'course_prof' });
module.exports = mongoose.model('course_prof', CourseProfSchema);
