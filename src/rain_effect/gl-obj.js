import WebGL from "./webgl";

export default class GL {
	constructor(canvas, options, vert, frag) {
		this.canvas = null;
		this.gl = null;
		this.program = null;
		this.width = 0;
		this.height = 0;
		this.init(canvas, options, vert, frag)
	}

	init(canvas, options, vert, frag) {
		this.canvas = canvas;
		this.width = canvas.width;
		this.height = canvas.height;
		this.webgl = new WebGL();
		this.gl = this.webgl.getContext(canvas, options);
		this.program = this.createProgram(vert, frag);
		this.useProgram(this.program);
	}

	createProgram(vert, frag) {
		return this.webgl.createProgram(this.gl, vert, frag);
	}

	useProgram(program) {
		this.program = program;
		this.gl.useProgram(program);
	}

	createTexture(source, i) {
		return this.webgl.createTexture(this.gl, source, i);
	}

	createUniform(type, name, ...v) {
		this.webgl.createUniform(this.gl, this.program, type, name, ...v);
	}

	activeTexture(i) {
		this.webgl.activeTexture(this.gl, i);
	}

	updateTexture(source) {
		this.webgl.updateTexture(this.gl, source);
	}

	draw() {
		this.webgl.setRectangle(this.gl, -1, -1, 2, 2);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
	}
}


