let clicked = null;
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');

/*
 To saVe the eVent when it is creating 
 datei= starting date of the giVen data
 datef= end date of the giVen date  
*/


function saveEvent(datei, datef) {
    clicked = datei;
    var datefinal = datef;
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        if (datef == datei) {
            events.push({
                date: datei,
                title: eventTitleInput.value,
                startTime: initialTime.value,
                endDate: finalDate.value,
                endTime: finalTiime.value,
            });
        }
        else {
            let ida = datei.split("/"); //05/24/2021
            let fda = datef.split("/");
            let z = new Date(fda[2], fda[0], fda[1]);
            let j = new Date(ida[2], ida[0], ida[1]);
            let x = (z.getTime() - j.getTime()) / (1000 * 3600 * 24);
            for (let i = 0; i <= x; i++) {
                let p = Number(ida[1]) + i;
                fdastr = `${ida[0]}/${p}/${ida[2]}`;
                //  console.log(fdastr); //2021-05-24
                let m = Number(ida[0]) - 1;
                let x = new Date(ida[2], m, p)
                // console.log(x);
                var pdate = x.toLocaleDateString('en-us', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                });
                // console.log(pdate.split(",")[1]);  //5/31/2021
                let l = pdate.split(",")[1].split("/");
                let ls = l[1] >= 10 ? l[1] : "0" + (l[1]); //31
                let lf = l[0] >= 10 ? l[0] : "0" + (Number(l[0])); //5
                str = `${lf}/${ls}/${l[2]}`;
                //console.log(str);
                var week = weekdays.indexOf(pdate.split(', ')[0]);
                if (week != 5 && week != 6) {

                    events.push({
                        date: str,   // 05/24/2021
                        title: eventTitleInput.value,
                        startTime: initialTime.value,
                        endDate: finalDate.value,
                        endTime: finalTiime.value,

                    })
                }
            }
        }

        localStorage.setItem('events', JSON.stringify(events));
        events.sort(dynamicsort("startTime", "asc"));
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }
}

/*
 deleteEVent() => for a particular eVent of The date 
 datei = date of the eVent 
 starttime = start time of the eVent
 endtime = end time of the eVent
 dtitle = Ttle of the eVent
*/
function deleteEvent(datei, starttime, endtime, dtitle) {
    events.forEach(e => {
        if (e.date == datei && e.startTime == starttime && e.endTime == endtime && e.title == dtitle) {
            var index = events.indexOf(e);
            if (index > -1) {
                events.splice(index, 1);
            }
        }
    })
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();

}
/*
 to delete the chain of same eVents in calendar
 dtitle= title of the eVent

*/
function deleteChain(dtitle) {
    var ind = new Array();
    events.forEach(e => {
        if (e.title == dtitle) {
            var index = events.indexOf(e);
            ind.push(index);
        }
    })

    ind.reverse().forEach(x => {
        console.log(x);
        if (x > -1) {
            events.splice(x, 1);
            console.log(events);
        }
    })

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();

}

/*
 closeModal()=> this is used to change the popup up EVent and make load display 
 and load calender again

*/
function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load();
    document.querySelector('.popupevent').style.display = 'none';
    document.getElementById('discription').value = '';

}


document.getElementById('saveButton').addEventListener('click', () => {
    if (document.getElementById('eventTitleInput').value) {

        var d = document.getElementById("initialDate").value; // 2021-5-20
        var pd;
        if(document.getElementById("finalDate").value){
         pd = document.getElementById("finalDate").value;
        }
        else{
            pd = document.getElementById("initialDate").value;
        }
        var w = d.split("-");
        var px = pd.split("-");
        console.log(px)
        if (satsun(d) && document.getElementById('initialTime').value <= document.getElementById('finalTiime').value) {

            let e = `${w[1]}/${w[2]}/${w[0]}`;
            let fe = `${px[1]}/${px[2]}/${px[0]}`;
            saveEvent(e, fe);
            document.getElementById("error").textContent = "";
            document.getElementById("errortime").textContent = "";
        }
        else if (!satsun(d)) {
            document.getElementById("error").textContent = "Saturday and Sunday are weekends";
            document.getElementById("error").style.color = "red";
        }
        else {
            document.getElementById("errortime").textContent = "Invalid time";
            document.getElementById("errortime").style.color = "red";   
        }
        document.getElementById("titleerror").textContent = "";
    }
    else {
        document.getElementById("titleerror").textContent = "Enter the Event title "
        document.getElementById("titleerror").style.color = "red"
    }

});
/*
     satsun()=> this function is to add no eVent on saturday and sunday
     datestri= date in string format which proVides weekdays also 
*/

function satsun(datestri) {
    let date = datestri.split("-");
    var d = new Date(date[0], date[1] - 1, date[2]);
    //console.log(d.getDay());
    if (d.getDay() == 0 || d.getDay() == 6) {
        return false;
    } else {

        return true;
    }
}

document.getElementById('close').addEventListener('click', closeModal);
document.getElementById('deleteButton').addEventListener('click', (x) => {
    deleteEvent(devent, deventStartTime, deventEndTime, dtitle)
});
document.getElementById('deletechain').addEventListener('click', (x) => {
    deleteChain(dtitle)
});
document.getElementById('close1').addEventListener('click', closeModal);
load();



/*
 saveEventChanges()   => this function call on when button clicked on saVe changes on delete eVent module
 dtitle= title of popup eVent 
 devent= date of popup eVent
*/


function saveEventChanges(dtitle, devent) {
    // console.log(devent);
    var changeDate = document.getElementById("eventdate").value; //2021-05-26
    var changestartTime = document.getElementById("eventStartTime").value;
    var changeendTime = document.getElementById("eventEndTime").value;
    let a = changeDate.split("-");
    var sc = `${a[1]}/${a[2]}/${a[0]}`
    //console.log(devent);
    if (changeendTime > changestartTime) {
        events.forEach(e => {
            //  console.log(e.date);
            if (e.title == dtitle && e.date == devent) {
                e.startTime = changestartTime;
                e.endTime = changeendTime;
                e.date = sc;
                e.endDate = changeDate;
                // console.log(e.date);
            }
        })
        // console.log(events);
        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    }
    else {
        alert("change the timings to correct format ")
    }

}

document.getElementById('saveChanges').addEventListener('click', (x) => { saveEventChanges(dtitle, devent) });


var togglebutton = document.getElementById('tbutton');
togglebutton.addEventListener('click', () => {
    if (togglebutton.checked == true) {
        console.log("a");
        document.getElementById('enddate').style.display="block";
    }
    else {
        console.log("b");
        document.getElementById('enddate').style.display="none"
    }
})