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
require('./course_enroll');
require('./course_network');

// Stats endpoints for sidebar plots
require('./course_prof');
require('./course_stats');

module.exports = {
  'student' : mongoose.model('student'),
  'teacher' : mongoose.model('teacher'),
  'course' : mongoose.model('course'),
  'enrollment' : mongoose.model('enrollment'),
  'jaccard' : mongoose.model('jaccard'),
  'course_enroll' : mongoose.model('course_enroll'),
  'course_network' : mongoose.model('course_network'),

  // Stats endpoints for sidebar plots
  'course_prof' : mongoose.model('course_prof'),
  'course_stats' : mongoose.model('course_stats'),

}
