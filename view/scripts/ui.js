"use strict";

const addItemButton = document.getElementById("addItemButton");
const signinButton = document.getElementById("signinButton");
const signupButton = document.getElementById("signupButton");
const signinFormButton = document.getElementById("signinFormButton");
const signupFormButton = document.getElementById("signupFormButton");

if (addItemButton) {
	addItemButton.addEventListener("click", () => {
		console.log("Add item");
	});
}

if (signinButton) {
	signinButton.addEventListener("click", () => {
		document.getElementById("signinForm").hidden = false;
	});
}

if (signupButton) {
	signupButton.addEventListener("click", () => {
		document.getElementById("signupForm").hidden = false;
	});
}

if (signinFormButton) {
	signinFormButton.addEventListener("click", () => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			if (xhr.status === 200) {
				window.location.reload();
			} else {
				console.log(xhr.responseText);
			}
		}

		xhr.open("POST", "./signin", true);

		xhr.setRequestHeader("Content-type", "application/json");

		const data = {};

		const form = document.getElementById("signinForm");

		data.user = form.getElementsByClassName("emailInput")[0].value;
		data.password = form.getElementsByClassName("passwordInput")[0].value;

		xhr.send(JSON.stringify(data));
	});
}

if (signupFormButton) {
	signupFormButton.addEventListener("click", () => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			if (xhr.status === 200) {
				window.location.reload();
			} else {
				console.log(xhr.responseText);
			}
		}

		xhr.open("POST", "./signup", true);

		xhr.setRequestHeader("Content-type", "application/json");

		const data = {};

		const form = document.getElementById("signupForm");

		data.user = form.getElementsByClassName("emailInput")[0].value;
		data.password = form.getElementsByClassName("passwordInput")[0].value;

		xhr.send(JSON.stringify(data));
	});
}
