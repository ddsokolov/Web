window.onload = function() {
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var array = JSON.parse(this.responseText);

			var canvas = document.getElementById('canvas1');
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;

			if (!canvas.getContext) return;

			var context = canvas.getContext('2d');
			for (var i = 0; i < array.length; i++) {
				if (array[i] < 0) {
					drawError('Error: Array contains negative numbers', context, canvas.width, canvas.height);
					return;
				}
			}
			drawDiagram(context, canvas.width, canvas.height, array);
		}
	}
	ajax.open('GET', 'ajax.php');
	ajax.send();
}

function drawError(error, context, width, height) {
	context.font = 'bold 12px Segoe UI';
	context.textBaseline = 'middle';
	context.textAlign = 'center';
	context.fillStyle = '#ff0000';
	context.fillText(error, width / 2, height / 2);
}

function drawDiagram(ctx, width, height, array) {
	var padding = 15;
	var max = Math.trunc(Math.max.apply(null, array));
	var step = max / 5;
	max += step;
	var foo = (width - 3 * padding) / array.length; // высота прямоугольника + отступ

	/* draw grid */
	ctx.strokeStyle = '#7f7f7f';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(padding * 2, padding);
	ctx.lineTo(padding * 2, height - padding);
	ctx.lineTo(width - padding, height - padding);
	ctx.stroke();

	ctx.lineWidth = 1;
	ctx.strokeStyle = '#7f7f7f';
	ctx.font = 'bold 12px Segoe UI';
	ctx.fillStyle = '#000';
	ctx.textAlign = 'right';
	ctx.textBaseline = 'middle';
	for (var i = step; i < max; i += step) {
		ctx.beginPath();
		ctx.moveTo(padding * 2, i * (height - padding) / max);
		ctx.lineTo(width - padding, i * (height - padding) / max);
		ctx.stroke();

		ctx.fillText(max - i, padding * 2 - 5, i * (height - padding) / max);
	}
	/* draw grid */

	/* draw diagram */
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(padding * 2 + foo / 2, height - padding - array[0] / max * (height - padding));
	for (var i = 1; i < array.length; i++) {
		ctx.lineTo(padding * 2 + i * foo + foo / 2, height - padding - array[i] / max * (height - padding));
	}
	ctx.stroke();

	ctx.font = 'bold 12px Segoe UI';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'bottom';
	for (var i = 0; i < array.length; i++) {
		ctx.fillStyle = '#4f81bd';
		ctx.beginPath();
		ctx.arc(padding * 2 + i * foo + foo / 2, height - padding - array[i] / max * (height - padding), 5, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.fillStyle = '#000000';
		ctx.fillText(array[i], padding * 2 + i * foo + foo / 2, height - padding - array[i] / max * (height - padding) - 5);
	}
	/* draw diagram */
}