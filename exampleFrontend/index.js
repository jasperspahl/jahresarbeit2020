// vim:fdm=marker:fdls=-1
// {{{ Helper Functions
function blocks(count) {
	return count * 10;
}

function map(n, start1, stop1, start2, stop2){
	var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	//alert(JSON.stringify({n, start1, stop1, start2, stop2, newval}));
	return newval;
}
// }}}
// {{{ Canvas
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth - 20;
canvas.height = 500;

var xGrid=20;
var yGrid=20;

var ctx = canvas.getContext("2d");

function drawGrid(xGrid, yGrid) {
	ctx.beginPath();

	for (var i = xGrid; i < canvas.width; i+= xGrid) {
		ctx.moveTo(i, 0);
		ctx.lineTo(i, canvas.height);
	}
	for (var i = yGrid; i < canvas.height; i+= yGrid){
		ctx.moveTo(0, i);
		ctx.lineTo(canvas.width, i);
	}
	ctx.strokeStyle = "#ebdeb288";
	ctx.stroke();
}
function drawAxis(offset){
	ctx.beginPath();
	ctx.strokeStyle = "#ebdeb2";
	ctx.moveTo(blocks(offset), 0);
	ctx.lineTo(blocks(offset), canvas.height);
	ctx.moveTo(0, canvas.height-blocks(offset));
	ctx.lineTo(canvas.width, canvas.height-blocks(offset));

	ctx.stroke();
}


drawGrid(xGrid, yGrid);
drawAxis(2);
// }}}
// {{{ Form
var form = document.querySelector("form");
async function handleSubmit(e) {
	e.preventDefault();
	var name = form.name.value;
	var res = await fetch(`/init/${name}`);
	var data = await res.json();
	var id = data._id;
	res = await fetch(`/id/${id}`);
	if (res.status === 404) {
		alert(`No Hive with id :${id} found`);
		return;
	}
	data = await res.json();
	if (data.data.length < 2) {
		alert(`There are not enouth enteries: ${data.data.length}`);
		return;
	}
	//alert(JSON.stringify({time: data.data[0].time, weight: data.data[0].weight}));
	var time1 = new Date(data.data[0].time);
	time1 = new Date(Date.now() - (1000*60*form.time.value));
	var time2 = new Date(data.data[data.data.length - 1].time);
	//time2 = new Date(Date.now());
	var record = 0;
	for (var i = 0; i < data.data.length; i++) {
		if (data.data[i].weight > record) {
			record = data.data[i].weight;
		}
	}
	ctx.clearRect(0,0,canvas.width, canvas.height);
	drawGrid(xGrid*2, yGrid*2);
	drawAxis(2);
	ctx.beginPath();
	ctx.moveTo(blocks(2), canvas.height-blocks(2));
	for (var i = 0; i < data.data.length; i++) {
		var item = data.data[i];
		var time = new Date(item.time);
		var x = map(time.getTime(), time1.getTime(), time2.getTime(), blocks(2), canvas.width);
		var y = map(item.weight, 0, record, canvas.height-blocks(2), blocks(2));
		//alert(JSON.stringify({x,y}));
		ctx.lineTo(x,y);
	}
	ctx.strokeStyle= "red";
	ctx.stroke();

}

form.onsubmit = handleSubmit;

// }}}
