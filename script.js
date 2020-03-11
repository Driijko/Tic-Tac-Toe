// cd Desktop/'Files + Programz'/Projects/'Programming Career Course 2019'/'Recurse Center'/'Pairing Interview Projects'/'Tic-Tac-Toe'/Code
// HTML ELEMENTS ----------------------------------------------------------------------
const gameStatus = document.querySelector(".gameStatus");
const gameBoardHTML = document.querySelector(".gameBoard");
const sectors = document.querySelectorAll(".gameBoardSector");
const instructionsContainer = document.querySelector(".instructionsContainer");
const instructions = document.querySelector(".instructions");
const aiOption = document.querySelector(".aiOption");

// COLORS ------------------------------------------------------------------------------
const player1Color = "rgb(58, 109, 228)";
const player2Color = "rgb(67, 226, 27)";
const player1TransparentColor = "rgba(58, 109, 228, 0.2)";
const player2TransparentColor = "rgba(67, 226, 27, 0.2)";
const instructionsBrightColor = "red";
const instructionsDullColor = "rgb(141, 4, 4)";

// SOUND EFFECTS -----------------------------------------------------------------------
const player1ClickSound = document.querySelector(".player1Click");
const player2ClickSound = document.querySelector(".player2Click");
const player1WinsSound = document.querySelector(".player1WinsSound");
const player2WinsSound = document.querySelector(".player2WinsSound");
const tieGameSound = document.querySelector(".tieGameSound");

// BASIC GAME VARIABLES ------------------------------------------------------------
// These keep track of whether there is a game being currently played, and whose turn it is.
let gameInProgress = false;
let currentPlayer = "player1";
let gameType;

// HELPER FUNCTIONS -----------------------------------------------------------------------------------------

// Checks to make sure we are looking at indexes within the right range of our game board size: 0 - 8.
const rightRange = function(i0, i1) {
  if (i0 >= 0 && i0 <= 8 && i1 >= 0 && i1 <= 8) return true;
  else return false;
};

// Modular division.
const modDiv = function(dividend, divisor) {
  return Math.floor(dividend / divisor);
};

// This function checks whether the board is full or not.
const fullBoard = function() {
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i][1] === undefined) return false;
  }
  return true;
};

// Checks whether the sectors being checked for a match of three each have the same symbol, either
// an 'X' or 'O'.
const symbolCheck = function(test1, test2, symbol) {
  if (gameBoard[test1][1] === symbol && gameBoard[test2][1] === symbol)
    return true;
  else return false;
};

// Checks whether each sector being tested is in the same row.
const sameRow = function(test1, test2, rowNumber) {
  if (modDiv(test1, 3) === rowNumber && modDiv(test2, 3) === rowNumber)
    return true;
  else return false;
};

// Checks whether each sector being tested is in a different row from each other sector.
const difRows = function(test1, test2, rowNumber) {
  if (
    modDiv(test1, 3) !== rowNumber &&
    modDiv(test2, 3) !== rowNumber &&
    modDiv(test1, 3) !== modDiv(test2, 3)
  )
    return true;
  else return false;
};

// Combines checking the range, symbols and row tests for checking for a match of three.
const matchCheck = function(test1, test2, symbol, rowNumber, specialTest) {
  if (rightRange(test1, test2) && symbolCheck(test1, test2, symbol)) {
    if (specialTest === "none") return true;
    else if (specialTest(test1, test2, rowNumber)) return true;
  }
};

// There are a number of different sectors on the board we will need to test to check for a match of three.
// We identify each sector by numerical relations to the sector that has just been clicked.
// This array will be used in the 'matchOfThree' function immediately below.
const testIndexes = [
  [3, 6],
  [-3, 3],
  [-3, -6],
  [4, 8],
  [-4, 4],
  [-4, -8],
  [1, 2],
  [-1, 1],
  [-2, -1],
  [2, 4],
  [2, -2],
  [-2, -4]
];

// Our main function for checking whether a match of three has occurred. This is the function
// that is called when a player clicks a sector.
const matchOfThree = function(sectorIndex, symbol) {
  // We check which row number the sector that was just clicked is in.
  const rowNumber = modDiv(sectorIndex, 3);

  // We iterate through each possible sector pattern.
  for (let i = 0; i < testIndexes.length; i++) {
    // We establish which sectors on the board we are testing.
    let test1 = sectorIndex + testIndexes[i][0];
    let test2 = sectorIndex + testIndexes[i][1];

    // For our first six tests, we don't need to worry about what rows the test sectors are on.
    // But for the next three, we need to check if they are on the same row.
    // And for the three after that, we need to check if they are on each different rows.
    if (i < 6) specialTest = "none";
    else if (i < 9) specialTest = sameRow;
    else specialTest = difRows;
    if (matchCheck(test1, test2, symbol, rowNumber, specialTest)) return true;
  }

  // If none of our tests have returned a match, we retun false.
  return false;
};

