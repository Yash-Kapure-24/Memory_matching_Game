const gridContainer = document.querySelector(".grid-container");
const scoreDisplay = document.querySelector(".score");
const messageContainer = document.querySelector(".message");

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let matchedPairs = 0;

scoreDisplay.textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
  }
}

function generateCards() {
  gridContainer.innerHTML = ""; 
  matchedPairs = 0;
  messageContainer.style.display = "none";
  
  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.name = card.name;
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src="${card.image}" alt="Card image" />
      </div>
      <div class="back"></div>
    `;
    cardElement.addEventListener("click", flipCard);
    gridContainer.appendChild(cardElement);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard) return;
  
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  scoreDisplay.textContent = score;
  lockBoard = true;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matchedPairs++;
  
  if (matchedPairs === cards.length / 2) {
    showCongratulations();
  }
  
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restartGame() {
  resetBoard();
  shuffleCards();
  score = 0;
  scoreDisplay.textContent = score;
  generateCards();
}

function showCongratulations() {
  messageContainer.style.display = "block";
}