import {spike} from "./data.js";

export function boot() {
	// creating pages
	spike.add("div", "page", "load");
	spike.add("div", "page", "home");
	spike.add("div", "page", "form").classList.add("div3");

	// creating page load
	spike.add("h1", "msg", "load", spike.load.page);
	spike.load.msg.innerText = "Iniciando...";

	// creating page home
	spike.add("div", "div", "home", spike.home.page); // container for elements
	spike.add("h1", "h1", "home", spike.home.div); // home title
	spike.add("ul", "list", "home", spike.home.div); // form list
	spike.add("h2", "load","home", spike.home.div); // load message
	spike.add("img", "img", "home", spike.home.div); // gojo photo
	spike.add("h3", "version", "home", spike.home.div); // spike version
	spike.add("div", "div2", "home", spike.home.page); // container for buttons
	spike.add("button", "reload", "home", spike.home.div2); // reload form button
	spike.add("span", null, "home", spike.home.reload).innerHTML = "&#8635;"; // reload span
	spike.add("button", "new", "home", spike.home.div2).innerText = "+"; // new form button

	spike.home.h1.innerText = "Tarefas pendentes do 1-Meca:";
	spike.home.load.innerText = "Carregando as tarefas... (isso pode demorar um pouco)";
	spike.home.img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShK42odeWlYQOSuNWda_jDTdwqPxURslx_7w7LHLooQQ&s=10";
	spike.home.div2.classList.add("div1");
	spike.home.reload.classList.add("input1");
	spike.home.new.classList.add("input1");

	// creating page form
	spike.add("h1", "h1", "form", spike.form.page); // form page title
	spike.add("label", null, "form", spike.form.page).innerText = "Titulo da tarefa";
	spike.add("input", "name", "form", spike.form.page);
	spike.add("label", null, "form", spike.form.page).innerText = "Descrição da tarefa";
	spike.add("textarea", "desc", "form", spike.form.page);
	spike.add("label", null, "form", spike.form.page).innerText = "Data de entrega";
	spike.add("input", "date", "form", spike.form.page).type = "date";
	spike.add("div", "div", "form", spike.form.page).classList.add("div4");
	spike.add("button", "send", "form", spike.form.div).classList.add("input2");
	spike.add("button", "cancel", "form", spike.form.div).classList.add("input2");

	spike.form.h1.innerText = "Preencha os campos abaixo:";
	spike.form.send.innerText = ">";
	spike.form.cancel.innerText = "x";
	spike.form.send.style.backgroundColor = "green";
	spike.form.cancel.style.backgroundColor = "red";
}
