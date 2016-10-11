// Using express for handling request.
var express = require('express');
var app = express();
var path = require('path');

//Lets define a port we want to listen to
const PORT=8080; 

app.use(express.static(path.join(__dirname, '/')));

// Serve the map.
app.get('/map1', function(req, res) {
    res.sendFile(path.join(__dirname + '/map.html'));
});

// Return all the locations that are currently in the database.
app.get('/map1/locations', function(req, res) {
  
  MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  
	  findlocations(db, function(docs) {
		  
		  res.send(docs);
		  db.close();
		  
		});
		
	});
	    
});

// Start listening for requests!
app.listen(PORT);

//
// Some mongo essentials
//
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
// Connection URL with default port 27017
var url = 'mongodb://localhost:27017/myproject';

/* Inserts locations into the locations collection.
 * Locations will be objects of structure {latitude: lat, longitude: lng}.
 * Mongo will add an id to make {_id: id, latitude: lat, longitude: lng}.
 *
 * params db objectArray callback
 * returns undefined
 */
var insertlocations = function(db, objectArray, callback) {
  
  // Get the locations collection
  var collection = db.collection('locations');
  // Insert some locations
  collection.insertMany(objectArray, function(err, result) {

    assert.equal(err, null);
    callback(result);
	
  });
  
};

/* Finds all the locations currently in the database.
 * 
 * params db callback
 * returns undefined
 */
var findlocations = function(db, callback) {
  // Get the locations collection
  var collection = db.collection('locations');
  // Find some locations
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

/* Removes all the locations from the locations collection.
 *
 * params db callback
 * returns undefined
 */
var removeAllLocations = function(db, callback) {
  // Get the locations collection
  var collection = db.collection('locations');
  // Insert some locations
  collection.remove({}, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });    
}

/* Remove single location from locations collection.
 *
 * params db idObject callback
 * returns undefined
 */
var removeLocation = function(db, idObject, callback) {
  // Get the locations collection
  var collection = db.collection('locations');
  // Delete a location. 
  // Notice when deleting by id we have to use an actual mongodb.ObjectID object.
  // Strings and numbers won't do the trick.
  collection.deleteOne( {_id : new mongodb.ObjectID(idObject._id)}, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    callback(result);
  });    
}

// Boiler plate connection method for testing mongo connection.
// This would be a good place to implement some fail-fast measures
// if you can't get a connection.
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db.close();
});

/* Express based post method for adding single location. When request consumed, 
 * express parses out the 
 * latitude and longitude variables from request string if the string matches
 * the format defined here. I decided to just use the same call back for one 
 * location or many which is why you see array usage here. Not necessary though
 * if you want to separate single and multiple location processing. May change 
 * later.
 */
app.post('/map1/latitude/:latitude/longitude/:longitude', function (req, res) {
  
  var locationsArray = [];
  locationsArray.push(req.params);
  MongoClient.connect(url, function(err, db) {
	  
	  assert.equal(null, err);  
	  insertlocations(db, locationsArray, function(results) {
		  
			res.send(results.ops);
			db.close();
			
	  });
	  
	});
  
});

/* Post method for deleting all locations. Not very practical except in
 * testing.
 */
app.post('/map1/locations/delete/all', function (req, res) {
  
  
  MongoClient.connect(url, function(err, db) {
	  
	  assert.equal(null, err);  
	  removeAllLocations(db, function() {
			db.close();
	  });
	  
	});
  
});

/* POST method for deleting single location by id.
 *
 */
app.post('/map1/locations/delete/:_id', function (req, res) {
  
  
  MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);  
	  removeLocation(db, req.params, function() {
		  res.send();
			db.close();
	  });
	  
	});
  
});