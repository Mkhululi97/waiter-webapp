export default function WaiterRoute(factoryFunc, dbFunc) {
  function home(req, res) {
    try {
      res.render("home");
    } catch (err) {
      console.log(err);
    }
  }
  function adminLoginForm(req, res) {
    try {
      res.render("adminlogin");
    } catch (err) {
      console.log(err);
    }
  }
  async function adminLoginDetails(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    /* WHEN THE USER IS AN ADMIN */
    if (username !== "" && password !== "") {
      /* ONLY REDIRECT TO THE DASHBOARD IF USER IS AN ADMIN  */
      if (await dbFunc.adminLogin(username, password)) {
        res.redirect("/admin");
      } else {
        // throw an error message.
        res.redirect("/");
      }
    }
  }
  async function formDetails(req, res) {
    try {
      let username = req.body.username;
      let password = req.body.password;
      /* WHEN THE USER IS A WAITER */
      // only submit the form when all inputs have been entered.
      if (username !== "" && password !== "") {
        /* CREATE ACCOUNT FOR A NEW WAITER */
        await dbFunc.setWaiter(username, password);
        res.redirect(`/waiters/${username}`);
      } else {
        // throw an error message.
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  }
  let currentWaiter;
  async function waitersPage(req, res) {
    currentWaiter = req.params.username;
    try {
      /* SHOW WAITERS PAGE, WITH CHECKBOX WEEKDAYS TO SELECT FROM */
      res.render("waiters", {
        waiter_name: currentWaiter,
        waiterDays: await dbFunc.keepWaiterDaysChecked(currentWaiter),
      });
    } catch (err) {
      console.log(err);
    }
  }
  async function days(req, res) {
    try {
      let workingDays = req.body.checkbox;
      let currentWaiter = req.params.username;
      /* SEND THE WEEKDAYS SELECTED TO THE DB */
      await dbFunc.setDays(workingDays, currentWaiter);
      res.redirect(`/waiters/${currentWaiter}`);
    } catch (err) {
      console.log(err);
    }
  }
  /* ------------------------- ROUTES CONCERNED WITH THE ADMINS PAGE ------------------------- */
  async function adminPage(req, res) {
    try {
      /* SHOW THE ADMINS PAGE, WITH THE SCHEDULE AND WAITER NAMES AVAILABLE TO WORK */
      await dbFunc.setSchedule();
      // await dbFunc.setWorkingDaysForAWaiter();
      res.render("admin", {
        weekdays: await dbFunc.getWeekdays(),
        scheduleObject: dbFunc.getSchedule(),
      });
    } catch (err) {
      console.log(err);
    }
  }
  async function reset(req, res) {
    try {
      await dbFunc.resetSchedule();
      res.redirect("/admin");
    } catch (err) {
      console.log(err);
    }
  }
  /* SEND SCHEDULE DATA TO THE FRONTEND */
  async function info(req, res) {
    /*------------------------------------ populate the waiter days here ------------------------------------*/
    res.json({ info: dbFunc.dayCounter() });
  }

  async function waiterdays(req, res) {
    res.json({ waiterdays: await dbFunc.keepWaiterDaysChecked(currentWaiter) });
  }
  /* ------------------------- ROUTES CONCERNED WITH THE ADMINS PAGE ------------------------- */

  return {
    home,
    formDetails,
    waitersPage,
    adminPage,
    days,
    info,
    adminLoginForm,
    adminLoginDetails,
    reset,
    waiterdays,
  };
}
