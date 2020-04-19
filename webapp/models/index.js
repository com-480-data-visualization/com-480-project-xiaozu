/** @module models/index.js
* Loads all models
*/
'use strict';

const mongoose = require('mongoose');

require('./Student');
require('./Teacher');
require('./Course');
require('./Enrollment');

module.exports = {
  'Student' : mongoose.model('Student'),
  'Teacher' : mongoose.model('Teacher'),
  'Course' : mongoose.model('Course'),
  'Enrollment' : mongoose.model('Enrollment'),
}

