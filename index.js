var MongoClient = require("mongodb").MongoClient;

var url = "mongodb://localhost:27017/todo";

MongoClient.connect(url, (err, db) => {
	if (err === null) {
		console.log("Connected to database");
	} else {
		console.error("Failed to connect to database");
	}

	db.close();
});

