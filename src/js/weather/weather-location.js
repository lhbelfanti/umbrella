export default class WeatherLocation {
	constructor(weatherAPI, onLocationChange, persistence) {
		this._locations = weatherAPI.locations;
		this._locationChangedCallback = onLocationChange;
		this._persistence = persistence;
		this._dropdownLocations = this.getDropdownLocationsList(this._locations)
		this._selectedLocation = this._persistence.location;
		this._todayData = {};
		this._fiveDaysData = {}
		this._weatherByLocation = {};
	}

	getDropdownLocationsList(locations) {
		let list = [];
		for (let loc in locations) {
			list.push(loc);
		}

		return list;
	}

	saveWeather() {
		let locationCode = this.getSelectedLocationCode();
		this._weatherByLocation[locationCode] = {};
		this._weatherByLocation[locationCode]["today"] = this._todayData;
		this._weatherByLocation[locationCode]["fiveDays"] = this._fiveDaysData;
	}

	dataAlreadyExists(location) {
		return this._weatherByLocation.hasOwnProperty(location);
	}

	getTodayDataByLocation(location) {
		return this._weatherByLocation[location]["today"];
	}

	getFiveDaysDataByLocation(location) {
		return this._weatherByLocation[location]["fiveDays"];
	}

	getSelectedLocationCode() {
		return this._locations[this.selectedLocation];
	}

	get dropdownLocations() {
		return this._dropdownLocations;
	}

	get selectedLocation() {
		return this._selectedLocation;
	}

	set selectedLocation(city) {
		this._selectedLocation = city;
		this._persistence.location = city;
		this._locationChangedCallback();
	}

	set todayData(data) {
		this._todayData = data;
	}

	set fiveDaysData(data) {
		this._fiveDaysData = data;
	}
}