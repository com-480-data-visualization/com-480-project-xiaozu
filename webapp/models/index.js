/** @module models/index.js
* Loads all models
*/
'use strict';

const mongoose = require('mongoose');

require('./student');
require('./teacher');
require('./course');
require('./enrollment');
require('./jaccard');
require('./courseenrol');

module.exports = {
  'student' : mongoose.model('student'),
  'teacher' : mongoose.model('teacher'),
  'course' : mongoose.model('course'),
  'enrollment' : mongoose.model('enrollment'),
  'jaccard' : mongoose.model('jaccard'),
  'courseenrol' : mongoose.model('courseenrol'),
}

