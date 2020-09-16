window.addEventListener("load", () => {
  let long;
  let lat;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const api_url = `weather/${lat},${long}`;
      const response = await fetch(api_url);
      const json = await response.json();
      console.log(json);
      data = json;
      const date = new Date();
      let minutes = date.getMinutes();
      let currentHour = date.getHours();
      currentHour >= 12 ? (amPm = " PM") : (amPm = " AM");

      //converts 24hr to 12hr format
      adjustHour = (hourNum) => {
        hourNum == 0
          ? (hourNum = 12)
          : hourNum >= 12
          ? (hourNum = hourNum = ((hourNum + 11) % 12) + 1)
          : (hourNum = hourNum);
        return hourNum;
      };
      
      //format minutes
      addZero = (num) => {
        num < 10 ? (num = ":" + "0" + num) : (num = ":" + num);
        return num;
      };

      //display current time
      const setClock = document.querySelectorAll(".clock");
      setClock.forEach((setClock) => {
        setClock.children[0].textContent = adjustHour(currentHour);
        setClock.children[1].textContent = addZero(minutes);
      });

      //DarkSky Api Data
      const hourlyForcastData = data.hourly.data;
      const weeklyForcastData = data.daily.data;
      const currentIcon = data.currently.icon;

      // define current day number
      const currentDay = date.getDay();

      let weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      // function to adjust day text in ui for weekly forcast
      getNext7Days = (currentDay) => {
        var next7Days = [];
        for (var i = 1; i <= 8; i++) {
          let dayNumber = currentDay + i;
          let adjustedDayNumber = 0;
          if (dayNumber >= weekdays.length) {
            adjustedDayNumber = dayNumber - weekdays.length;
          } else {
            adjustedDayNumber = dayNumber;
          }
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

      //get html elements to append data to
      const dailyForcast = document.getElementById("daily-forcast");
      const hrForcast = document.getElementById("hr-forcast");
      //tempory to make ui easier to look at for now
      const space = " ------------------";

      //loop api and create dom elements from api data
      for (let i = 0; i < weeklyForcastData.length; i++) {
        const dailyWind = weeklyForcastData[i].windSpeed;
        let dailyTemp = weeklyForcastData[i].temperatureHigh;
        const nextDay = getNext7Days(currentDay);
        dailyForcast.appendChild(createListItem(nextDay[i]));
        dailyForcast.appendChild(createListItem(dailyWind + "MPH"));
        dailyForcast.appendChild(createListItem(dailyTemp + "F"));
        dailyForcast.appendChild(createListItem(space));
        //dailyForcast.children.style.classList.add('add-border')
      }
      for (let i = 0; i < hourlyForcastData.length; i++) {
        const hrWind = hourlyForcastData[i].windSpeed;
        const hrTemp = hourlyForcastData[i].temperature;
        const hrSummary = hourlyForcastData[i].summary;
        hrForcast.appendChild(createListItem(adjustHour(currentHour++)));
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

