import WeatherType from "../weather/weather-type";
import ForecastDayButton, { FORECAST_DAY_CURRENT } from "./forecast-day-button";
import MainDayElement from "./main-day-element";

export default class WeatherInfoUI {
	constructor(weatherInfo, textures, updateWeather) {
		this._weatherInfo = weatherInfo;
		this._textures = textures;
		this._weatherData = null;
		this._updateWeatherCallback = updateWeather;
	}

	weather(data, defaultWeather) {
		return Object.assign({}, defaultWeather, data);
	}

	setupWeatherData() {
		this._weatherData = {
			rain: new WeatherType("rain", this._textures.textureRainFg, this._textures.textureRainBg).data,
			thunderstorm: new WeatherType("thunderstorm", this._textures.textureRainFg, this._textures.textureRainBg,
				this._textures.textureStormLightningFg, this._textures.textureStormLightningBg).data,
			//fallout: new WeatherType("fallout", this._textures.textureFalloutFg, this._textures.textureFalloutBg).data,
			drizzle: new WeatherType("drizzle", this._textures.textureDrizzleFg, this._textures.textureDrizzleBg).data,
			clouds: new WeatherType("clouds", this._textures.textureCloudsFg, this._textures.textureCloudsBg).data,
			clear: new WeatherType("clear", this._textures.textureSunFg, this._textures.textureSunBg).data
		};

		this.loadMinDateInfo();
	}

	loadMinDateInfo() {
		if (this._weatherInfo.weekForecast.today?.temp === undefined) {
			window.setTimeout(() => { this.loadMinDateInfo(); }, 2000);
		} else {
			let dayData, dayIndex;
			this._weatherInfo.weekForecast.processTemperatureScale();
			for (let i = 0; i < 5; i++) {
				let forecastDayButton = new ForecastDayButton(i + 1);
				if (forecastDayButton.isFirstForecastDay()) {
					dayData = this._weatherInfo.weekForecast.today;
				} else {
					dayIndex = i;
					//Sometimes the API return 5 days instead of 6
					if (this._weatherInfo.weekForecast.minifiedWeek.length === 5) {
						dayIndex--;
					}
					dayData = this._weatherInfo.weekForecast.minifiedWeek[dayIndex];
				}

				forecastDayButton.minDateSpan.innerHTML = dayData.minDate;
				forecastDayButton.dataIcon.setAttribute("data-icon", dayData.icon);
				forecastDayButton.maxTemp.innerHTML = dayData.max + "°";
				forecastDayButton.minTemp.innerHTML = dayData.min + "°";
				this.defineForecastDayButtonCallback(forecastDayButton.button);
			}
		}
	}

	defineForecastDayButtonCallback(forecastDayButton) {
		forecastDayButton.onclick = () => {
			let prevForecastDayButton = document.querySelector("." + FORECAST_DAY_CURRENT);
			if (prevForecastDayButton != null) {
				prevForecastDayButton.classList.remove(FORECAST_DAY_CURRENT);
				forecastDayButton.classList.add(FORECAST_DAY_CURRENT);
				this._updateWeatherCallback();
			}
		}
	}

	loadWeatherInfo() {
		if (this._weatherInfo.weekForecast.today?.temp === undefined) {
			window.setTimeout(() => { this.loadWeatherInfo(); }, 2000);
		} else {
			let mainDayElement = new MainDayElement();
			let forecastDayButton = new ForecastDayButton();

			let dayData;
			this._weatherInfo.weekForecast.processTemperatureScale();
			if (forecastDayButton.isFirstForecastDay()) {
				dayData = this._weatherInfo.weekForecast.today;
			} else {
				let dayIndex = forecastDayButton.getHashIndex();
				//Sometimes the API return 5 days instead of 6
				if (this._weatherInfo.weekForecast.minifiedWeek.length === 5) {
					dayIndex--;
				}
				dayData = this._weatherInfo.weekForecast.minifiedWeek[dayIndex];
			}

			this.startTransitionAnim(mainDayElement);
			mainDayElement.temp.innerHTML = Math.round(dayData.temp).toString();
			mainDayElement.date.innerHTML = dayData.date;
			mainDayElement.mainDay.setAttribute("data-weather", dayData.type);
			this._weatherInfo.currentWeatherData = this._weatherData[dayData.type];
		}
	}

	startTransitionAnim(mainDayElement) {
		mainDayElement.mainDay.classList.add('pre-animation');
		setTimeout(() => {
			mainDayElement.mainDay.classList.remove('pre-animation')
		},300);
	}

	get weatherData() {
		return this._weatherData;
	}
}