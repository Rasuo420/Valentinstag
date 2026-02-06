const dialog = [
  {
    text: "Hey du… ja genau du 👀",
    buttons: [
      { label: "Okay?", next: 1 }
    ]
  },
  {
    text: "Wie ich sehe, hat der QR-Code funktioniert 😏",
    buttons: [
      { label: "Sehr gut!", next: 2 }
    ]
  },
  {
    text: "Ich wette, du fragst dich, was hier gerade passiert.",
    buttons: [
      { label: "Ja", next: 3 },
      { label: "Nein", next: 4 }
    ]
  },
  {
    text: "Verständlich. Bleib kurz bei mir 🖤",
    buttons: [
      { label: "Okay", next: 5 }
    ]
  },
  {
    text: "Mutig. Dann schauen wir mal 😌",
    buttons: [
      { label: "Weiter", next: 5 }
    ]
  },
  {
    text: "Gut. Dann lass uns anfangen.",
    buttons: [
      { label: "Ich bin bereit ❤️", next: null }
    ]
  }
];


let currentStep = 0;

const dialogEl= document.getElementById("dialog");
const buttonsEl= document.getElementById("buttons");
const music = document.getElementById("bgmusic");

    function renderStep(index) {
  const step = dialog[index];
  dialogEl.textContent = step.text;
  buttonsEl.innerHTML = "";

  step.buttons.forEach(btn => {
    const button = document.createElement("button");
    button.textContent = btn.label;

    button.onclick = () => {
      if (music.paused) {
        music.volume = 0.4;
        music.play().catch(() => {});
      }

      if (btn.next !== null) {
        currentStep = btn.next;
        renderStep(currentStep);
      }
    };

    buttonsEl.appendChild(button);
  });
}

renderStep(currentStep);
