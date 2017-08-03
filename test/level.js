"use strict";

const store = require("../model/level");

setTimeout(() => {
	store.addUser("bossie", "password", (res) => {
		console.log(res);

		store.getUser("bossie", (res) => {
			console.log(res);
		});
	});
}, 1000);

