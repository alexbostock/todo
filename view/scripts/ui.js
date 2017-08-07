"use strict";

document.getElementById("signinButton").addEventListener("click", () => {
	document.getElementById("signinForm").hidden = false;
});

document.getElementById("signupButton").addEventListener("click", () => {
	document.getElementById("signupForm").hidden = false;
});

document.getElementById("signinFormButton").addEventListener("click", () => {
	const xhr = new XMLHttpRequest();

	xhr.onload = () => {
		console.log(xhr.responseText);
	}

	xhr.open("POST", "./signin", true);

	xhr.setRequestHeader("Content-type", "application/json");

	const data = {};

	const form = document.getElementById("signinForm");

	data.user = form.getElementsByClassName("emailInput")[0].value;
	data.password = form.getElementsByClassName("passwordInput")[0].value;

	xhr.send(JSON.stringify(data));
});

document.getElementById("signupFormButton").addEventListener("click", () => {
	const xhr = new XMLHttpRequest();

	xhr.onload = () => {
		console.log(xhr.responseText);
	}

	xhr.open("POST", "./signup", true);

	xhr.setRequestHeader("Content-type", "application/json");

	const data = {};

	const form = document.getElementById("signupForm");

	data.user = form.getElementsByClassName("emailInput")[0].value;
	data.password = form.getElementsByClassName("passwordInput")[0].value;

	xhr.send(JSON.stringify(data));
});

