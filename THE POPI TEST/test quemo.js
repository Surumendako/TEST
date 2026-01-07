const params = new URLSearchParams(location.search);

const mode =
  params.get("mode") ||
  localStorage.getItem("POPI_CH_MODE") ||
  "textbook";

let stageNumber = Number(
  params.get("stage") ||
  localStorage.getItem("startStage") ||
  1
);

if (stageNumber < 1) stageNumber = 1;

const stageKey = "stage" + stageNumber;

if (
  !WORD_DATA[mode] ||
  !WORD_DATA[mode][stageKey] ||
  WORD_DATA[mode][stageKey].length === 0
) {
  alert("このステージの問題がありません");
  stageNumber = 1;
}

const questions = [...WORD_DATA[mode][stageKey]];

let currentQuestionIndex = 0;
let currentInput = "";
let incorrectAttempts = 0;

(function shuffle() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
})();

localStorage.setItem("POPI_CH_DATA", JSON.stringify(questions));
localStorage.setItem("POPI_CH_STAGE", stageKey);
localStorage.setItem("POPI_CH_MODE", mode);

function saveWrongWord(word) {
  const key = "POPI_WRONG_WORDS";
  const data = JSON.parse(localStorage.getItem(key) || "[]");

  if (!data.find(w =>
    w.english === word.english &&
    w.stage === stageKey &&
    w.mode === mode
  )) {
    data.push({ ...word, stage: stageKey, mode });
  }

  localStorage.setItem(key, JSON.stringify(data));
}

function showNextQuestion() {
  if (currentQuestionIndex >= questions.length) {
    finishStage();
    return;
  }

  document.getElementById("jpWord").textContent =
    `「${questions[currentQuestionIndex].japanese}」`;

  currentInput = "";
  incorrectAttempts = 0;
  document.getElementById("answer").value = "";

  const reveal = document.getElementById("answerReveal");
  reveal.classList.remove("show");
  reveal.textContent = "";

  updateProgress();
}

function add(char) {
  currentInput += char;
  document.getElementById("answer").value = currentInput;
}

function del() {
  if (!currentInput) return;
  currentInput = currentInput.slice(0, -1);
  document.getElementById("answer").value = currentInput;
}

function clearAll() {
  currentInput = "";
  document.getElementById("answer").value = "";
}

function check() {
  if (!currentInput) return;

  const correct = questions[currentQuestionIndex].english;

  if (currentInput === correct) {
    showJudge("correct");
    setTimeout(() => {
      currentQuestionIndex++;
      showNextQuestion();
    }, 800);
  } else {
    showJudge("wrong");
    incorrectAttempts++;

    if (incorrectAttempts === 1) {
      saveWrongWord(questions[currentQuestionIndex]);
    }

    setTimeout(() => {
      if (incorrectAttempts >= 3) {
        showAnswerText();
        clearAll();
      } else {
        clearAll();
      }
    }, 800);
  }
}

function showAnswerText() {
  const el = document.getElementById("answerReveal");
  el.textContent = questions[currentQuestionIndex].english;
  el.classList.add("show");
}

function showJudge(type) {
  const correct = document.getElementById("correct");
  const wrong = document.getElementById("wrong");

  correct.classList.remove("show");
  wrong.classList.remove("show");

  void correct.offsetWidth;
  void wrong.offsetWidth;

  (type === "correct" ? correct : wrong).classList.add("show");
}

function updateProgress() {
  const percent = (currentQuestionIndex / questions.length) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

function finishStage() {
  document.getElementById("keyboard").style.display = "none";
  document.getElementById("progressBar").style.width = "100%";

  const endArea = document.getElementById("stageEndArea");
  if (endArea) endArea.style.display = "block";
}

function changeStage(nextStageKey) {
  const next = Number(nextStageKey.replace("stage", ""));
  localStorage.setItem("startStage", next);
  location.reload();
}

window.addEventListener("keydown", (e) => {
  if (currentQuestionIndex >= questions.length) return;
  if (e.repeat) return;

  const key = e.key;

  if (key === "Enter") {
    e.preventDefault();
    check();
    return;
  }

  if (key === "Backspace") {
    e.preventDefault();
    del();
    return;
  }

  if (/^[a-z]$/.test(key)) {
    e.preventDefault();
    add(key);
    return;
  }

  if (key === "-") {
    e.preventDefault();
    add("-");
    return;
  }
});

window.addEventListener("load", showNextQuestion);
