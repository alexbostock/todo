"use strict";

const levelup = require("level");

const db = levelup("./data");

function saveValue(name, value, callback) {
	db.put(name, value, (err) => {
		callback(! Boolean(err));
	});
}

const addUser = (name, password, callback) => {
	const data = {};

	data.username = name;
	data.password = password;
	data.emailVerified = false;
	data.item = [];

	// Default items
	
	data.item.push({
		heading: "Verify email address",
		body: "An email has been sent to " + name + ". Please click on the link there to verify your address. This will allow you to reset your password if you forget."
	});

	data.item.push({
		heading: "Add some things to do",
		body: "This is a todo list - that's what it's for."
	});

	data.item.push({
		heading: "Make the world a better place",
		body: "...profit."
	});

	db.put(name, JSON.stringify(data), (err) => {
		callback(! Boolean(err));
	});
}

const changePassword = (name, password, callback) => {
	db.get(name, (err, value) => {
		if (err) {
			callback(false);
		} else {
			const data = JSON.parse(value);

			data.password = password;

			saveValue(name, JSON.stringify(data), callback);
		}
	});
}

const delUser = (name, callback) => {
	db.del(name, (err) => {
		callback(! Boolean(err));
	});
}

const getUser = (name, callback) => {
	db.get(name, (err, value) => {
		if (err) {
			callback("");
		} else {
			callback(JSON.parse(value));
		}
	});
}

const addItem = (user, item, callback) => {
	getUser(user, (data) => {
		if (data) {
			data.item.push(item);

			saveValue(user, JSON.stringify(data), callback);
		} else {
			callback(value);
		}
	});
}

const mutateItem = (user, index, item, callback) => {
	getUser(user, (data) => {
		if (data) {
			if (index < data.item.length) {
				data.item[index] = item;

				saveValue(user, JSON.stringify(data), callback);
			} else {
				callback(false);
			}
		} else {
			callback(value);
		}
	});
}

const delItem = (user, index, callback) => {
	getUser(user, (data) => {
		if (data) {
			data.item.splice(index, 1);

			saveValue(user, JSON.stringify(data), callback);
		} else {
			callback(value);
		}
	});
}

process.on("SIGINT", () => {
	db.close();

	process.exit(0);
});

module.exports.addUser = addUser;
module.exports.changePassword = changePassword;
module.exports.delUser = delUser;
module.exports.getUser = getUser;
module.exports.addItem = addItem;
module.exports.mutateItem = mutateItem;
module.exports.delItem = delItem;
