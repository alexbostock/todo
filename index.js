"use strict";

const express = require("express");
const app = express();

app.enable("trust proxy");

const config = require("./config.js");
const root = config.root;

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

app.post("/settings/change-password", (req, res) => {
	if (req.verifedUser) {
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
	if (req.verifedUser) {
		controller.deletAccount(req, res);
	} else {
		res.sendStatus(403);
	}
});

app.post("/add", (req, res) => {
	if (req.verifedUser) {
		controller.addItem(req, res);
	} else {
		res.sendStatus(403);
	}
});

app.put("/mutate", (req, res) => {
	if (req.verifedUser) {
		controller.mutateItem(req, res);
	} else {
		res.sendStatus(403);
	}
});

app.delete("/delete", (req, res) => {
	if (req.verifiedUser) {
		controller.deleteItem(req, res);
	} else {
		res.sendStatus(403);
	}
});

app.use(express.static(root + "/view"));

app.use((req, res) => {
	res.sendStatus(400);
});

app.listen(8080, () => console.log("todo running on port 8080"));

