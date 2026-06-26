export async function send(url, route, src) {
	return fetch(url + route, {
		method: "POST",
		headers: {
			"Content-Type": "text/plain; charset=utf-8;",
		},
		body: src,
	});
}

export async function recive(url, route) {
	return fetch(url + route);
}
