const express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.use(express.static("view"));

app.use((req, res) => {
	res.sendStatus(400);
});

app.listen(8000, () => console.log("todo running on port 8000"));

