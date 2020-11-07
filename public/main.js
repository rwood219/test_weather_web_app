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
      const space = " ------------------";
      const hourlyForcastData = data.hourly.data; //DarkSky Api Data vars; console log data for more detail
      const weeklyForcastData = data.daily.data;
      const currentIcon = data.currently.icon;
      //get html elements to append api data
      const dailyForcast = document.getElementById("daily-forcast");
      const hrForcast = document.getElementById("hr-forcast");
      const setClock = document.querySelectorAll(".clock");
  
      let weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      changeAmpm = (time) => {
        time > 12 ? (amPm = " PM") : (amPm = " AM");
        return amPm;
      };

      adjustHour = (hourNum, amp) => {
        hourNum == 0
          ? (hourNum = 12)
          : hourNum > 12
          ? (hourNum = ((hourNum + 11) % 12) + 1)
          : (hourNum = hourNum);
        return hourNum;  
      };

      addZero = (num) => {
        num < 10 ? (num = ":" + "0" + num) : (num = ":" + num);
        return num;
      };

      setClock.forEach((setClock) => {
        setClock.children[0].textContent = adjustHour(currentHour);
        setClock.children[1].textContent =
          addZero(minutes) + changeAmpm(currentHour);
      });

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

      createListItem = (text) => {
        let li = document.createElement("li");
        li.textContent = text;
        return li;
      };

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

      changeBackGround = (icon) => {
        let body = document.querySelector("body");
        body.classList.add(icon);
      };
      changeBackGround(currentIcon);
    });
  }
});
