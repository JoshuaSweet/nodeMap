# nodeMap
Basic google map using node server with mongodb. The objective of this project is to learn about nodejs servers and mongodb.
I decided to use google maps as the context of my project, but there was no agenda there.

If you have node installed and mongo and express installed via npm then you should be able to download this repo, fill in some variables and then be in business.  After download, you will need to fill in the following markers with your local values.

map.html -> {hostName}, {portNumber}, {googleMapsApiKey}

mapServer.js -> PORT

When you are up and running, you should be able to navigate to "/map1", at which point you will see a Google Map centered more or less on Texas. If you single click on the map, a marker will be added to the map. If you single click on the marker, then you will see an info window open for that marker.  Inside the info window, you will see the id for the marker (which is the same id in mongo) and you will see a delete href.  If you click on the delete text, then the marker will diappear from the map and it will be deleted from mongo.  That's about it. the following requests are implemented. No authentication is implemented in this example.

*GET
/map1

*gets map.html

*GET
/map1/locations

*gets all locations currently in locations collection

*POST
/map1/locations/delete/:_id

*deletes single location by id from locations collection in mongo

*POST
/map1/locations/delete/all

*deletes all locations from the locations collection

*POST
/map1/latitude/:latitude/longitude/:longitude

*adds a location to the locations collection
