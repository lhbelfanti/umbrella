import weatherJson from '../configs/weather-visual-info.json'
import { processDateInformation } from "../localization/date-localization";
import TemperatureScale from "./temperature-scale";
import Translatable from "../localization/translatable";

export default class DayForecast extends Translatable {
	constructor(weatherData, languages, id = "") {
		super();
		this._weatherData = weatherData;
		this._languages = languages;
		this.localizeDate();
		const weatherInfo = this.weatherDataById(this._weatherData.weather[0].id)
		this._icon = weatherInfo.icon;
		this._type = weatherInfo.type;
		this._dt = this._weatherData.dt;
		this._humidity = this._weatherData.main.humidity;
		this._max = Math.round(this._weatherData.main.temp_max);
		this._min = Math.round(this._weatherData.main.temp_min);
		this._pressure = this._weatherData.main.pressure;
		this._temp = this._weatherData.main.temp;
		this._weather = this._weatherData.weather[0].main;
		this._windSpeed = this._weatherData.wind.speed;

		this._languages.subscribeElement(this, id !== "" ? id + this._date : this._date);
	}

	translate() {
		super.translate();
		this.localizeDate();
	}

	localizeDate() {
		const dateInfo = processDateInformation(this._weatherData.dt, this._languages.selectedLanguageCode)
		this._date = dateInfo.date;
		this._minDate = dateInfo.minDate;
	}

	weatherDataById(weatherId) {
		const defaultWeatherInfo = {icon: ")", desc: "N/A", type: "rain"};
		let weatherInfo = Object.assign({}, defaultWeatherInfo);
		let info = weatherJson[weatherId];
		weatherInfo.icon = info.icon;
		weatherInfo.desc = info.desc;
		weatherInfo.type = info.type === "snow" ? "clouds" : info.type;
		return weatherInfo;
	}

	processTemperatureScale() {
		this._max = TemperatureScale.processTemperatureScale(this._weatherData.main.temp_max);
		this._min = TemperatureScale.processTemperatureScale(this._weatherData.main.temp_min);
		this._temp = TemperatureScale.processTemperatureScale(this._weatherData.main.temp);
	}

	get date () {
		return this._date;
	}

	get minDate () {
		return this._minDate;
	}

	get icon () {
		return this._icon;
	}

	get type () {
		return this._type;
	}

	get dt () {
		return this._dt;
	}

	get humidity() {
		return this._humidity;
	}

	get max () {
		return this._max;
	}

	get min () {
		return this._min;
	}

	get pressure() {
		return this._pressure;
	}

	get temp() {
		return this._temp;
	}

	get weather() {
		return this._weather;
	}

	get windSpeed() {
		return this._windSpeed;
	}

}

