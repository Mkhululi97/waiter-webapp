// alert("frontend");
window.addEventListener("DOMContentLoaded", function () {
  const addDaysBtn = document.querySelector(".add-days-btn");
  const scheduleBtn = document.querySelector(".schedule-btn");
  const dayEle = document.querySelectorAll(".weekday");
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
    count === 3 ? "" : e.preventDefault();
  }
  let daysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  /* ++++++++++++++++++++++++++++++++++++++++++++ */
  const baseUrl = "http://localhost:3002/info";
  async function getInfo(e) {
    e.preventDefault();
    const res = await fetch(baseUrl, {
      method: "GET",
    });
    const data = await res.json();
    daysOfTheWeek.forEach((day, index) => {
      console.log(day, data.info[day], index);
      if (data.info[day] > 3) {
        dayEle[index].classList.add("over-booked");
      } else if (data.info[day] === 3) {
        dayEle[index].classList.add("fully-booked");
      } else if (data.info[day] < 3) {
        dayEle[index].classList.add("under-booked");
      }
    });
  }
  /* ++++++++++++++++++++++++++++++++++++++++++++ */

  /* ************* EVENT LISTENERS ************* */
  scheduleBtn.addEventListener("click", getInfo);
  addDaysBtn.addEventListener("click", addDaysFunc);
});
