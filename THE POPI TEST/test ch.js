const allWords = JSON.parse(localStorage.getItem("POPI_CH_DATA"));
const stage = localStorage.getItem("POPI_CH_STAGE") || 1;
const mode = localStorage.getItem("POPI_CH_MODE") || "textbook";


const wrongWords = JSON.parse(localStorage.getItem("POPI_WRONG_WORDS")) || [];

if (!allWords) {
  alert("先にステージを開始してください");
  location.href = "../text/test que.html?mode=" + mode + "&stage=" + stage;
}

let showMode = "all"; 
let words = allWords;
let index = 0;


const stageBadge = document.getElementById("stageBadge");
const wordMain = document.getElementById("wordMain");
const wordSub = document.getElementById("wordSub");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const toggleBtn = document.getElementById("toggleBtn");


function render() {
  if (!words.length) {
    wordMain.textContent = "単語がありません";
    wordSub.textContent = "";
    return;
  }
  stageBadge.textContent = `STAGE ${stage}`;
  wordMain.textContent = words[index].english;
  wordSub.textContent = words[index].japanese;
}

render();


prevBtn.onclick = () => {
  if (index > 0) index--;
  render();
};

nextBtn.onclick = () => {
  if (index < words.length - 1) index++;
  render();
};


toggleBtn.onclick = () => {
  if (showMode === "all") {
    showMode = "wrong";
    words = wrongWords;
    toggleBtn.textContent = "全単語を見る";
  } else {
    showMode = "all";
    words = allWords;
    toggleBtn.textContent = "間違えた単語を見る";
  }
  index = 0;
  render();
  
};
