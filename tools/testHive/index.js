const {exec} = require("child_process");
const fetch = require("node-fetch");
const SimplexNoise = require("simplex-noise");

const hiveName = "TestHive1";
const serverUrl = "http://localhost:5000";
const simplex = new SimplexNoise("seed");

let id;
let x = 0;

async function sendData() {
	console.log(x);
	const weight = (simplex.noise2D(x, x) + 1) * 4000;
	exec(`curl -X POST http://localhost:5000/add -H 'cache-control: no-cache' -H 'content-type: application/json' -d '{"_id": "${id}","weight": ${weight}}'`, (err, _stdout, _stderr) => {
		if (err) {
			throw err;
		}
		//console.log(stdout);
		//console.error(stderr);
	});
	x+= 0.005;
}

function start(url, name){
	fetch(`${url}/init/${name}`).then(res => res.json()).then(res => {
		console.log(res);
		id = res._id;
		setInterval(sendData, 1000);
	});
}

start(serverUrl, hiveName);
