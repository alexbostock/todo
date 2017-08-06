"use strict";

const fileSystem = require("fs");

const mustache = require("mustache");

const index = fileSystem.readFileSync("./view/index.html", {encoding: "utf8"});

mustache.parse(index);

const render = (data) => {
	return mustache.render(index, data);
}

module.exports.render = render;

