export const CELSIUS = "celsius";
export const FAHRENHEIT = "fahrenheit";

export default class TemperatureScale {

	static init(persistence) {
		this._persistence = persistence;
		TemperatureScale.setTemperatureScale(this._persistence.temperatureScale);
	}

	static setTemperatureScale(metricSystem) {
		this._temperatureScale = metricSystem;
		this._persistence.temperatureScale = metricSystem;
	}

	static getTemperatureScale() {
		return this._temperatureScale;
	}

	static processTemperatureScale(temperature) {
		let currentTempScale = TemperatureScale.getTemperatureScale();
		let newTemperature = 0;
		switch (currentTempScale) {
			case CELSIUS:
				newTemperature = Math.round(temperature);
				break;
			case FAHRENHEIT:
				newTemperature = Math.round((temperature * 1.8) + 32);
				break;
		}

		return newTemperature;
	}
}