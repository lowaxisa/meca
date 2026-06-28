console.log("iniciando...");

// --- imports, independent imports
import {spike} from "./data.js";
import {api} from "./api.js";

// dependent imports
import {boot} from "./boot.js"; boot();
import {sdraw} from "./render/sdraw.js"; sdraw.page("load");
import {init} from "./apps/umbrella.js"; init();

// --- state var
let loadf_initiated = false;

// --- logic
async function loadf() {
	loadf_initiated = true;
	spike.home.list.innerHTML = "";
	spike.home.load.style.display = "block";
    spike.home.load.innerText = "Carregando as tarefas... (isso pode demorar um pouco)";
    try {
        let response = await api.receive("?route=comp_form");

        if (!response.ok) {
            throw new Error(`status ${response.status}`);
        }

        let data = await response.json();

	    for (let i = data.length - 1; i >= 1; i--) {
		    let row = data[i];
		    let date = new Date(row[2]);
            date.setDate(date.getDate() + 1);

		    date = (isNaN(date.getTime())) ? null : date.toLocaleDateString("pt-BR");
    		try {
                sdraw.form(spike.home.list, row[0], row[1], date);
            } catch(err) {}
        }
    } catch(err) {
        spike.home.load.innerText = `O banco de dados parece estar fora de ar, tente novamente mais tarde. Erro: ${err}`;
        loadf_initiated = false;
        return;
    }
	spike.home.load.style.display = "none";
	loadf_initiated = false;
}

async function sendf(task_title, task_desc, task_date) {
	let src =  JSON.stringify({
		title: task_title,
		desc: task_desc,
		date: task_date,
	});
	let response = await api.send("?route=comp_send", src);
}

// --- event listener
spike.home.new.addEventListener("click", () => {
	sdraw.page("form", "flex");
});

spike.form.cancel.addEventListener("click", () => {
	sdraw.page("home");
});

spike.form.send.addEventListener("click", async () => {
	let ftitle = spike.form.name.value;
	let fdesc = spike.form.desc.value;
	let fdate = spike.form.date.value;

	spike.form.name.value = "";
	spike.form.desc.value = "";
	spike.form.date.value = "";

	alert("enviando isso pode demorar um pouco");
	try {
		await sendf(ftitle, fdesc, fdate);
		sdraw.page("home");
		await loadf();
	}
	catch (err) {
		alert("erro ao enviar :(");
		alert(err);
	}
});

spike.home.reload.addEventListener("click", async () => {
	if (loadf_initiated) {
		return;
	}
	spike.home.reload.disabled = true;
	spike.home.reload.style.opacity = "0.5";
	await loadf();
	spike.home.reload.disabled = false;
	spike.home.reload.style.opacity = "1.0";
});

window.addEventListener("DOMContentLoaded", async () => {
	spike.home.reload.style.opacity = "0.5";
	await loadf();
	spike.home.reload.style.opacity = "1.0";
});

