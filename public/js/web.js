document.addEventListener("DOMContentLoaded", function() {
  "use strict";

  const datetxtEl = document.querySelector(".datetxt");
  const datesEl = document.querySelector(".dates");
  const monthYearEl = document.querySelector(".months_year");
  const btnEl = document.querySelectorAll(".calendar_headings .fa-solid");
  
  let dmObj = {
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };
  
  // date object
  let dateObj = new Date();
  let dayName = dmObj.days[dateObj.getDay()]; // day
  let month = dateObj.getMonth(); // month
  let year = dateObj.getFullYear(); // year
  let date = dateObj.getDate(); // dates;
  
  // today date
  datetxtEl.innerHTML = `${dayName}, ${date}, ${dmObj.months[month]}, ${year}`;

  const displayCalendar = () => {
      let firstDayOfMonth = new Date(year, month, 1).getDay(); // first day of the month
      let lastDateOfMonth = new Date(year, month + 1, 0).getDate(); // last date of the month
      let lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay(); // last day of month
      let lastDateOfLastMonth = new Date(year, month, 0).getDate(); // last date of previous month
      
      let days = "";
      
      // previous month last days
      for (let i = firstDayOfMonth; i > 0; i--) {
          days += `<li class="dummy">${lastDateOfLastMonth - i + 1}</li>`;
      }

      // current month days
      for (let i = 1; i <= lastDateOfMonth; i++) {
          let checkToday = (i === dateObj.getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) ? "active" : "";
          days += `<li class="${checkToday}">${i}</li>`;
      }

      //next month first days
      for (let i = lastDayOfMonth; i < 6; i++) {
          days += `<li class="dummy">${i - lastDayOfMonth + 1}</li>`;
      }
      
      // display all days inside the HTML file
      datesEl.innerHTML = days;
      
      // display current month & year
      monthYearEl.innerHTML = `${dmObj.months[month]}, ${year}`;
  };
  
  displayCalendar();
  
  // previous and next month
  btnEl.forEach((btns) => {
      btns.addEventListener("click", () => {
          month = btns.id === "prev" ? month - 1 : month + 1;
          
          if (month < 0 || month > 11) {
              date = new Date(year, month, new Date().getDate());
              year = date.getFullYear();
              month = date.getMonth();
          } else {
              date = new Date();
          }
          
          displayCalendar();
      });
  });
});
