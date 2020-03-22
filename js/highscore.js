const Scoretable = document.querySelector('.scoreTable');
let list = '';
const scoreList = JSON.parse(localStorage.getItem('highestScore'));

scoreList.forEach((result) => {
	list += `<tr>
             <td>${result.name}</td>
            <td>${result.score}</td>
           </tr>`;
});

Scoretable.innerHTML = list;
