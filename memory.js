///////////////////// DEFINITION /////////////////////

function Memory () {
	this.id    = 1;
	this.store = [];
}

//
// Inserts one or more structs into the store, giving each one a unique id,
// and returns the id inserted structs.  A list of structs is returned if a 
// list structs is provided, otherwise a single struct is returned.
// Input structs do not have id properties.
//
// NOTE: Due to callbacks, the function is not very composable
// TODO: Find a way to make the function more composable despite callbacks,
//       or switch to a promise based structure
Memory.prototype.create = function (structs, callback) /* callback(error, structs) */ {
	if (structs.constructor === Array) {
		var processed_structs = [];

		var wrap_single_callback = function(_err, _stru) {
			if (_err) {
				erred = true;
				return callback(_err, null);
			}

			processed_structs.push(_stru);
		};

		for (var i = 0; i < structs.length; i++) {
			var erred = false;

			this.create(structs[i], wrap_single_callback);

			if (erred) return null;
		}

		callback(null, processed_structs);
	}
	else {
		// Sanity checks to catch wayward use of the API at the storage level
		// TODO: Set up better validation; decide whether it should be here at all
		if (typeof structs.id !== "undefined")
			return callback(new Error("Struct ID must NOT be set"), null);

		structs.id = this.id;
		this.id += 1;
		this.store[structs.id] = structs;

		callback(null, structs);
	}
};

//
// Returns the struct with the provided id from the store.
//
Memory.prototype.read = function (id, callback) /* callback(error, struct) */ {
	if (typeof this.store[id] === "undefined")
		return callback(new Error("ID not set"), null);

	var struct = this.store[id];

	callback(null, struct);
};

//
// Updates the struct in the store with the provided struct, which must contain
// the id property.  Returns the updated attachment struct.
//
Memory.prototype.update = function (struct, callback) /* callback(error, struct) */ {
	if (typeof struct.id === "undefined")
		return callback(new Error("Struct ID must be set"), null);
	if (typeof this.store[struct.id] === "undefined")
		return callback(new Error("ID not set"), null);

	this.store[struct.id] = struct;

	callback(null, struct);
};

//
// Removes the struct from the store with the provided id.
//
Memory.prototype.delete = function (id, callback) /* callback(error) */ {
	if (typeof this.store[id] === "undefined")
		return callback(new Error("ID not set"), null);

	delete this.store[id];
};

//
// Returns a list of structs with the provided property that have the
// provided value - i.e. struct[property] === value
//
Memory.prototype.find = function (property, value, callback) /* callback(error, structs) */ {
	callback(null, this.store.filter(function(struct) {
		return !!struct && struct[property] === value;
	}));
};

///////////////////// PUBLIC SYMBOLS /////////////////////

exports = module.exports = Memory;
