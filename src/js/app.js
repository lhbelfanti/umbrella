import 'core-js';
import { TweenLite } from 'gsap';
import WeatherInfo from "./weather/weather-info";
import WeatherInfoUI from "./ui/weather-info-ui";
import BackgroundEffects from "./ui/background-effects";
import UIButtons from "./ui/ui-buttons";
import Languages from "./localization/languages";
import Persistence from "./persistence/persistence";
import TemperatureScale from "./weather/temperature-scale";

export default class App {
	constructor() {
		this._persistence = new Persistence();
		TemperatureScale.init(this._persistence);
		this._languages = new Languages(this._persistence);
		this._weatherInfo = new WeatherInfo(this.setupEvents.bind(this), this._languages, this._persistence);
		this._bgEffects = new BackgroundEffects(this._weatherInfo);
		new UIButtons(this._weatherInfo, this.setupWeather.bind(this), this._languages, this._weatherInfo.weatherLocation);
	}

	setupEvents() {
		this._weatherInfoUI = new WeatherInfoUI(this._weatherInfo, this._bgEffects.textures, this.updateWeather.bind(this));
		this._bgEffects.setupParallax();
		this.setupWeather();
		this._bgEffects.setupFlash();
	}

	setupWeather() {
		this._weatherInfoUI.setupWeatherData();
		this.updateWeather();
	}

	updateWeather() {
		if (!this._weatherInfo.weatherInfoLoaded)
			return window.setTimeout(() => { this.updateWeather(); }, 2000);

		this._weatherInfoUI.loadWeatherInfo();
		let weatherData = this._weatherInfo.currentWeatherData;

		this._bgEffects.raindrops.options = Object.assign(this._bgEffects.raindrops.options, weatherData);

		this._bgEffects.raindrops.clearDrops();

		TweenLite.fromTo(this._bgEffects.blend, 1, {
			v: 0
		}, {
			v: 1,
			onUpdate: () => {
				this._bgEffects.generateTextures(weatherData.fg, weatherData.bg, this._bgEffects.blend.v);
				this._bgEffects.renderer.updateTextures();
			}
		});
	}
}






