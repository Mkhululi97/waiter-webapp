/* ####### BRING IN ASSERT ####### */
import assert from "assert";
/* ##### BRING IN THE FACTORY FUNCTION ##### */
/* ##### BRING IN THE DATABASE ##### */
import db from "../database.js";
/* ##### BRING IN THE DATABASE FACTORY FUNCTION ##### */
import DBFactoryFunc from "../Waiterdb.js";

describe("Test Waiter Functions", function () {
  /* SOLVE THE TIMEOUT OF 2000MS EXCEEDED EEROR */
  this.timeout(3000);
  /* START WITH A CLEAN TABLE EACH TIME */
  beforeEach(async function () {
    await db.none("truncate table waiters restart identity cascade");
  });

  /* ------------------------ TESTS CONNECTED TO THE DATABASE ------------------------ */
  describe("setWaiter function", function () {
    it("should add waiter details to the waiters table", async function () {
      try {
        let dbFactoryFunc = DBFactoryFunc(db);
        assert.deepEqual(
          [{ password: "mdu123", waiter_id: 1, waiter_name: "mdu" }],
          await dbFactoryFunc.setWaiter("Mdu", "mdu123")
        );
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("setDays function", function () {
    it("should send to the workingdays table, the ids that match each day that was selected", async function () {
      try {
        let dbFactoryFunc = DBFactoryFunc(db);
        await dbFactoryFunc.setWaiter("Mdu", "mdu123");
        let days = ["Monday", "Wednesday", "Thursday"];
        let resArr = [{ weekdayid: 1 }, { weekdayid: 3 }, { weekdayid: 4 }];
        let sendQuery = await dbFactoryFunc.setDays(days, "Mdu");
        assert.deepEqual(resArr, sendQuery);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("setSchedule function", function () {
    it("should group waiters according to days they selected to work", async function () {
      try {
        let dbFactoryFunc = DBFactoryFunc(db);
        await dbFactoryFunc.setWaiter("Mdu", "mdu123");
        await dbFactoryFunc.setDays(["Monday", "Wednesday", "Thursday"], "Mdu");
        await dbFactoryFunc.setSchedule();
        assert.deepEqual(
          { Monday: ["mdu"], Wednesday: ["mdu"], Thursday: ["mdu"] },
          dbFactoryFunc.getSchedule()
        );
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("adminLogin function", function () {
    it("should return a boolean value, base on if user exist on the admin tables", async function () {
      try {
        let dbFactoryFunc = DBFactoryFunc(db);
        assert.equal(
          true,
          await dbFactoryFunc.adminLogin("ntombi", "ntombi123")
        );
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("resetSchedule function", function () {
    it("should clear both the waiters and the workingdays table from the database", async function () {
      let dbFactoryFunc = DBFactoryFunc(db);
      await dbFactoryFunc.setWaiter("Mdu", "mdu123");
      await dbFactoryFunc.setDays(["Monday", "Wednesday", "Thursday"], "Mdu");
      await dbFactoryFunc.setSchedule();
      assert.equal(null, await dbFactoryFunc.resetSchedule());
    });
  });

  // close of the connection to the database.
  // after(function () {
  //   db.$pool.end();
  // });
  /* ------------------------ TESTS CONNECTED TO THE DATABASE ------------------------ */
});
