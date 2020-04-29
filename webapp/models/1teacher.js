var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TeacherSchema = new Schema({
    course_id : { type: String, required: true },
    prof : { type: String, required: true}
},{ collection: 'teacher' });
module.exports = mongoose.model('teacher', TeacherSchema);