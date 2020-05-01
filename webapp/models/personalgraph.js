var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var JaccardSchema = new Schema({
    course_name_x: { type: String, required: true},
    course_name_y: { type: String, required: true},
    jaccard: {type: Number, required: true }
},{ collection: 'personalgraph' });
module.exports = mongoose.model('personalgraph', JaccardSchema);
