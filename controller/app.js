"use strict";

const auth = require("./auth");
const store = require("../model/level");

function checkPassword(user, password, callback) {
	store.getUser(user, (ok, user) => {
		if (ok) {
			const hash = user.password;

			auth.verify(password, hash, callback);
		} else {
			callback(false);
		}
	});
}

function storeAccessError(res) {
	res.sendStatus(500);

	console.error("Failed to write to data store!");
}

const addItem = (req, res) => {
	const email = req.verifiedUser;
	const item = req.body.item;

	store.addItem(email, item, (ok) => {
		if (ok) {
			res.sendStatus(200);
		} else {
			storeAccessError(res);
		}
	});
}

const changePassword = (req, res) => {
	const email = req.verifiedUser;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	if (newPassword.length < 12) {
		// No friendly message - primarily enforce this on client-side

		res.sendStatus(400);
	} else {
		checkPassword(email, oldPassword, (ok) => {
			if (ok) {
				store.changePassword(email, newPassword, (ok) => {
					if (ok) {
						res.sendStatus(200);
					} else {
						storeAccessError(res);
					}
				});
			} else {
				res.sendStatus(403);
			}
		});
	}
}

const deleteAccount = (req, res) => {
	const email = req.verifedUser;
	const password = req.body.password;

	checkPassword(email, password, (ok) => {
		if (ok) {
			store.delUser(email, (ok) => {
				if (ok) {
					res.sendStatus(200);
				} else {
					storeAccessError(res);
				}
			});
		} else {
			res.sendStatus(403);
		}
	});
}

const deleteItem = (req, res) => {
	const email = req.verifiedUser;
	const index = req.body.index;

	store.delItem(email, index, (ok) => {
		if (ok) {
			res.sendStatus(200);
		} else {
			storeAccessError(res);
		}
	});
}

const mutateItem = (req, res) => {
	const email = req.verifedUser;
	const index = req.body.index;
	const item = req.body.item;

	store.mutateItem(email, index, item, (ok) => {
		if (ok) {
			res.sendStatus(200);
		} else {
			storeAccessError(res);
		}
	});
}

const verify = (req, callback) => {
	const ip = req.ip;
	const token = req.cookies.token;

	auth.verifyToken(token, ip, (verifiedUser) => {
		callback(verifiedUser);
	});
}

module.exports.addItem = addItem;
module.exports.changePassword = changePassword;
module.exports.deleteAccount = deleteAccount;
module.exports.deleteItem = deleteItem;
module.exports.mutateItem = mutateItem;
module.exports.verify = verify;

