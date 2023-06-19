import weatherTypes from "../configs/weather-types.json"

export default class WeatherType {
	constructor(type, fgImg, bgImg, flashFgImg = null, flashBgImg = null) {
		let defaultWeatherType = weatherTypes["defaultWeather"]
		let currentWeatherType = weatherTypes[type];
		currentWeatherType.fg = fgImg;
		currentWeatherType.bg = bgImg;
		if (flashFgImg != null)
			currentWeatherType.flashFg = flashFgImg;
		if (flashBgImg != null)
			currentWeatherType.flashBg = flashBgImg;

		this._data = Object.assign({}, defaultWeatherType, currentWeatherType);
	}

	get data() {
		return this._data;
	}
}