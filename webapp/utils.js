// var mongoose = require('mongoose');
// const fs = require('fs');
// const csv = require('csv-parser');
// require("./models");

// /** 
// * Drops the database and closes the mongoose connection.
// */
// module.exports.dropDbAndCloseConnection = function dropDbAndCloseConnection(done){
//   //drop database
//   mongoose.connection.db.dropDatabase( function(err){
//     if(err) return done(err);

//     //close connection
//     mongoose.connection.close( function(err){
//       if(err) return done(err);
//       done();
//     });
//   });
// }

// /** 
// * Drops the database
// */
// var dropDb = module.exports.dropDb = function dropDb(done){
//   //drop database
//   mongoose.connection.db.dropDatabase( function(err){
//     if(err) return done(err);
//     done();
//   });
// }

// /** 
// * Connects to mongo and drops the database.
// */
// module.exports.connectAndDropDb = function connectAndDropDb(done){
//   //check if connection has opened but is not ready yet
//   if (mongoose.connection && mongoose.connection.readyState ==2){
//     mongoose.createConnection('mongodb://127.0.0.1:27017/xiaozu', {useNewUrlParser: true}, function(err){
//       if(err) return done(err);
//       dropDb(done);
//     });
//   }else{
//     mongoose.connect('mongodb://127.0.0.1:27017/xiaozu', {useNewUrlParser: true}, function(err){
//       if (err) {
//         //if connection is already open it's fine
//         if(err.message !== 'Trying to open unclosed connection.'){
//           return done(err);
//         }
//       }
//       dropDb(done);
//     });
//   } 
// }


// /// Fill database mongoose

// module.exports.importTeachersDB = function importTeachersDB(){
//   var Teacher  = mongoose.model('Teacher');
//   const csvfile = __dirname + "/../data/csv/teaching.csv";
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(csvfile)
//         .pipe(csv())
//         .on('data', (el) => {
//           var teacher = new Teacher({
//                           course_id: el['course_id'],
//                           prof: el['prof']
//                     });

//           teacher.save(function(error){
//                     if(error){
//                         throw error;
//                     }
//                 }); 
//         })
//         .on('end', () => {
//           console.log('CSV file teaching successfully processed');
//           resolve({success : "Data imported successfully.", status : 200});
//         })
//         .on('error', error =>{
//           reject(error)
//         })
//     });
// }

// module.exports.importStudentsDB = function importStudentsDB(){
//   var Student  = mongoose.model('Student');
//   const csvfile = __dirname + "/../data/csv/student.csv";
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(csvfile)
//         .pipe(csv())
//         .on('data', (el) => {
//           var student = new Student({
//                       student_id: el['student_id'],
//                       student_name: el['student_name'],
//                       section: el['section'],
//                   });

//           student.save(function(error){
//                     if(error){
//                         throw error;
//                     }
//                 }); 
//         })
//         .on('end', () => {
//           console.log('CSV file student successfully processed');
//           resolve({success : "Data imported successfully.", status : 200});
//         })
//         .on('error', error =>{
//           reject(error)
//         })
//     });
// }

// module.exports.importCoursesDB = function importCoursesDB(){
//   var Course  = mongoose.model('Course');
//   const csvfile = __dirname + "/../data/csv/courses.csv";
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(csvfile)
//         .pipe(csv())
//         .on('data', (el) => {
//           var course = new Course({
//                 course_name: el['course_name'],
//                 course_id: el['course_id'],
//                 year: el['year'],
//           });

//           course.save(function(error){
//                     if(error){
//                         throw error;
//                     }
//                 }); 
//         })
//         .on('end', () => {
//           console.log('CSV file courses successfully processed');
//           resolve({success : "Data imported successfully.", status : 200});
//         })
//         .on('error', error =>{
//           reject(error)
//         })
//     });
// }

// module.exports.importEnrollmentsDB = function importEnrollmentsDB(){
//   var Enrollment  = mongoose.model('Enrollment');
//   const csvfile = __dirname + "/../data/csv/enrollment_large.csv";
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(csvfile)
//         .pipe(csv())
//         .on('data', (el) => {
//           var enrollment = new Enrollment({
//                         student_id: el['student_id'],
//                         course_id: el['course_id'],
//                         semester: el['semester'],
//                     });

//           enrollment.save(function(error){
//                     if(error){
//                         throw error;
//                     }
//                 }); 
//         })
//         .on('end', () => {
//           console.log('CSV file enrollment_large successfully processed');
//           resolve({success : "Data imported successfully.", status : 200});
//         })
//         .on('error', error =>{
//           reject(error)
//         })
//     });
// }