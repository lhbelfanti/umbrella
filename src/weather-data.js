import json from './weather.json'

let weatherJson = json;

const defaultWeatherInfo = {icon:")", desc:"N/A", type:"clear"};

export default function weatherDataById(weatherId){
  let weatherInfo = Object.assign({}, defaultWeatherInfo);
  for (let [k, v] of Object.entries(weatherJson)) {
      if(k == weatherId) {
      	weatherInfo.icon = v.icon;
      	weatherInfo.desc = v.desc;
      	 //REMOVE HARDCODE
      	if(v.type == "snow")
      	  weatherInfo.type = "clouds";
      	else
      	  weatherInfo.type = v.type;
      }
  }
  return weatherInfo;
}
