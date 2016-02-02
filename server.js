///////////////////// DEPENDENCY /////////////////////

var express  = require('express');
var body     = require('body-parser');
var multer   = require('multer');
var uuid     = require('node-uuid');
var Memory   = require('./memory.js');
var JSONFile = require('./jsonfile.js');

///////////////////// APPLICATION /////////////////////

// TODO: break some of these out into a config file

var app            = express();
var file           = process.argv[2];
var store          = file ? new JSONFile(file) : new Memory();
var UPLOAD_PREFIX  = 'uploads/';
var multer_storage = multer.diskStorage({
	destination: UPLOAD_PREFIX,
	filename: function (req, file, callback) {
		callback(null, uuid.v4());
	}
});
var upload         = multer({ storage: multer_storage });

////// REQUEST ACTIVITY //////

app.use('/', function (req,res,next) {
	console.log(req.method, req.url);
	next();
});

////// JSON REST API //////

app.use('/api', body.json());

//
// List attachments for object/i in the store
//
app.get('/api/:type/:i/attachments', function (req, res) {
	store.find('object', req.params.type + '/' + req.params.i, function(err, structs) {
		// TODO: determine better error message scheme
		if (err) return res.status(503).send(err.message).end();

		res.json(structDBToMeta(structs));
	});
});

//
// Create one or more attachments for an object putting the file in the 'filestore' directory
//
app.post('/api/attachment', upload.array('attachments'), function (req, res) {
	// TODO: validate required fields (fix casing, ensure required fields exist, etc.)
	var processed_structs = [];

	for (var i = 0; i < req.files.length; i++) {
		processed_structs.push(structMetaToDB({
			originalName: req.files[i].originalname,
			objectType: req.body.objectType,
			objectId: req.body.objectId,
			fileName: req.files[i].filename
		}));
	}

	store.create(processed_structs, function(error, structs) {
		res.json(structDBToMeta(structs));
	});
});

//
// Read or Download attachment/i.
// Download if the query is ?download, otherwise Read.
//
app.get('/api/attachment/:i', function (req, res) {
	store.read(req.params.i, function(error, struct) {
		if (typeof req.query.download !== "undefined") {
			res.download(UPLOAD_PREFIX + struct.file, struct.label, fileSendCallback(res));
		}
		else {
			res.sendFile(UPLOAD_PREFIX + struct.file, null, fileSendCallback(res));
		}
	});
});

//
// Update attachment/i
//
app.put('/api/attachment/:i', function (req, res) {
});

//
// Delete attachment/i
//
app.delete('/api/attachment/:i', function (req, res) {
});

////// HELPER FUNCTIONS //////

//
// Standard error callback on file upload error
//
function fileSendCallback(res) {
	return function (err) {
		if (err) {
			res.status(err.status).end();
		}
	};
}

//
// Convert from user provided Metadata to DB style metadata
//
function structMetaToDB(structs) {
	// TODO: determine whether this should be broken out into middleware
	if (structs.constructor === Array) {
		return structs.map(function (el) { return structMetaToDB(el); });
	}
	else {
		return {
			label: structs.originalName,
			object: structs.objectType + "/" + structs.objectId,
			file: structs.fileName
		};
	}
}

//
// Convert from DB style metadata to user provided Metadata
//
function structDBToMeta(structs) {
	// TODO: determine whether this should be broken out into middleware
	if (structs.constructor === Array) {
		return structs.map(function (el) { return structDBToMeta(el); });
	}
	else {
		var object_type_id = structs.object.match(/(\w+)\/(\d+)/);

		return {
			id: structs.id,
			objectId: object_type_id[2],
			objectType: object_type_id[1],
			label: structs.label
		};
	}
}

////// HTML CLIENT //////

app.use(express.static('.'));

app.listen(3000);