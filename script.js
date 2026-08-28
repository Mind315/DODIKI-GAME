const scene = document.querySelector(".scene");
const message = document.querySelector(".message");
const karenSpeech = document.querySelector(".speech");
const catSpeechText = "Я тебя дрессирую кошечка, выполняй команды";
let catX = 0;
let speechTimer = 0;
let horseSpeechTimer = 0;
let horseHideTimer = 0;

const catMessages = {
  sit: "Кошка сидит и смотрит на Karen.",
  lie: "Кошка растянулась на траве.",
  jump: "Кошка делает бодрый прыжок.",
  stand: "Кошка стоит наготове.",
  left: "Кошка идет влево.",
  right: "Кошка идет вправо."
};

function showKarenSpeech(text = catSpeechText, duration = 1800) {
  karenSpeech.textContent = text;
  scene.dataset.speaking = "true";
  window.clearTimeout(speechTimer);
  speechTimer = window.setTimeout(() => {
    scene.dataset.speaking = "false";
  }, duration);
}

function clearHorseDialogue() {
  window.clearTimeout(horseSpeechTimer);
  window.clearTimeout(horseHideTimer);
  scene.dataset.horseSpeaking = "false";
}

function moveCat(direction) {
  const step = 70;
  const nextX = direction === "left" ? catX - step : catX + step;
  catX = Math.max(-420, Math.min(120, nextX));
  scene.style.setProperty("--cat-x", `${catX}px`);
  scene.dataset.catState = "stand";
  message.textContent = catMessages[direction];
  showKarenSpeech();
}

document.querySelector("[data-action='mount']").addEventListener("click", () => {
  scene.dataset.riding = "true";
  message.textContent = "Karen аккуратно села на лошадь.";
  clearHorseDialogue();
  showKarenSpeech("я буду рулить, где руль, пончик", 2000);
  horseSpeechTimer = window.setTimeout(() => {
    scene.dataset.horseSpeaking = "true";
    horseHideTimer = window.setTimeout(() => {
      scene.dataset.horseSpeaking = "false";
    }, 2800);
  }, 2000);
});

document.querySelector("[data-action='dismount']").addEventListener("click", () => {
  scene.dataset.riding = "false";
  message.textContent = "Karen снова стоит рядом с лошадью.";
  clearHorseDialogue();
  scene.dataset.speaking = "false";
  karenSpeech.textContent = catSpeechText;
});

document.querySelectorAll("[data-cat]").forEach((button) => {
  button.addEventListener("click", () => {
    const state = button.dataset.cat;
    showKarenSpeech();

    if (state === "jump") {
      scene.dataset.catState = "jump";
      message.textContent = catMessages.jump;
      window.setTimeout(() => {
        if (scene.dataset.catState === "jump") {
          scene.dataset.catState = "stand";
          message.textContent = catMessages.stand;
        }
      }, 650);
      return;
    }

    scene.dataset.catState = state;
    message.textContent = catMessages[state];
  });
});

document.querySelectorAll("[data-move]").forEach((button) => {
  button.addEventListener("click", () => {
    moveCat(button.dataset.move);
  });
});
