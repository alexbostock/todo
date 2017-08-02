const store = require("../model/mongoose");

store.addUser("bossie", "password", (res) => {
	console.log(res);

	store.getUser("bossie", (res) => {
		console.log(res);
	});
});

