export function c_spike() {}; // page class

/*
type is element type in dom
name is the name used to store
from is to link obj in a dic on spike
and link is this element is child of link
*/
function add(type, name = null, from, link = null) {
	if (!this[from]) {
		this[from] = {};
	}
	if (!name) {
		let i = 0;
		let key = "";
		while (true) {
			key = `struct_${i}`;
			if (!this[from][key]) {
				name = key;
				break;
			}
			i++;
		}
	}

	let element = document.createElement(type);
	this[from][name] = element;

	if (!link) {
		document.body.appendChild(element);
	} else {
		link.appendChild(element);
	}

	return element;
}

function remove(target, from) {
	this[from][target].remove();

	for (let page in this) {
		for (let element in this[page]) {
			if (!this[page][element].isConnected) {
				delete this[page][element];
			}
		}
	}
}

c_spike.prototype.add = add;
c_spike.prototype.remove = remove;

let spike = new c_spike();
