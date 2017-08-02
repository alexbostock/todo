const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const url = "mongodb://localhost:27017/todo";

const User = new Schema({
	username: String,
	password: String,
	salt: String,
	items: [ObjectId]
});

const Item = new Schema({
	heading: String,
	body: String,
	done: Boolean
});

mongoose.createConnection(url);

