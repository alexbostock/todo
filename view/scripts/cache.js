"use strict";

function Cache(email, numItems) {
	this.email = email;
	this.numItems = numItems;

	const NEW = 1;
	const MUTATE = 2;
	const DELETE = 3;

	this.changes = new Array(numItems);

	this.push = () => {
		for (var i = 0; i < numItems; i++) {
			const xhr = new XMLHttpRequest();

			xhr.onload = () => {
				if (xhr.status === 200) {
					this.changes[i] = null;
				} else {
					console.log(status);
				}
			}

			const change = this.changes[i];

			switch (change.type) {
			case NEW:
				xhr.open("POST", "./add", true);

				xhr.send({
					item: {
						heading: change.heading,
						body: change.body
					}
				});

				break;

			case MUTATE:
				xhr.open("PUT", "./mutate", true);

				xhr.send({
					index: i,
					item: {
						heading: change.heading,
						body: change.body
					}
				});

				break;

			case DELETE:
				xhr.open("DELETE", "./delete", true);

				xhr.send({
					index: i
				});

				break;

			}
		}
	}

	this.add = () => {
		const id = this.numItems++;

		const row = document.getElementsByTagName("tr")[id];
		const tds = row.getElementsByTagName("td");

		this.changes.push({
			type: NEW,
			heading: td[0].innerText,
			body: td[1].innerText
		});
	}

	this.mutate = (id) => {
		const row = document.getElementsByTagName("tr")[id];
		const tds = row.getElementsByTagName("td");

		this.changes[id] = {
			type: MUTATE,
			heading: td[0].innerText,
			body: td[0].innerText
		}

		// TODO - should I use innerText?
	}

	this.remove = (id) => {
		this.changes[id] = {
			type: DELETE
		}
	}
}

const thead = document.getElementsByTagName("thead")[0];

const numItems = thead.getAttribute("data-num-items");
const email = thead.getAttribute("data-email");

window.cache = new Cache(email, numItems);
