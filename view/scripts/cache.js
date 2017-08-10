"use strict";

function Cache(email, numItems) {
	this.email = email;
	this.numItems = numItems;

	this.news = [];
	this.mutates = [];
	this.removes = [];

	this.push = () => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			if (xhr.status === 200) {
				//
			} else {
				//
			}
		}

		// Consolidate changes
		
		// xhr.open()
		
		xhr.send();
	}

	this.add = () => {
		const id = this.numItems++;

		const row = document.getElementsByTagName("tr")[id];
		const tds = row.getElementsByTagName("td");

		this.news.push({
			heading: td[0].innerText,
			body: td[1].innerText
		});
	}

	this.mutate = (id) => {
		const row = document.getElementsByTagName("tr")[id];
		const tds = row.getElementsByTagName("td");

		this.mutates[id] = {
			heading: td[0].innerText,
			body: td[0].innerText
		}

		// TODO - should I use innerText?

	this.remove = (id) => {
		this.removes.push(id);
	}
}

const thead = document.getElementsByTagName("thead")[0];

const numItems = thead.getAttribute("data-num-items");
const email = thead.getAttribute("data-email");

window.cache = new Cache(email, numItems);
