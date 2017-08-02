const levelup = require("level");

const db = levelup("./data");

const addUser = (name, password, callback) => {
	const value = {
		username: name,
		password: password
	}

	console.log(db);

	db.put(name, value, (err) => {
		callback(! Boolean(err));
	});
}

const changePassword = (name, password, callback) => {
	// TODO
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
	;
}

const mutateItem = (user, index, item, callback) => {
	;
}

const delItem = (user, index, callback) => {
	;
}

module.exports.addUser = addUser;
module.exports.changePassword = changePassword;
module.exports.delUser = delUser;
module.exports.getUser = getUser;
module.exports.addItem = addItem;
module.exports.mutateItem = mutateItem;
module.exports.delItem = delItem;

