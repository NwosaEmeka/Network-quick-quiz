const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const question = document.querySelector('.question');
const choices = document.querySelectorAll('.choice-text');
const numsQues = document.querySelector('.num-ques');
const currentScore = document.querySelector('.current-score');

// ALL ABOUT TIMING
let timer = 0;
let interval;
let isRunning = false;

//Quiz variable
let questions = []; //list of all questions

let score = 0;
let currentQuestion = {};
let questionCounter = 0;
let availableQuestions = [];
let acceptingAnswer = false;

const MAX_QUESTIONS = 10;
const ANSWER_BONUS = 10; //each correct answer carries 10 marks

// fetch questions using fetchapi
fetch('questions.json')
	.then((res) => {
		return res.json();
	})
	.then((loadquestions) => {
		//load question from json then start the gamr
		questions = loadquestions;
		startGame();
	})
	.catch((err) => {
		console.log(err);
	});

function startClock() {
	if (isRunning) return;

	isRunning = true;
	interval = setInterval(setTimer, 1000);
}
function setTimer() {
	timer++;
	const numOfSecs = timer % 60;
	const numOfMins = Math.floor((timer % 3600) / 60);
	const sec = 59 - numOfSecs;
	const min = 2 - numOfMins;
	minutes.innerHTML = `${pad(min)}`;
	seconds.innerHTML = `${pad(sec)}`;

	//if we are out of time
	if (min <= 0 && sec <= 0) {
		stopTimer();
	}
}

function pad(num) {
	return num < 10 ? '0' + num : num;
}
function stopTimer() {
	if (!isRunning) return;
	isRunning = false;
	clearInterval(interval);

	//save the current score in local storage if the time is up
	saveScore(score);
	//end the game and return to score page
	return window.location.assign('/end.html');
}

startGame = () => {
	score = 0; //keep track of score
	questionCounter = 0; // Keep track of questions
	availableQuestions = [ ...questions ];
	startClock(); // start the clock
	getNewQuestion();
};

getNewQuestion = () => {
	if (availableQuestions === 0 || questionCounter >= MAX_QUESTIONS) {
		//save score before ending the game
		saveScore(score);
		//End the game is there is no more questions or we have reached maximum number of questions
		return window.location.assign('/end.html');
	}
	questionCounter++;
	numsQues.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

	//select question at random using their index
	let questionIndex = Math.floor(Math.random() * availableQuestions.length);
	currentQuestion = availableQuestions[questionIndex];

	// Set the question
	question.innerText = currentQuestion.question;
	//Set the multiple choice
	choices.forEach((choice) => {
		let number = choice.dataset['number'];
		choice.innerText = currentQuestion['choice' + number];
		acceptingAnswer = true; // ready to accept answer
	});
	//remove the selected question from list of available questions
	availableQuestions.splice(questionIndex, 1);
};

choices.forEach((choice) => {
	choice.addEventListener('click', (e) => {
		if (!acceptingAnswer) return; // if the system is not ready to accept answer, return

		const selectedChoice = e.target; //
		const selelctedAnswer = selectedChoice.dataset['number'];

		const classToApply = selelctedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

		//IF THE ANSWER IS CORRECT, INCREAMENT THE SCORE
		if (classToApply === 'correct') {
			incrementScore(ANSWER_BONUS);
		}

		selectedChoice.classList.add(classToApply);
		setTimeout(() => {
			//remove the feedback after 1 seconds and get new question
			selectedChoice.classList.remove(classToApply);
			getNewQuestion(); // once they answer, fetch a new question
		}, 1000);
	});
});

function incrementScore(num) {
	score += num;
	currentScore.innerText = score;
}

function saveScore(recentScore) {
	localStorage.setItem('currentScore', recentScore);
}
