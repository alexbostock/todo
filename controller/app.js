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

	if (item) {
		store.addItem(email, item, (ok) => {
			if (ok) {
				res.sendStatus(200);
			} else {
				storeAccessError(res);
			}
		});
	} else {
		res.sendStatus(400);
	}
}

const changePassword = (req, res) => {
	const email = req.verifiedUser;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	if (oldPassword && newPassword && newPassword.length >= 12) {
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
	} else {
		res.sendStatus(400);
	}
}

const deleteAccount = (req, res) => {
	const email = req.verifedUser;
	const password = req.body.password;

	if (password) {
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
	} else {
		res.sendStatus(400);
	}
}

const deleteItem = (req, res) => {
	const email = req.verifiedUser;
	const index = req.body.index;

	if (index) {
		store.delItem(email, index, (ok) => {
			if (ok) {
				res.sendStatus(200);
			} else {
				storeAccessError(res);
			}
		});
	} else {
		res.sendStatus(400);
	}
}

const logout = (req, res) => {
	const token = req.cookies.token;

	if (token) {
		auth.revokeToken(token);
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}

	auth.revoke(token);
}

const mutateItem = (req, res) => {
	const email = req.verifedUser;
	const index = req.body.index;
	const item = req.body.item;

	if (index && item) {
		store.mutateItem(email, index, item, (ok) => {
			if (ok) {
				res.sendStatus(200);
			} else {
				storeAccessError(res);
			}
		});
	} else {
		res.sendStatus(400);
	}
}

const signin = (req, res) => {
	const email = req.body.user;
	const password = req.body.password;

	if (email && password) {
		store.getUser(email, (ok, user) => {
			if (ok) {
				const hash = user.password;

				auth.verify(password, hash, (ok) => {
					if (ok) {
						auth.genToken(email, req.ip, (hash) => {
							if (hash) {
								res.cookie("token", hash);
							} else {
								res.sendStatus(500);
							}
						});
					} else {
						res.sendStatus(400);
					}
				});

			} else {
				res.sendStatus(400);
			}
		});
	} else {
		res.sendStatus(400);
	}
}

const signup = (req, res) => {
	const email = req.body.user;
	const password = req.body.password;

	// TODO - confirm email

	if (email && password) {
		store.getUser(email, (ok, value) => {
			if (ok) {
				res.sendStatus(410);	// "Gone" - Already registered
			} else {
				auth.hash(password, (hash) => {
					if (hash) {
						store.addUser(email, hash, (ok) => {
							if (ok) {
								signin(req, res);
							} else {
								res.sendStatus(500);
							}
						});
					} else {
						res.sendStatus(500);
					}
				});
			}
		});
	} else {
		res.sendStatus(400);
	}
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
module.exports.logout = logout;
module.exports.mutateItem = mutateItem;
module.exports.signin = signin;
module.exports.signup = signup;
module.exports.verify = verify;

