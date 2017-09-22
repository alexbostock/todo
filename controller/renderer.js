"use strict";

const fileSystem = require("fs");
const path = require("path");

const mustache = require("mustache");

const file = path.join(__dirname, "../view/index.html");

const index = fileSystem.readFileSync(file, {encoding: "utf8"});

mustache.parse(index);

const render = (data) => {
	return mustache.render(index, data);
}

module.exports.render = render;

