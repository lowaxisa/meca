const API_URL = "https://script.google.com/macros/s/AKfycbw3VN2sSD4feBDMXuIDDkVvNb6Z42WmEq5pB3gW3U95AQQ8Yc9iw3LkT4q3S7MkcLd-Yg/exec";

function c_api() {
	this.status = null;
}

// api functions
function send(route, src) {
	return fetch(API_URL + route, {
		method: "POST",
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
		body: src,
	});
}

function receive(route) {
	return fetch(API_URL + route);
}

async function sync() {
	try {
		let response = await receive("?route=status");

		if (!response.ok) {
			throw new Error(response.status);
		}

		let data = await response.json();
		this.status = data;
	} catch(err) {
		alert(err);
	}
}

// link
c_api.prototype.send = send;
c_api.prototype.receive = receive;
c_api.prototype.sync = sync;

// summon
export let api = new c_api();
