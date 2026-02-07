let audioStarted = false;

const vinylStart = document.getElementById("vinylStart");
const music = document.getElementById("bgMusic");

vinylStart.volume = 0.8;
music.volume = 0.35;

/* =======================
   DIALOG
======================= */

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
      { label: "Ja", next: 3 },
      { label: "Nein", next: "miniQuest" }
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
    buttons: [{ label: "Ich bin bereit ❤️", next: null }]
  }
];

const dialogEl = document.getElementById("dialog");
const buttonsEl = document.getElementById("buttons");

/* =======================
   TYPEWRITER
======================= */

function typeText(text, element) {
  element.textContent = "";
  let i = 0;

  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 35);
}

/* =======================
   RENDER
======================= */

function renderStep(index) {
  const step = dialog[index];
  buttonsEl.innerHTML = "";

  typeText(step.text, dialogEl);

  step.buttons.forEach(btn => {
    const button = document.createElement("button");
    button.textContent = btn.label;

    button.onclick = () => {

      // 🔊 Audio nur einmal starten
      if (!audioStarted) {
        audioStarted = true;

        vinylStart.currentTime = 0;
        vinylStart.play().catch(() => {});

        setTimeout(() => {
          music.currentTime = 0;
          music.play().catch(() => {});
        }, 700);
      }

      // 😈 Mini Quest starten
      if (btn.next === "miniQuest") {
        questStep = 0;
        showQuestStep();
        return;
      }

      if (btn.next === null) return;

      renderStep(btn.next);
    };

    buttonsEl.appendChild(button);
  });
}

/* =======================
   QUEST FLOW
======================= */

let questStep = 0;

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

/* =======================
   QUEST 1 – POPUP
======================= */

function showClosePopup() {
  const box = document.createElement("div");
  box.className = "quest popup";

  box.innerHTML = `
    <p>ok… dann klick mich weg 😜</p>
    <button>X</button>
  `;

  box.querySelector("button").onclick = () => {
    questStep++;
    showQuestStep();
  };

  document.body.appendChild(box);
}

/* =======================
   QUEST 2 – CAPTCHA
======================= */

function showCaptcha() {
  const items = [
    { name: "Volvos", img: "images/volvo.jpg" },
    { name: "Katzen", img: "images/katzen.jpg" },
    { name: "Gitarren", img: "images/gitarre.jpg" },
    { name: "Rock am Ring", img: "images/rockamring.jpg" },
    { name: "Yoga", img: "images/yoga.jpg" }
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

/* =======================
   QUEST 3 – ESCAPE ROOM
======================= */

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

/* =======================
   QUEST 4 – ACTOR
======================= */

function showActorScreen() {
  const box = document.createElement("div");
  box.className = "quest";

  box.innerHTML = `
    <img src="images/charlie.jpg" alt="Charlie Hunnam">
    <p>Bonusfrage abgeschlossen 😏</p>
    <button>Okay… ich bin bereit</button>
  `;

  box.querySelector("button").onclick = () => {
    clearQuest();
    renderStep(5);
  };

  document.body.appendChild(box);
}

/* =======================
   START
======================= */

renderStep(0);
