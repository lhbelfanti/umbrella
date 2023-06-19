import dateConfig from "../configs/date-data.json"

export function formatDate(weekDay, dayNum, month, year, stringToFormat) {
  // First, checks if it isn't implemented yet.
  if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
          ;
      });
    };
  }
  return stringToFormat.format(weekDay, dayNum, month, year);
}

export function processDateInformation(milliseconds, language = "es") {
  let dateObjectDefault = {date: "", minDate: ""};
  let dateObject = Object.assign({}, dateObjectDefault);
  let dateObj = new Date(milliseconds * 1000);
  let dayNumber = dateObj.getDate();
  let monthNumber = dateObj.getMonth();

  let dateCfg = dateConfig[language];
  dateObject.date = formatDate(dateCfg.days[dateObj.getDay()], dayNumber, dateCfg.months[monthNumber], dateObj.getFullYear(), dateCfg.dateFormat);
  let dayString = (dayNumber < 10 ? "0" : "") + dateObj.getDate();
  let monthString = ((monthNumber + 1) < 10 ? "0" : "") + (monthNumber + 1);

  dateObject.minDate = dateCfg.minifiedDateFormat.format(dayString, monthString);
  return dateObject;
}

