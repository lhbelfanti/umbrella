import TemperatureScale, {CELSIUS} from "./temperature-scale";
import Translatable from "../localization/translatable";
import {processDateInformation} from "../localization/date-localization";

export default class MinifiedDay extends Translatable{
	constructor(day, languages) {
		super();
		this._languages = languages;
		this._min = 200;
		this._max = -200;
		this._temp = 0;
		this._date = "";
		this._minDate = "";
		this._icon = "";
		this._type = "";
		this._currentTemperatureScale = CELSIUS;
		this._day = day;
		this.processData(day);

		this._languages.subscribeElement(this, "MinifiedDay - " + this._date);
	}

	translate() {
		super.translate();
		const dateInfo = processDateInformation(this._day[0].dt, this._languages.selectedLanguageCode)
		this._date = dateInfo.date;
		this._minDate = dateInfo.minDate;
	}

	processData(day) {
		let threeHoursData, dayTemp = 0;
		for (let i = 0; i < day.length; i++) {
			threeHoursData = day[i];
			let threeHoursMin = TemperatureScale.processTemperatureScale(threeHoursData.min);
			let threeHoursMax = TemperatureScale.processTemperatureScale(threeHoursData.max);

			if (threeHoursMin < this._min)
				this._min = threeHoursMin;

			if (threeHoursMax > this._max) {
				this._max = threeHoursMax;
				this._icon = threeHoursData.icon;
				this._type = threeHoursData.type;
			}

			this._date = this._date === "" ? threeHoursData.date : this._date;
			this._minDate = this._minDate === "" ? threeHoursData.minDate : this._minDate;

			dayTemp += Math.round((threeHoursMin + threeHoursMax) / 2);
		}
		this._temp = Math.round(dayTemp / day.length);
	}

	processTemperatureScale() {
		let temperatureScale = TemperatureScale.getTemperatureScale();
		if (this._currentTemperatureScale !== temperatureScale) {
			this._min = 200;
			this._max = -200;
			this._temp = 0;
			this.processData(this._day)
			this._currentTemperatureScale = temperatureScale;
		}
	}

	get min() {
		return this._min;
	}

	get max() {
		return this._max;
	}

	get temp() {
		return this._temp;
	}

	get date() {
		return this._date;
	}

	get minDate() {
		return this._minDate;
	}

	get icon() {
		return this._icon;
	}

	get type() {
		return this._type;
	}
}