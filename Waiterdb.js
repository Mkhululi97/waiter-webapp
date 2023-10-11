export default function dbFactoryFunc(db) {
  let waiters;
  let usernameTrimmed;
  let adminUser;
  let waiterid;
  let waiteridexist;
  let weekdaysArr;
  let weekdaysObj = {};
  let isAdmin = false;
  let counterMap = {};
  const lettersOnlyRegex = /^[a-zA-Z]+$/;

  /* Sign new waiters up */
  async function setWaiter(username, password) {
    usernameTrimmed = username.trim().toLowerCase();
    // ensure the string inputed is username that does not contain any numbers and spaces.
    if (lettersOnlyRegex.test(usernameTrimmed)) {
      let waitercheck = await db.oneOrNone(
        "select waiter_name from waiters where waiter_name = $1",
        [usernameTrimmed]
      );
      // if the waiter doesn't exists on the db then add the waiter to the db
      if (!waitercheck) {
        await db.none(
          "insert into waiters (waiter_name,password) values ($1,$2)",
          [usernameTrimmed, password]
        );
      }
      return await db.manyOrNone("select * from waiters");
    }
  }
  /* Take user to the admins page, only if they exist on the admins table */
  async function adminLogin(username, password) {
    isAdmin = false;
    adminUser = username.trim().toLowerCase();
    // ensure the string inputed is username that does not contain any numbers and spaces.
    if (lettersOnlyRegex.test(adminUser)) {
      let query = await db.manyOrNone(
        "select * from admin where admin_name=$1 and password=$2",
        [adminUser, password]
      );
      // if the query returns an object, then current user is an admin on our database.
      if (query[0]) {
        isAdmin = true;
      }
    }
    return isAdmin;
  }

  /* Deal with the days a waiter would like to work */
  async function setDays(days, waiterParams) {
    // check if the current waiter exists on the waiters table.
    let checkwaiter = await db.oneOrNone(
      "select waiter_id from waiters where waiter_name=$1",
      [waiterParams.toLowerCase()]
    );

    if (checkwaiter !== null) {
      // if they do, check for their id on the workingdays table.
      waiteridexist = await db.manyOrNone(
        "select weekdayid from workingdays where waiterid=$1",
        [checkwaiter["waiter_id"]]
      );
      waiterid = checkwaiter["waiter_id"];
    }
    // if their id is not on the workingdays table, then add their selected days.
    let dayid;
    //only work this code with users that exist in the waiters table.
    if (waiteridexist !== undefined) {
      // when user hasn't selected their days
      if (waiteridexist.length < 1) {
        for (const day of days) {
          dayid = await db.oneOrNone(
            "select id from daysoftheweek where weekdays=$1",
            [day]
          );
          await db.none(
            "insert into workingdays (weekdayid, waiterid) values ($1,$2)",
            [dayid["id"], waiterid]
          );
        }
      }
      // when user has selected their days
      if (waiteridexist.length > 0) {
        // delete previous days for the current waiter.
        db.none("delete from workingdays where waiterid=$1", [waiterid]);
        for (const day of days) {
          dayid = await db.oneOrNone(
            "select id from daysoftheweek where weekdays=$1",
            [day]
          );
          // insert the update of the newld dy selecteays for the current waiter.
          await db.none(
            "insert into workingdays (weekdayid, waiterid) values ($1,$2)",
            [dayid["id"], waiterid]
          );
        }
      }
    } else {
      // only work this code with users that don't exist in the waiters table.
      // if the current waiters doesn't exist on the waiters table,
      // throw an error ("not waiter not registered");
    }
    return await db.manyOrNone(
      "select weekdayid from workingdays where waiterid=$1",
      [waiterid]
    );
  }
  async function getWeeklydays() {
    return await db.manyOrNone("select * from daysoftheweek");
  }
  async function waitersDay(waiterParams) {
    // toLowerCase() format name/ validate.
    // look at inner joins from basic express app.
    // get actual
  }

  function keepWaiterDaysChecked() {
    // send data to the frontend.
  }
  /* Counts how many times each weekday, has been selected */
  async function setSchedule() {
    weekdaysObj = {};
    let scheduleday;
    let schedulewaiter;
    weekdaysArr = await db.manyOrNone("select weekdays from daysoftheweek");
    // get data with two columns one with weekdays and the second with
    // list of waiter names
    let fullSchedule = await db.manyOrNone(
      `select dof.weekdays, w.waiter_name
      from workingdays as wdays 
      inner join daysoftheweek as dof on dof.id = wdays.weekdayid 
      inner join waiters as w on w.waiter_id= wdays.waiterid
      `
    );
    fullSchedule.forEach((scheduleObject) => {
      scheduleday = scheduleObject["weekdays"];
      schedulewaiter = scheduleObject["waiter_name"];
      if (weekdaysObj[scheduleday] === undefined) {
        weekdaysObj[scheduleday] = [];
        weekdaysObj[scheduleday].push(schedulewaiter);
      } else {
        weekdaysObj[scheduleday].push(schedulewaiter);
      }
    });
  }

  function dayCounter() {
    Object.entries(weekdaysObj).forEach(([key, value]) => {
      /* logic to get which days are fully book and
     which are under booked and which are over booked */
      if (counterMap[key] === undefined) {
        counterMap[key] = value.length;
      }
    });
    return counterMap;
  }
  async function resetSchedule() {
    weekdaysObj = {};
    counterMap = {};
    return await db.none("truncate table waiters restart identity cascade");
  }
  /* ------------------------- FUNCTIONS TO CALL ON ROUTES THAT DISPLAY INFORMATION ------------------------- */

  /* Call the function on the admin route, to display days of the week that will be color coded. */
  async function getWeekdays() {
    return weekdaysArr;
  }
  /* Call the function on the admin route */
  function getSchedule() {
    return weekdaysObj;
  }

  /* Call the function on the admin route */
  function getWaiters() {
    return waiters;
  }

  /* ------------------------- FUNCTIONS TO CALL ON ROUTES THAT DISPLAY INFORMATION ------------------------- */
  return {
    setWaiter,
    getWaiters,
    setDays,
    setSchedule,
    getSchedule,
    getWeekdays,
    adminLogin,
    resetSchedule,
    getWeeklydays,
    dayCounter,
  };
}
