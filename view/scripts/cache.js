"use strict";

const saveButton = document.getElementById("saveButton");

function Cache(email, numItems) {
	this.email = email;
	this.numItems = numItems;

	const NEW = 1;
	const MUTATE = 2;
	const DELETE = 3;

	this.changes = new Array(numItems);

	this.push = () => {
		let xhrs = new Array(numItems);

		for (var i = 0; i < numItems; i++) {
			let change = this.changes[i];

			if (! change) {
				continue;
			}

			xhrs[i] = new XMLHttpRequest();

			let xhr = xhrs[i];

			xhr.onload = () => {
				if (xhr.status === 200) {
					this.changes[i] = null;

					saveButton.disabled = true;
				} else {
					console.log("Failed to push changes");

					saveButton.disabled = false;
				}
			}

			switch (change.type) {
			case NEW:
				xhr.open("POST", "./add", true);
				xhr.setRequestHeader("Content-Type", "application/json");

				xhr.send(JSON.stringify({
					item: {
						heading: change.heading,
						body: change.body
					}
				}));

				break;

			case MUTATE:
				xhr.open("PUT", "./mutate", true);
				xhr.setRequestHeader("Content-Type", "application/json");

				xhr.send(JSON.stringify({
					index: i,
					item: {
						heading: change.heading,
						body: change.body
					}
				}));

				break;

			case DELETE:
				xhr.open("DELETE", "./delete", true);
				xhr.setRequestHeader("Content-Type", "application/json");

				xhr.send(JSON.stringify({
					index: i
				}));

				setTimeout(() => {
					window.location.reload();
				}, 500);

				break;

			}
		}
	}

	this.add = () => {
		const id = this.numItems++;

		const row = document.getElementsByTagName("tr")[id + 1];
		const tds = row.getElementsByTagName("td");

		this.changes.push({
			type: NEW,
			heading: td[0].textContent,
			body: td[1].textContent
		});

		saveButton.disabled = false;
	}

	this.mutate = (id) => {
		const row = document.getElementsByTagName("tr")[id + 1];
		const tds = row.getElementsByTagName("td");

		this.changes[id] = {
			type: MUTATE,
			heading: tds[0].textContent,
			body: tds[1].textContent
		}

		saveButton.disabled = false;
	}

	this.remove = (id) => {
		this.changes[id] = {
			type: DELETE
		}

		saveButton.disabled = false;
	}
}

const thead = document.getElementsByTagName("thead")[0];

const numItems = thead.getAttribute("data-num-items");
const email = thead.getAttribute("data-email");

window.cache = new Cache(email, numItems);

const rows = document.getElementsByTagName("tr");

for (var i = 1; i < rows.length; i++) {
	const cells = rows[i].getElementsByTagName("td");

	const index = i;

	cells[0].addEventListener("keypress", () => {
		window.cache.mutate(index - 1);
	});

	cells[1].addEventListener("keypress", () => {
		window.cache.mutate(index - 1);
	});

	cells[2].firstChild.addEventListener("click", () => {
		window.cache.remove(index - 1);
	});
}

saveButton.addEventListener("click", cache.push);
