var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var JaccardSchema = new Schema({
    course_name_x: { type: String, required: true},
    course_name_y: { type: String, required: true},
    jaccard: {type: Number, required: true }
},{ collection: 'course_network' });
module.exports = mongoose.model('course_network', JaccardSchema);
