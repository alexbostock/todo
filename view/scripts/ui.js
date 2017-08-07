"use strict";

const addItemButton = document.getElementById("addItemButton");

const signinButton = document.getElementById("signinButton");
const signupButton = document.getElementById("signupButton");
const signinFormButton = document.getElementById("signinFormButton");
const signupFormButton = document.getElementById("signupFormButton");

const forgotPasswordButton = document.getElementById("forgotPasswordButton");

const signoutButton = document.getElementById("signoutButton");

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

if (signoutButton) {
	signoutButton.addEventListener("click", () => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			window.location.reload();
		}

		xhr.open("POST", "./logout", true);

		xhr.send();
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
				forgotPasswordButton.hidden = false;
			}
		}

		xhr.open("POST", "./signin", true);

		xhr.setRequestHeader("Content-Type", "application/json");

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

		xhr.setRequestHeader("Content-Type", "application/json");

		const data = {};

		const form = document.getElementById("signupForm");

		data.user = form.getElementsByClassName("emailInput")[0].value;
		data.password = form.getElementsByClassName("passwordInput")[0].value;

		xhr.send(JSON.stringify(data));
	});
}

forgotPasswordButton.addEventListener("click", () => {
	const xhr = new XMLHttpRequest();

	xhr.onload = () => {
		if (xhr.status === 200) {
			console.log("We emailed you a link");
		} else {
			console.log("Account reset failed");
		}
	}

	xhr.open("POST", "./forgot-password", true);

	xhr.setRequestHeader("Content-Type", "application/json");

	const data = {};

	const form = document.getElementById("signinForm");

	data.user = form.getElementsByClassName("emailInput")[0].value;

	xhr.send(JSON.stringify(data));
});

