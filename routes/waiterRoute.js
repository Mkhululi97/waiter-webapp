export default function WaiterRoute(factoryFunc, dbFunc) {
  async function home(req, res) {
    try {
      res.render("home");
    } catch (err) {
      console.log(err);
    }
  }

  async function register(req, res) {
    try {
      let username = req.body.username;
      let password = req.body.password;
      let employee_id = req.body.employee_id;
      // only submit the form when all inputs have been entered.
      if (username !== "" && password !== "" && employee_id !== "") {
        /* CREATE ACCOUNT FOR A NEW WAITER */
        await dbFunc.setWaiter(username, employee_id, password);
        res.redirect("/waiters");
      } else {
        // throw an error message.
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function waitersPage(req, res) {
    try {
      /* SHOW WAITERS PAGE, WITH CHECKBOX WEEKDAYS TO SELECT FROM */
      res.render("waiters", {
        waiter_name: dbFunc.getWaiter(),
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function days(req, res) {
    try {
      let workingDays = req.body.checkbox;
      /* SEND THE WEEKDAYS SELECTED TO THE DB */
      dbFunc.setDays(workingDays);
      res.redirect("/waiters");
    } catch (err) {
      console.log(err);
    }
  }
  /* ------------------------- ROUTES CONCERNED WITH THE ADMINS PAGE ------------------------- */
  async function adminPage(req, res) {
    try {
      /* SHOW THE ADMINS PAGE, WITH THE SCHEDULE AND WAITER NAMES AVAILABLE TO WORK */
      await dbFunc.setSchedule();
      await dbFunc.setWorkingDaysForAWaiter();
      res.render("admin", {
        // waiters: dbFunc.getWaiters(),
        weekdays: dbFunc.getWeekdays(),
        /*------------------------------------ populate the waiter days here ------------------------------------*/
      });
    } catch (err) {
      console.log(err);
    }
  }
  /* SEND SCHEDULE DATA TO THE FRONTEND */
  async function info(req, res) {
    res.json({ info: dbFunc.getSchedule() });
  }
  /* SEND WAITER NAME AND WAITER WORKING DAYS DATA TO THE FRONTEND */
  async function inform(req, res) {
    res.json(dbFunc.getWorkingDaysForAWaiter());
  }
  /* ------------------------- ROUTES CONCERNED WITH THE ADMINS PAGE ------------------------- */

  return { home, register, waitersPage, adminPage, days, info, inform };
}
