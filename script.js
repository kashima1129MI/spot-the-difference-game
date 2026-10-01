const totalDifferences = 7;
const definitions = [
  { id: 'sun', label: '太陽' },
  { id: 'cloud1', label: '雲1' },
  { id: 'cloud2', label: '雲2' },
  { id: 'tree', label: '木' },
  { id: 'flower', label: '花' },
  { id: 'window', label: '窓' },
  { id: 'bird', label: '鳥' },
];

const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

let score = 0;
let timeLeft = 60;
let timerId = null;
let hasEnded = false;

const found = new Set();

function updateScore() {
  scoreEl.textContent = `${score} / ${totalDifferences}`;
}

function finishGame(message) {
  hasEnded = true;
  clearInterval(timerId);
  messageEl.textContent = message;
  document.querySelectorAll('.hotspot').forEach((button) => {
    button.disabled = true;
  });
}

function setFoundState(id) {
  const matchingButtons = document.querySelectorAll(`.hotspot[data-id="${id}"]`);
  matchingButtons.forEach((button) => {
    button.classList.add('found');
  });
}

function handleHit(id) {
  if (hasEnded || found.has(id)) {
    return;
  }

  const item = definitions.find((difference) => difference.id === id);
  if (!item) return;

  found.add(id);
  score += 1;
  updateScore();
  setFoundState(id);

  const foundLabel = item.label;
  messageEl.textContent = `${foundLabel} を見つけた！`;

  if (score === totalDifferences) {
    finishGame('クリア！ 7つの違いを全部見つけました！');
  }
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = `${timeLeft}`;

    if (timeLeft <= 0) {
      finishGame('時間切れ！ もう一度チャレンジしてね。');
    }
  }, 1000);
}

function resetGame() {
  score = 0;
  timeLeft = 60;
  hasEnded = false;
  found.clear();

  updateScore();
  timerEl.textContent = '60';
  messageEl.textContent = '2つの絵の違いを見つけて、丸い場所をクリックしてね！';

  document.querySelectorAll('.hotspot').forEach((button) => {
    button.disabled = false;
    button.classList.remove('found');
  });

  startTimer();
}

document.querySelectorAll('.hotspot').forEach((button) => {
  button.addEventListener('click', () => {
    handleHit(button.dataset.id);
  });
});

restartBtn.addEventListener('click', resetGame);

updateScore();
startTimer();
