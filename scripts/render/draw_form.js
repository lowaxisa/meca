// --- imports
import {spike} from './../data.js';

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
export function draw_form(target, name, desc, date) {
    if (!name && !desc) return;
    if (!date) date = "A data de entrega não definida";

	let fcomp  = document.createElement("div");
	let fname = document.createElement("h2");
	let fdesc = document.createElement("p");
	let fdate = document.createElement("h3");

	let felements = {
		name: fname,
		desc: fdesc,
		date: fdate,
	};

	let fappendlist = [
		fname,
		fdesc,
		fdate,
	];

	fname.innerText = `Trabalho: ${name}`;
	fdate.innerText = `Data de entrega: ${date}`;

	// style
	fcomp.classList.add("div2");
	fcomp.style.backgroundColor = "#bfcade";
	fcomp.style.padding         = "5px 20px";
	fcomp.style.borderRadius    = "25px";
	fcomp.style.marginBottom    = "15px";

	target.appendChild(fcomp);

	// parser
	let acc = "";
	let descchanged = false;
	let descnum = 0;
	let removedesctemplate = false;

    try {
        for (let i = 0; i < desc.length; i++) {
            if (desc[i] === "\\") {
                let cmd_acc = "";
                for (let j = i + 1; j < desc.length; j++) {
                    const get_parameter = () => {
                        let temp_return = "";
                        for (let k = j + 1; k < desc.length; k++) {
                            let char = desc[k];
                            if (char === "\\") {
                                k += 1;
                                temp_return += desc[k];
                            } else if (char === ";") {
                                j = k;
                                return temp_return;
                            } else {
                                temp_return += char;
                            }
                        }
                        return null;
                    };
                    const update_desc = () => {
                        if (descchanged) {
                            fdesc.innerText = acc;
                            fappendlist.splice(fappendlist.length - 2, 0, fdesc);
                            fdesc = document.createElement("p");
                            descnum += 1; acc = "";
                        } else {
                            if (!removedesctemplate) {
                                fdesc.innerText = `Descrição: ${acc}`;
                            } else { fdesc.innerText = acc; } acc = "";
                            descchanged = true;
                            fappendlist.splice(fappendlist.length - 2, 0, fdesc);
                            fdesc = document.createElement("p");
                        }
                    };
                    cmd_acc += desc[j];
                    if (cmd_acc === "\\") {
                        acc += "\\";
                        i = j + 1;
                        break;
                    } else if (cmd_acc === "removetitletemplate") {
                        fname.innerText = name;
                        i = j + 1;
                        break;
                    } else if (cmd_acc === "removedesctemplate") {
                        removedesctemplate = true;
                        i = j + 1;
                        break;
                    } else if (cmd_acc === "removedatetemplate") {
                        fdate.innerText = date;
                        i = j + 1;
                        break;
                    } else if (cmd_acc === "setfont=") {
                        let splited = get_parameter().split(","); // target, font
                        if (splited[0] in felements) {
                            felements[splited[0]].style.fontFamily = splited[1];
                        }
                        i = j;
                        break;
                    } else if (cmd_acc === "setchar=") {
                        let splited = get_parameter().split(",");
                        if (splited[0] in felements) {
                            felements[splited[0]].style.fontSize = `${calc_charsize(felements[splited[0]], fcomp.clientWidth * 0.4, parseInt(splited[1], 10))}px`;
                        }
                        i = j;
                        break;
                    } else if (cmd_acc === "img=") {
                        let url = get_parameter();
                        let img = document.createElement("img");
                        img.src = url;
                        fappendlist.splice(fappendlist.length - 1, 0, img);
                        update_desc();
                        i = j;
                        break;
                    } else if (cmd_acc === "link=") {
                        let splited = get_parameter().split(",");
                        if (!splited[0].startsWith("https://")) {
                            throw new Error("error");
                        }

                        let link = document.createElement("a");
                        link.href = splited[0];
                        link.innerText = splited[1];
                        fappendlist.splice(fappendlist.length - 1, 0, link);
                        update_desc();
                        i = j;
                        break;
                    } else if (cmd_acc === "video=") {
                        let url = get_parameter();
                        let video = document.createElement("video");
                        video.src = url;
                        video.controls = true;
                        video.style.width = "100%";
                        fappendlist.splice(fappendlist.length - 1, 0, video);
                        update_desc();
                        i = j;
                        break;
                    } else if (cmd_acc === "youtube=") {
                        let url = get_parameter();
                        let video_id = "";
                        let youtube = document.createElement("iframe");

                        if (url.includes("watch?v=")) {
                            video_id = url.split("v=")[1].split("&")[0];
                        }

                        if (url.includes("youtu.be/")) {
                            video_id = url.split("youtu.be/")[1].split("?")[0];
                        }

                        youtube.src = `https://www.youtube.com/embed/${video_id}`;
                        youtube.setAttribute("allowfullscreen", "");

                        fappendlist.splice(fappendlist.length - 1, 0, youtube);
                        update_desc();
                        i = j;
                        break;
                    }
                }
            } else {
                acc += desc[i];
            }
        }
    } catch (err) {
        fcomp.remove();
        return;
    }

    if (!name && !descchanged && !acc) {
        fcomp.remove();
        return;
    }

	if (!removedesctemplate && !descchanged) {
		fdesc.innerText = `Descrição: ${acc}`;
	} else {
		fdesc.innerText = acc;
		fappendlist.splice(fappendlist.length - 1, 0, fdesc);
	}

	for (let element of fappendlist) {
		fcomp.appendChild(element);
	}
}
