///////////////////// DEPENDENCY /////////////////////

var Memory = require('./memory.js');

///////////////////// DEFINITION /////////////////////

function JSONFile (file) {
	Memory.call(this);
}

JSONFile.prototype = Object.create(Memory.prototype);

JSONFile.prototype.constructor = JSONFile;

//
// Extend the Memory class to make the store persist in the specified
// file.  Use asynchronous operations except in the constructor.
//

///////////////////// PUBLIC SYMBOLS /////////////////////

exports = module.exports = JSONFile;
