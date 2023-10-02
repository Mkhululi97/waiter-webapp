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
      let employee_id = req.body.employee_id;
      /* WHEN THE USER IS A WAITER */
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
        weekdays: dbFunc.getWeekdays(),
      });
    } catch (err) {
      console.log(err);
    }
  }
  /* SEND SCHEDULE DATA TO THE FRONTEND */
  async function info(req, res) {
    /*------------------------------------ populate the waiter days here ------------------------------------*/
    res.json({ info: dbFunc.getSchedule() });
  }
  /* SEND WAITER NAME AND WAITER WORKING DAYS DATA TO THE FRONTEND */
  async function inform(req, res) {
    res.json(dbFunc.getWorkingDaysForAWaiter());
  }
  /* ------------------------- ROUTES CONCERNED WITH THE ADMINS PAGE ------------------------- */

  return {
    home,
    formDetails,
    waitersPage,
    adminPage,
    days,
    info,
    inform,
    adminLoginForm,
    adminLoginDetails,
  };
}
