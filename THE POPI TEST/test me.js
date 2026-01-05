const rain = document.getElementById("gummyRain");

const modeColors = {
default: ["green"]
};

const mode = document.body.dataset.mode || "default";
const colors = modeColors[mode] || modeColors.default;


function createGummy() {
  const g = document.createElement("div");
  g.classList.add("gummy");

  const color = colors[Math.floor(Math.random() * colors.length)];
  g.classList.add(color);

  const size = 50 + Math.random() * 60;
  g.style.width = size + "px";
  g.style.height = size * 1.4 + "px";
  g.style.left = Math.random() * 100 + "vw";

  const fallTime = 7 + Math.random() * 6;
  g.style.animationDuration = `${fallTime}s, ${1.6 + Math.random()}s`;

  rain.appendChild(g);
  setTimeout(() => g.remove(), fallTime * 1000);
}

setInterval(createGummy, 450);

const popi = document.querySelector(".popi-area");
const terms = document.querySelector(".terms-box");

popi.addEventListener("click", () => {
  terms.classList.toggle("show");
});

const menu = document.getElementById("stageMenu");
const startBtn = document.getElementById("startBtn");
const closeBtn = document.getElementById("closeBtn");

let selectedMode = "";

document.querySelectorAll(".gummy-btn[data-mode]").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedMode = btn.dataset.mode;
    menu.classList.add("show");
  });
});


startBtn.addEventListener("click", () => {
  const stage = document.getElementById("stageSelect").value;
  location.href = `test que.html?mode=${selectedMode}&stage=${stage}`;
});

closeBtn.addEventListener("click", () => {
  menu.classList.remove("show");
});