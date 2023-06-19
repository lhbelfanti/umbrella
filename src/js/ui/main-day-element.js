export const MAIN_DAY_ID = "main-day";
export const TEMP_MODIFIER = "--temp";
export const DATE_MODIFIER = "--date";

export default class MainDayElement {
	constructor() {
		this._mainDay = document.getElementById(MAIN_DAY_ID);
		this._temp = document.getElementById(MAIN_DAY_ID + TEMP_MODIFIER);
		this._date = document.getElementById(MAIN_DAY_ID + DATE_MODIFIER);
	}

	// The main day that appears in the middle of the screen.
	get mainDay() {
		return this._mainDay;
	}

	get temp() {
		return this._temp;
	}

	get date() {
		return this._date;
	}
}