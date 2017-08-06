"use strict";

const mail = require("../controller/mail.js");

const address = "vxlsgubk@sharklasers.com"

mail.send(address, "Ping", "Testing...", (ok) => {
	console.log(ok);
});

