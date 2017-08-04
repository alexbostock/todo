"use strict";

const levelup = require("level");

const db = levelup("./data");

function saveValue(name, value, callback) {
	db.put(name, value, (err) => {
		callback(! Boolean(err));
	});
}

const addUser = (name, password, callback) => {
	const value = {
		username: name,
		password: password,
		items: []
	}

	db.put(name, value, (err) => {
		callback(! Boolean(err));
	});
}

const changePassword = (name, password, callback) => {
	db.get(name, (err, value) => {
		if (err) {
			callback(false);
		} else {
			value.password = password;

			saveValue(name, value, callback);
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
		callback(! Boolean(err), value);
	});
}

const addItem = (user, item, callback) => {
	getUser(user, (ok, value) => {
		if (ok) {
			value.items.push(item);

			saveValue(user, value, callback);
		} else {
			callback(ok);
		}
	});
}

const mutateItem = (user, index, item, callback) => {
	getUser(user, (ok, value) => {
		if (ok) {
			if (index < value.items.length) {
				value.items[index] = item;

				saveValue(user, value, callback);
			} else {
				callback(false);
			}
		} else {
			callback(ok);
		}
	});
}

const delItem = (user, index, callback) => {
	getUser(user, (ok, value) => {
		if (ok) {
			value.items.splice(index, 1);

			saveValue(user, value, callback);
		} else {
			callback(ok);
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

