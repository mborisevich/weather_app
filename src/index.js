/* eslint-disable no-unused-vars */
import * as css from "./style.css";
import {getDay, toDate, format} from 'date-fns'
import clock from "./clock.svg";
import weatherimage from "./weather-cloudy.svg";
import thermometer from "./thermometer.svg";
import uvimage from "./sun-wireless.svg"
import rainy from "./weather-rainy.svg"
import sunny from "./weather-sunny.svg"
import suncloud from "./weather-partly-cloudy.svg"
const cityInput = document.querySelector("#location")
const unitInput = document.querySelector("#units")
const searchButton = document.querySelector("button")
searchButton.addEventListener("click", (event) => {
  event.preventDefault()
  findWeather(cityInput.value.toLowerCase(), unitInput.value.toLowerCase())
})
class WeatherObj{
  constructor(time, icon, temp, uv, conditions, timezone="", tzoffset=""){
    this.time = time,
    this.icon = icon,
    this.temp = temp,
    this.uv = uv,
    this.conditions = conditions
    this.timezone = timezone
    this.tzoffset = tzoffset
  }
}

async function findWeather(location, units){
  loadingWeatherDOM();
  const responseJSON = await callWeatherAPI(location, units)
  const weatherData = createWeatherData(responseJSON)
  displayWeather(weatherData.weatherObj, weatherData.allDays, units)
}
async function callWeatherAPI(location, units){
  let fetching = true
  while (fetching){
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${units}&key=YPJJJQHDLQL34VNTEWTWZLJA8&contentType=json`)
    const responseJSON = await response.json()
    console.log(responseJSON)
    return responseJSON
  }
 
}
function loadingWeatherDOM(){
  clearDOM()
  const container = document.querySelector(".container")
  const loadElement = document.createElement("p")
  loadElement.textContent = "Loading weather!"
  container.appendChild(loadElement)
}

function clearDOM(){
  const container = document.querySelector(".container")
  while (container.hasChildNodes()){
  container.firstChild.remove()
  }
}
async function displayWeather(weather, forecast, units){
  clearDOM()
  const container = document.querySelector(".container")
  container.classList.add("open")
  const currentWeather = document.createElement("div")
  const timeDiv = document.createElement("div")
  const tempDiv = document.createElement("div")
  const conditionDiv = document.createElement("div")
  const uvDiv = document.createElement("div")
  const timeImg = document.createElement("img")
  const tempImg = document.createElement("img")
  const conditionImg = document.createElement("img")
  const uvImg = document.createElement("img")
  const timeTitle = document.createElement("p")
  const tempTitle = document.createElement("p")
  const conditionTitle =  document.createElement("p")
  const uvTitle = document.createElement("p")
  const weatherInfo = document.createElement("div")
  const timeElement = document.createElement("p")
  const iconElement = document.createElement("p")
  const tempElement = document.createElement("p")
  const uvElement = document.createElement("p")
  const weatherImg = document.createElement("img")
  const forecastDiv = document.createElement("div")
  forecastDiv.classList.add("forecast")
  container.appendChild(currentWeather)
  container.appendChild(forecastDiv)

  timeImg.src = clock;
  tempImg.src = thermometer;
  conditionImg.src = weatherimage
  uvImg.src = uvimage;
  timeDiv.classList.add("info-item")
  tempDiv.classList.add("info-item")
  conditionDiv.classList.add("info-item")
  uvDiv.classList.add("info-item")
  timeElement.classList.add("value")
  iconElement.classList.add("value")
  tempElement.classList.add("value")
  uvElement.classList.add("value")
  weatherImg.classList.add("giphy")
  weatherInfo.classList.add("weather-info")
  timeElement.classList.add("time")
  timeElement.textContent = "Time: " + weather.time + ` ${weather.timezone}  ${parseInt(weather.tzoffset) > 0 ? "GMT +" : "GMT"}${weather.tzoffset}`
  iconElement.textContent = weather.conditions
  tempElement.textContent = "Temperature: " + weather.temp + `${units == "metric" ? " °C" : " °F"}`
  uvElement.textContent = "UV Index: " + weather.uv
  const gifUrl = await callGiphyAPI(weather.icon)
  weatherImg.src = gifUrl
  timeDiv.appendChild(timeImg)
  timeDiv.appendChild(timeTitle)
  timeDiv.appendChild(timeElement)
  tempDiv.appendChild(tempImg)
  tempDiv.appendChild(tempTitle)
  tempDiv.appendChild(tempElement)
  conditionDiv.appendChild(conditionImg)
  conditionDiv.appendChild(conditionTitle)
  conditionDiv.appendChild(iconElement)
  uvDiv.appendChild(uvImg)
  uvDiv.appendChild(uvTitle)
  uvDiv.appendChild(uvElement)
  currentWeather.appendChild(weatherImg)
  currentWeather.appendChild(timeDiv)
  currentWeather.appendChild(conditionDiv)
  currentWeather.appendChild(tempDiv)
  currentWeather.appendChild(uvDiv)

  console.log(forecast)
  for (let i = 0; i < 7; i++){
    const dayDiv = document.createElement("div")
    const dayName = document.createElement("p")
    const dayDate = document.createElement("p")
    const forecastImg = document.createElement("img")
    const forecastCondition = document.createElement("p")
    dayDiv.classList.add("day")
    forecastDiv.classList.add("forecast-item")
    dayDate.classList.add("date")
    forecastCondition.textContent = forecast[i].conditions
    dayDate.textContent = format(toDate(forecast[i].time), 'MMMM do')
    let dayValue = format((toDate(forecast[i].time)), 'eeee')
    dayName.textContent = dayValue
    weatherIcon(forecast[i].conditions, forecastImg)
    dayDiv.appendChild(dayName)
    dayDiv.appendChild(dayDate);
    forecastDiv.appendChild(dayDiv);
    forecastDiv.appendChild(forecastImg);
    forecastDiv.appendChild(forecastCondition);
}
}
function weatherIcon(condition, image){
  if (condition.toLowerCase().includes("sunny")){
    image.src = sunny
  } else if (condition.toLowerCase().includes("rainy") || condition.toLowerCase().includes("rain")){
    image.src = rainy
  } else if (condition.toLowerCase().includes("cloudy")){
    image.src = suncloud
  } else if (condition.toLowerCase().includes("overcast")){
    image.src = weatherimage
  } else if (condition.toLowerCase().includes("clear")){
    image.src = sunny
  } else {
    image.src = weatherimage
  }
}
async function callGiphyAPI(weatherTitle){
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?s=${weatherTitle}&api_key=vKShR0pT8g495XNIOTYXN0N7PHtEemPA`, {mode: 'cors'})
    const responseJSON = await response.json()
    console.log(responseJSON)
    console.log(responseJSON.data.url)
   return responseJSON.data.images.original.url
  } catch (err){
    console.log("Error!!")
  }
  
}

function createWeatherData(data){
  const weatherObj = new WeatherObj(data.currentConditions.datetime, 
    data.currentConditions.icon, data.currentConditions.temp, 
    data.currentConditions.uvindex, data.currentConditions.conditions, data.timezone, data.tzoffset);
  const allDays = []
  data.days.forEach((index) => {
    let date = toDate(index.datetime)
    let weather = new WeatherObj(date, 
      index.icon, index.temp, 
      index.uvindex, index.conditions)
      allDays.push(weather)
  })
    return {weatherObj, allDays}
}