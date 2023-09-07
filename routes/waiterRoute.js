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
      await dbFunc.setWaiter(username, employee_id, password);
      res.redirect("/waiters");
    } catch (err) {
      console.log(err);
    }
  }
  async function waitersPage(req, res) {
    try {
      res.render("waiters", {
        waiter_name: dbFunc.getWaiter(),
      });
    } catch (err) {
      console.log(err);
    }
  }
  async function adminPage(req, res) {
    try {
      res.render("admin", {
        waiters: dbFunc.getWaiters(),
      });
    } catch (err) {
      console.log(err);
    }
  }
  return { home, register, waitersPage, adminPage };
}
