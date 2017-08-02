// Unused in favour of level.js

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
	const u = new User({username: name, password: password, items: []});
	u.save((err) => {
		callback(! Boolean(err));
	});
}

const changePassword = (name, password, callback) => {
	User.findOneAndUpdate({username: name}, {password: password}, (err) => {
		callback(! Boolean(err);
	});
}

const delUser = (name, callback) => {
	User.findOneAndRemove({username: name}, (err) => {
		callback(! Boolean(err));
	});
}

const getUser = (name, callback) => {
	const query = User.find({username: name});

	query.exec((err, docs) => {
		callback(docs);
	});
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

