// Unused in favour of mongoose.js

const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/todo";

MongoClient.connect(url, (err, db) => {
	console.log("Connected to database");

	db.close();
}

