export default class Persistence {
	constructor() {
		this._temperatureScale = localStorage.getItem("temperatureScale") || "celsius";
		this._language = localStorage.getItem("language") || "es";
		this._location = localStorage.getItem("location") || "Buenos Aires, Argentina";
	}

	save() {
		localStorage.setItem("temperatureScale", this._temperatureScale);
		localStorage.setItem("language", this._language);
		localStorage.setItem("location", this._location);
	}

	set temperatureScale(value) {
		this._temperatureScale = value;
		this.save();
	}

	get temperatureScale() {
		return this._temperatureScale;
	}

	set language(value) {
		this._language = value;
		this.save();
	}

	get language() {
		return this._language;
	}

	set location(value) {
		this._location = value;
		this.save();
	}

	get location() {
		return this._location;
	}
}