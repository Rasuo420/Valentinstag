let audioStarted = false;
let questStep = 0;
let questIntroText = "";

const vinylStart = document.getElementById("vinylStart");
const music = document.getElementById("bgMusic");

vinylStart.volume = 0.8;
music.volume = 0.35;

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
   DIALOG
===================== */
function renderStep(index) {
  const step = dialog[index];
  buttonsEl.innerHTML = "";

  typeText(step.text, dialogEl);

  step.buttons.forEach(btn => {
    const button = document.createElement("button");
    button.textContent = btn.label;

    button.onclick = () => {

      // 🔊 Audio nur beim ersten Klick
      if (!audioStarted) {
        audioStarted = true;
        vinylStart.currentTime = 0;
        vinylStart.play().catch(() => {});
        setTimeout(() => {
          music.currentTime = 0;
          music.play().catch(() => {});
        }, 700);
      }

      // 😈 MINI QUEST
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
    { name: "Volvos", img: "volvo.png" },
    { name: "Katzen1", img: "carlos.jpeg" },
    { name: "Katzen2", img: "pablo.jpeg" },
    { name: "Gitarren", img: "gitarre.avif" },
    { name: "Rock am Ring", img: "rockamring.jfif" },
    { name: "Felina", img: "felina.jpeg"},
    { name: "Aquarius", img: "aquarius.jpg"},
    { name: "Ich", img: "ich.jpeg" }
  ];

  let selected = new Set();

  const box = document.createElement("div");
  box.className = "quest captcha";

  box.innerHTML = `<p>Wähle alles aus, was du magst 😌</p>`;

  const grid = document.createElement("div");
  grid.className = "captcha-grid";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "captcha-card";

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;

    card.appendChild(img);

    card.onclick = () => {
      card.classList.add("active");
      selected.add(item.name);

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
    <img src="charlie.jfif" alt="Charlie Hunnam">
    <p>Bonusfrage abgeschlossen 😏</p>
    <button>Okay… ich bin bereit</button>
  `;

  box.querySelector("button").onclick = () => {
    clearQuest();
    renderStep(5);
  };

  document.body.appendChild(box);
}
function startGift() {
  buttonsEl.innerHTML = "";
  dialogEl.textContent = "Okay… dann ist es Zeit 😌";

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
      showFinalScreen();
    }
  };

  box.appendChild(gift);
  box.appendChild(hint);
  document.body.appendChild(box);
}
function showFinalScreen() {
  document.body.innerHTML = `
    <div class="final">
      <h1>Happy Valentinstag ❤️</h1>
      <p>Ich bin sehr froh, dass es dich gibt.</p>
      <div class="hearts">💐💖🌸💖💐</div>
    </div>
  `;
}
/* =====================
   START
===================== */
renderStep(0);
