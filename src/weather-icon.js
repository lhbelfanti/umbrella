const weatherIcons = {
	//N/A
	0:")",
	//Thunderstorm
	200:"O", //thunderstorm with light rain
	201:"O", //thunderstorm with rain
	202:"O", //thunderstorm with heavy rain
	210:"O", //light thunderstorm
	211:"O", //thunderstorm
	212:"O", //heavy thunderstorm
	221:"O", //ragged thunderstorm
	230:"O", //thunderstorm with light drizzle
	231:"O", //thunderstorm with drizzle
	232:"O", //thunderstorm with heavy drizzle
	//Drizzle
	300:"Q", //light intensity drizzle
	301:"Q", //drizzle
	302:"Q", //heavy intensity drizzle
	310:"Q", //light intensity drizzle rain
	311:"Q", //drizzle rain
	312:"Q", //heavy intensity drizzle rain
	313:"Q", //shower rain and drizzle
	314:"Q", //heavy shower rain and drizzle
	321:"Q", //shower drizzle
	//Rain
	500:"R", //light rain
	501:"R", //moderate rain
	502:"R", //heavy intensity rain
	503:"R", //very heavy rain
	504:"R", //extreme rain
	511:"R", //freezing rain
	520:"R", //light intensity shower rain
	521:"R", //shower rain
	522:"R", //heavy intensity shower rain
	531:"R", //ragged shower rain
	960:"T", //storm
	//Snow
	600:"W", //light snow
	601:"W", //snow
	602:"W", //heavy snow
	611:"W", //sleet
	612:"W", //shower sleet
	615:"W", //light rain and snow
	616:"W", //rain and snow
	620:"W", //light shower snow
	621:"W", //shower snow
	622:"W", //heavy shower snow
	//Atmosphere
	700:"F", //mist
	711:"F", //smoke
	721:"F", //haze
	731:"F", //sand, dust whirls
	741:"F", //fog
	751:"F", //sand
	761:"F", //dust
	762:"F", //volcanic ash
	771:"F", //squalls
	781:"F", //tornado
	905:"F", //windy
	//Clear
	800:"B", //	clear sky
	//Clouds
	801:"H", //few clouds
	802:"N", //scattered clouds
	803:"Y", //broken clouds
	804:"Y" //overcast clouds
}

export default function getIcon(weatherId){
  let iconsObj = Object.assign({}, weatherIcons);
  let icon = ")";
  for (let [k, v] of Object.entries(iconsObj)) {
      if(k == weatherId) {
      	 icon = v;
      }
  }
  return icon;
}
