console.log("iniciando...");

window.onerror = (msg, url, line) => {
	alert(`O erro "${msg}" ocorreu na linha ${line}`);
};

// --- imports
import { dom } from './tools/dlink.js';
import { send, recive } from './tools/api.js';
import { show_page, show_task } from './tools/render.js';

// --- global var
const api = "https://script.google.com/macros/s/AKfycbxMx-8HRw3GNRX3acOmW4NZwYodxyLCbYjJcj5Er8nLnEQsfhy1KZt4gEl0LPLSnEqzEQ/exec";

// --- logic
async function load_tasks() {
	dom.it.flist.innerHTML = "";
	dom.it.msgload.style.display = "block";
	let response = await recive(api, "?route=tasks");
	let data = await response.json();

	for (let i = data.length - 1; i >= 1; i--) {
		let row = data[i];
		let date = new Date(row[2]);
		date = (date.getDate() + 1) + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

		show_task(dom.it.flist, row[0], row[1], date);
	}
	dom.it.msgload.style.display = "none";
}

async function send_task(task_title, task_desc, task_date) {
	let src =  JSON.stringify({
		title: task_title,
		desc: task_desc,
		date: task_date,
	});
	let response = await send(api, "?route=send", src);
}

// --- init
dom.it.inewf.addEventListener("click", () => {
	show_page("page-form", "flex");
});

dom.fm.icancelf.addEventListener("click", () => {
	show_page("page-init");
});

dom.fm.isendf.addEventListener("click", async () => {
	let task_title = dom.fm.ititle.value;
	let task_desc = dom.fm.idesc.value;
	let task_date = dom.fm.idate.value;

	dom.fm.ititle.value = "";
	dom.fm.idesc.value = "";
	dom.fm.idate.value = "";

	alert("enviando isso pode demorar um pouco");
	try {
		await send_task(task_title, task_desc, task_date);
		show_page("page-init");
		await load_tasks();
	}
	catch (err) {
		alert("erro ao enviar :(");
		alert(err);
	}
});

dom.it.ireloadf.addEventListener("click", async () => {
	dom.it.ireloadf.disabled = true;
	dom.it.ireloadf.style.opaticy = "0.5";
	await load_tasks();
	dom.it.ireloadf.disabled = false;
	dom.it.ireloadf.style.opacity = "1.0";
});

window.addEventListener("DOMContentLoaded", async () => {
	dom.it.ireloadf.disabled = true;
	dom.it.ireloadf.style.opaticy = "0.5";
	await load_tasks();
	dom.it.ireloadf.disabled = false;
	dom.it.ireloadf.style.opacity = "1.0";
});
