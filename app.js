const signupForm = document.querySelector("#signupForm");
const nameInput = document.querySelector("#nameInput");
const loginPanel = document.querySelector("#loginPanel");
const lovePanel = document.querySelector("#lovePanel");
const helloBadge = document.querySelector("#helloBadge");
const logoutButton = document.querySelector("#logoutButton");
const messageInput = document.querySelector("#messageInput");
const noButton = document.querySelector("#noButton");
const yesButton = document.querySelector("#yesButton");
const answerZone = document.querySelector(".answer-zone");
const celebration = document.querySelector("#celebration");
const escapeDistance = 115;
let lastEscapeAt = 0;

const defaultMessage = "Hi my love. This is a very professional website built for one important purpose: asking you to say yes.";

messageInput.value = localStorage.getItem("love-message") || defaultMessage;

const savedName = localStorage.getItem("visitor-name");
if (savedName) {
  showLovePanel(savedName);
}

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.focus();
    return;
  }

  localStorage.setItem("visitor-name", name);
  showLovePanel(name);
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("visitor-name");
  loginPanel.classList.remove("hidden");
  lovePanel.classList.add("hidden");
  celebration.classList.add("hidden");
  nameInput.focus();
});

messageInput.addEventListener("input", () => {
  localStorage.setItem("love-message", messageInput.value);
});

yesButton.addEventListener("click", () => {
  celebration.classList.remove("hidden");
  yesButton.textContent = "Obviously";
});

noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("pointerdown", moveNoButton);
noButton.addEventListener("focus", moveNoButton);
answerZone.addEventListener("pointermove", runWhenCursorIsClose);

function showLovePanel(name) {
  helloBadge.textContent = `hello, ${name}`;
  loginPanel.classList.add("hidden");
  lovePanel.classList.remove("hidden");
}

function moveNoButton() {
  const areaRect = answerZone.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();
  const padding = 12;

  const maxLeft = Math.max(padding, areaRect.width - buttonRect.width - padding);
  const maxTop = Math.max(padding, areaRect.height - buttonRect.height - padding);
  const yesRect = yesButton.getBoundingClientRect();

  let nextLeft = padding;
  let nextTop = padding;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    nextLeft = randomBetween(padding, maxLeft);
    nextTop = randomBetween(padding, maxTop);

    const candidate = {
      left: areaRect.left + nextLeft,
      right: areaRect.left + nextLeft + buttonRect.width,
      top: areaRect.top + nextTop,
      bottom: areaRect.top + nextTop + buttonRect.height
    };

    if (!rectsOverlap(candidate, yesRect)) {
      break;
    }
  }

  noButton.style.left = `${nextLeft}px`;
  noButton.style.top = `${nextTop}px`;
  noButton.style.transform = `rotate(${randomBetween(-9, 9)}deg)`;
}

function runWhenCursorIsClose(event) {
  const now = Date.now();
  if (now - lastEscapeAt < 170) {
    return;
  }

  const buttonRect = noButton.getBoundingClientRect();
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonCenterY = buttonRect.top + buttonRect.height / 2;
  const cursorDistance = Math.hypot(event.clientX - buttonCenterX, event.clientY - buttonCenterY);

  if (cursorDistance < escapeDistance) {
    lastEscapeAt = now;
    moveNoButton();
  }
}

function randomBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}
