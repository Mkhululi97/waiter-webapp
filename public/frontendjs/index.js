window.addEventListener("DOMContentLoaded", function () {
  const daysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  // Hit these urls when the 'see scheduled days' button is clicked on the admins page.
  // const baseUrl = "http://localhost:3002/info";
  // const waiterDaysUrl = "http://localhost:3002/waiterdays";

  const baseUrl = "https://waiter-webapp-ywrf.onrender.com/info";
  const waiterDaysUrl = "https://waiter-webapp-ywrf.onrender.com/waiterdays";

  /* ------------------ GET HTML ELEMENTS ------------------ */
  const addDaysBtn = document.querySelector(".add-days-btn");
  const scheduleBtn = document.querySelector(".schedule-btn");
  const dayEle = document.querySelectorAll(".weekday");
  const reset = document.querySelector(".reset-schedule-btn");
  const checkboxArr = document.querySelectorAll(".checkbox");
  /* ------------------ GET HTML ELEMENTS ------------------ */
  async function persistCheckedDays() {
    const res = await fetch(waiterDaysUrl, {
      method: "GET",
    });
    const data = await res.json();
    let waiterdaysArrObj = data.waiterdays;
    let waiterdaysArr = [];
    waiterdaysArrObj.forEach((day) => {
      waiterdaysArr.push(day["weekdays"]);
    });
    checkboxArr.forEach((checkbox, index) => {
      waiterdaysArr.includes(checkbox["value"])
        ? (checkbox.checked = true)
        : "";
    });
  }
  if (checkboxArr.length > 0) persistCheckedDays();
  /* ------------------ FUNCTIONALITY FOR LIMITING CHECKBOXES ------------------ */
  const checkboxsArr = document.querySelectorAll('input[type="checkbox"]');
  const checkboxLimit = 5;
  let count;
  checkboxsArr.forEach(function (checkbox) {
    function checkboxFunc() {
      count = document.querySelectorAll(
        'input[type="checkbox"]:checked'
      ).length;
      if (count > checkboxLimit) {
        this.checked = false;
      }
      if (count === checkboxLimit) {
        checkboxsArr.forEach(function (otherCheckbox) {
          if (!otherCheckbox.checked) {
            otherCheckbox.disabled = true;
          }
        });
        updateLabel("Maximum selected checkboxes reached");
      } else {
        checkboxsArr.forEach(function (otherCheckbox) {
          otherCheckbox.disabled = false;
        });
        updateLabel("");
      }
    }
    function updateLabel(message) {
      const label = document.getElementById("messageLabel");
      label.textContent = message;
    }
    checkbox.addEventListener("change", checkboxFunc);
  });
  /* ------------------ FUNCTIONALITY FOR LIMITING CHECKBOXES ------------------ */

  let element = document.querySelectorAll('input[type="checkbox"]:checked');
  function addDaysFunc(e) {
    element.forEach((el) => {
      el.setAttribute("checked", "checked");
    });
    console.log(el);
    // ONLY SUBMIT WHEN THERES EXACTLY THREE CHECKBOXES CHECKED.
    count === 3 ? "" : e.preventDefault();
  }

  /* ------------------ FUNCTIONALITY THAT SHOWS DAYS SCHEDULED IN APPROPRIATE COLORS ------------------ */
  // Use data coming from the backend, about which days are fully, over and under booked.
  // add classes that will change the background colors to green, red and yellow, for fully,
  // over and under booked respectively.
  async function updateSchedule(e) {
    e.preventDefault();
    const res = await fetch(baseUrl, {
      method: "GET",
    });
    const data = await res.json();
    daysOfTheWeek.forEach((day, index) => {
      if (data.info[day] > 3) {
        dayEle[index].classList.add("over-booked");
      } else if (data.info[day] === 3) {
        dayEle[index].classList.add("fully-booked");
      } else if (data.info[day] < 3) {
        dayEle[index].classList.add("under-booked");
      }
    });
  }
  /* ------------------ FUNCTIONALITY THAT SHOWS DAYS SCHEDULED IN APPROPRIATE COLORS ------------------ */

  /* ------------------ EVENT LISTENERS ------------------ */
  if (reset !== null) {
    reset.addEventListener("click", function (e) {
      const deleteData = window.confirm(
        "Are you sure you want to reset waiter schedule"
      );
      //when true delete the data, when false do not delete dataS
      deleteData ? "" : e.preventDefault();
    });
  }

  // wait for the waiters page to execute this event listener
  if (addDaysBtn !== null) addDaysBtn.addEventListener("click", addDaysFunc);

  // wait for the admin page to execute this event listener
  if (scheduleBtn !== null)
    scheduleBtn.addEventListener("click", updateSchedule);
});
