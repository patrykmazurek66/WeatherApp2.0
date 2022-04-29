const apiKey = '63bf289f0a05fdfa5b1002c77f53563c'
const input = document.querySelector('.weather input');

let lat;
let lon;

daysInWeek = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']



const getCoords = async () =>{

    const city = input.value;
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${3}&appid=${apiKey}`);
    if(response.status !== 200){
        throw new Error('cannot fetch the data');
    }
    const data = await response.json();
    return data;
}


const getWeather = async (lat, lon) =>{
    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&units=metric`);
    if(response.status !== 200){
        throw new Error('cannot fetch the data');
    }
    const data = await response.json();
    return data;
}


const setBackground = (weatherType)=>{
    // console.log(document.querySelector('section.weather').style);
        document.querySelector('.weather').style.backgroundImage = `url('/WeatherApp2.0/backgrounds/${weatherType.toLowerCase()}.gif')`;
        console.log(document.querySelector('.weather').style);
}



const displayWeather = (data) => {

    //curent
    document.querySelector('.tempWeather .temperature').textContent = Math.round(data.current.temp) + '°C';
    document.querySelector('.tempWeather .caption').textContent = data.current.weather[0].description;

    const date = new Date(data.current.dt*1000).toDateString();
    document.querySelector('.dateMinMax').textContent = `${date}`;
   
    document.querySelector('.details .sensedTemp').innerHTML = `${Math.round(data.current.feels_like)}°C<p>sensed temp</p>`;
    document.querySelector('.details .humidity').innerHTML = `${Math.round(data.current.humidity)}%<p>humidity</p>`;
    document.querySelector('.details .wind').innerHTML = `${Math.round(data.current.wind_speed * 3600/1000)} km/h<p>wind</p>`;
    document.querySelector('.details .pressure').innerHTML = `${Math.round(data.current.pressure)}hPa<p>atmospheric pressure</p>`;

    setBackground(data.current.weather[0].main);

    //hourly

    console.log(data);
    for(let i =0;i<6;i++){
        document.querySelector(`.hourContainer.hrs${i+1} .time`).innerText = new Date(data.hourly[i].dt*1000).getHours() + `:00`;
        document.querySelector(`.hourContainer.hrs${i+1} .icon`).innerHTML =  `<img src="http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}.png">`;
        document.querySelector(`.hourContainer.hrs${i+1} .temp`).innerText =  Math.round(data.hourly[i].temp) + `°C`;
    }


    //daily

    for(let i =0;i<6;i++){
        document.querySelector(`.dayContainer.day${i+1} .day`).innerText = daysInWeek[new Date(data.daily[i].dt*1000).getUTCDay()];
        document.querySelector(`.dayContainer.day${i+1} .icon`).innerHTML =  `<img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png">`;
        document.querySelector(`.dayContainer.day${i+1} .caption`).innerText =  data.daily[i].weather[0].description;
        document.querySelector(`.dayContainer.day${i+1} .minMax`).innerText =  `${Math.round(data.daily[i].temp.day)}°C / ${Math.round(data.daily[i].temp.eve)}°C`;

    }
}


input.addEventListener('keyup', (e) =>{
    input.classList.remove('err');
    if(e.key === 'Enter'){
        getCoords()
    .then(data => {
        getWeather(data[0].lat, data[0].lon)
                .then(data => {
                displayWeather(data);
    })})
    .catch(err => {
        console.log('rejected:', err.message);
        input.classList.add('err');
    });
    }
 });





input.value = 'wrocław'
    getCoords()
    .then(data => {
        getWeather(data[0].lat, data[0].lon)
                .then(data => {
                displayWeather(data);
  
    })})
    .catch(err => console.log('rejected:', err.message));
