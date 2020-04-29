var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EnrollmentSchema = new Schema({
    course_id : { type: String, required: true },
    student_id : { type: String, required: true},
    semester: {type: String, default: "master"}
},{ collection: 'enrollment' });
module.exports = mongoose.model('enrollment', EnrollmentSchema);