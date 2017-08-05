"use strict"

const nodemailer = require("nodemailer");

const config = require("../config");

const transporter = nodemailer.createTransport({
	host: config.mailServer,
	port: 587,
	secure: true,
	auth: {
		user: config.mailFrom,
		pass: config.mailPassword
	}
});

const send = (to, subject, body, html) => {
	const options = {};

	options.to = to;
	options.from = config.mailFrom;
	options.subject = subject;

	if (html) {
		options.html = body;
	} else {
		options.text = body;
	}

	transporter.sendMail(options, (err, info) => {
		if (err) {
			console.error(err);
		}

		console.log(info);
	});
}

module.exports.send = send;

