export const FORECAST_DAY_ID = "forecast-day-";
export const FORECAST_DAY_CURRENT = "forecast-day--current";
export const MIN_DATE_MODIFIER = "--min-date";
export const MAX_TEMP_MODIFIER = "--max-temp";
export const MIN_TEMP_MODIFIER = "--min-temp";

export default class ForecastDayButton {
	constructor(currentId = 0) {
		this._currentForecastDayId = null;
		this._currentForecastDay = null;
		this.defineCurrentForecastDayAndId(currentId);
		this._minDateSpan = document.getElementById(this._currentForecastDayId + MIN_DATE_MODIFIER);
		this._dataIcon = this._currentForecastDay.querySelector(".icon");
		this._maxTemp = document.getElementById(this._currentForecastDayId + MAX_TEMP_MODIFIER);
		this._minTemp = document.getElementById(this._currentForecastDayId + MIN_TEMP_MODIFIER);
	}

	defineCurrentForecastDayAndId(currentId) {
		if (currentId !== 0) {
			this._currentForecastDayId = FORECAST_DAY_ID + currentId;
			this._currentForecastDay = document.getElementById(this._currentForecastDayId);
		}
		else {
			this._currentForecastDay = document.querySelector("." + FORECAST_DAY_CURRENT);
			this._currentForecastDayId = this._currentForecastDay.getAttribute("id");
		}
	}

	getHashIndex() {
		return (this._currentForecastDayId.charAt(this._currentForecastDayId.length - 1)) - 1;
	}

	isFirstForecastDay() {
		return this._currentForecastDayId === FORECAST_DAY_ID + "1";
	}

	get button() {
		return this._currentForecastDay;
	}

	get minDateSpan() {
		return this._minDateSpan;
	}

	get dataIcon() {
		return this._dataIcon;
	}

	get maxTemp() {
		return this._maxTemp;
	}

	get minTemp() {
		return this._minTemp;
	}
}