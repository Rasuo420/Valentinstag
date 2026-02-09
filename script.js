let audioStarted = false;
let questStep = 0;
let questIntroText = "";
let typeInterval = null;

/* =====================
   AUDIO
===================== */
const vinylStart = document.getElementById("vinylStart");
const music      = document.getElementById("bgMusic");
const vinylStop  = document.getElementById("vinylStop");

vinylStart.volume = 0.8;
music.volume      = 0.35;
vinylStop.volume  = 0.8;

/* =====================
   DIALOG DATA
===================== */

const dialog = [
   
  {
    text: "Hey du… ja genau du 👀",
    buttons: [{ label: "Okay?", next: 1 }]
  },
  {
    text: "Wie ich sehe, hat der QR-Code funktioniert 😏",
    buttons: [{ label: "Sehr gut!", next: 2 }]
  },
  {
    text: "Ich wette, du fragst dich, was hier gerade passiert.",
    buttons: [
      { label: "Ja", next: "miniQuestSoft" },
      { label: "Nein", next: "miniQuestTease" }
    ]
  },
  {
    text: "Verständlich. Bleib kurz bei mir 🖤",
    buttons: [{ label: "Okay", next: 5 }]
  },
  {
    text: "Mutig. Dann schauen wir mal 😌",
    buttons: [{ label: "Weiter", next: 5 }]
  },
  {
    text: "Gut. Dann lass uns anfangen.",
    buttons: [{ label: "Ich bin bereit ❤️", next: "gift" }]
  }
];

const dialogEl  = document.getElementById("dialog");
const buttonsEl = document.getElementById("buttons");

/* =====================
   TYPEWRITER (SAFE)
===================== */
function typeText(text, element) {
  if (typeInterval) clearInterval(typeInterval);

  element.textContent = "";
  let i = 0;

  typeInterval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(typeInterval);
      typeInterval = null;
    }
  }, 35);
}

/* =====================
   DIALOG FLOW
===================== */
function renderStep(index) {
  const step = dialog[index];
  buttonsEl.innerHTML = "";
  typeText(step.text, dialogEl);

  step.buttons.forEach(btn => {
    const button = document.createElement("button");
    button.textContent = btn.label;

    button.onclick = () => {

      /* 🔊 start audio once */
      if (!audioStarted) {
        audioStarted = true;
        vinylStart.currentTime = 0;
        vinylStart.play().catch(() => {});
        setTimeout(() => {
          music.currentTime = 0;
          music.play().catch(() => {});
        }, 700);
      }

      if (btn.next === "miniQuestSoft") return startMiniQuest("soft");
      if (btn.next === "miniQuestTease") return startMiniQuest("tease");
      if (btn.next === "gift") return startGift();

      renderStep(btn.next);
    };

    buttonsEl.appendChild(button);
  });
}

/* =====================
   MINI QUEST FLOW
===================== */
function startMiniQuest(mode) {
  questStep = 0;
  questIntroText =
    mode === "soft"
      ? "Dachte ich mir 😌 Dann spiel kurz mit mir."
      : "Ach ja? 😏 Dann lass uns das kurz testen.";
  showQuestStep();
}

function showQuestStep() {
  clearQuest();
  if (questStep === 0) showClosePopup();
  if (questStep === 1) showCaptcha();
  if (questStep === 2) showEscapeQuestion();
  if (questStep === 3) showActorScreen();
}

function clearQuest() {
  document.querySelectorAll(".quest").forEach(e => e.remove());
}

/* =====================
   QUEST STEPS
===================== */
function showClosePopup() {
  const box = document.createElement("div");
  box.className = "quest";
  box.innerHTML = `
    <p>${questIntroText}</p>
    <button>Okay 😌</button>
  `;
  box.querySelector("button").onclick = () => {
    questStep++;
    showQuestStep();
  };
  document.body.appendChild(box);
}

