import TemperatureScale, { CELSIUS, FAHRENHEIT } from "../weather/temperature-scale";

const CURRENT_METRIC_SYSTEM = "ui_button--selected";
const DROPDOWN_BUTTON_SELECTED = "dropdown-button--selected";
const DROPDOWN_LOCATION_BUTTON = "dropdown-location-button";

export default class UIButtons {
	constructor(weatherInfo, updateWeather, languages, locations) {
		this._weatherInfo = weatherInfo;
		this.gatherElements()
		this._updateWeatherCallback = updateWeather;
		this._languages = languages;
		this._locations = locations;
		this._languagesButtons = [];
		this._locationsButtons = [];
		this.setupButtonsCallbacks();
		this.setupLanguagesDropdown();
		this.setupLocationDropdown();
	}

	gatherElements() {
		this._refreshButton = document.getElementById("refresh");
		this._celsiusButton = document.getElementById("celsius");
		this._fahrenheitButton = document.getElementById("fahrenheit");
		this._languagesDropdown = document.getElementById("languages");
		this._locationsDropdown = document.getElementById("locations");
	}

	setupButtonsCallbacks() {
		this._refreshButton.onclick = () => {
			this._weatherInfo.init(true);
		}

		this._celsiusButton.onclick = () => {
			this._fahrenheitButton.classList.remove(CURRENT_METRIC_SYSTEM);
			this._celsiusButton.classList.add(CURRENT_METRIC_SYSTEM);
			TemperatureScale.setTemperatureScale(CELSIUS);
			this._updateWeatherCallback();
		}

		this._fahrenheitButton.onclick = () => {
			this._celsiusButton.classList.remove(CURRENT_METRIC_SYSTEM);
			this._fahrenheitButton.classList.add(CURRENT_METRIC_SYSTEM);
			TemperatureScale.setTemperatureScale(FAHRENHEIT);
			this._updateWeatherCallback();
		}
	}

	setupLanguagesDropdown() {
		let availableLanguages = this._languages.dropdownLanguages;
		let defaultLanguage = this._languages.selectedLanguage;
		availableLanguages.forEach( lang => {
			let dropdownButton = this.createDropdownButton(lang, defaultLanguage);
			this._languagesButtons.push(dropdownButton);
			dropdownButton.onclick = () => {
				this._languagesButtons.forEach( button => {
					button.classList.remove(DROPDOWN_BUTTON_SELECTED);
				});
				dropdownButton.classList.add(DROPDOWN_BUTTON_SELECTED);
				this._languages.selectedLanguage = lang;
				this._languages.updateElements();
				this._updateWeatherCallback();
			}

			this._languagesDropdown.appendChild(dropdownButton);
		});
	}

	setupLocationDropdown() {
		let availableLocations = this._locations.dropdownLocations;
		let defaultLocation = this._locations.selectedLocation;
		availableLocations.forEach( loc => {
			let dropdownButton = this.createDropdownButton(loc, defaultLocation);
			dropdownButton.classList.add(DROPDOWN_LOCATION_BUTTON);
			this._locationsButtons.push(dropdownButton);
			dropdownButton.onclick = () => {
				this._locationsButtons.forEach( button => {
					button.classList.remove(DROPDOWN_BUTTON_SELECTED);
				});
				dropdownButton.classList.add(DROPDOWN_BUTTON_SELECTED);
				this._locations.selectedLocation = loc;
			}

			this._locationsDropdown.appendChild(dropdownButton);
		});
	}

	createDropdownButton(text, defaultValue) {
		let dropdownButton = document.createElement("button");
		let textNode = document.createTextNode(text);
		dropdownButton.appendChild(textNode);
		if (text === defaultValue)
			dropdownButton.classList.add(DROPDOWN_BUTTON_SELECTED);
		return dropdownButton;
	}
}