const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const url = "mongodb://localhost:27017/todo";

const UserS = new Schema({
	username: String,
	password: String,
	items: [ObjectId]
});

const ItemS = new Schema({
	heading: String,
	body: String,
	done: Boolean
});

const User = mongoose.model("User", UserS);
const Item = mongoose.model("Item", ItemS);

mongoose.createConnection(url);

process.on("SIGINT", () => {
	mongoose.connection.close(() => {
		console.log("Mongoose connection closed");
		process.exit(0);
	});
});

const addUser = (name, password, callback) => {
	const u = new User(name, password, []);
	u.save((err) => {
		callback(! Boolean(err));
	});
}

// TODO - everything below here

const changePassword = (name, password, callback) => {
	callback(false);
}

const delUser = (name, callback) => {
	callback(false);
}

const getUser = (name, callback) => {
	callback(false);
}

const addItem = (user, json, callback) => {
	callback(false);
}

const mutateItem = (user, index, json, callback) => {
	callback(false);
}

const delItem = (user, index, callback) => {
	callback(false);
}

module.exports.addUser = addUser;
module.exports.changePassword = changePassword;
module.exports.delUser = delUser;
module.exports.getUser = getUser;
module.exports.addItem = addItem;
module.exports.mutateItem = mutateItem;
module.exports.delItem = delItem;

