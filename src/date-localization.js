export function dayIndexToString(dayIndex){
	let dayString;
  	switch(dayIndex) {
  	case 0:
	  	dayString = "Domingo";
	  	break;
  	case 1:
	  	dayString = "Lunes";
	  	break;
  	case 2:
	  	dayString = "Martes";
	  	break;
  	case 3:
	  	dayString = "Miércoles";
	  	break;
  	case 4:
	  	dayString = "Jueves";
	  	break;
  	case 5:
	  	dayString = "Viernes";
	  	break;
  	case 6:
	  	dayString = "Sábado";
	  	break;
  }
  return dayString;
}

export function monthIndexToString(monthIndex) {
	let monthString;
  	switch(monthIndex) {
	case 0:
		monthString = "Enero";
		break;
	case 1:
		monthString = "Febrero";
		break;
	case 2:
		monthString = "Marzo";
		break;
	case 3:
		monthString = "Abril";
		break;
	case 4:
		monthString = "Mayo";
		break;
	case 5:
		monthString = "Junio";
		break;
	case 6:
		monthString = "Julio";
		break;
	case 7:
		monthString = "Agosto";
		break;
	case 8:
		monthString = "Septiembre";
		break;
	case 9:
		monthString = "Octubre";
		break;
	case 10:
		monthString = "Noviembre";
		break;
	case 11:
		monthString = "Diciembre";
		break;
  }
  return monthString;
}