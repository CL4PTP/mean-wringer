///////////////////// DEPENDENCY /////////////////////

var express  = require('express');
var body     = require('body-parser');
var multer   = require('multer');
var Memory   = require('./memory.js');
var JSONFile = require('./jsonfile.js');

///////////////////// APPLICATION /////////////////////

var app   = express();
var file  = process.argv[2];
var store = file ? new JSONFile(file) : new Memory();

////// REQUEST ACTIVITY //////

app.use('/', function (req,res,next) {
	console.log(req.method, req.url);
	next();
});

////// JSON REST API //////

app.use('/api', body.json());

app.get('/api/object/:x/attachments', function (req,res) {
	//
	// List attachments for object/x in the store
	//
});

app.post('/api/attachment', function (req,res) {
	//
	// Create one or more attachments for an object putting the file in the 'filestore' directory
	//
});

app.get('/api/attachment/:y', function (req,res) {
	//
	// Read or Download attachment/y.
	// Download if the query is ?download, otherwise Read.
	//
});

app.put('/api/attachment/:y', function (req,res) {
	//
	// Update attachment/y
	//
});

app.delete('/api/attachment/:y', function (req,res) {
	//
	// Delete attachment/y
	//
});

////// HTML CLIENT //////

app.use(express.static('.'));

app.listen(3000);