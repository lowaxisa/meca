console.log("iniciando...");

// --- imports
import { dom } from './tools/dlink.js';
import { send, recive } from './tools/api.js';

// --- global var
const page_list = {
	"page-init": dom.it.page,
	"page-form": dom.fm.page,
};

const api = "https://script.google.com/macros/s/AKfycbxMx-8HRw3GNRX3acOmW4NZwYodxyLCbYjJcj5Er8nLnEQsfhy1KZt4gEl0LPLSnEqzEQ/exec";
let task_count = 0

// --- helpers
function show_page(page, mode = "block") {
	for (const [key, value] of Object.entries(page_list)) {
		if (key === page) {
			value.style.display = mode;
		} else {
			value.style.display = "none";
		}
	}
}

function show_task(target, title, desc, date) {
	task_count++;

	let task_div   = document.createElement("div");
	let task_title = document.createElement("h2");
	let task_desc  = document.createElement("p");
	let task_date  = document.createElement("h3");

	task_div.id   = `task${task_count}-div`;
	task_title.id = `task${task_count}-title`;
	task_desc.id  = `task${task_count}-desc`;
	task_date.id  = `task${task_count}-date`;

	task_title.innerText = `Trabalho: ${title}`;
	task_desc.innerText  = `Descrição: ${desc}`;
	task_date.innerText  = `Data de entrega: ${date}`;

	task_div.appendChild(task_title);
	task_div.appendChild(task_desc);
	task_div.appendChild(task_date);

	// style
	task_div.style.backgroundColor = "#bfcade";
	task_div.style.padding = "5px 20px";
	task_div.style.borderRadius = "25px";
	task_div.style.marginBottom = "15px";

	target.appendChild(task_div);
}

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
show_page("none"); // hide everthing
// defining styles
dom.it.inewf.style.fontSize = "140px";
dom.it.inewf.style.borderRadius = "50px";
dom.it.inewf.style.padding = "0px 40px";

dom.fm.isendf.style.fontSize = "120px";
dom.fm.isendf.style.borderRadius = "50px";
dom.fm.isendf.style.padding = "0px 40px";
dom.fm.isendf.style.backgroundColor = "green";
dom.fm.isendf.style.color = "white";

dom.fm.icancelf.style.fontSize = "120px";
dom.fm.icancelf.style.borderRadius = "50px";
dom.fm.icancelf.style.padding = "0px 40px";
dom.fm.icancelf.style.backgroundColor = "red";
dom.fm.icancelf.style.color = "white";

// setup page
show_page("page-init");

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
load_tasks();
