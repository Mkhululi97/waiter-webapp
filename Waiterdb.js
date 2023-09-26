export default function dbFactoryFunc(db) {
  let waiter;
  let waiters;
  let waiterWorkingDays;
  let usernameTrimmed;
  let currentWaiter;
  let workdays;
  let weekdaysObj;
  let updateWorkingdays = false;
  const lettersOnlyRegex = /^[a-zA-Z]+$/;

  /* Sign new waiters up */
  async function setWaiter(username, employee_id, password) {
    usernameTrimmed = username.trim().toLowerCase();
    // ensure the string inputed is username that contains any numbers and spaces.
    if (lettersOnlyRegex.test(usernameTrimmed)) {
      let waitercheck = await db.oneOrNone(
        "select waiter_name from waiters where waiter_name = $1",
        [usernameTrimmed]
      );
      // if the waiter doesn't exists on the db then add the waiter to the db
      if (!waitercheck) {
        await db.none(
          "insert into waiters (waiter_name, employee_id, password) values ($1,$2,$3)",
          [usernameTrimmed, employee_id, password]
        );
      } else {
        updateWorkingdays = true;
      }
      // waiters = await db.manyOrNone("select * from waiters");
      waiter = usernameTrimmed;
      currentWaiter = usernameTrimmed;
      return waitercheck;
    }
  }

  /* Deal with the days a waiter would like to work */
  async function setDays(days) {
    let daysStr = days.toString();
    let waiterid = await db.oneOrNone(
      "select waiter_id from waiters where waiter_name=$1",
      [currentWaiter]
    );
    /* Get new waiters to add days they will be working, if it's a existing waiter, update their schedule. */
    if (updateWorkingdays) {
      await db.none("update workingdays set workdays=$1 where waiterid=$2", [
        daysStr,
        waiterid["waiter_id"],
      ]);
      updateWorkingdays = false;
    } else {
      await db.none(
        "insert into workingdays (workdays, waiterid) values ($1, $2)",
        [daysStr, waiterid["waiter_id"]]
      );
    }

    return await db.manyOrNone("select workdays from workingdays");
  }

  /* Count how many times each weekday, has been selected */
  async function setSchedule() {
    workdays = await db.manyOrNone("select workdays from workingdays");
    /* +++++++++++++++++++++++++++++++++++++++++++++ */
    /* use this logic to get which days are fully book and
     which are under booked and which are over booked */
    weekdaysObj = {};
    workdays.forEach((weekdaysStr) => {
      let weekdaysArr = weekdaysStr.workdays.split(",");
      weekdaysArr.forEach((day) => {
        if (weekdaysObj[day] === undefined) {
          weekdaysObj[day] = 1;
        } else {
          weekdaysObj[day]++;
        }
      });
    });
    /* +++++++++++++++++++++++++++++++++++++++++++++ */
  }

  /* ------------------------- FUNCTION TO DISPLAY WAITER NAME AND HIS/HER WORKING DAYS ------------------------- */
  let waitersMap = {};
  async function setWorkingDaysForAWaiter() {
    waiters = await db.manyOrNone("select * from waiters");
    for (const waiterobj of waiters) {
      // use waiters array to find the days a set waiter will be working.
      waiterWorkingDays = await db.manyOrNone(
        "select workdays from workingdays where waiterid=$1",
        waiterobj["waiter_id"]
      );
      waitersMap[waiterobj["waiter_name"]] = waiterWorkingDays[0]["workdays"]; // { mdu:'Monday, Tuesday, Sunday' }
    }
  }
  /* ------------------------- FUNCTION TO DISPLAY WAITER NAME AND HIS/HER WORKING DAYS ------------------------- */

  /* ------------------------- FUNCTIONS TO CALL ON ROUTES THAT DISPLAY INFORMATION ------------------------- */
  function getWeekdays() {
    return [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
  }
  /* Call the function on the admin route */
  function getSchedule() {
    return weekdaysObj;
  }
  /* Call the function on the waiters route */
  function getWaiter() {
    return waiter;
  }
  /* Call the function on the admin route */
  function getWaiters() {
    return waiters;
  }
  /* Call the function on the admin route */
  function getWorkingDaysForAWaiter() {
    return waitersMap;
  }
  /* ------------------------- FUNCTIONS TO CALL ON ROUTES THAT DISPLAY INFORMATION ------------------------- */

  return {
    setWaiter,
    getWaiter,
    getWaiters,
    setDays,
    setSchedule,
    getSchedule,
    getWeekdays,
    setWorkingDaysForAWaiter,
    getWorkingDaysForAWaiter,
  };
}
