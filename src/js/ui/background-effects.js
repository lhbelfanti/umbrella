import texturesConfig from "../configs/textures.json";
import TexturesLoader from "../utils/textures_loader";
import CanvasUtils from "../rain-effect/canvas-utils";
import Raindrops from "../rain-effect/raindrops";
import RainRenderer from "../rain-effect/rain_renderer";
import { Quint, TweenLite } from "gsap";
import { chance, random } from "../utils/random";
import times from "../utils/times";

export default class BackgroundEffects {
	constructor(weatherInfo) {
		this.weatherInfo = weatherInfo;
		this.raindrops = null;
		this.renderer = null;
		this.parallax = {x: 0, y: 0};
		this.blend = {v: 0};
		this.textureFgCtx = null;
		this.textureBgCtx = null;
		this.canvasUtils = null;

		this.textureBgSize = texturesConfig.sizes.textureBgSize;
		this.textureFgSize = texturesConfig.sizes.textureFgSize;
		this.textures = new TexturesLoader(this.init.bind(this));
	}

	init() {
		this.canvasUtils = new CanvasUtils();
		this.raindrops = new Raindrops(this.canvasUtils, this.textures.dropAlpha, this.textures.dropColor);

		let textureFg = this.canvasUtils.createCanvas(this.textureFgSize.width, this.textureFgSize.height);
		this.textureFgCtx = textureFg.getContext('2d');
		let textureBg = this.canvasUtils.createCanvas(this.textureBgSize.width, this.textureBgSize.height);
		this.textureBgCtx = textureBg.getContext('2d');

		this.generateTextures(this.textures.textureRainFg, this.textures.textureRainBg);

		this.renderer = new RainRenderer(this.canvasUtils, this.raindrops.canvas, textureFg, textureBg);
	}

	generateTextures(fg, bg, alpha = 1) {
		this.textureFgCtx.globalAlpha = alpha;
		this.textureFgCtx.drawImage(fg, 0, 0, this.textureFgSize.width, this.textureFgSize.height);

		this.textureBgCtx.globalAlpha = alpha;
		this.textureBgCtx.drawImage(bg, 0, 0, this.textureBgSize.width, this.textureBgSize.height);
	}

	setupParallax() {
		document.addEventListener('mousemove', (event) => {
			let x = event.pageX;
			let y = event.pageY;

			TweenLite.to(this.parallax, 1, {
				x: ((x / this.canvasUtils.canvas.width) * 2) - 1,
				y: ((y / this.canvasUtils.canvas.height) * 2) - 1,
				ease: Quint.easeOut,
				onUpdate: () => {
					this.renderer.parallaxX = this.parallax.x;
					this.renderer.parallaxY = this.parallax.y;
				}
			})
		});
	}

	setupFlash() {
		setInterval(() => {
			if (this.weatherInfo.weatherInfoLoaded && this.weatherInfo.currentWeatherData !== null) {
				let currentWeatherData = this.weatherInfo.currentWeatherData;
				if (chance(currentWeatherData.flashChance)) {
					this.flash(currentWeatherData.bg, currentWeatherData.fg, currentWeatherData.flashBg, currentWeatherData.flashFg);
				}
			}
		}, 500);
	}

	flash(baseBg, baseFg, flashBg, flashFg) {
		let flashValue = {v: 0};

		let lastFlash = this.transitionFlash(1);
		times(random(2, 7), (i) => {
			lastFlash = lastFlash.then(() => {
				return this.transitionFlash(random(0.1, 1), baseFg, baseBg, flashFg, flashBg, flashValue)
			})
		});
		lastFlash = lastFlash.then(() => {
			return this.transitionFlash(1, 0.1, baseFg, baseBg, flashFg, flashBg, flashValue);
		}).then(() => {
			return this.transitionFlash(0, 0.25, baseFg, baseBg, flashFg, flashBg, flashValue);
		});
	}

	transitionFlash(to, t = 0.025, baseFg, baseBg, flashFg, flashBg, flashValue) {
		return new Promise((resolve) => {
			TweenLite.to(flashValue, t, {
				v: to,
				ease: Quint.easeOut,
				onUpdate: () => {
					this.generateTextures(baseFg, baseBg);
					this.generateTextures(flashFg, flashBg, flashValue.v);
					this.renderer.updateTextures();
				},
				onComplete: () => {
					resolve();
				}
			});
		});
	}
}