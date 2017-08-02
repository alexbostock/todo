const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const url = "mongodb://localhost:27017/todo";

const itemSchema = new Schema({
	user: String,
	heading: String,
	body: String,
	done: Boolean
});

const Item = mongoose.model("Item", itemSchema);

mongoose.createConnection(url);

process.on("SIGINT", () => {
	mongoose.connection.close(() => {
		console.log("Mongoose connection closed");
		process.exit(0);
	});
});

