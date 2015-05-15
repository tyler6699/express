var express = require("express");
var app = express();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});

app.use(express.static('public'));
var logger = require('./logger');
app.use(logger);

// MONGO
//var db = require('mongoskin').db('mongodb://localhost/course_db');

//db.collection('courses').find().toArray(function(err, result) {
//  if (err) throw err;
//  console.log(result);
//});

// MONGOOSE
// https://github.com/Automattic/mongoose
//require mongoose node module
var mongoose = require('mongoose');

//connect to local mongodb database
var db = mongoose.connect('mongodb://localhost/course_db');

//attach lister to connected event
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});
 
// app.get('/', function(request, response){
//   response.sendFile(__dirname + '/public/index.html');
// });

// app.get('/blocks', function(request, response){
//   response.redirect(301, '/parts');
// });

var blocks = {
  'Fixed':'fixed desc',
  'Moveable':'move desc',
  'Roatating':'roating desc' 
};
 
app.get('/parts', function(request, response){
  if(request.query.limit >= 0){
    response.json(Object.keys(blocks).slice(0, request.query.limit));
  } else{
    response.json(Object.keys(blocks));
  }
});

app.get('/parts/:name', function(request, response){  
  var description = blocks[request.blockName];
  
  if(!description){
    response.status(404).json('No description found for ' + request.params.name);
  } else {
    response.json(description);
  }
});

app.post('/parts', parseUrlencoded, function(request, response){
  var part = createPart(request.body.name, request.body.description);
  response.status(201).json(part);
});

var createPart = function(name, description){
  blocks[name] = description;
  return name; 
};

app.delete('/parts/:name', function(request, response){
  console.log('REMOVED');
  delete blocks[request.blockName];
  response.sendStatus(200);
});

app.param('name', function(request,response, next){
  var name = request.params.name;
  var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
  request.blockName = block;
  next();
});

app.listen(3000, function(){
  console.log('Listening on port 3000');
});