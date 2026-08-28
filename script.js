const scene = document.querySelector(".scene");
const message = document.querySelector(".message");
const karenSpeech = document.querySelector(".speech");
const game = document.querySelector(".game");
const startKarenButton = document.querySelector("[data-start-character='KAREN']");
const startCharacterButtons = document.querySelectorAll("[data-start-character]");
const returnMenuButton = document.querySelector("[data-return-menu]");
const characterPanels = document.querySelectorAll("[data-character-panel]");
const animalTabs = document.querySelectorAll("[data-animal-tab]");
const animalActions = document.querySelectorAll("[data-animal-actions]");
const razolterActionButton = document.querySelector("[data-razolter-action]");
const razolterActions = document.querySelector("[data-razolter-actions]");
const razolterMoveButtons = document.querySelectorAll("[data-razolter-move]");
const razolterSpeech = document.querySelector("[data-razolter-speech]");
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
let razolterActionTimer = 0;
let money = 0;
let currentCharacter = "KAREN";
let karenMoodTick = 0;
const characterMoods = {
  KAREN: 100,
  RAZOLTER: 100
};
const characterInventories = {
  KAREN: [],
  RAZOLTER: ["светлое", "темное", "стаут", "шмаут"]
};
const moodItems = ["светлое", "темное", "стаут", "шмаут"];
let nextDrinkIndex = 0;

const catMessages = {
  sit: "Кошка сидит и смотрит на Karen.",
  lie: "Кошка растянулась на траве.",
  jump: "Кошка делает бодрый прыжок.",
  stand: "Кошка стоит наготове.",
  left: "Кошка идет влево.",
  right: "Кошка идет вправо."
};

function setCharacter(character) {
  currentCharacter = character;
  document.body.dataset.character = character;

  characterPanels.forEach((panel) => {
    const isActive = panel.dataset.characterPanel === character;
    panel.hidden = !isActive;
  });

  closeAnimalActions();
  closeRazolterActions();
  scene.dataset.riding = "false";
  scene.dataset.speaking = "false";
  clearHorseDialogue();

  if (character === "RAZOLTER") {
    message.textContent = "Razolter стоит в комнате.";
  } else {
    message.textContent = catMessages.sit;
  }

  renderInventory();
  renderMood();
}

function startGame(character) {
  document.body.dataset.screen = "game";
  game.setAttribute("aria-hidden", "false");
  setCharacter(character);

  if (character === "RAZOLTER") {
    document.querySelector("[data-razolter-action]").focus();
    return;
  }

  document.querySelector("[data-animal-tab='horse']").focus();
}

startCharacterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    startGame(button.dataset.startCharacter);
  });
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

function closeRazolterActions() {
  razolterActions.hidden = true;
  razolterActionButton.classList.remove("is-selected");
  window.clearTimeout(razolterActionTimer);
  delete document.body.dataset.razolterState;
  delete document.body.dataset.privateSpot;
  clearRazolterSpeech();
}

function showRazolterSpeech(text) {
  razolterSpeech.textContent = text;
  document.body.dataset.razolterSpeaking = "true";
}

function clearRazolterSpeech() {
  razolterSpeech.textContent = "";
  delete document.body.dataset.razolterSpeaking;
}

function playRazolterAction(action, duration = 2200, onComplete) {
  window.clearTimeout(razolterActionTimer);
  document.body.dataset.razolterState = action;
  delete document.body.dataset.privateSpot;
  razolterActionTimer = window.setTimeout(() => {
    delete document.body.dataset.razolterState;
    clearRazolterSpeech();
    onComplete?.();
  }, duration);
}

function addRazolterDrink() {
  const drink = moodItems[nextDrinkIndex];
  nextDrinkIndex = (nextDrinkIndex + 1) % moodItems.length;
  characterInventories.RAZOLTER.push(drink);
  renderInventory();
  setOpenPanel("inventory");
  message.textContent = `Razolter достал ${drink}.`;
  playRazolterAction("beer", 2400);
}

function renderInventory() {
  const inventory = characterInventories[currentCharacter];
  inventoryList.innerHTML = "";

  if (inventory.length === 0) {
    const emptyNote = document.createElement("p");
    emptyNote.className = "empty-note";
    emptyNote.textContent = "Пока пусто";
    inventoryList.append(emptyNote);
    return;
  }

  inventory.forEach((item, index) => {
    const isMoodItem = moodItems.includes(item);
    const inventoryItem = document.createElement(isMoodItem ? "button" : "div");
    inventoryItem.className = "inventory-item";
    inventoryItem.textContent = item;

    if (isMoodItem) {
      inventoryItem.type = "button";
      inventoryItem.addEventListener("click", () => {
        inventory.splice(index, 1);
        changeMood(5);
        renderInventory();
        message.textContent = `${item} использовано. Настроение +5%.`;
      });
    }

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
  const mood = characterMoods[currentCharacter];
  moodFace.textContent = getMoodFace(mood);
  moodPercent.textContent = `${mood}%`;
  moodFace.parentElement.setAttribute("aria-label", `Настроение ${mood}%`);
}

function changeMood(amount) {
  characterMoods[currentCharacter] = Math.max(0, Math.min(100, characterMoods[currentCharacter] + amount));
  renderMood();
}

function decreaseMood() {
  changeMood(-1);
}

function tickMood() {
  if (document.body.dataset.screen !== "game") {
    return;
  }

  if (currentCharacter === "RAZOLTER") {
    decreaseMood();
    return;
  }

  karenMoodTick += 5;

  if (karenMoodTick >= 60) {
    karenMoodTick = 0;
    decreaseMood();
  }
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
    characterInventories[currentCharacter].push(item.dataset.buyItem);
    renderMoney();
    renderInventory();
    setOpenPanel("inventory");
    message.textContent = `${item.dataset.buyItem} добавлено в инвентарь.`;
  });
});

renderMoney();
renderInventory();
renderMood();
window.setInterval(tickMood, 5000);

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

const razolterMessages = {
  pushup: "Razolter отжался и почувствовал себя бодрее.",
  sleep: "Razolter лег спать.",
  fridge: "Razolter подошел к холодильнику.",
  sing: "Razolter поет песню.",
  dance: "Razolter танцует.",
  eyes: "Razolter открыл глаза.",
  private: "Razolter уединился."
};

const razolterActionDurations = {
  pushup: 3200,
  sleep: 6200,
  fridge: 2400,
  sing: 3200,
  dance: 3200,
  eyes: 4000,
  private: 7600
};

const razolterActionSpeech = {
  pushup: "я стану сильный, похудею и девки мне покажут сиси",
  sleep: "я высплюсь, и новый день это новая бутылочка пивка"
};

razolterActionButton.addEventListener("click", () => {
  const isOpen = razolterActions.hidden;
  razolterActions.hidden = !isOpen;
  razolterActionButton.classList.toggle("is-selected", isOpen);
});

razolterMoveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.razolterMove;

    if (action === "beer") {
      addRazolterDrink();
      return;
    }

    playRazolterAction(action, razolterActionDurations[action], () => {
      if (action === "private") {
        document.body.dataset.privateSpot = "true";
      }
    });
    if (razolterActionSpeech[action]) {
      showRazolterSpeech(razolterActionSpeech[action]);
    }
    message.textContent = razolterMessages[action];
  });
});
