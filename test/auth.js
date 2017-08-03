"use strict";

const auth = require("../controller/auth");

auth.hash("password", (hash) => {
	console.log(hash);

	auth.verify("password", hash, (ok) => {
		console.log(ok);
	});

	auth.verify("Password", hash, (ok) => {
		console.log(!ok);
	});

	auth.verify("xxxxx", hash, (ok) => {
		console.log(!ok);
	});
});

