let audioStarted = false;

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
      { label: "Ja", next: 3 },
      { label: "Nein", next: "popupGame" }
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

function typeText(text, element) {
  element.textContent = "";
  let i = 0;

  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 35);
}

function renderStep(index) {
  const step = dialog[index];
  buttonsEl.innerHTML = "";

  typeText(step.text, dialogEl);

  step.buttons.forEach(btn => {
    const button = document.createElement("button");
    button.textContent = btn.label;

    button.onclick = () => {

      // 🔊 AUDIO – nur beim ersten Klick
      if (!audioStarted) {
        audioStarted = true;

        vinylStart.currentTime = 0;
        vinylStart.play().catch(() => {});

        setTimeout(() => {
          music.currentTime = 0;
          music.play().catch(() => {});
        }, 700);
      }

      // 😈 Popup-Game
      if (btn.next === "popupGame") {
        startPopupGame();
        return;
      }

      // 👉 letzter Dialog
      if (btn.next === null) {
        return;
      }

      // 👉 normal weiter
      renderStep(btn.next);
    };

    buttonsEl.appendChild(button);
  });
}

// 😈 MINI-GAME: Popups wegklicken
function startPopupGame() {
  let remaining = 5;

  for (let i = 0; i < 5; i++) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = "Okay… dann klick mich weg 😅";

    popup.style.left = Math.random() * 70 + "vw";
    popup.style.top = Math.random() * 70 + "vh";

    const close = document.createElement("button");
    close.textContent = "✖";

    close.onclick = () => {
      popup.remove();
      remaining--;

      if (remaining === 0) {
        renderStep(5);
      }
    };

    popup.appendChild(close);
    document.body.appendChild(popup);
  }
}

// 🚀 Start
renderStep(0);
