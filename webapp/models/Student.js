var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentSchema = new Schema({
    student_id: {type: String,  required: true},
    student_name: { type: String, required: true},
    section: { type: String, required: true }
});
module.exports = mongoose.model('Student', StudentSchema);