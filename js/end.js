const scoreNow = document.querySelector('.ScoreNow');
const btnSave = document.querySelector('.save');
const username = document.querySelector('input[type=text]');
const form = document.querySelector('.form-group');

const current = localStorage.getItem('currentScore'); // pull the most recent score from the local sotage
scoreNow.innerText = current; //set the current score

const topFiveScore = JSON.parse(localStorage.getItem('highestScore')) || []; // pull the top score from the local storage, initialize it with items or empty array if no score yet

//disable the save button is the username is empty
username.addEventListener('keyup', () => {
	btnSave.disabled = !username.value;
});

btnSave.addEventListener('click', (e) => {
	if (username.value.trim() === '') {
		return;
	}
	//set the current score with the player name
	const score = {
		name: username.value,
		score: current
	};

	//add the score to the topFiveScore
	topFiveScore.push(score);

	//sort the score
	topFiveScore.sort((a, b) => b.score - a.score);

	//Select only the top 5
	topFiveScore.splice(5);

	//reset the topfive score with new score
	localStorage.setItem('highestScore', JSON.stringify(topFiveScore));
	username.value = ''; //clear the user name
	return window.location.assign('/index.html'); //return to homepage
	e.preventDefault();
});
