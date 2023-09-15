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

        let sendQuery = await dbFactoryFunc.setWaiter("Mdu", 343, "psswrd123");
        let resArr = [
          {
            waiter_id: 1,
            waiter_name: "Mdu",
            employee_id: 343,
            password: "psswrd123",
          },
        ];
        assert.deepEqual(resArr, sendQuery);
        /* TESTING getWaiter Function */
        assert.equal("Mdu", await dbFactoryFunc.getWaiter());
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

  // close of the connection to the database.
  // after(function () {
  //   db.$pool.end();
  // });
  /* ------------------------ TESTS CONNECTED TO THE DATABASE ------------------------ */
});
