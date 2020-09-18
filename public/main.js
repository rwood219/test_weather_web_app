window.addEventListener("load", () => {
  let long;
  let lat;
  if (!navigator.geolocation) alert("no nav");
  else {
    navigator.geolocation.getCurrentPosition(async (position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const api_url = `weather/${lat},${long}`;
      const response = await fetch(api_url);
      const json = await response.json();
      const data = json;
      const date = new Date();
      let minutes = date.getMinutes();
      let currentHour = date.getHours();
      const currentDay = date.getDay();
      //temporary to make ui easier to look at for now
      const space = " ------------------";
      const hourlyForcastData = data.hourly.data; //DarkSky Api Data vars; console log data for more detail
      const weeklyForcastData = data.daily.data;
      const currentIcon = data.currently.icon;
      //get html elements to append api data
      const dailyForcast = document.getElementById("daily-forcast");
      const hrForcast = document.getElementById("hr-forcast");
      const setClock = document.querySelectorAll(".clock");
  
      // weekdays array provides starting point to leverage current day number to adjust value to match weekly data from API
      let weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      //change amPM var for am or pm based on currenthour value
      changeAmpm = (time) => {
        time > 12 ? (amPm = " PM") : (amPm = " AM");
        return amPm;
      };

      //converts 24hr to 12hr format
      adjustHour = (hourNum, amp) => {
        hourNum == 0
          ? (hourNum = 12)
          : hourNum > 12
          ? (hourNum = ((hourNum + 11) % 12) + 1)
          : (hourNum = hourNum);
        return hourNum;  
      };

      //format minutes to add a 0 if minutes are < 10
      addZero = (num) => {
        num < 10 ? (num = ":" + "0" + num) : (num = ":" + num);
        return num;
      };

      //display current time in ui at top of page; its just a dumb clock
      setClock.forEach((setClock) => {
        setClock.children[0].textContent = adjustHour(currentHour);
        setClock.children[1].textContent =
          addZero(minutes) + changeAmpm(currentHour);
      });

      // function to adjust day text in ui for weekly forcast
      getNext7Days = (currentDay) => {
        const next7Days = [];
        for (let i = 1; i <= 8; i++) {
          let dayNumber = currentDay + i;
          let adjustedDayNumber = 0;
          dayNumber >= weekdays.length
            ? (adjustedDayNumber = dayNumber - weekdays.length)
            : (adjustedDayNumber = dayNumber);
          let day = weekdays[adjustedDayNumber];
          next7Days.push(day);
        }
        return next7Days;
      };

      //function to generate list items
      createListItem = (text) => {
        let li = document.createElement("li");
        li.textContent = text;
        return li;
      };

      //loop api and create list items from api data
      for (let i = 0; i < weeklyForcastData.length; i++) {
        const dailyWind = weeklyForcastData[i].windSpeed;
        const dailyTemp = weeklyForcastData[i].temperatureHigh;
        const nextDay = getNext7Days(currentDay);
        dailyForcast.appendChild(createListItem(nextDay[i]));
        dailyForcast.appendChild(createListItem(dailyWind + "MPH"));
        dailyForcast.appendChild(createListItem(dailyTemp + "F"));
        dailyForcast.appendChild(createListItem(space));
      }
      for (let i = 0; i < 48; i++) {
        const hrWind = hourlyForcastData[i].windSpeed;
        const hrTemp = hourlyForcastData[i].temperature;
        const hrSummary = hourlyForcastData[i].summary;
        let amPm = [" AM", " PM"];
       
        hrForcast.appendChild(createListItem(adjustHour(currentHour++) + amPm));
        hrForcast.appendChild(createListItem(hrSummary));
        hrForcast.appendChild(createListItem(hrWind + "MPH"));
        hrForcast.appendChild(createListItem(hrTemp + "F"));
        hrForcast.appendChild(createListItem(space));
      }

      //change bg for current icon
      changeBackGround = (icon) => {
        let body = document.querySelector("body");
        body.classList.add(icon);
      };
      changeBackGround(currentIcon);
    });
  }
});
