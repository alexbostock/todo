"use strict";

const email = require("emailjs");

const server = email.server.connect({
	user: process.env.MAIL_USERNAME,
	password: process.env.MAIL_PASSWORD,
	host: process.env.MAIL_SERVER,
	port: 587,
	tls: true
});

const send = (to, subject, body, callback) => {
	const options = {};

	options.to = to;
	options.from = process.env.MAIL_FROM_ADDRESS;
	options.subject = subject;

	options.text = body;
	
	server.send(options, (err, msg) => {
		if (err) {
			console.log(err);
		}

		callback(! Boolean(err));
	});
}

module.exports.send = send;

