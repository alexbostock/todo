"use strict"

//const nodemailer = require("nodemailer");
const email = require("emailjs");

const config = require("../config");

const server = email.server.connect({
	user: config.mailFrom,
	password: config.mailPassword,
	host: config.mailServer,
	post: 587,
	tls: true
});

const send = (to, subject, body, callback) => {
	const options = {};

	options.to = to;
	options.from = config.mailFrom;
	options.subject = subject;

	options.text = body;
	
	server.send(options, (err, msg) => {
		callback(! Boolean(err));
	});
}

module.exports.send = send;

