"use strict";

const fileSystem = require("fs");

const mustache = require("mustache");

const index = fs.readFileSync("../view/index.html");

mustache.parse(index);

const render = (data) => {
	return mustache.render(index, data);
}

module.exports.render = render;

