const scene = document.querySelector(".scene");
const message = document.querySelector(".message");
const karenSpeech = document.querySelector(".speech");
const game = document.querySelector(".game");
const startKarenButton = document.querySelector("[data-start-character='KAREN']");
const returnMenuButton = document.querySelector("[data-return-menu]");
const animalTabs = document.querySelectorAll("[data-animal-tab]");
const animalActions = document.querySelectorAll("[data-animal-actions]");
const panelButtons = document.querySelectorAll("[data-panel-toggle]");
const slidePanels = document.querySelectorAll("[data-slide-panel]");
const moneyValue = document.querySelector("[data-money]");
const moodFace = document.querySelector("[data-mood-face]");
const moodPercent = document.querySelector("[data-mood-percent]");
const inventoryList = document.querySelector("[data-inventory-list]");
const shopItems = document.querySelectorAll("[data-buy-item]");
const catSpeechText = "Я тебя дрессирую кошечка, выполняй команды";
let catX = 0;
let speechTimer = 0;
let horseSpeechTimer = 0;
let horseHideTimer = 0;
let money = 0;
let mood = 100;
const inventory = [];

const catMessages = {
  sit: "Кошка сидит и смотрит на Karen.",
  lie: "Кошка растянулась на траве.",
  jump: "Кошка делает бодрый прыжок.",
  stand: "Кошка стоит наготове.",
  left: "Кошка идет влево.",
  right: "Кошка идет вправо."
};

startKarenButton.addEventListener("click", () => {
  document.body.dataset.screen = "game";
  game.setAttribute("aria-hidden", "false");
  closeAnimalActions();
  document.querySelector("[data-animal-tab='horse']").focus();
});

returnMenuButton.addEventListener("click", () => {
  document.body.dataset.screen = "menu";
  game.setAttribute("aria-hidden", "true");
  clearHorseDialogue();
  scene.dataset.speaking = "false";
  slidePanels.forEach((panel) => {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  });
  panelButtons.forEach((button) => {
    button.classList.remove("is-selected");
  });
  startKarenButton.focus();
});

animalTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const animal = tab.dataset.animalTab;

    animalTabs.forEach((button) => {
      const isSelected = button === tab;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
    });

    animalActions.forEach((actions) => {
      const isOpen = actions.dataset.animalActions === animal;
      actions.hidden = !isOpen;
      actions.classList.toggle("is-open", isOpen);
    });
  });
});

function closeAnimalActions() {
  animalTabs.forEach((button) => {
    button.classList.remove("is-selected");
    button.setAttribute("aria-selected", "false");
  });

  animalActions.forEach((actions) => {
    actions.hidden = true;
    actions.classList.remove("is-open");
  });
}

function renderInventory() {
  inventoryList.innerHTML = "";

  if (inventory.length === 0) {
    const emptyNote = document.createElement("p");
    emptyNote.className = "empty-note";
    emptyNote.textContent = "Пока пусто";
    inventoryList.append(emptyNote);
    return;
  }

  inventory.forEach((item) => {
    const inventoryItem = document.createElement("div");
    inventoryItem.className = "inventory-item";
    inventoryItem.textContent = item;
    inventoryList.append(inventoryItem);
  });
}

function getMoodFace(value) {
  if (value > 80) {
    return "😄";
  }

  if (value > 60) {
    return "🙂";
  }

  if (value > 40) {
    return "😐";
  }

  if (value > 20) {
    return "😟";
  }

  return "😢";
}

function renderMood() {
  moodFace.textContent = getMoodFace(mood);
  moodPercent.textContent = `${mood}%`;
  moodFace.parentElement.setAttribute("aria-label", `Настроение ${mood}%`);
}

function decreaseMood() {
  mood = Math.max(0, mood - 1);
  renderMood();
}

function renderMoney() {
  moneyValue.textContent = `${money}$`;
  shopItems.forEach((item) => {
    item.disabled = money < Number(item.dataset.price);
  });
}

function setOpenPanel(panelName) {
  const activePanel = [...slidePanels].find((panel) => panel.classList.contains("is-open"));
  const shouldClose = activePanel?.dataset.slidePanel === panelName;

  slidePanels.forEach((panel) => {
    const isOpen = !shouldClose && panel.dataset.slidePanel === panelName;
    panel.classList.toggle("is-open", isOpen);
    panel.setAttribute("aria-hidden", String(!isOpen));
  });

  panelButtons.forEach((button) => {
    button.classList.toggle("is-selected", !shouldClose && button.dataset.panelToggle === panelName);
  });
}

panelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setOpenPanel(button.dataset.panelToggle);
  });
});

shopItems.forEach((item) => {
  item.addEventListener("click", () => {
    const price = Number(item.dataset.price);

    if (money < price) {
      message.textContent = "Недостаточно денег.";
      return;
    }

    money -= price;
    inventory.push(item.dataset.buyItem);
    renderMoney();
    renderInventory();
    setOpenPanel("inventory");
    message.textContent = `${item.dataset.buyItem} добавлено в инвентарь.`;
  });
});

renderMoney();
renderInventory();
renderMood();
window.setInterval(decreaseMood, 60000);

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
