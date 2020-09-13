window.addEventListener("load", () => {
  let long;
  let lat;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const KEY = "54edd9c1bbf1ba4d15adb1abeaf06736";
      var proxy = "https://cors-anywhere.herokuapp.com/";
      var api = `https://api.darksky.net/forecast/${KEY}/${lat},${long}`;
      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const date = new Date();
          let minutes = date.getMinutes();
          let currentHour = date.getHours();
          //let adjustedHour = ((currentHour + 11) % 12) + 1;
          let currentDay = date.getDay();
          const setClock = document.querySelectorAll(".clock");
          const hourlyForcastData = data.hourly.data;
          const weeklyForcastData = data.daily.data;
          const currentIcon = data.currently.icon;
          let weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          getNext7Days = (currentDay) => {
            var next7Days = [];
            for (var i = 0; i < 8; i++) {
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

          //display current time
          setClock.forEach((setClock) => {
            setClock.children[0].textContent = currentHour + ": ";
            setClock.children[1].textContent = minutes;
          });

          //function to generate list items
          createListItem = (text) => {
            let li = document.createElement("li");
            li.textContent = text;
            return li;
          };

          //get html elements to append data to
          const dailyForcast = document.getElementById("daily-forcast");
          const hrForcast = document.getElementById("hr-forcast");
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
            dailyForcast.style.color = 'blue'  
          };
          for (let i = 0; i < hourlyForcastData.length; i++) {
            const hrWind = hourlyForcastData[i].windSpeed;
            const hrTemp = hourlyForcastData[i].temperature;
            const hrSummary = hourlyForcastData[i].summary;
            hrForcast.appendChild(createListItem(currentHour++));
            hrForcast.appendChild(createListItem(hrSummary));
            hrForcast.appendChild(createListItem(hrWind + "MPH"));
            hrForcast.appendChild(createListItem(hrTemp + "F"));
            hrForcast.appendChild(createListItem(space));
          };

          //trying to style daily forcast elements
          dayForcastChildren = dailyForcast.children
          console.log(dailyForcast.children[0])

          //change bg for current icon
          changeBackGround = (icon) => {
            let body = document.querySelector("body");
            body.classList.add(icon);
          };
          changeBackGround(currentIcon);
        });
    });
  }
});

/* 
appendChildren = (parent, children) => {
  children.forEach((child) => {
    parent.appendChild(child);
  });
};
*/

/*           function addZero(n) {
            return (parseInt(n, 10) < 10 ? "0" : "") + n;
          }
          addZero(minutes); */
