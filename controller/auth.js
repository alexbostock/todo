const passwordLib = require("password-hash-and-salt");
const uniqid = require("uniqid");

const hash = (password, callback) => {
	passwordLib.hash(uniqid(), (err, hash) => {
		if (error) {
			return "";	// Falsy value indicates failure
		} else {
			callback(hash);
		}
	});
}

const verify = (password, hash, callback) => {
	passwordLib(password).verifyAgainst(hash, (err, verified) => {
		callback(verified && ! err);
	});
}

module.exports.hash = hash;
module.exports.verify = verify;

