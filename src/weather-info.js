import {dayIndexToString, monthIndexToString} from "./date-localization";
import getIcon from "./weather-icon";

const defaultJson = {
	country:"",
	city:"",
	today:{},
	week:[],
	minWeekData:[]
}

const minifiedWeek = {
	min:100,
	max:0,
	temp:0,
	date:"",
	minDate:"",
	icon:""
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
		this.jsonData.country = weatherData.sys.country;
    this.jsonData.city = weatherData.name;
		this.jsonData.today = Object.assign(this.jsonData.today, this.weatherInfoToJsonData(weatherData));
	},
	proccessFiveDaysForecastResult(weatherData) {	
		let forecast = [];
		if (weatherData.list.length > 0) {
			for (let i = 0; i < weatherData.list.length; i++) {
		    	forecast.push(this.weatherInfoToJsonData(weatherData.list[i]));
		    }
		    this.divideForecastByDay(forecast);
		    this.minifyWeekForecast();
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
		let dateObject = this.setDateInformation(weatherItem.dt);
		let weatherJson = {
	        weather: weatherItem.weather[0].main,
	        temp: weatherItem.main.temp,
	        min: weatherItem.main.temp_min,
	        max: weatherItem.main.temp_max,
	        humidity: weatherItem.main.humidity,
	        pressure: weatherItem.main.pressure,
	        windSpeed: weatherItem.wind.speed,
	        dt: weatherItem.dt,
	        date: dateObject.date,
	        minDate: dateObject.minDate,
	        icon: getIcon(weatherItem.weather[0].id)
		}
		return weatherJson;
	},
	getJsonData() {
		return this.jsonData;
	},
	minifyWeekForecast() {
		let weekArray = this.jsonData.week;
		let day, data, threeHoursData, dayTemp = 0, dateObject, iconName = 0;

		for(let j = 0; j < weekArray.length; j++) {
			day = weekArray[j];
			data = Object.assign({}, minifiedWeek);


			for (let i = 0; i < day.length; i++) {
				threeHoursData = day[i];

				if(threeHoursData.min < data.min) {
					data.min = Math.round(threeHoursData.min); //Save data.min
				}
				if(threeHoursData.max > data.max) {
					data.max = Math.round(threeHoursData.max); //Save data.max
				}
				if(i == 4) { //Midday
					iconName = threeHoursData.icon;
				}

				dayTemp += Math.round((threeHoursData.min + threeHoursData.max) / 2);
			}
			
			data.temp = Math.round((dayTemp / day.length)); //Save data.temp
			data.date = threeHoursData.date; //Save data.date
			data.minDate = threeHoursData.minDate; //Save data.minDate
			data.icon = iconName; //Save data.icon

			this.jsonData.minWeekData.push(data);
			dayTemp = 0;
		}
	},
	setDateInformation(milliseconds) {
		let dateObjectDefault = {date: "", minDate: ""};
		let dateObject = Object.assign({}, dateObjectDefault);
		let dateObj = new Date(milliseconds * 1000);
		let dayNumber = dateObj.getDate();
		let monthNumber = dateObj.getMonth();

		let dateString = dayIndexToString(dateObj.getDay()) + ", " + dayNumber + " de " + 
							monthIndexToString(monthNumber) + " de " + dateObj.getFullYear();
		dateObject.date = dateString;
		let addZeroToDay = dayNumber < 10;
		let addZeroToMonth = (monthNumber + 1) < 10;
		dateObject.minDate = (addZeroToDay ? "0" : "") + dateObj.getDate() + "/" + (addZeroToMonth ? "0" : "") + (monthNumber + 1);
		return dateObject;
	}
}

export default WeatherInfo;