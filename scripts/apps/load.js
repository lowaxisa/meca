import {spike} from "./../data.js";
import {api} from "./../api.js";
import {sdraw} from "./../render/sdraw.js";

export async function load() {
	await api.sync();
	if (api.status.spike_down) {
		let temp = "O dev derrubou o site";
		temp += (api.status.alert.has_alert) ? ", motivo: " + api.status.alert.alert_msg : "";
		spike.load.msg.innerText = temp;
		return;
	}
	spike.home.version.innerText = api.status.version;
	sdraw.page("home");
}
