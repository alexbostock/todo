"use strict";

const passwordLib = require("password-hash-and-salt");

const sessionTokens = {};
const lastUsed = {};

const resetTokens = {};

function leftPad(s, length) {
	while (s.length < length) {
		s = "0" + s;
	}

	return s;
}

function randomString(length) {
	let s = "";

	while (length --> 0) {
		s += Math.floor(Math.random() * 16).toString(16);
	}

	return s;
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

const getResetToken = (email) => {
	const token = randomString(16) + Date.now().toString(16);

	resetTokens[token] = email;

	return token;
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
module.exports.getResetToken = getResetToken;
module.exports.genToken = genToken;
module.exports.hash = hash;
module.exports.revokeToken = revokeToken;
module.exports.verify = verify;
module.exports.verifyToken = verifyToken;

