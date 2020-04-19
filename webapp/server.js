const express = require('express');
const bodyParser= require('body-parser');
const session = require('express-session');
var database = require("./app/js/insert_data");
require("./models");
// var d3 = require("d3");
// var _ = require("lodash");

var app = express();

// Register model definition here
app.listen(3000, function() {
  console.log('listening on 3000')
})

app.use(
  bodyParser.urlencoded({ extended: true })
);

// HANDLERS (e.g. GET, POST requests)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/quotes', (req, res) => {
    console.log(req.body)
  })