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
  console.log("here ")
  // If you want to return just the top 5
  // http://localhost:3000/top_courses/?max=5&year=2008-2009
  if (!req.query.max || !req.query.year) {
    res.send("Please specify the numbers of courses (e.g., url/top_courses/?max=5)")
  }
  // case we have a query with max courses to return
  // filter.max = req.query.max;
  top_N_courses = +req.query.max;
  ay = req.query.year

  // 1. group e assegnare un count ad ogni enrollment, poi 2. join con courses e dopo di che
  // 3. filter by year e ordinare tutto a seconda del count trovato prima e dopo
  // fare limit (#maxcourses)
  enrollments.aggregate([
    {
    $group: { // group by
            _id: "$course_id",
            count: { $sum: 1 }
      }
    },
    { // join and pick just element of correct year
      $lookup: {
          from: "course", // collection name in db
          localField: "_id",
          foreignField: "course_id",
          as: "courses_detail"
      }
    },
    {
      $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$courses_detail", 0 ] }, "$$ROOT" ] } }
   },
   { $project: { courses_detail: 0 } },
    { // filter by date (some data have space etc)
      $match: {
        $expr: {
          $gt: [
            {
                $indexOfBytes: [
                  "$year",
                    ay
                ]
            },
            -1
          ]
        }
     }
    }
   //{ $sort : {"count" : -1 } }, //need to find a solution, sort it is extremely slow!
  ]
).limit(top_N_courses)
  .exec(
      function(err, result) {
        if (err) {
          res.send(err);
        } else {
          // console.log(result)
          res.send(result)
          }
      }
  );
});
