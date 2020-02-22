import GL from "./gl-obj";
import rainConfig from "../configs/rain_data";

export default class RainRenderer {
	constructor(canvasUtils, canvasLiquid, imageFg, imageBg, imageShine = null) {
		this.textures = null;
		this.programWater = null;
		this.parallaxX = 0;
		this.parallaxY = 0;
		this.renderShadow = false;

		this.canvasUtils = canvasUtils;
		this.canvas = canvasUtils.canvas;
		this.canvasLiquid = canvasLiquid;
		this.imageShine = imageShine;
		this.imageFg = imageFg;
		this.imageBg = imageBg;

		let options = { brightness: 1.04, alphaMultiply: 6, alphaSubtract: 3/*, minRefraction:256,*/ /*maxRefraction:512*/};
		this.options = Object.assign({}, rainConfig.rainRenderer.defaultOptions, options);

		this.init();
	}

	init() {
		let requireShaderScript = require("glslify");
		let vertShader = requireShaderScript('../shaders/simple.vert');
		let fragShader = requireShaderScript('../shaders/water.frag');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.gl = new GL(this.canvas, {alpha: false}, vertShader, fragShader);

		let gl = this.gl;
		this.programWater = gl.program;

		gl.createUniform("2f", "resolution", this.width, this.height);
		gl.createUniform("1f", "textureRatio", this.imageBg.width / this.imageBg.height);
		gl.createUniform("1i", "renderShine", this.imageShine != null);
		gl.createUniform("1i", "renderShadow", this.options.renderShadow);
		gl.createUniform("1f", "minRefraction", this.options.minRefraction);
		gl.createUniform("1f", "refractionDelta", this.options.maxRefraction - this.options.minRefraction);
		gl.createUniform("1f", "brightness", this.options.brightness);
		gl.createUniform("1f", "alphaMultiply", this.options.alphaMultiply);
		gl.createUniform("1f", "alphaSubtract", this.options.alphaSubtract);
		gl.createUniform("1f", "parallaxBg", this.options.parallaxBg);
		gl.createUniform("1f", "parallaxFg", this.options.parallaxFg);

		gl.createTexture(this.imageBg, 0);

		this.textures = [
			{name: 'textureShine', img: this.imageShine == null ? this.canvasUtils.createCanvas(2, 2) : this.imageShine},
			{name: 'textureFg', img: this.imageFg},
			{name: 'textureBg', img: this.imageBg}
		];

		this.textures.forEach((texture, i) => {
			gl.createTexture(texture.img, i + 1);
			gl.createUniform("1i", texture.name, i + 1);
		});

		this.draw();
	}

	draw() {
		this.gl.useProgram(this.programWater);
		this.gl.createUniform("2f", "parallax", this.parallaxX, this.parallaxY);
		this.updateTexture();
		this.gl.draw();

		requestAnimationFrame(this.draw.bind(this));
	}

	updateTextures() {
		this.textures.forEach((texture, i) => {
			this.gl.activeTexture(i + 1);
			this.gl.updateTexture(texture.img);
		})
	}

	updateTexture() {
		this.gl.activeTexture(0);
		this.gl.updateTexture(this.canvasLiquid);
	}
}
