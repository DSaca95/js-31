const quizEl = document.getElementById("quiz");
const nextBtn = document.getElementById("nextBtn");
const startBtn = document.getElementById("startBtn");
const resultEl = document.getElementById("result");
const categorySelect = document.getElementById("category")

let questions = [];
let currentQuestion = 0;
let score = 0;

const loadCategories = async () => {
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();
    const categories = data.trivia_categories;

    categorySelect.innerHTML = categories
        .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
        .join("");
}

const loadQuestions = async () => {
    const difficulty = document.getElementById("difficulty").value;
    const length = document.getElementById("length").value;
    const category = document.getElementById("category").value;

    const response = await fetch(`https://opentdb.com/api.php?amount=${length}&category=${category}&type=multiple&difficulty=${difficulty}`);
    const data = await response.json();
    questions = data.results;
    currentQuestion = 0;
    score = 0;
    resultEl.classList.add("hidden");
    nextBtn.classList.add("hidden");
    showQuestion();
}

startBtn.addEventListener('click', loadQuestions);

const updateProgress = () => {
    const dots = questions.map((_, i) =>
        `<span class="dot ${i === currentQuestion ? "active" : ""}"></span>`).join("");

    const numbers = `<div class="progress-numbers">${currentQuestion + 1} / ${questions.length}</div>`;

    document.getElementById("progress").innerHTML = dots + numbers;
}

const showQuestion = () => {
    const q = questions[currentQuestion];
    const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

    quizEl.innerHTML = `
        <div class="question">${q.question}</div>
        <div class="options">
            ${options.map(opt => `<div class="option">${opt}</div>`).join("")}
        </div>
    `;

    document.querySelectorAll(".option").forEach(opt => {
        opt.addEventListener('click', () => selectAnswer(opt.textContent, q.correct_answer));
    });

    updateProgress();
}

const selectAnswer = (selected, correct) => {
    const options = document.querySelectorAll(".option");
    options.forEach(opt => {
        if (opt.textContent === correct) {
            opt.classList.add("correct");
            if (selected === correct) {
                score++;
            }
        }
        if (opt.textContent === selected && selected !== correct) {
            opt.classList.add("incorrect");
        }
        opt.style.pointerEvents = "none";
    });
    nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        nextBtn.classList.add("hidden");
        showQuestion();
    } else {
        quizEl.innerHTML = "";
        nextBtn.classList.add("hidden");
        resultEl.classList.remove("hidden");
        resultEl.textContent = `You scored ${score} out of ${questions.length}!`;
    }
});

loadCategories();
loadQuestions();