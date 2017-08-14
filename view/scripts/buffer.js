"use strict";

const saveButton = document.getElementById("saveButton");

function Buffer() {
	this.state = [];

	const tbody = document.getElementsByTagName("tbody")[0];
	this.items = tbody.getElementsByTagName("tr");

	for (let i = 0; i < this.items.length; i++) {
		let cells = this.items[i].getElementsByTagName("td");

		this.state.push({
			heading: cells[0].textContent,
			body: cells[1].textContent
		});

		cells[2].firstChild.addEventListener("click", () => {
			this.remove(i);
		});
	}

	this.remove = (id) => {
		let item = this.items[id];

		item.parentNode.removeChild(item);

		this.state.splice(id, 1);

		this.setUnsavedChanges(true);
	}

	this.save = () => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			if (xhr.status === 200) {
				this.setUnsavedChanges(false);
			} else {
				console.log("Failed to push changes");
			}
		}

		xhr.open("POST", "./save", true);
		xhr.setRequestHeader("Content-Type", "application/json");

		let data = {};

		data.items = this.state;

		xhr.send(JSON.stringify(data));
	}

	this.setUnsavedChanges = (unsaved) => {
		this.unsavedChanges = unsaved;

		saveButton.disabled = ! unsaved;
	}
		

	this.update = () => {
		let changes = this.unsavedChanges;

		for (let i = 0; i < this.items.length; i++) {
			let cells = this.items[i].getElementsByTagName("td");

			let s = this.state[i];

			let heading = cells[0].textContent;
			let body = cells[1].textContent;

			changes = changes || (heading !== s.heading) || (body !== s.body);

			s.heading = heading;
			s.body = body;

			this.setUnsavedChanges(changes);
		}
	}

	this.setUnsavedChanges(false);
}

window.buffer = new Buffer();

const tbody = document.getElementsByTagName("tbody")[0];

tbody.addEventListener("click", buffer.update);
tbody.addEventListener("keyup", buffer.update);

saveButton.addEventListener("click", buffer.save);

setInterval(() => {
	if (buffer.unsavedChanges) {
		buffer.save();
	}
}, 5000);	// Auto-save every 5 seconds
