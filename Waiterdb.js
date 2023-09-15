export default function dbFactoryFunc(db) {
  let waiter;
  let waiters;
  let usernameTrimmed;
  let currentWaiter;
  let workdays;
  let daysObj;
  const lettersOnlyRegex = /^[a-zA-Z]+$/;
  async function setWaiter(username, employee_id, password) {
    usernameTrimmed = username.trim().toLowerCase();
    if (lettersOnlyRegex.test(usernameTrimmed)) {
      let waitercheck = await db.oneOrNone(
        "select waiter_name from waiters where waiter_name = $1",
        [username]
      );
      // if the waiter doesn't exists on the db then add the waiter to the db
      if (!waitercheck) {
        await db.none(
          "insert into waiters (waiter_name, employee_id, password) values ($1,$2,$3)",
          [username, employee_id, password]
        );
      } else {
        console.log("waiter registered already");
      }
      waiters = await db.manyOrNone("select * from waiters");
      waiter = username;
    }
    currentWaiter = username;
    return waiters;
  }

  async function setDays(days) {
    let daysStr = days.toString();
    let waiterid = await db.oneOrNone(
      "select waiter_id from waiters where waiter_name=$1",
      [currentWaiter]
    );
    await db.none(
      "insert into workingdays (workdays, waiterid) values ($1, $2)",
      [daysStr, waiterid["waiter_id"]]
    );
    return await db.manyOrNone("select workdays from workingdays");
  }

  async function setSchedule() {
    workdays = await db.manyOrNone("select workdays from workingdays");
    /* +++++++++++++++++++++++++++++++++++++++++++++ */
    //use this logic to get which days are fully book and
    // which are underbooked.
    daysObj = {};
    workdays.forEach((str) => {
      let arr = str.workdays.split(",");
      arr.forEach((day) => {
        if (daysObj[day] === undefined) {
          daysObj[day] = 1;
        } else {
          daysObj[day]++;
        }
      });
    });
    /* +++++++++++++++++++++++++++++++++++++++++++++ */
  }

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
    return daysObj;
  }
  /* Call the function on the waiters route */
  function getWaiter() {
    return waiter;
  }
  /* Call the function on the admin route */
  function getWaiters() {
    return waiters;
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
  };
}
