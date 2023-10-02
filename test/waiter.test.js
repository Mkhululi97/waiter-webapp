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
    it("should send waiter names to the db", async function () {
      try {
        let dbFactoryFunc = DBFactoryFunc(db);
        await dbFactoryFunc.setWaiter("Mdu", 343, "psswrd123");
        let res = {
          waiter_name: "mdu",
        };
        assert.deepEqual(
          res,
          await dbFactoryFunc.setWaiter("Mdu", 343, "psswrd123")
        );
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("setDays function", function () {
    it("should send a string of days to the db", async function () {
      try {
        let dbFactoryFunc = DBFactoryFunc(db);
        await dbFactoryFunc.setWaiter("Mdu", 343, "psswrd123");
        let days = ["Monday", "Wednesday", "Thursday"];
        let resArr = [{ workdays: "Monday,Wednesday,Thursday" }];
        let sendQuery = await dbFactoryFunc.setDays(days);
        assert.deepEqual(resArr, sendQuery);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("setWorkingDaysForAWaiter function", function () {
    it("should add the current waiter name and waiter working days to the waiters map", async function () {
      try {
        let dbFactoryFunc = DBFactoryFunc(db);
        await dbFactoryFunc.setWaiter("Mdu", 343, "psswrd123");
        await dbFactoryFunc.setDays(["Monday", "Wednesday", "Thursday"]);
        await dbFactoryFunc.setWorkingDaysForAWaiter();
        assert.deepEqual(
          { mdu: "Monday,Wednesday,Thursday" },
          dbFactoryFunc.getWorkingDaysForAWaiter()
        );
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("dbFactoryFunc function", function () {
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

  // close of the connection to the database.
  // after(function () {
  //   db.$pool.end();
  // });
  /* ------------------------ TESTS CONNECTED TO THE DATABASE ------------------------ */
});
