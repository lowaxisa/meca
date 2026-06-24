// --- imports
import { dom } from './dlink.js';

// --- global var
const page_list = {
	"page-init": dom.it.page,
	"page-form": dom.fm.page,
};

let task_count = 0

// --- helpers
export function show_page(page, mode = "block") {
	for (const [key, value] of Object.entries(page_list)) {
		if (key === page) {
			value.style.display = mode;
		} else {
			value.style.display = "none";
		}
	}
}

export function show_task(target, title, desc, date) {
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

// --- init
show_page("none"); // hide everthing

// defining styles
dom.fm.isendf.style.backgroundColor   = "green";
dom.fm.icancelf.style.backgroundColor = "red";

show_page("page-init");
