const defaultJson = {
	country:"",
	city:"",
	today:{},
	week:[]
}

function WeatherInfo(city, units) {
	this.apiUrl = "http://api.openweathermap.org/data/2.5/";
	this.appId = "fe7d49304405d3ad0ccae68b822ca831";
	this.city = city;
	this.units = units; //metric: Celsius, imperial: Fahrenheit
	this.jsonData = Object.assign({}, defaultJson);
	this.init();
}

WeatherInfo.prototype = {
	init(){
		this.getWeatherForecast("weather", this.proccessTodayForecastResult.bind(this));//Load today forecast
		this.getWeatherForecast("forecast", this.proccessFiveDaysForecastResult.bind(this)); //Load five days forecast
	},
	getWeatherForecast(type, callback) {
	    let requestString = this.apiUrl + type + "?q=" + this.city + "&units=" + this.units + "&appid=" + this.appId;
	    fetch(requestString)
	    	.then(function(response) {  
	  			if (response.status !== 200) {  
	   				console.log('Looks like there was a problem. Status Code: ' + response.status);  
	    			return;  
				}
				response.json().then(function(data) {  
					callback(data);  
				});  
	    	});
	},
	proccessTodayForecastResult(weatherData) {
		this.jsonData.country = Object.assign(this.jsonData.country, weatherData.sys.country);
    	this.jsonData.city = Object.assign(this.jsonData.city, weatherData.name);
		this.jsonData.today = Object.assign(this.jsonData.today, this.weatherInfoToJsonData(weatherData));
	},
	proccessFiveDaysForecastResult(weatherData) {	
		let forecast = [];
		if (weatherData.list.length > 0) {
			for (let i = 0; i < weatherData.list.length; i++) {
		    	forecast.push(this.weatherInfoToJsonData(weatherData.list[i]));
		    }
		    this.divideForecastByDay(forecast);
		}
	},
	divideForecastByDay(forecast) {
		let actualDay = new Date(forecast[0].dt * 1000).getDate();
		let newDay;
		let dayArray = [];
		for (let i = 0; i < forecast.length; i++) {
			newDay = new Date(forecast[i].dt * 1000).getDate();

			if(actualDay == newDay) {
				dayArray.push(forecast[i]);
			}
			else {
				this.jsonData.week.push(dayArray);
				actualDay = newDay;
				dayArray = [];
				dayArray.push(forecast[i]);
			}

			if(i == forecast.length-1) {
				this.jsonData.week.push(dayArray);
			}
		}
	},
	weatherInfoToJsonData(weatherItem) {
		let weatherJson = {
	        weather: weatherItem.weather[0].main,
	        temperature: weatherItem.main.temp,
	        min: weatherItem.main.temp_min,
	        max: weatherItem.main.temp_max,
	        humidity: weatherItem.main.humidity,
	        pressure: weatherItem.main.pressure,
	        windSpeed: weatherItem.wind.speed,
	        dt: weatherItem.dt
		}
		return weatherJson;
	}
}

export default WeatherInfo;