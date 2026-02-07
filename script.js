let audioStarted = false;
let questStep = 0;
let questIntroText = "";

const vinylStart = document.getElementById("vinylStart");
const vinylStop  = document.getElementById("vinylStop");
const music      = document.getElementById("bgMusic");

vinylStart.volume = 0.8;
vinylStop.volume  = 0.8;
music.volume      = 0.35;

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

const dialogEl = document.getElementById("dialog");
const buttonsEl = document.getElementById("buttons");

/* =====================
   TYPEWRITER
===================== */
function typeText(text, element) {
  element.textContent = "";
  let i = 0;

  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
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
      // 🔊 Musikstart beim ersten Klick
      if (!audioStarted) {
        audioStarted = true;
        vinylStart.currentTime = 0;
        vinylStart.play().catch(() => {});
        setTimeout(() => {
          music.currentTime = 0;
          music.play().catch(() => {});
        }, 700);
      }

      if (btn.next === "miniQuestSoft") {
        startMiniQuest("soft");
        return;
      }

      if (btn.next === "miniQuestTease") {
        startMiniQuest("tease");
        return;
      }

      if (btn.next === "gift") {
        startGift();
        return;
      }

      renderStep(btn.next);
    };

    buttonsEl.appendChild(button);
  });
}

/* =====================
   MINI QUEST
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

function showClosePopup() {
  const box = document.createElement("div");
  box.className = "quest";
  box.innerHTML = `<p>${questIntroText}</p><button>Okay 😌</button>`;
  box.querySelector("button").onclick = () => {
    questStep++;
    showQuestStep();
  };
  document.body.appendChild(box);
}

function showCaptcha() {
  const items = [
    { img: "volvo.png" },
    { img: "carlos.jpeg" },
    { img: "pablo.jpeg" },
    { img: "gitarre.avif" },
    { img: "rockamring.jfif" },
    { img: "felina.jpeg" },
    { img: "aquarius.jpg" },
    { img: "ich.jpeg" }
  ];

  let selected = new Set();
  const box = document.createElement("div");
  box.className = "quest captcha";
  box.innerHTML = "<p>Wähle alles aus, was du magst 😌</p>";

  const grid = document.createElement("div");
  grid.className = "captcha-grid";

  items.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "captcha-card";
    const img = document.createElement("img");
    img.src = item.img;
    card.appendChild(img);

    card.onclick = () => {
      card.classList.add("active");
      selected.add(i);
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
    <img src="charlie.jfif">
    <p>Bonusfrage abgeschlossen 😏</p>
    <button>Weiter</button>
  `;
  box.querySelector("button").onclick = () => {
    clearQuest();
    renderStep(5);
  };
  document.body.appendChild(box);
}

/* =====================
   GIFT + FAKE END
===================== */
function startGift() {
  dialogEl.textContent = "Okay… dann ist es Zeit 😌";
  buttonsEl.innerHTML = "";

  const box = document.createElement("div");
  box.className = "gift";

  let clicks = 0;
  const gift = document.createElement("div");
  gift.className = "gift-box";
  gift.textContent = "🎁";

  gift.onclick = () => {
    clicks++;
    gift.classList.add("shake");
    if (clicks >= 5) showFakeEnd();
  };

  box.appendChild(gift);
  document.body.appendChild(box);
}

function showFakeEnd() {
  vinylStop.currentTime = 0;
  vinylStop.play().catch(() => {});

  document.body.innerHTML = `<div class="blackout"></div>`;

  setTimeout(() => {
    music.currentTime = 0;
    music.play().catch(() => {});
    showValentineScreen();
  }, 700);
}

/* =====================
   FINAL SCREEN + RAIN
===================== */
let rainInterval;

function showValentineScreen() {
  document.body.innerHTML = `
    <div class="valentine">
      <h1>Happy Valentinstag ❤️</h1>
      <p>Ich bin sehr froh, dass es dich gibt.</p>
    </div>
  `;
  startRain();
}

function startRain() {
  rainInterval = setInterval(() => {
    const el = document.createElement("div");
    el.className = Math.random() > 0.5 ? "heart" : "flower";
    el.textContent = el.className === "heart" ? "❤️" : "🌸";
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = 4 + Math.random() * 3 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }, 300);
}

/* =====================
   START
===================== */
renderStep(0);
