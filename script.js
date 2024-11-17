const timer = document.getElementById("timer");
const timerButton = document.getElementById("timerButton");
const resetButton = document.getElementById("resetButton");
const themeButton = document.getElementById("themeButton");
const sidebar = document.getElementById("sidebar");
const sidebarButton = document.getElementById("toggleSidebar");
const customSongEmbed = document.getElementById("customSongEmbed");
const customSong = document.getElementById("customSong");

const timerWorker = new Worker("timer.js");

var hour = 0,
  minute = 0,
  second = 0;

function updateTime() {
  second++;
  if (second >= 60) {
    second = 0;
    minute++;
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }
  timer.innerText = ((hour < 10) ? "0" : "") + hour + ":" + ((minute < 10) ? "0" : "") + minute + ":" + ((second < 10) ? "0" : "") + second;
}

timerWorker.addEventListener("message", async () => {
  updateTime();
});

timerButton.addEventListener("click", () => {
  if (timerButton.getAttribute("running") == "false") {
    resetButton.style.display = "inline";
    timerButton.setAttribute("running", "true");
    timerWorker.postMessage("start");
    timerButton.innerText = "stop";
  } else {
    timerButton.setAttribute("running", "false");
    timerWorker.postMessage("stop");
    timerButton.innerText = "start";
  }
});

resetButton.addEventListener("click", () => {
  timerButton.setAttribute("running", "false");
  timerWorker.postMessage("stop");
  timerButton.innerText = "start";
  hour = 0;
  minute = 0;
  second = 0;
  timer.innerText = "00:00:00";
  resetButton.style.display = "none";
});

sidebarButton.addEventListener("click", () => {
  if (sidebarButton.getAttribute("open") == "false") {
    sidebarButton.setAttribute("open", "true");
    sidebar.style.transform = "translateX(-100%)";
  } else {
    sidebarButton.setAttribute("open", "false");
    sidebar.style.transform = "translateX(0)";
  }
});

themeButton.addEventListener("click", () => {
  switch(themeButton.getAttribute("state")) {
    case "light":
      themeButton.setAttribute("state", "dark");
      document.documentElement.style.setProperty("--bg", "#0f0f0f");
      document.documentElement.style.setProperty("--main", "#dedede");
      themeButton.innerText = "🌑";
      break;
    case "dark":
      themeButton.setAttribute("state", "sepia");
      document.documentElement.style.setProperty("--bg", "#f9ebdc");
      document.documentElement.style.setProperty("--main", "#5f5954");
      themeButton.innerText = "💡";
      break;
    case "sepia":
      themeButton.setAttribute("state", "light");
      document.documentElement.style.setProperty("--bg", "whitesmoke");
      document.documentElement.style.setProperty("--main", "black");
      themeButton.innerText = "☀️";
      break;
    default:
      themeButton.setAttribute("state", "light");
      document.documentElement.style.setProperty("--bg", "whitesmoke");
      document.documentElement.style.setProperty("--main", "black");
      themeButton.innerText = "☀️";
      break;
  }
});

customSong.addEventListener("blur", () => {
  let rawInput = customSong.innerText;
  rawInput = rawInput.replace(/.*watch\?v=/g,"").replace(/&.*/g,"").replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"").trim() // really simple data extraction, might be unsafe
  customSongEmbed.src = `https://www.youtube.com/embed/${rawInput}?disablekb=1`;
});

window.addEventListener('focus', function() {
  document.body.classList.remove('blur');
});

window.addEventListener('blur', function() {
  document.body.classList.add('blur');
});