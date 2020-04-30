var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var JaccardSchema = new Schema({
    course_name: { type: String, required: true},
    set: {type: String, required: true }
},{ collection: 'jaccard' });
module.exports = mongoose.model('jaccard', JaccardSchema);