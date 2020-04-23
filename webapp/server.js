const express = require('express');
const bodyParser= require('body-parser');
const session = require('express-session');
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

// Database
const url = "mongodb+srv://costanzaMongo:2sFcLtMzv7CDJ7kd@xiaozu-dq18h.azure.mongodb.net/test?retryWrites=true&w=majority"; 
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, dbName: 'EPFL'});
 
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

// Routes query
router.route("/students").get(function(req, res) {
  students.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

// Enrollments
router.route("/enrollments").get(function(req, res) {
  enrollments.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


router.get("/enrollments/:studid", function(req, res) {
	let filter = {};

	if (req.params.studid) {
		filter.student_id = req.params.studid;
  }
  
	enrollments.find(filter, function(err, found) {
		if ((err) || (!found))
			return res.sendStatus(404);
		res.json(found);
	});
});



// Teacher
router.route("/teachers").get(function(req, res) {
  teachers.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

// Courses
router.route("/courses").get(function(req, res) {
  courses.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


router.route("/top_courses").get(function(req, res) {
  // If you want to return just the top 5
  // http://localhost:3000/top_courses/?max=5
  if (!req.query.max) {
    res.send("Please specify the numbers of courses (e.g., url/top_courses/?max=5)")
  }
  // case we have a query with max courses to return
  // filter.max = req.query.max;
  top_N_courses = +req.query.max;

  enrollments.aggregate([{$group : {_id: "$course_id"}}]).limit(top_N_courses).exec( 
      function(err, result) {
        if (err) {
          res.send(err);
        } else {
          let id_courses_list = result;
          courses.find({course_id: {$in: id_courses_list}}, function(err, result) {
              if (err) {
                res.send(err);
              } else {
                res.send(result);
              }
            });
          }
      }
  );
});

