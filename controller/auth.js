"use strict";

const crypto = require("crypto");
const passwordLib = require("password-hash-and-salt");

const sessionTokens = {};
const lastUsed = {};

const resetTokens = {};
const verifyTokens = {};

function leftPad(s, length) {
	while (s.length < length) {
		s = "0" + s;
	}

	return s;
}

function randomString(callback) {
	crypto.randomBytes(256, (err, buf) => {
		callback(! Boolean(err), buf.toString("hex"));
	});
}

const checkResetToken = (email, token) => {
	const correct = resetTokens[token];

	if (correct === email) {
		const timeElapsed = Date.now() - parseInt(token.substring(64), 16);
		const maxTime = 1000 * 60 * 60   // 1 hour

		if (timeElapsed < maxTime) {
			return true;
		} else {
			deleteResetToken(token);

			return false;
		}
	} else {
		return false;
	}
}

const checkResetTokenExists = (token) => {
	return resetTokens[token];
}

const deleteResetToken = (token) => {
	delete resetTokens[token];
}

const genToken = (email, ip, callback) => {
	let timestamp = Date.now().toString(16);
	const length = timestamp.length;

	if (length % 2 === 1) {
		timestamp = leftPad(timestamp, length + 1);
	}

	passwordLib(email + ip).hash(timestamp, (err, hash) => {
		if (err) {
			callback("");
		} else {
			sessionTokens[hash] = email;
			lastUsed[hash] = timestamp;

			callback(hash);
		}
	});
}

const genEmailToken = (email, callback) => {
	randomString((ok, token) => {
		token += Date.now().toString(16);

		verifyTokens[token] = email;

		callback(token);
	});
}

const getResetToken = (email, callback) => {
	randomString((ok, token) => {
		token += Date.now().toString(16);

		resetTokens[token] = email;

		callback(token);
	});
}

const hash = (password, callback) => {
	passwordLib(password).hash((err, hash) => {
		if (err) {
			callback("");   // Falsy value indicates failure
		} else {
			callback(hash);
		}
	});
}

const revokeToken = (hash) => {
	delete sessionTokens[hash];
	delete lastUsed[hash];
}

const verify = (password, hash, callback) => {
	passwordLib(password).verifyAgainst(hash, (err, verified) => {
		callback(! err && verified);
	});
}

const verifyEmail = (token) => {
	const email = verifyTokens[token];

	if (email) {
		delete verifyTokens[token];
	}

	return email;
}

const verifyToken = (hash, ip, callback) => {
	const email = sessionTokens[hash];

	if (! email) {
		callback(false);
	} else {
		const timestamp = hash.split("$")[3];

		const timeNow = Date.now();

		const timeElapsed = timeNow - parseInt(timestamp, 16);
		const sinceLast = timeNow - lastUsed[hash];
	
		const maxTime = 1000 * 60 * 60 * 24 * 30;   // 30 days
		const maxSinceLast = 1000 * 60 * 60;        // 1 hour

		if (timeElapsed > maxTime || sinceLast > maxSinceLast) {
			revokeToken(hash);

			callback(false);
		} else {
			passwordLib(email + ip).verifyAgainst(hash, (err, verified) => {
				lastUsed[hash] = timeNow;

				if (verified && ! err) {
					callback(email);
				} else {
					callback(false);
				}
			});
		}
	}
}

module.exports.checkResetToken = checkResetToken;
module.exports.checkResetTokenExists = checkResetTokenExists;
module.exports.deleteResetToken = deleteResetToken;
module.exports.genEmailToken = genEmailToken;
module.exports.getResetToken = getResetToken;
module.exports.genToken = genToken;
module.exports.hash = hash;
module.exports.revokeToken = revokeToken;
module.exports.verify = verify;
module.exports.verifyEmail = verifyEmail;
module.exports.verifyToken = verifyToken;

