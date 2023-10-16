const playButtons = document.querySelectorAll(".image-container");
const playButtonsContainer = document.querySelector(".play-buttons");
const resultContainer = document.querySelector(".result-container");
const yourScoreBox = document.querySelector(".your-score .score");
const computerScoreBox = document.querySelector(".computer-score .score");
// const rulesButton = document.querySelector(".rules-button");
const nextButton = document.querySelector(".next");
const rulesContainer = document.querySelector(".rules-container");
const ruleButton = document.querySelector(".rules");
const closeRuleButton = document.querySelector(".close");
const firstPage = document.querySelector(".first-page");
const lastPage = document.querySelector(".last-page");
const lastPagePlyAgain = document.querySelector(".last-page-play-btn");
const refreshScore = document.querySelector(".refresh");

// restricting user to see my code using inspect
// (() =>
// 	document.addEventListener("contextmenu", (e) => {
// 		e.preventDefault();
// 	}))();

// state which manages all data
let state = {
	yourPick: "",
	computerPick: "",
	scores: {
		yourScore: JSON.parse(localStorage.getItem("scores"))?.yourScore ?? 0,
		computerScore:
			JSON.parse(localStorage.getItem("scores"))?.computerScore ?? 0,
	},
	winner: "",
};

playButtons.forEach((button) =>
	button.addEventListener("click", () => {
		if (
			button.id === "rock" ||
			button.id === "paper" ||
			button.id === "scissor"
		) {
			state.yourPick = button.id;
			computerTurns();
			getTheWinner();
			maintainScore(getTheWinner());
			showHideResultPlayButtons();
			updateScore();
			showResult();
			addNextButton();
		}
	})
);

ruleButton.addEventListener("click", () => {
	rulesContainer.classList.toggle("hide");
});
closeRuleButton.addEventListener("click", () => {
	rulesContainer.classList.add("hide");
});

nextButton.addEventListener("click", () => {
	firstPage.classList.add("hide");
	lastPage.classList.remove("hide");
	nextButton.classList.add("hide");
});
lastPagePlyAgain.addEventListener("click", continuePlay);

refreshScore.addEventListener("click", () => {
	localStorage.removeItem("scores");
	window.location.reload();
});

function computerTurns() {
	const randomComputerPick = Math.floor(Math.random() * 3) + 1;
	switch (randomComputerPick) {
		case 1:
			return (state.computerPick = "rock");
		case 2:
			return (state.computerPick = "paper");
		case 3:
			return (state.computerPick = "scissor");
	}
}

function getTheWinner() {
	const { computerPick, yourPick } = state;
	if (computerPick === yourPick) {
		state.winner = "";
		return "tie";
	}
	switch (computerPick) {
		case "rock":
			if (yourPick === "paper") {
				state.winner = "You";
				return "win";
			}
			if (yourPick === "scissor") {
				state.winner = "Computer";
				return "loss";
			}
		case "paper":
			if (yourPick === "scissor") {
				state.winner = "You";
				return "win";
			}
			if (yourPick === "rock") {
				state.winner = "Computer";
				return "loss";
			}
		case "scissor":
			if (yourPick === "paper") {
				state.winner = "Computer";
				return "loss";
			}
			if (yourPick === "rock") {
				state.winner = "You";
				return "win";
			}
	}
}

function maintainScore(result) {
	if (result === "win") {
		state.scores.yourScore += 1;
		localStorage.setItem("scores", JSON.stringify(state.scores));
	} else if (result === "loss") {
		state.scores.computerScore += 1;
		localStorage.setItem("scores", JSON.stringify(state.scores));
	} else return;
}

function showHideResultPlayButtons() {
	playButtonsContainer.classList.add("hide");
	resultContainer.classList.remove("hide");
}

function updateScore() {
	const {
		scores: { yourScore, computerScore },
	} = state;
	yourScoreBox.textContent = yourScore;
	computerScoreBox.textContent = computerScore;
}
updateScore();

// this function will handle all return back to play buttons
function continuePlay() {
	state = {
		yourPick: "",

		computerPick: "",
		scores: {
			yourScore: JSON.parse(localStorage.getItem("scores"))?.yourScore ?? 0,
			computerScore:
				JSON.parse(localStorage.getItem("scores"))?.computerScore ?? 0,
		},
		winner: "",
	};
	addNextButton();
	playButtonsContainer.classList.remove("hide");
	resultContainer.classList.add("hide");
	firstPage.classList.remove("hide");
	lastPage.classList.add("hide");
}

function addNextButton() {
	const { winner } = state;
	if (winner === "You") {
		nextButton.classList.remove("hide");
	} else {
		nextButton.classList.add("hide");
	}
}

function showResult() {
	resultContainer.innerHTML = "";
	const { yourPick, computerPick, winner } = state;
	const announcement =
		winner !== ""
			? `<span>You ${
					winner === "You" ? "won" : "lost"
			  }</span> <span>against  computer 
			  </span>`
			: "Tie up";
	const html = `<div class="you-pick ${winner === "You" ? "winner" : ""}">
					<p>You picked</p>
					<div class="wrapper-1"></div>
					<div class="wrapper-2"></div>
					<div class="wrapper-3"></div>
					<div class="image-container">
						<img src="assests/${yourPick}.svg" class="circle" />
						<img src="assests/${yourPick}.png" class="hand-icon" />
					</div>
				</div>
				<div class="announce">
					${announcement}
					<button>${winner === "" ? "Replay" : "Play again"}</button>
				</div>
				<div class="computer-pick ${winner === "Computer" ? "winner" : ""}">
					<p>Pc picked</p>
					<div class="wrapper-1"></div>
					<div class="wrapper-2"></div>
					<div class="wrapper-3"></div>
					<div class="image-container">
						<img src="assests/${computerPick}.svg" class="circle" />
						<img src="assests/${computerPick}.png" class="hand-icon" />
					</div>
				</div>
			</section>`;
	resultContainer.insertAdjacentHTML("afterbegin", html);
	//  we have to define this selector inside this function as every time this function run firstly all innerHtml get cleaned up and hence playAgain button lost its binding
	const playAgainBtn = document.querySelector(".announce button");
	playAgainBtn.addEventListener("click", continuePlay);
}
