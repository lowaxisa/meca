// --- imports
import { dom } from './dlink.js';

// --- global var
const page_list = {
	"page-init": dom.it.page,
	"page-form": dom.fm.page,
};

let task_count = 0

// --- helpers
function calc_fontsize(text, width, fontfamily) {
	let canvas = document.createElement("canvas");
	let ctx = canvas.getContext("2d");

	let size_ref = 20;
	ctx.font = `${size_ref}px ${fontfamily}`;
	let width_ref = ctx.measureText(text).width;

	return (width / width_ref) * size_ref;
}

function calc_charsize(element, width, num_char) {
	let fontfamily = getComputedStyle(element).fontFamily;
	return calc_fontsize("a".repeat(num_char), width, fontfamily);
}

// --- logic
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

	let felements = {
		title: task_title,
		desc: task_desc,
		date: task_date,
	};

	task_div.id   = `task${task_count}-div`;
	task_title.id = `task${task_count}-title`;
	task_desc.id  = `task${task_count}-desc`;
	task_date.id  = `task${task_count}-date`;

	task_title.innerHTML = `Trabalho: ${title}`;
	task_date.innerHTML = `Data de entrega: ${date}`;

	task_div.appendChild(task_title);
	task_div.appendChild(task_desc);
	task_div.appendChild(task_date);
	target.appendChild(task_div);

	// style
	task_div.classList.add("it-fc1");
	task_div.style.backgroundColor = "#bfcade";
	task_div.style.padding = "5px 20px";
	task_div.style.borderRadius = "25px";
	task_div.style.marginBottom = "15px";

	// parser
	let acc = "";
	let removedesctemplate = false;

	for (let i = 0; i < desc.length; i++) {
		if (desc[i] === "\\") {
			let cmd_acc = "";
			for (let j = i + 1; j < desc.length; j++) {
				const get_parameter = () => {
					let temp_return = "";
					for (let k = j + 1; k < desc.length; k++) {
						let char = desc[k];
						if (char === ";") {
							j = k;
							return temp_return;
						} else {
							temp_return += char;
						}
					}
				};
				cmd_acc += desc[j];
				if (cmd_acc === "\\") {
					acc += "\\";
					i = j + 1;
					break;
				} else if (cmd_acc === "removetitletemplate") {
					task_title.innerHTML = title;
					i = j + 1;
					break;
				} else if (cmd_acc === "removedesctemplate") {
					removedesctemplate = true;
					i = j + 1;
					break;
				} else if (cmd_acc === "removedatetemplate") {
					task_date.innerHTML = date;
					i = j + 1;
					break;
				} else if (cmd_acc === "setfont=") {
					let splited = get_parameter().split(","); // target, font
					felements[splited[0]].style.fontFamily = splited[1];
					i = j;
					break;
				} else if (cmd_acc === "setchar=") {
					let splited = get_parameter().split(",");
					felements[splited[0]].style.fontSize = `${calc_charsize(felements[splited[0]], task_div.clientWidth, parseInt(splited[1], 10))}px`;
					i = j;
					break;
				}
			}
		} else {
			acc += desc[i];
		}
	}

	if (!removedesctemplate) {
		task_desc.innerHTML = `Descrição: ${acc}`;
	} else {
		task_desc.innerHTML = acc;
	}
}

// --- init
show_page("none"); // hide everthing

// defining styles
dom.fm.isendf.style.backgroundColor   = "green";
dom.fm.icancelf.style.backgroundColor = "red";

show_page("page-init");
