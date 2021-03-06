"use strict";

require("dotenv").config();

const express = require("express");
const app = express();

app.enable("trust proxy");

const controller = require("./controller/app.js");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
	controller.verify(req, (verifiedUser) => {
		req.verifiedUser = verifiedUser;

		next();
	});
});

app.get("/", controller.render);

app.post("/signup", controller.signup);

app.post("/signin", controller.signin);

app.post("/forgot-password", controller.forgotPassword);

app.get("/reset-password/:key", controller.resetPasswordPage);

app.post("/reset-password/:key", controller.resetPassword);

app.get("/verify-email/:key", controller.verifyEmail);

app.post("/settings/change-password", (req, res) => {
	if (req.verifiedUser) {
		controller.changePassword(req, res);
	} else {
		res.sendStatus(403);
	}
});

app.post("/logout", (req, res) => {
	if (req.verifiedUser) {
		controller.logout(req, res);
	} else {
		res.sendStatus(400);
	}
});

app.delete("/settings/delete-account", (req, res) => {
	if (req.verifiedUser) {
		controller.deletAccount(req, res);
	} else {
		res.sendStatus(403);
	}
});

app.post("/save", (req, res) => {
	if (req.verifiedUser) {
		controller.mutateItems(req, res);
	} else {
		res.sendStatus(403);
	}
});

app.use(express.static(__dirname + "/view"));

app.use((req, res) => {
	res.sendStatus(400);
});

app.listen(8080, () => console.log("todo running on port 8080"));

