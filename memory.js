///////////////////// DEFINITION /////////////////////

function Memory () {
	this.id    = 1;
	this.store = [];
}

Memory.prototype.create = function (structs, callback) /* callback(error, structs) */ {

    //
	// Inserts one or more structs into the store, giving each one a unique id,
	// and returns the id inserted structs.  A list of structs is returned if a 
	// list structs is provided, otherwise a single struct is returned.
	// Input structs do not have id properties.
	//

};

Memory.prototype.read = function (id, callback) /* callback(error, struct) */ {

	//
	// Returns the struct with the provided id from the store.
	//

};

Memory.prototype.update = function (struct, callback) /* callback(error, struct) */ {

    //
	// Updates the struct in the store with the provided struct, which must contain
	// the id property.  Returns the updated attachment struct.
	//

};

Memory.prototype.delete = function (id, callback) /* callback(error) */ {

    //
	// Removes the struct from the store with the provided id.
	//

};

Memory.prototype.find = function (property, value, callback) /* callback(error, structs) */ {

    //
	// Returns a list of structs with the provided property that have the
	// provided value - i.e. struct[property] === value
	//

};

///////////////////// PUBLIC SYMBOLS /////////////////////

exports = module.exports = Memory;
