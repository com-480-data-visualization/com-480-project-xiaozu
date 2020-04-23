const express = require('express');
const bodyParser= require('body-parser');
const session = require('express-session');
const { MongoClient } = require("mongodb");
const path = require('path');
var mongoose = require("mongoose");


models = require("./models");
students = require("./models/student")
enrollments = require("./models/enrollment")
courses = require("./models/course")
teachers = require("./models/teacher")

var app = express();
const router = express.Router();


// Register model definition here
app.listen(3000, function() {
  console.log('listening on 3000')
})

app.use(
  bodyParser.urlencoded({ extended: true })
);

app.use('/app', express.static(__dirname + "/app"));

app.use("/", router);


// HANDLERS (e.g. GET, POST requests)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'),
    res.sendFile(__dirname + '/index.html')
})

// EPFL_db = db()

const url = "mongodb+srv://costanzaMongo:2sFcLtMzv7CDJ7kd@xiaozu-dq18h.azure.mongodb.net/test?retryWrites=true&w=majority"; 
 // The database to use
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, dbName: 'EPFL'});
 
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});


router.route("/students").get(function(req, res) {
  students.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.route("/enrollments").get(function(req, res) {
  enrollments.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.route("/teachers").get(function(req, res) {
  teachers.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.route("/courses").get(function(req, res) {
  courses.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});