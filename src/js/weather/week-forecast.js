import MinifiedDay from "./minified-day";

export default class WeekForecast {
	constructor(languages) {
		this._languages = languages;
		this._country = "";
		this._city = "";
		this._week = [];
		this._minifiedWeek = [];
		this._today = {};
	}

	minifyWeekForecast() {
		let day;
		for (let j = 0; j < this._week.length; j++) {
			day = new MinifiedDay(this._week[j], this._languages);
			this._minifiedWeek.push(day);
		}
	}

	processTemperatureScale() {
		for (let j = 0; j < this._minifiedWeek.length; j++) {
			this._minifiedWeek[j].processTemperatureScale();
		}
		this._today.processTemperatureScale();
	}

	get today() {
		return this._today;
	}

	set today(todayForecast) {
		this._today = todayForecast;
	}

	set country(country) {
		this._country = country;
	}

	set city(city) {
		this._city = city;
	}

	get week() {
		return this._week;
	}

	get minifiedWeek() {
		return this._minifiedWeek;
	}
}