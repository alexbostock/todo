const express = require("express");
const app = express();

const config = require("./config.js");
const root = config.root;

const controller = require("./controller/app.js");

app.get("/", (req, res) => {
	res.sendFile("./view/index.html", {root: root});
});

app.use(express.static("view"));

app.use((req, res) => {
	res.sendStatus(400);
});

app.listen(8000, () => console.log("todo running on port 8000"));

