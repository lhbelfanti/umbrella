export default class CanvasUtils {
	constructor() {
		this.canvas = document.querySelector('#container');
		this.dpi = window.devicePixelRatio;
		this.canvas.width = window.innerWidth * this.dpi;
		this.canvas.height = window.innerHeight * this.dpi;
		this.canvas.style.width = window.innerWidth + "px";
		this.canvas.style.height = window.innerHeight + "px";
	}

	createCanvas(width, height) {
		let canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		return canvas;
	}
}
