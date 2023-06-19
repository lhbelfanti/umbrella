import DayForecast from "./day-forecast";
import WeekForecast from "./week-forecast";
import weatherAPI from "../configs/weather-api"
import WeatherLocation from "./weather-location";

export default class WeatherInfo {

  constructor(weatherLoadedCallback, languages, persistence) {
    this._apiUrl = weatherAPI.appUrl;
    this._appId = weatherAPI.appId;
    this._weatherLocation = new WeatherLocation(weatherAPI, this.init.bind(this), persistence);
    this._units = "metric";
    this._loaded = false;
    this._currentWeatherData = null;
    this._loadCount = 0;
    this._weatherLoadedCallback = weatherLoadedCallback;
    this._languages = languages;
    this.init();
  }

  init(fromRefresh = false) {
    this._weekForecast = new WeekForecast(this._languages);
    this._cityId = this._weatherLocation.getSelectedLocationCode();

    if (!fromRefresh && this._weatherLocation.dataAlreadyExists(this._cityId)) {
      this.processTodayForecastResult(this._weatherLocation.getTodayDataByLocation(this._cityId));
      this.processFiveDaysForecastResult(this._weatherLocation.getFiveDaysDataByLocation(this._cityId));
    }
    else {
      this.requestWeatherForecast("weather", this.processTodayForecastResult.bind(this));
      this.requestWeatherForecast("forecast", this.processFiveDaysForecastResult.bind(this));
    }
  }

  // Call to the weather forecast API
  requestWeatherForecast(type, callback) {
    let requestString = this._apiUrl + type + "?id=" + this._cityId + "&units=" + this._units + "&appid=" + this._appId;
    fetch(requestString)
      .then(function (response) {
        if (response.status !== 200) {
          console.error('Looks like there was a problem. Status Code: ' + response.status);
          return;
        }
        response.json().then(function (data) {
          callback(data);
        });
      });
  }

  processTodayForecastResult(weatherData) {
    this._weekForecast.country = weatherData.sys.country;
    this._weekForecast.city = weatherData.name;
    this._weekForecast.today = new DayForecast(weatherData, this._languages, "Today - ");
    this._loaded = true;
    this._weatherLocation.todayData = weatherData;
    this.incrementCountAndExecuteCallback()
  }

  processFiveDaysForecastResult(weatherData) {
    let forecast = [];
    if (weatherData.list.length > 0) {
      for (let i = 0; i < weatherData.list.length; i++) {
        forecast.push(new DayForecast(weatherData.list[i], this._languages));
      }
      this.divideForecastByDay(forecast);
      this._weekForecast.minifyWeekForecast();
    }
    this._weatherLocation.fiveDaysData = weatherData;
    this.incrementCountAndExecuteCallback()
  }

  incrementCountAndExecuteCallback() {
    this._loadCount += 1;
    if (this._loadCount === 2) {
      this._weatherLocation.saveWeather();
      this._weatherLoadedCallback();
      this._loadCount = 0;
    }
  }

  divideForecastByDay(forecast) {
    let currentDay = forecast[0].date;
    let newDay;
    let dayArray = [];

    for (let i = 0; i < forecast.length; i++) {
      newDay = forecast[i].date;
      if (currentDay === newDay) {
        dayArray.push(forecast[i]);
      } else {
        this.addToWeekArray(dayArray);
        currentDay = newDay;
        dayArray = [];
        dayArray.push(forecast[i]);
      }
    }
    // Add the last day to the week array.
    this.addToWeekArray(dayArray);
  }

  addToWeekArray(dayArray) {
    if (dayArray.length > 0)
      this._weekForecast.week.push(dayArray);
  }

  get weekForecast() {
    return this._weekForecast;
  }

  get weatherInfoLoaded() {
    return this._loaded;
  }

  set currentWeatherData(currentWeather) {
    this._currentWeatherData = currentWeather;
  }

  get currentWeatherData() {
    return this._currentWeatherData;
  }

  get weatherLocation() {
    return this._weatherLocation;
  }
}