function showCaptcha() {
  const items = [
    "volvo.png","carlos.jpeg","pablo.jpeg",
    "gitarre.avif","rockamring.jfif",
    "felina.jpeg","aquarius.jpg","charlie.jfif"
  ];

  const selected = new Set();
  const box = document.createElement("div");
  box.className = "quest captcha";
  box.innerHTML = "<p>Wähle alles aus, was du magst 😌</p>";

  const grid = document.createElement("div");
  grid.className = "captcha-grid";

  items.forEach(img => {
    const card = document.createElement("div");
    card.className = "captcha-card";
    card.innerHTML = `<img src="${img}">`;

    card.onclick = () => {
      if (card.classList.contains("active")) return;
      card.classList.add("active");
      selected.add(img);

      if (selected.size === items.length) {
        questStep++;
        showQuestStep();
      }
    };

    grid.appendChild(card);
  });

  box.appendChild(grid);
  document.body.appendChild(box);
}

function showEscapeQuestion() {
  const box = document.createElement("div");
  box.className = "quest";
  box.innerHTML = `
    <p>In welchem Escape Room waren wir gemeinsam?</p>
    <button id="wrong">Da Vinci</button>
    <button id="right">Atlantis</button>
    <p id="hint"></p>
  `;

  box.querySelector("#wrong").onclick = () => {
    box.querySelector("#hint").textContent = "Hmm… fast 😌";
  };

  box.querySelector("#right").onclick = () => {
    questStep++;
    showQuestStep();
  };

  document.body.appendChild(box);
}

function showActorScreen() {
  const box = document.createElement("div");
  box.className = "quest";
  box.innerHTML = `
    <img src="ich.jpeg">
    <p>Oh wups 👀</p>
    <button>Weiter ❤️</button>
  `;
  box.querySelector("button").onclick = () => {
    clearQuest();
    renderStep(5);
  };
  document.body.appendChild(box);
}

/* =====================
   GIFT + VINYL STOP
===================== */
function startGift() {
  /* 🔥 alles töten */
  if (typeInterval) {
    clearInterval(typeInterval);
    typeInterval = null;
  }

  const game = document.getElementById("game");
  if (game) game.remove();

  const box = document.createElement("div");
  box.className = "gift";

  let clicks = 0;

  const gift = document.createElement("div");
  gift.className = "gift-box";
  gift.textContent = "🎁";

  const hint = document.createElement("p");
  hint.textContent = "Mach es auf ❤️";

  gift.onclick = () => {
    clicks++;
    gift.classList.add("shake");

    if (clicks >= 5) {
      //music.pause();
      //vinylStop.currentTime = 0;
      //vinylStop.play().catch(() => {});
      showFinalScreen();
    }
  };

  box.appendChild(gift);
  box.appendChild(hint);
  document.body.appendChild(box);
}

/* =====================
   FINAL + RAIN
===================== */
let rainInterval = null;

function showFinalScreen() {
  document.body.innerHTML = `
    <div class="final">
      <h1 class="pulse">Happy Valentinstag ❤️</h1>
      <p>Ich bin sehr froh, dass es dich gibt.</p>
    </div>
  `;

  startValentineRain();
}

function startValentineRain() {
  if (rainInterval) clearInterval(rainInterval);

  rainInterval = setInterval(createFallingItem, 280);
}

function createFallingItem() {
  const item = document.createElement("div");
  item.className = "fall";

  const isHeart = Math.random() > 0.5;
  item.textContent = isHeart ? "❤️" : "🌸";

  item.style.left = Math.random() * 100 + "vw";
  item.style.animationDuration = 3 + Math.random() * 6 + "s";
  item.style.fontSize = 18 + Math.random() * 22 + "px";
  item.style.opacity = 0.6 + Math.random() * 0.4;

  document.body.appendChild(item);
  item.addEventListener("animationend", () => item.remove());
}

/* =====================
   START
===================== */
renderStep(0);
