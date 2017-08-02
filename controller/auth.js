const passwordLib = require("password-hash-and-salt");

function genSalt() {
	salt = Math.random() * 65536;
	salt = Math.floor(salt);
	
	return salt.toString(16);
}

const hash = (password, callback) => {
	salt = genSalt();

	passwordLib(password).hash(salt, (err, hash) => {
		if (err) {
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

