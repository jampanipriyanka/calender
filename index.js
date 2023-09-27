var nav = 0;
const calender = document.getElementById("calender");
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


const addbutton = document.getElementById("addeVent");

var events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

/**
 * load () => is to load the calender and display particular month 
 * 
 */


function load() {
  const d = new Date();

  if (nav !== 0) {
    d.setMonth(new Date().getMonth() + nav);
  }

  const day = d.getDate();  //19
  const month = d.getMonth(); //4
  const year = d.getFullYear(); //2021

  const firstDayOfMonth = new Date(year, month, 1); //Sat May 01 2021 00:00:00 GMT+0530 (India Standard Time)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); //31

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });                   //Saturday, 5/1/2021
  const extraDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText =
    `${d.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calender.innerHTML = '';

  const nextMonthFirstDay = new Date(year, month + 1, 1);
  const nextMonthDateString = nextMonthFirstDay.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  var nextdays = weekdays.indexOf(nextMonthDateString.split(',')[0]);
  // console.log(nextdays); //1
  var x = 0;
  if (nextdays != 0) {
    x = 7 - nextdays;
  }



  for (let i = 1; i <= extraDays + daysInMonth + x; i++) {
    const daySquare = document.createElement('div');

    if (i - extraDays > 0 && i <= extraDays + daysInMonth) {
      daySquare.classList.add('day');
      let m = month + 1 >= 10 ? month + 1 : "0" + (month + 1);
      let p = i - extraDays >= 10 ? i - extraDays : "0" + (i - extraDays);
      const dayString = `${m}/${p}/${year}`;
      daySquare.innerText = i - extraDays;
      if (i - extraDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      events.forEach(e => {
        if (e.date === dayString) {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('eventdiv');
          eventDiv.addEventListener('click', clickedevent(e.title, e.date));
          eventDiv.innerText = e.title;
          daySquare.appendChild(eventDiv);
        }
      });

    } else if (i <= extraDays) {
      daySquare.classList.add('oddday');
      const lastMonthLastDay = new Date(year, month, i - extraDays);
      const lastMonthDateString = lastMonthLastDay.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      //console.log(lastMonthLastDay);
      daySquare.innerText = lastMonthDateString.split(',')[1].split('/')[1];
    }
    else {
      daySquare.classList.add('nextday');
      const l = new Date(year, month + 1, i - extraDays - daysInMonth);
      const s = l.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      daySquare.innerText = s.split(',')[1].split('/')[1];
    }
    calender.appendChild(daySquare);

  }
  events.sort(dynamicsort("startTime", "asc"));

}
 
/*
 * sorting array of ojects based on property
 * @param {eVent propert } property 
 * @param {in asc or des order} order 
 * @returns  true or false to make order correct 
 */

function dynamicsort(property, order) {
  var sort_order = 1;
  if (order === "desc") {
    sort_order = -1;
  }
  return function (a, b) {
    if (a[property] < b[property]) {
      return -1 * sort_order;
    } else if (a[property] > b[property]) {
      return 1 * sort_order;
    } else {
      return 0 * sort_order;
    }
  }
}

document.getElementById('nextButton').addEventListener('click', () => {
  nav++;
  load();
});

document.getElementById('backButton').addEventListener('click', () => {
  nav--;
  load();
});

load();

document.getElementById("finalDate").defaultValue = document.getElementById("initialDate").value ;

document.querySelector(".eventapply").addEventListener("click", () => {
  document.querySelector('.popupevent').style.display = 'flex';
  document.getElementById("newEventModal").style.display = "block";
  var today = new Date();
  let todayM = today.getMonth();
  let todayd = today.getDate();
  let m = todayM + 1 >= 10 ? todayM + 1 : "0" + (todayM + 1);
  let p = todayd >= 10 ? todayd : "0" + (todayd);
  var string = `${today.getFullYear()}-${m}-${p}`; //2021-4-22
  //console.log(today.getTime());
  document.getElementById("initialDate").defaultValue = string;
  document.getElementById("initialDate").min = string;

  document.getElementById("finalDate").min = string;
})


var deventStartTime = null;
var deventEndTime = null;
var devent = null;
var dtitle = null;
/* 
   to make chaneges of clicked eVent x=clicked title, y= clicked date 
*/
function clickedevent(x, y) {
  return () => {
    events.forEach(e => {
      if (e.title == x && e.date == y) {
        deventStartTime = e.startTime;
        deventEndTime = e.endTime;
        devent = e.date;
        dtitle = x;

      }
    })
    let a = devent.split('/')
    document.querySelector('.popupevent').style.display = 'flex';
    document.querySelector('#deleteEventModal').style.display = 'block';
    document.getElementById("newEventModal").style.display = "none";
    document.getElementById('eventTitle').value = x;

    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //As January is 0.
    var yyyy = today.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    console.log(`${yyyy}-${mm}-${dd}`);
    console.log(`${a[2]}-${a[0]}-${a[1]}`);
    document.getElementById('eventdate').min = `${yyyy}-${mm}-${dd}`;
    document.getElementById('eventdate').defaultValue = `${a[2]}-${a[0]}-${a[1]}`;
    document.getElementById('eventStartTime').value = deventStartTime;
    document.getElementById('eventEndTime').value = deventEndTime;

  }
}

