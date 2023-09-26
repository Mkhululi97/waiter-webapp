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
  // Hit this url when the 'see scheduled days' button is clicked on the admins page.
  // const baseUrl = "http://localhost:3002/info"

  // const scheduleurl = "http://localhost:3002/inform"

  const baseUrl = "https://waiter-webapp-ywrf.onrender.com/info";
  const scheduleurl = "https://waiter-webapp-ywrf.onrender.com/inform";

  /* ------------------ GET HTML ELEMENTS ------------------ */
  const addDaysBtn = document.querySelector(".add-days-btn");
  const scheduleBtn = document.querySelector(".schedule-btn");
  const dayEle = document.querySelectorAll(".weekday");
  /* ------------------ GET HTML ELEMENTS ------------------ */

  /* ------------------ FUNCTIONALITY FOR LIMITING CHECKBOXES ------------------ */
  const checkboxsArr = document.querySelectorAll('input[type="checkbox"]');
  const checkboxLimit = 3;
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

  function addDaysFunc(e) {
    // ONLY SUBMIT WHEN THERES EXACTLY THREE CHECKBOXES CHECKED.
    count === 3 ? "" : e.preventDefault();
  }

  /* ++++++++++++++++++++++++++++++++++++++++++++ */
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
    currentSchedule();
  }
  /* ++++++++++++++++++++++++++++++++++++++++++++ */

  /* ++++++++++++++++++++++++++++++++++++++++++++ */
  async function currentSchedule() {
    const res = await fetch(scheduleurl, {
      method: "GET",
    });
    // console.log(res);
    const data = await res.json(); // gets the object(waitersMap) that has waiter names and days, sent from the backend.
    // console.log(data);
    let placeholder = document.querySelector("#waiters-working-days");
    let out = "";
    Object.entries(data).forEach(([key, value]) => {
      out += `
        <div class="waiter-working-days">
          <ul>
            <li class="waiter-name">${key}👨🏽‍🍳</li>
            <li>${value}</li>
          </ul>
        </div>
        `;
    });
    placeholder.innerHTML = out;
  }
  /* ++++++++++++++++++++++++++++++++++++++++++++ */

  /* ************* EVENT LISTENERS ************* */
  scheduleBtn.addEventListener("click", updateSchedule);
  addDaysBtn.addEventListener("click", addDaysFunc);
});