function aiTurn() {
  if(fullBoard()) {
    return;
  }
  let sectorChoice = Math.floor(Math.random() * 9);
  while(!(gameBoard[sectorChoice][1] === undefined)) {
    sectorChoice = Math.floor(Math.random() * 9);
  }
  if(matchOfThree(sectorChoice, "O")) {
    gameStatus.innerHTML = "AI Wins!";
    player2WinsSound.play();
  }
  gameBoard[sectorChoice][1] = "O";
  gameBoard[sectorChoice][0].innerHTML = "O";
  gameBoard[sectorChoice][0].style.color = player2Color;
}

// GAME START --------------------------------------------------------------------
// The HTML div "instructions" functions at the outset as a button which informs a player to click it in order
// to iniate a game. The following functions highlight and include this functionality. Note that the "onclick" event
// changes the variable "gameInProgress" to true.

// The following two functions determine what happens when you mouse over or off of the "instructions" element.
instructions.onmouseover = function() {
  if (gameInProgress === false) {
    instructions.style.cursor = "pointer";
    instructions.style.color = "red";
    instructionsContainer.style.border = "1px solid red";
  }
};

instructions.onmouseout = function() {
  if (gameInProgress === false) {
    instructions.style.color = instructionsDullColor;
    instructionsContainer.style.border = "none";
  }
};

// Clicking the "instructions" element when a game is not in progress iniates a new game, and the function
// below does everything required to set up a new game, including cleaning the board of any symbols from a
// previous game.
instructions.onclick = function() {
  if (gameInProgress === false) {
    gameStatus.innerHTML = "Player One's Turn";
    instructions.innerHTML = "Click an empty square";
    instructionsContainer.style.border = "none";
    instructions.style.cursor = "default";
    gameBoardHTML.style.cursor = "crosshair";
    currentPlayer = "player1";
    gameStatus.style.color = player1Color;
    gameInProgress = true;
    for (let i = 0; i < 9; i++) {
      gameBoard[i][1] = undefined;
      gameBoard[i][0].innerHTML = "";
    }
  }
};

aiOption.onclick = function() {
  gameType = "aiOption";
  gameInProgress = true;
  gameStatus.style.color = player1Color;
  gameStatus.innerHTML = "Player One's Turn";
  instructions.innerHTML = "Click an empty square";
  instructionsContainer.style.border = "none";
  instructions.style.cursor = "default";
  gameBoardHTML.style.cursor = "crosshair";
}

// The GAMEBOARD -------------------------------------------------------------------------------------------------
// The array "gameBoard" allows us to keep track of what is happening on the game board. Each index of the array
// has a sub-array with two elements: the DOM element of a given sector of the board, and an option of either
// "undefined", "X" or "O". If "undefined", then the sector is still empty, otherwise, either player 1 or 2 has
// filled that sector.
let gameBoard = [];

for (let i = 0; i < 9; i++) {
  // Here we connect the array "gameBoard" to the DOM. For each sector we will give mouseover, mouseout and click
  // event functionality.
  gameBoard[i] = [sectors[i]];

  // The mouseover event handler displays an X or O that is transparent if a square is empty.
  gameBoard[i][0].onmouseover = function() {
    if (gameInProgress && gameBoard[i][1] === undefined) {
      if (currentPlayer === "player1") {
        gameBoard[i][0].innerHTML = "X";
        gameBoard[i][0].style.color = player1TransparentColor;
      } else {
        gameBoard[i][0].innerHTML = "O";
        gameBoard[i][0].style.color = player2TransparentColor;
      }
    }
  };

  gameBoard[i][0].onmouseout = function() {
    if (gameBoard[i][1] === undefined) {
      gameBoard[i][0].innerHTML = "";
    }
  };

  // If a player clicks an empty square, we place an X or O there, not transparent this time, and switch
  // to the other player's turn. But! We also check if the game is over.
  gameBoard[i][0].onclick = function() {
    if (gameInProgress && gameBoard[i][1] === undefined) {
      if (currentPlayer === "player1") {
        gameBoard[i][1] = "X";
        gameBoard[i][0].style.color = player1Color;
        player1ClickSound.play();
        if (matchOfThree(i, "X")) {
          gameStatus.innerHTML = "Player 1 Wins!";
          player1WinsSound.play();
          gameInProgress = false;
          instructions.innerHTML = "Click here to start a new game.";
          instructions.style.color = instructionsBrightColor;
        } else if (fullBoard()) {
          gameStatus.innerHTML = "Tie Game";
          tieGameSound.play();
          gameStatus.style.color = "red";
          gameInProgress = false;
          instructions.innerHTML = "Click here to start a new game";
          instructions.style.color = instructionsBrightColor;
        } else {
          if(gameType === "aiOption") {
            aiTurn();
          } else {
            gameStatus.style.color = player2Color;
            currentPlayer = "player2";
            gameStatus.innerHTML = "Player Two's Turn";
          }
        }
      } else {
        gameBoard[i][1] = "O";
        player2ClickSound.play();
        gameBoard[i][0].style.color = player2Color;
        if (matchOfThree(i, "O")) {
          gameStatus.innerHTML = "Player 2 Wins!";
          player2WinsSound.play();
          gameInProgress = false;
          instructions.innerHTML = "Click here to start a new game.";
          instructions.style.color = instructionsDullColor;
        } else {
          currentPlayer = "player1";
          gameStatus.style.color = player1Color;
          gameStatus.innerHTML = "Player One's Turn";
        }
      }
    }
  };
}
