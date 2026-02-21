const scoreEl = document.getElementById("score");
const roundEl = document.getElementById("round");
const wordEl = document.getElementById("word");
const feedbackEl = document.getElementById("feedback");
const startBtn = document.getElementById("start-btn");
const questionArea = document.getElementById("question-area");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const articleButtons = Array.from(document.querySelectorAll(".article-btn"));

const state = {
  active: false,
  score: 0,
  index: -1,
  rounds: []
};

function pickRandomWord() {
  const i = Math.floor(Math.random() * wordsTable.length);
  return wordsTable[i];
}

function startSession() {
  state.active = true;
  state.score = 0;
  state.index = 0;
  state.rounds = [newRound()];
  startBtn.classList.add("hidden");
  questionArea.classList.remove("hidden");
  render();
}

function newRound() {
  const entry = pickRandomWord();
  return {
    word: entry.word,
    article: entry.article,
    selected: null,
    isCorrect: false,
    wasScored: false
  };
}

function currentRound() {
  return state.rounds[state.index];
}

function handleAnswer(selectedArticle) {
  if (!state.active) return;
  const round = currentRound();
  if (!round || round.selected) return;

  round.selected = selectedArticle;
  round.isCorrect = selectedArticle === round.article;

  if (round.isCorrect && !round.wasScored) {
    state.score += 1;
    round.wasScored = true;
  }

  render();
}

function goNext() {
  if (!state.active) return;
  if (state.index < state.rounds.length - 1) {
    state.index += 1;
  } else {
    state.rounds.push(newRound());
    state.index += 1;
  }
  render();
}

function goPrev() {
  if (!state.active) return;
  if (state.index > 0) {
    state.index -= 1;
    render();
  }
}

function updateArticleButtons(round) {
  articleButtons.forEach((btn) => {
    btn.classList.remove("correct", "wrong");
    const value = btn.dataset.article;
    const answered = Boolean(round.selected);
    btn.disabled = answered;

    if (!answered) return;
    if (value === round.article) btn.classList.add("correct");
    if (value === round.selected && round.selected !== round.article) btn.classList.add("wrong");
  });
}

function render() {
  const round = currentRound();
  if (!round) return;

  scoreEl.textContent = String(state.score);
  roundEl.textContent = `${state.index + 1} / ${state.rounds.length}`;
  wordEl.textContent = round.word;
  prevBtn.disabled = state.index === 0;
  updateArticleButtons(round);

  feedbackEl.classList.remove("ok", "error");
  if (!round.selected) {
    feedbackEl.textContent = "";
  } else if (round.isCorrect) {
    feedbackEl.classList.add("ok");
    feedbackEl.textContent = "Correct! +1 point";
  } else {
    feedbackEl.classList.add("error");
    feedbackEl.textContent = `Wrong. Correct article is "${round.article}".`;
  }
}

startBtn.addEventListener("click", startSession);
nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);
articleButtons.forEach((btn) => {
  btn.addEventListener("click", () => handleAnswer(btn.dataset.article));
});

