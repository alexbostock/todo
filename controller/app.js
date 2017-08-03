"use strict";

const auth = require("./auth");
const store = require("../model/level");

const verify(req, callback) => {
	const ip = req.ip;
	const token = req.cookies.token;

	auth.verifyToken(token, ip, (verifed) => {
		callback(verified);
	});
}

module.exports.verify = verify;

