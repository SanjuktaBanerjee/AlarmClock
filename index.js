const currentTime = document.querySelector("#display-current-time");
const hours = document.querySelector("#hour");
const minutes = document.querySelector("#min");
const seconds = document.querySelector("#sec");
const amPm = document.querySelector("#ampm");
const btnAlarm = document.querySelector("#btn-set-alarm");
const btnStopAlarm = document.querySelector("#stopAlarm");
const alarmContainer = document.querySelector("#container-list-new-alarms");
const alarmSound = document.querySelector("#alarmSound");

// Track active alarms
let activeAlarms = [];

// Initialize the clock and alarms
window.addEventListener("DOMContentLoaded", () => {
  // Start the clock
  updateClock();
  setInterval(updateClock, 1000);
  // Load any saved alarms
  loadAlarms();
});

// Update the clock and check alarms
function updateClock() {
  const time = getCurrentTime();
  currentTime.textContent = time;
  checkAlarms(time);
}

// Get the current time as a formatted string
function getCurrentTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
}

// Check if the current time matches any active alarms
function checkAlarms(time) {
  activeAlarms.forEach(alarm => {
    if (alarm.time === time) {
      triggerAlarm(alarm.time);
    }
  });
}

// Trigger an alarm
function triggerAlarm(time) {
  alarmSound.play();
  alert("Wake up!!");
  removeAlarm(time);
}

// Add a new alarm
btnAlarm.addEventListener("click", () => {
  const alarmTime = formatTime(hours.value, minutes.value, seconds.value, amPm.value);
  if (activeAlarms.some(alarm => alarm.time === alarmTime)) {
    alert("Alarm already set for this time!");
  } else {
    addAlarm(alarmTime);
  }
});

// Stop the alarm sound
btnStopAlarm.addEventListener("click", () => {
  alarmSound.pause();
});

// Format time for the alarm
function formatTime(hour, minute, second, ampm) {
  return `${hour}:${minute}:${second} ${ampm}`;
}

// Load alarms from local storage
function loadAlarms() {
  const savedAlarms = JSON.parse(localStorage.getItem("alarms")) || [];
  savedAlarms.forEach(addAlarm);
}

// Add an alarm to the DOM and active list
function addAlarm(time, skipSave = false) {
  activeAlarms.push({ time });
  displayAlarm(time);
  if (!skipSave) {
    saveAlarms();
  }
}

// Display the alarm in the DOM
function displayAlarm(time) {
  const divElement = document.createElement("div");
  divElement.classList.add("alarm", "margin-bottom", "display-flex");
  divElement.innerHTML = `
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-time="${time}">Delete</button>
  `;
  const deleteButton = divElement.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", () => removeAlarm(time));
  alarmContainer.prepend(divElement);
}

// Remove an alarm
function removeAlarm(time) {
  activeAlarms = activeAlarms.filter(alarm => alarm.time !== time);
  saveAlarms();
  removeAlarmFromDOM(time);
}

// Remove an alarm from the DOM
function removeAlarmFromDOM(time) {
  const alarmElements = document.querySelectorAll(".alarm .time");
  alarmElements.forEach(alarmElement => {
    if (alarmElement.textContent === time) {
      alarmElement.parentElement.remove();
    }
  });
}

// Save alarms to local storage
function saveAlarms() {
  const alarmTimes = activeAlarms.map(alarm => alarm.time);
  localStorage.setItem("alarms", JSON.stringify(alarmTimes));
}