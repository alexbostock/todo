"use strict";

const auth = require("./auth");
const mail = require("./mail");
const renderer = require("./renderer.js");
const store = require("../model/level.js");

function checkPassword(user, password, callback) {
	store.getUser(user, (user) => {
		if (user) {
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
	const email = req.verifiedUser;
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

const forgotPassword = (req, res) => {
	const email = req.body.user;

	if (email) {
		store.getUser(email, (account) => {
			if (account) {
				const token = auth.getResetToken(email);

				const link = "https://todo.alexbostock.co.uk/reset-password/" + token;

				let message = "A password reset was requested for this account.\n";
				message += "If this was you, follow the link below.\n";
				message += "If this wasn't you, ignore this message\n";
				message += "The link will expire in one hour\n\n";
				message += link;

				mail.send(email, "Todo Password Reset", message, (ok) => {
					if (ok) {
						res.sendStatus(200);
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
}

const logout = (req, res) => {
	const token = req.cookies.token;

	if (token) {
		auth.revokeToken(token);
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}

const mutateItems = (req, res) => {
	const email = req.verifiedUser;
	const items = req.body.items;

	if (items) {
		store.mutateItems(email, items, (ok) => {
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

const render = (req, res) => {
	const email = req.verifiedUser;

	const data = {};

	if (email) {
		store.getUser(email, (user) => {
			user.numItems = user.item.length;
			data.user = user;

			res.send(renderer.render(data));
		});
	} else {
		res.send(renderer.render(data));
	}
}

const resetPassword = (req, res) => {
	const email = req.body.user;
	const password = req.body.password;
	const token = req.params.key;

	if (auth.checkResetToken(email, token) && password.length >= 12) {
		store.changePassword(email, password, (ok) => {
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

const resetPasswordPage = (req, res) => {
	const token = req.params.key;

	if (auth.checkResetTokenExists(token)) {
		// TODO
	} else {
		res.sendStatus(404);
	}
}

const signin = (req, res) => {
	const email = req.body.user;
	const password = req.body.password;

	if (email && password) {
		store.getUser(email, (user) => {
			if (user) {
				const hash = user.password;

				auth.verify(password, hash, (ok) => {
					if (ok) {
						auth.genToken(email, req.ip, (hash) => {
							if (hash) {
								res.cookie("token", hash);
								res.sendStatus(200);
							} else {
								console.log("Generating token failed");
								res.sendStatus(500);
							}
						});
					} else {
						res.sendStatus(403);
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

	if (email && password) {
		store.getUser(email, (value) => {
			if (value) {
				res.sendStatus(410);	// "Gone" - Already registered
			} else {
				auth.hash(password, (hash) => {
					if (hash) {
						store.addUser(email, hash, (ok) => {
							if (ok) {
								const token = auth.genEmailToken(email);

								const link = "https://todo.alexbostock.co.uk/verify-email/" + token;
								
								let message = "Please verify your email for todo.alexbostock.co.uk\n\n";
									message += link;

								mail.send(email, "Todo - Verify Email", message, (ok) => {
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

const verifyEmail = (req, res) => {
	const token = req.params.key;

	const email = auth.verifyEmail(token);

	if (email) {
		store.verifyEmail(email, (ok) => {
			if (ok) {
				res.sendStatus(200);
				// TODO - redirect to /
			} else {
				res.sendStatus(500);
			}
		});
	} else {
		res.sendStatus(400);
	}
}

module.exports.changePassword = changePassword;
module.exports.deleteAccount = deleteAccount;
module.exports.forgotPassword = forgotPassword;
module.exports.logout = logout;
module.exports.mutateItems = mutateItems;
module.exports.render = render;
module.exports.resetPassword = resetPassword;
module.exports.resetPasswordPage = resetPasswordPage;
module.exports.signin = signin;
module.exports.signup = signup;
module.exports.verify = verify;
module.exports.verifyEmail = verifyEmail;

