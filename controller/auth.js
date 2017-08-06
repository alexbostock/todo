"use strict";

const passwordLib = require("password-hash-and-salt");

const sessionTokens = {};
const lastUsed = {};

const resetTokens = {};

function genSalt() {
	salt = Math.random() * 65536 * 65536;
	salt = Math.floor(salt);
	
	return leftPad(salt.toString(16), 64);
}

function leftPad(s, length) {
	while (s.length < length) {
		s = "0" + s;
	}

	return s;
}

const checkResetToken = (email, token) => {
	const correct = resetToken[email];

	if (correct === token) {
		const timeElapsed = Date.now() - parseInt(correct.substring(64), 16);
		const maxTime = 1000 * 60 * 60	// 1 hour

		if (timeElapsed < maxTime) {
			return true;
		} else {
			deleteResetToken(email);

			return false;
		}
	} else {
		return false;
	}
}

const deleteResetToken = (email) => {
	delete resetToken[email];
}

const genToken = (email, ip, callback) => {
	timestamp = Date.now().toString(16);

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
	const token = genSalt() + Date.now().toString(16);

	resetTokens[email] = token;

	return token;
}

const hash = (password, callback) => {
	salt = genSalt();

	passwordLib(password).hash(salt, (err, hash) => {
		if (err) {
			callback("");	// Falsy value indicates failure
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
		callback(verified && ! err);
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
		const sinceLast = lastUsed[hash];
	
		const maxTime = 1000 * 60 * 60 * 24 * 30;	// 30 days
		const maxSinceLast = 1000 * 60 * 60;

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
module.exports.deleteResetToken = deleteResetToken;
module.exports.getResetToken = getResetToken;
module.exports.genToken = genToken;
module.exports.hash = hash;
module.exports.revokeToken = revokeToken;
module.exports.verify = verify;
module.exports.verifyToken = verifyToken;

