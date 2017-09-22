"use strict";

const fileSystem = require("fs");

const mustache = require("mustache");

const config = require("../config");

const path = config.root + "/view/index.html";

const index = fileSystem.readFileSync(path, {encoding: "utf8"});

mustache.parse(index);

const render = (data) => {
	return mustache.render(index, data);
}

module.exports.render = render;

