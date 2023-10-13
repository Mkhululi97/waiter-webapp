export default function helperFunctions() {
  function keepdaysChecked(waiterdays, dayoftheweek) {
    waiterdays.forEach((day) => {
      if (day.weekdays === dayoftheweek) {
        console.log(day.weekdays);
        return day.weekdays;
      }
    });
  }

  return {
    keepdaysChecked,
  };
}
