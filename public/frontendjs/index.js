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
  const baseUrl = "http://localhost:3002/info";
  const scheduleurl = "http://localhost:3002/inform";

  // const baseUrl = "https://waiter-webapp-ywrf.onrender.com/info";
  // const scheduleurl = "https://waiter-webapp-ywrf.onrender.com/inform";

  /* ------------------ GET HTML ELEMENTS ------------------ */
  const addDaysBtn = document.querySelector(".add-days-btn");
  const scheduleBtn = document.querySelector(".schedule-btn");
  const dayEle = document.querySelectorAll(".weekday");
  const switchUserBtn = document.querySelector(".switch-user");
  // const loginLabel = document.querySelector(".login");
  // const signupLabel = document.querySelector(".signup");
  // const employeeId = document.querySelector(".employee-id-label");
  // const signUpBtn = document.querySelector(".sign-up-btn");
  // const loginBtn = document.querySelector(".login-btn");
  // const accountText = document.querySelector(".account-text");
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
    currentSchedule();
  }
  /* ------------------ FUNCTIONALITY THAT SHOWS DAYS SCHEDULED IN APPROPRIATE COLORS ------------------ */

  /* ------------------ TEMPLATE THAT SHOWS WAITER NAME AND DAYS THEY SELECTED TO WORK ------------------ */
  async function currentSchedule() {
    const res = await fetch(scheduleurl, {
      method: "GET",
    });
    const data = await res.json(); // gets the object(waitersMap) that has waiter names and days, sent from the backend.
    const waiterTempContainer = document.querySelector("#waiters-working-days");
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
    waiterTempContainer.innerHTML = out;
  }
  /* ------------------ TEMPLATE THAT SHOWS WAITER NAME AND DAYS THEY SELECTED TO WORK ------------------ */

  /* ------------------ FUNCTIONALITY FOR SWITCHING LOGIN SCREENS BETWEEN WAITER AND ADMIN ------------------ */
  // function switchUserFunc() {
  //   if (loginLabel.classList.toggle("hide-el")) {
  //     /* This is the admins signup screen */
  //     // when login label does the class of hide-el
  //     // change the 'are you the waiter' text to 'are you a admin'
  //     accountText.innerHTML = `Are you the admin?`;
  //     // also show the employee_id input field.
  //     employeeId.classList.toggle("hide-el");
  //     // also show the sign-up button.
  //     signUpBtn.classList.toggle("hide-el");
  //     // also hide the login button.
  //     loginBtn.classList.toggle("hide-el");
  //   } else {
  //     /* This is the admins login screen */
  //     // when login label does not have the class of hide-el
  //     // change the are you the admin text to are you a waiter
  //     accountText.innerHTML = `Are you the waiter?`;
  //     // also hide the employee_id input field.
  //     employeeId.classList.toggle("hide-el");
  //     // also hide the sign up button.
  //     signUpBtn.classList.toggle("hide-el");
  //     // also show the login button.
  //     loginBtn.classList.toggle("hide-el");
  //   }
  //   // hide the sign up label on the form, when the user is an admin
  //   signupLabel.classList.toggle("hide-el");
  // }
  /* ------------------ FUNCTIONALITY FOR SWITCHING LOGIN SCREENS BETWEEN WAITER AND ADMIN ------------------ */

  /* ------------------ EVENT LISTENERS ------------------ */
  // wait for the home page to execute this event listener
  // if (switchUserBtn !== null)
  //   switchUserBtn.addEventListener("click", switchUserFunc);

  // wait for the waiters page to execute this event listener
  if (addDaysBtn !== null) addDaysBtn.addEventListener("click", addDaysFunc);

  // wait for the admin page to execute this event listener
  if (scheduleBtn !== null)
    scheduleBtn.addEventListener("click", updateSchedule);
});
