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
            //current weather vars
            let currentIcon = data.currently.icon;
            console.log(currentIcon);
            //date and time stuff
            let date = new Date();
            let minutes = date.getMinutes()
                if(minutes < 10) {minutes = minutes + ' 0'}
            let currentHour = date.getHours();
            let currentDay = date.getDay();
            let amPM = "";
            //API data vars
            let hourlyForcastData = data.hourly.data;
            let weeklyForcastData = data.daily.data;
            let day = date.getDay();
            let weekdays = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];

              getNext5Days = (currentDay) => {
                var next5Days = [];
                for (var i = 1; i <= 7; i++) {
                  let dayNumber = currentDay + i;
                  let adjustedDayNumber = 0;
                  if (dayNumber >= weekdays.length) {
                    adjustedDayNumber = dayNumber - weekdays.length;
                  } else {
                    adjustedDayNumber = dayNumber;
                  }
                  let day = weekdays[adjustedDayNumber];
                  next5Days.push(day);
                }
                return next5Days;
              };         
            //function to generate list items in dom
            createListItem = (text) => {
                let li = document.createElement('li');
                li.textContent = text;
                return li
            };           
            appendChildren = (parent, children) => {
                children.forEach((child) => {
                    parent.appendChild(child)
                })
            };
             //daily forcast elements
            let dailyForcast = document.getElementById('daily-forcast');
            for (let i = 0; i < weeklyForcastData.length; i++) {
                const dailyWind = weeklyForcastData[i].windSpeed
                const dailyTemp = weeklyForcastData[i].temperatureHigh
                const nextDay = getNext5Days(currentDay)
                dailyForcast.appendChild(createListItem(nextDay[i]))            
                dailyForcast.appendChild(createListItem(dailyWind + 'MPH'))
                dailyForcast.appendChild(createListItem(dailyTemp + 'F'))         
            };
            //defines dom parent element to append 
            let hrForcast = document.getElementById('hr-forcast');   
            //loop api and create dom elements 
            for (let i = 0; i< hourlyForcastData.length; i++) {
                const hrWind = hourlyForcastData[i].windSpeed 
                const hrTemp = hourlyForcastData[i].temperature
                const hrSummary = hourlyForcastData[i].summary 
                const space = ' '

                if (currentHour > 12) {
                    currentHour = ((currentHour++ + 11) % 12) + 1
                 } else {
                     currentHour = currentHour++ 
                 }

                hrForcast.appendChild(createListItem(currentHour++)) 
                hrForcast.appendChild(createListItem(hrSummary))
                hrForcast.appendChild(createListItem(hrWind + 'MPH'))
                hrForcast.appendChild(createListItem(hrTemp + 'F'))
                hrForcast.appendChild(createListItem(space))
            };
  
            const setClock = document.querySelectorAll(".clock");
            setClock.forEach((setClock) => {
              setClock.children[0].innerHTML = currentHour;
              setClock.children[1].innerHTML = ": " + minutes + amPM;
            });
   
            //change bg for current icon
            let body = document.querySelector("body");
            switch (currentIcon) {
              case "clear-day":
                body.classList.add("change-bg-sun");
                break;
              case "partly-cloudy-day":
              case "cloudy":
                body.classList.add("change-bg-cloudy");
                break;
              case "clear-night":
                body.classList.add("clear-night-bg");
                break;
              case "rain":
                body.classList.add("change-bg-rain");
                break;
              case "sleet":
              case "fog":
              case "snow":
                body.classList.add("snow-bg");
                break;
              case "partly-cloudy-night":
                body.classList.add("partly-cloudy-night");
                break;
              default:
                body.classList.add("default-bg");
            } 
          });
      });
    }
});
  