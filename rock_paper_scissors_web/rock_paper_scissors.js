let userScore = 0;
let compScore = 0;

const result_p = document.querySelector(".result > p");

const userScore_span = document.getElementById("user-score");
const compScore_span = document.getElementById("computer-score");

const scoreBoard_div = document.querySelector(".score-board");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");

function getCompChoice(){
  const choices = ['r', 'p', 's'];
  return choices[ Math.floor( Math.random() * 3 ) ];
}

function convertToWord(letter){
  if(letter === "r") return "Rock";
  if(letter === "p") return "Paper";
  if(letter === "s") return "Scissors";
}

function win(userChoice, compChoice){
  userScore += 1;

  userScore_span.innerHTML = userScore;
  compScore_span.innerHTML = compScore;

  result_p.innerHTML = convertToWord(userChoice) + " beats " + convertToWord(compChoice) + ". You win!";

  const userChoice_div = document.getElementById(userChoice);

  userChoice_div.classList.add('green-glow');
  setTimeout(() => userChoice_div.classList.remove('green-glow'), 300);
}

function lose(userChoice, compChoice){
  compScore += 1;

  userScore_span.innerHTML = userScore;
  compScore_span.innerHTML = compScore;

  result_p.innerHTML = convertToWord(userChoice) + " loses to " + convertToWord(compChoice) + ". You lost!";

  const userChoice_div = document.getElementById(userChoice);

  userChoice_div.classList.add('red-glow');
  setTimeout(() => userChoice_div.classList.remove('red-glow'), 300);
}

function draw(userChoice, compChoice){
  userScore_span.innerHTML = userScore;
  compScore_span.innerHTML = compScore;

  result_p.innerHTML = convertToWord(userChoice) + " is equal to " + convertToWord(compChoice) + ". It's a draw!";

  const userChoice_div = document.getElementById(userChoice);

  userChoice_div.classList.add('gray-glow');
  setTimeout(() => userChoice_div.classList.remove('gray-glow'), 300);
}

function cmp(userChoice, compChoice){
  switch (userChoice + compChoice) {
    case "rs":
    case "pr":
    case "sp":
      win(userChoice, compChoice);
      break;
    case "sr":
    case "rp":
    case "ps":
      lose(userChoice, compChoice);
      break;
    case "ss":
    case "pp":
    case "rr":
      draw(userChoice, compChoice);
      break;
  }
}

function game(userChoice){
  const compChoice = getCompChoice();
  cmp(userChoice, compChoice);
}

function main(){
  rock_div.addEventListener('click', () => { game("r"); })
  paper_div.addEventListener('click', () => { game("p"); })
  scissors_div.addEventListener('click', () => { game("s"); })
}

main();
