const express = require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// var utils = require('./utils')
var database = require("./app/js/insert_data");
// var d3 = require("d3");
var _ = require("lodash");


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://costanzaMongo:2sFcLtMzv7CDJ7kd@xiaozu-dq18h.azure.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

db = undefined; //global variable db

// client.connect(err => {
//   // const collection = client.db("EPFL").collection("teacher");
//   // console.log(collection)
//   // // perform actions on the collection object

//   db = client.db("EPFL");
//   const students = db.collection("student");
//   var cursor = students.find({ student_name: "Costanza Volpini" })
//   function iterateFunc(doc) {
//     console.log(JSON.stringify(doc, null, 4));
//  }
 
//  function errorFunc(error) {
//     console.log(error);
//  }
 
//  cursor.forEach(iterateFunc, errorFunc);
//   ;
// });

require("./models");

var app = express();

// Register model definition here
app.listen(3000, function() {
  console.log('listening on 3000')
})

app.use(
  bodyParser.urlencoded({ extended: true })
);

// const db = client.db("EPFL");
// db.once('open', _ => {
//   console.log('Database connected:', url)
// })

// db.on('error', err => {
//   console.error('connection error:', err)
// })


// HANDLERS (e.g. GET, POST requests)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/quotes', (req, res) => {
    console.log(req.body)
  })


// app.get('/import-db', function(req, res, next) {
//     // Clean db existing
//     utils.connectAndDropDb(function(err){
//         if(err) return done(err);
//         else console.log("cleaned database")
//       });
    
//     Promise.all([
//       utils.importTeachersDB(), utils.importCoursesDB(), 
//       utils.importEnrollmentsDB(), utils.importStudentsDB()]
//       ).then(value => { 
//       console.log(value);
//       res.json({success : "Data imported successfully.", status : 200});
//     }, reason => {
//       console.log(reason)
//       res.json({status: 500});
//     });
//   })