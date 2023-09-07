export default function dbFactoryFunc(db) {
  let waiter;
  let waiters;
  async function setWaiter(username, employee_id, password) {
    await db.none(
      "insert into waiters (waiter_name, employee_id, password) values ($1,$2,$3)",
      [username, employee_id, password]
    );
    waiters = await db.manyOrNone("select * from waiters");
    waiter = username;
    return waiters;
  }
  function getWaiter() {
    return waiter;
  }
  function getWaiters() {
    return waiters;
  }
  return { setWaiter, getWaiter, getWaiters };
}
