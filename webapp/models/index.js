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
require('./course_network');

// Stats endpoints for sidebar plots
// require('./courseprofessor');
// require('./studbyenryear');
// require('./studbysec');
// require('./studebyyear');

module.exports = {
  'student' : mongoose.model('student'),
  'teacher' : mongoose.model('teacher'),
  'course' : mongoose.model('course'),
  'enrollment' : mongoose.model('enrollment'),
  'jaccard' : mongoose.model('jaccard'),
  'courseenrol' : mongoose.model('courseenrol'),
  'course_network' : mongoose.model('course_network'),

  // Stats endpoints for sidebar plots
  // 'courseprofessor' : mongoose.model('courseprofessor'),
  // 'studbyenryear' : mongoose.model('studbyenryear'),
  // 'studbysec' : mongoose.model('studbysec'),
  // 'studebyyear' : mongoose.model('studebyyear')
}
