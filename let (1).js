let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;
let isFrozen = false;
let freezeChances = 1;

const elements = [
    { name: "Hydrogen", symbol: "H", number: 1 },
    { name: "Helium", symbol: "He", number: 2 },
    { name: "Lithium", symbol: "Li", number: 3 },
    { name: "Beryllium", symbol: "Be", number: 4 },
    { name: "Boron", symbol: "B", number: 5 },
    { name: "Carbon", symbol: "C", number: 6 },
    { name: "Nitrogen", symbol: "N", number: 7 },
    { name: "Oxygen", symbol: "O", number: 8 },
    { name: "Fluorine", symbol: "F", number: 9 },
    { name: "Neon", symbol: "Ne", number: 10 },
    { name: "Sodium", symbol: "Na", number: 11 },
    { name: "Magnesium", symbol: "Mg", number: 12 },
    { name: "Aluminium", symbol: "Al", number: 13 },
    { name: "Silicon", symbol: "Si", number: 14 },
    { name: "Phosphorus", symbol: "P", number: 15 },
    { name: "Sulfur", symbol: "S", number: 16 },
    { name: "Chlorine", symbol: "Cl", number: 17 },
    { name: "Argon", symbol: "Ar", number: 18 },
    { name: "Pottasium", symbol: "K", number: 19 },
    { name: "Calcium", symbol: "Ca", number: 20 },
    // Add more elements as needed
];

const questionTemplates = [
    { question: "What is the symbol of {name}?", answerKey: "symbol" },
    { question: "What is the atomic number of {name}?", answerKey: "number" },
    { question: "Which element has the symbol {symbol}?", answerKey: "name" },
    { question: "Which element has the atomic number {number}?", answerKey: "name" }
];

let userAnswers = [];
let questions = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('home-container').classList.add('show');
    document.getElementById('freeze-left').innerText = freezeChances;
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateQuestions() {
    const shuffledElements = shuffleArray([...elements]);
    questions = [];
    for (let i = 0; i < 20; i++) {
        const element = shuffledElements[i % shuffledElements.length];
        const template = questionTemplates[i % questionTemplates.length];
        const questionText = template.question.replace(/{name}/g, element.name)
            .replace(/{symbol}/g, element.symbol)
            .replace(/{number}/g, element.number);
        const options = generateOptions(template.answerKey, element);
        questions.push({ question: questionText, options: options, answer: element[template.answerKey] });
    }
    shuffleArray(questions);
}

function generateOptions(answerKey, correctElement) {
    const options = [correctElement[answerKey]];
    while (options.length < 4) {
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        const option = randomElement[answerKey];
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    return shuffleArray(options);
}

function loadQuestions() {
    generateQuestions();
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endQuiz();
        return;
    }

    const questionData = questions[currentQuestion];
    const questionElement = document.getElementById('question');
    questionElement.innerText = questionData.question;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    questionData.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.innerText = option;
        optionElement.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionElement);
    });

    document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
    resetTimer();
    startTimer();
}

function selectOption(event) {
    document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');
}

function nextQuestion() {
    const selectedOption = document.querySelector('.option.selected');
    if (selectedOption) {
        const selectedAnswer = selectedOption.innerText;
        userAnswers.push({
            question: questions[currentQuestion].question,
            selectedAnswer: selectedAnswer,
            correctAnswer: questions[currentQuestion].answer
        });
        if (selectedAnswer === questions[currentQuestion].answer) {
            score++;
        }
    } else {
        userAnswers.push({
            question: questions[currentQuestion].question,
            selectedAnswer: null,
            correctAnswer: questions[currentQuestion].answer
        });
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function startTimer() {
    timeLeft = 15;
    const timerElement = document.getElementById('timer');
    const progressElement = document.getElementById('progress');

    timer = setInterval(() => {
        if (!isFrozen) {
            timeLeft--;
            timerElement.innerText = timeLeft;
            progressElement.style.width = (timeLeft / 15) * 100 + '%'; 

            if (timeLeft <= 0) {
                clearInterval(timer);
                nextQuestion();
            }
        }
    }, 1000);
}



function resetTimer() {
    clearInterval(timer);
    document.getElementById('timer').innerText = 15;
    document.getElementById('progress').style.width = '0%';
}

function endQuiz() {
    document.getElementById('quiz-container').classList.remove('show');
    document.getElementById('result-container').classList.add('show');
    calculateScore();
}

function calculateScore() {
    score = 0;
    userAnswers.forEach(answer => {
        if (answer.selectedAnswer === answer.correctAnswer) {
            score++;
        }
    });
    document.getElementById('score').innerText = `You scored ${score} out of ${questions.length}`;;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    document.getElementById('result-container').classList.remove('show');
    document.getElementById('home-container').classList.add('show');
}

function startQuiz() {
    document.getElementById('home-container').classList.remove('show');
    document.getElementById('quiz-container').classList.add('show');
    loadQuestions();
}

function freezeTime() {
    if (freezeChances > 0 && !isFrozen) {
        isFrozen = true;
        clearInterval(timer);

        freezeChances--;
        document.getElementById('freeze-left').innerText = freezeChances;
        document.getElementById('freeze-left-btn').innerText = freezeChances;

        setTimeout(() => {
            isFrozen = false;
            startTimer();
        }, 10000);
    }
}

function watchAd() {
    // Display the Google AdSense ad in the ad container
    document.getElementById('ad-container').innerHTML = `
        <ins class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-xxxxxxxxxxxx"
            data-ad-slot="xxxxxxxxxx"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    `;

    // Simulate a delay to represent the time taken to watch the ad
    setTimeout(() => {
        // Increment freeze chances by 2 after the ad is "watched"
        freezeChances += 2;
        document.getElementById('freeze-left').innerText = freezeChances;
        document.getElementById('freeze-left-btn').innerText = freezeChances;

        // Clear the ad container after watching the ad
        document.getElementById('ad-container').innerHTML = '';
    }, 3000); // Adjust this delay based on actual ad length
}

function showCorrections() {
    document.getElementById('result-container').classList.remove('show');
    document.getElementById('corrections-container').classList.add('show');
    const correctionsList = document.getElementById('corrections-list');
    correctionsList.innerHTML = '';
    
    questions.forEach((question, index) => {
        if (question.userAnswer !== question.correctAnswer) {
            const correctionItem = document.createElement('div');
            correctionItem.classList.add('correction-item');
            correctionItem.innerHTML = `
                <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
                <p><strong>Your Answer:</strong> ${question.userAnswer || 'No answer'}</p>
                <p><strong>Correct Answer:</strong> ${question.correctAnswer}</p>
            `;
            correctionsList.appendChild(correctionItem);
        }
    });
}

function restartQuiz() {
    document.getElementById('corrections-container').classList.remove('show');
    startQuiz();
}