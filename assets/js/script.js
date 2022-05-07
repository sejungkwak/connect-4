// DOM elements
const logoLink = elById('logoLink');
const navOpenBtn = elById('navOpenBtn');
const navCloseBtn = elById('navCloseBtn');
const navNewGameBtn = elById('primarySettings');
const navGameBtn = elById('primaryGame');
const navHelpBtn = elById('primaryHelp');
const navLeaderboardBtn = elById('primaryLeaderboard');
const settingStartBtn = elById('settingStartBtn');
const settingCloseBtn = elById('settingCloseBtn');
const playToNewGameBtn = elById('noGameButton');
const soundBtn = elById('soundBtn');
const muteBtn = elById('muteBtn');
const landscapeOkBtn = elById('landscapeOkBtn');
const leaderboardDeleteBtn = elById('leaderboardDeleteBtn');
const successHomeBtn = elById('successHomeBtn');
const failContactBtn = elById('failContactBtn');
const footerContactBtn = elById('footerContactBtn');
const sections = qsa('.section');
const settingsSection = elById('settings');
const gameSection = elById('game');
const leaderboardSection = elById('leaderboard');
const player1TypeCheckbox = elById('player1Type');
const player1ColourCheckbox = elById('player1Colour');
const player2TypeCheckbox = elById('player2Type');
const player2ColourCheckbox = elById('player2Colour');
const boardEl = elById('boardGrid');
const contactForm = elById('contactForm');
let nameEl = elById('name');
let emailEl = elById('email');
let messageEl = elById('message');

// Constant values for the game board grid
const NUM_OF_COLUMN = 7;
const NUM_OF_ROW = 6;

// Variables for the game
let freeCellCounter;
let gameOver;
let playerData;
let player1Turn;
let computerTurn;
let gamePlayed = 0;
let isMuted = true;

// Fix for the iOS audio issue.
// Source: user2415116 and AndrewL's answer on Stack Overflow(https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari)
const soundEffect = new Audio();
soundEffect.autoplay = true;
// Silent MP3 file
soundEffect.src =
  'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

/**----------------------------------------------------------------------------
 * Runs after the user clicks the "start" or "play again" button:
 * Starts a new game.
 -----------------------------------------------------------------------------*/
function runGame() {
  const overlays = qsa('.overlay');
  freeCellCounter = 42;
  gameOver = false;
  computerTurn = false;
  gamePlayed++;

  // Makes the player1 play first in every odd-numbered game.
  if (gamePlayed % 2 === 0) {
    player1Turn = false;
  } else {
    player1Turn = true;
  }

  overlays.forEach(overlay => overlay.remove());
  createGrid();
  updateName(player1Turn ? playerData.player1Name : playerData.player2Name);
  updateColour(player1Turn ? playerData.player1Colour : playerData.player2Colour);

  if (playerData.player1Type === 'human' && playerData.player2Type === 'human') {
    playerMove();
  } else if (
    (playerData.player1Type === 'computer' && player1Turn) ||
    (playerData.player2Type === 'computer' && !player1Turn)
  ) {
    computerMove();
    playerMove();
  } else {
    playerMove();
  }
}

/**----------------------------------------------------------------------------
 * Runs when it's the computer's turn:
 * Picks a random number to place a disc.
 -----------------------------------------------------------------------------*/
function computerMove() {
  const randomNumber = Math.floor(Math.random() * NUM_OF_COLUMN);
  const freeCell = findFreeCell(randomNumber);
  computerTurn = true;

  if (gameOver) return;
  // This function runs again if the target column is full.
  if (!freeCell) {
    return computerMove();
  }

  setTimeout(() => {
    placeDisc(freeCell);
  }, 1000);
}

/**----------------------------------------------------------------------------
 * Runs when it's a human player's turn:
 * Adds mouse event listeners.
 -----------------------------------------------------------------------------*/
function playerMove() {
  const cells = qsa('.cell');

  // Detects touchscreen device.
  // Source: KaMeHb's answer on Stack Overflow(https://stackoverflow.com/questions/56324813/how-to-detect-touch-device-in-2019)
  const isMobile = window.matchMedia('(hover: none)').matches;

  // Disables mouseover event listener if it is a touchscreen device.
  if (isMobile) {
    for (let cell of cells) {
      cell.addEventListener('click', calculateColIndex);
    }
  } else {
    for (let cell of cells) {
      cell.addEventListener('mouseover', cellMouseoverHandler);
      cell.addEventListener('click', calculateColIndex);
    }
  }
}

/**----------------------------------------------------------------------------
 * Runs when a player presses one of the arrow keys:
 * Changes the visibility of a column indicator disc.
 * Column indicator disc: a disc that is on top of the first row.
 * @param {string} pressedKey ArrowLeft, ArrowRight or ArrowDown.
 -----------------------------------------------------------------------------*/
function keydownHandler(pressedKey) {
  const cells = qsa('.cell');
  const invisibleCells = qsa('.cell.invisible');
  let visibleCellIndex;

  if (gameOver || gameOver === undefined) return;
  if (computerTurn || computerTurn === undefined) return;

  // Changes a visible column indicator disc's colour to the board colour.
  for (let i = 0; i < NUM_OF_COLUMN; i++) {
    if (!cells[i].classList.contains('invisible')) {
      if (pressedKey === 'ArrowLeft' || pressedKey === 'ArrowRight') {
        cells[i].classList.add('invisible');
      }
      visibleCellIndex = i;
    }
  }

  // Moves a visible column indicator disc to the left
  // or makes a column indicator disc visible on top of the last column.
  if (pressedKey === 'ArrowLeft') {
    if (invisibleCells.length === NUM_OF_COLUMN - 1 && visibleCellIndex !== 0) {
      return cells[visibleCellIndex - 1].classList.remove('invisible');
    } else {
      return cells[NUM_OF_COLUMN - 1].classList.remove('invisible');
    }
  }
  // Moves a visible column indicator disc to the right
  // or makes a column indicator disc visible on top of the first column.
  if (pressedKey === 'ArrowRight') {
    if (invisibleCells.length === NUM_OF_COLUMN - 1 && visibleCellIndex !== NUM_OF_COLUMN - 1) {
      return cells[visibleCellIndex + 1].classList.remove('invisible');
    } else {
      return cells[0].classList.remove('invisible');
    }
  }
  // Drops a disc if there is a column indicator disc, or else does nothing.
  if (pressedKey === 'ArrowDown') {
    if (invisibleCells.length === NUM_OF_COLUMN) {
      return;
    } else {
      return cellClickHandler(visibleCellIndex);
    }
  }
}

/**----------------------------------------------------------------------------
 * Runs when a player moves the mouse on the board:
 * Makes a column indicator disc move as the mouse moves.
 * Column indicator disc: a disc that is on top of the first row.
 * @param {object} event Mouseover event.
 -----------------------------------------------------------------------------*/
function cellMouseoverHandler(event) {
  const cells = qsa('.cell');
  const colIndex = cells.indexOf(event.target) % 7;

  if (gameOver || computerTurn) return;

  for (let i = 0; i < NUM_OF_COLUMN; i++) {
    cells[i].classList.add('invisible');
  }
  cells[colIndex].classList.remove('invisible');
}

/**----------------------------------------------------------------------------
 * Runs when a player clicks on the board:
 * Calculates the target column's index.
 * @param {object} event Mouse click event.
 -----------------------------------------------------------------------------*/
function calculateColIndex(event) {
  const cells = qsa('.cell');
  const colIndex = cells.indexOf(event.target) % 7;
  cellClickHandler(colIndex);
}

/**----------------------------------------------------------------------------
 * Runs when a player clicks on the board or presses the down arrow key:
 * Calls the function that Places a disc if there is an available cell.
 * @param {number} colIndex The index of the target column.
 -----------------------------------------------------------------------------*/
function cellClickHandler(colIndex) {
  const cells = qsa('.cell');
  const freeCell = findFreeCell(colIndex);

  if (gameOver || computerTurn || !freeCell) return;

  cells[colIndex].classList.add('invisible');
  placeDisc(freeCell);
}

/**----------------------------------------------------------------------------
 * Runs after the target column is calculated:
 * Returns the lowest empty cell(div element) of the target column.
 * @param {number} colIndex The index of the target column.
 * @returns {object} cell The lowest empty cell of the target column.
 -----------------------------------------------------------------------------*/
function findFreeCell(colIndex) {
  const cells = qsa(`[data-coords-col="${colIndex}"]`);

  for (let i = cells.length - 1; i >= 0; i--) {
    if (!cells[i].classList.contains('red') && !cells[i].classList.contains('yellow')) {
      return cells[i];
    }
  }
}

/**----------------------------------------------------------------------------
 * Runs when there's an empty cell in the target column:
 * Places a disc into the target cell.
 * @param {object} cell The lowest empty cell of the target column.
 -----------------------------------------------------------------------------*/
function placeDisc(cell) {
  cell.classList.add(player1Turn ? playerData.player1Colour : playerData.player2Colour);
  cell.textContent = `
    ${player1Turn ? playerData.player1Colour.charAt(0) : playerData.player2Colour.charAt(0)}
  `;
  freeCellCounter--;
  checkGameOver();
}

/**----------------------------------------------------------------------------
 * Runs after a disc is placed.
 * @returns {function} Calls displayResult() if the game is over.
 -----------------------------------------------------------------------------*/
function checkGameOver() {
  const connected = checkForWin(player1Turn ? playerData.player1Colour : playerData.player2Colour);

  if (connected) {
    const player1Point = 42 - qsa(`.${playerData.player1Colour}`).length + NUM_OF_COLUMN;
    const player2Point = 42 - qsa(`.${playerData.player2Colour}`).length + NUM_OF_COLUMN;
    gameOver = true;
    addToLocalstorage(player1Turn ? playerData.player1Name : playerData.player2Name, player1Turn ? player1Point : player2Point, 1);
    return displayResult('winner', player1Turn ? playerData.player1Name : playerData.player2Name, player1Turn ? player1Point : player2Point, connected);
  } else if (freeCellCounter === 0) {
    gameOver = true;
    addToLocalstorage(player1Turn ? playerData.player1Name : playerData.player2Name, 0, 0);
    return displayResult('draw');
  } else {
    playDropSound();
    updatePlayer();
  }
}

/**----------------------------------------------------------------------------
 * Runs after the computer or human player places a disc:
 * Checks if the current player has formed 4 discs in a line.
 * @param {string} playerColour The current player's colour.
 * @returns {array} The 4 cells(div elements) that are in a line.
 -----------------------------------------------------------------------------*/
function checkForWin(playerColour) {
  const cells = qsa('.cell').splice(NUM_OF_COLUMN);

  // Source: Tom Campbell's "Coding Connect 4 with JavaScript"(https://www.youtube.com/watch?v=kA9OOeUXXSU)
  for (let index = 0; index < NUM_OF_ROW * NUM_OF_COLUMN; index++) {
    const horizontalWin = horizontal4Check(index, cells[index], cells[index + 1], cells[index + 2], cells[index + 3], playerColour);
    const verticalWin = vertical4Check(index, cells[index], cells[index + NUM_OF_COLUMN], cells[index + NUM_OF_COLUMN * 2], cells[index + NUM_OF_COLUMN * 3], playerColour);
    const mainDiagonalWin = mainDiagonal4Check(index, cells[index], cells[index + NUM_OF_COLUMN + 1], cells[index + NUM_OF_COLUMN * 2 + 2], cells[index + NUM_OF_COLUMN * 3 + 3], playerColour);
    const offDiagonalWin = offDiagonal4Check(index, cells[index], cells[index + NUM_OF_COLUMN - 1], cells[index + NUM_OF_COLUMN * 2 - 2], cells[index + NUM_OF_COLUMN * 3 - 3], playerColour);

    if (horizontalWin) {
      return horizontalWin;
    }
    if (verticalWin) {
      return verticalWin;
    }
    if (mainDiagonalWin) {
      return mainDiagonalWin;
    }
    if (offDiagonalWin) {
      return offDiagonalWin;
    }
  }
}

/**----------------------------------------------------------------------------
 * Runs after a disc is placed.
 * @param {number} index
 * @param {object} cell1 The cell/div element which is at the index position in the array of cells.
 * @param {object} cell2 The cell which is at the index+1 position in the array of cells.
 * @param {object} cell3 The cell which is at the index+2 position in the array of cells.
 * @param {object} cell4 The cell which is at the index+3 position in the array of cells.
 * @param {string} colour The current player's disc colour
 * @returns {array} The cells that are 4 in a row.
 -----------------------------------------------------------------------------*/
function horizontal4Check(index, cell1, cell2, cell3, cell4, colour) {
  if (
    index % NUM_OF_COLUMN < 4 &&
    checkCellColour(cell1, cell2, cell3, cell4, colour)
  ) {
    return ([cell1, cell2, cell3, cell4]);
  }
}

/**----------------------------------------------------------------------------
 * Runs after a disc is placed and
 * if the horizontal win condition is not met.
 * @param {number} index 
 * @param {object} cell1 The cell/div element which is at the index position in the array of cells.
 * @param {object} cell2 The cell which is at the index+7 position in the array of cells.
 * @param {object} cell3 The cell which is at the index+14 position in the array of cells.
 * @param {object} cell4 The cell which is at the index+21 position in the array of cells.
 * @param {string} colour The current player's disc colour
 * @returns {array} The cells that are 4 in a vertical line.
 -----------------------------------------------------------------------------*/
function vertical4Check(index, cell1, cell2, cell3, cell4, colour) {
  if (
    index < NUM_OF_COLUMN * 3 &&
    checkCellColour(cell1, cell2, cell3, cell4, colour)
  ) {
    return ([cell1, cell2, cell3, cell4]);
  }
}

/**----------------------------------------------------------------------------
 * Runs after a disc is placed and
 * if the horizontal and vertical win conditions are not met.
 * @param {number} index 
 * @param {object} cell1 The cell/div element which is at the index position in the array of cells.
 * @param {object} cell2 The cell which is at the index+8 position in the array of cells.
 * @param {object} cell3 The cell which is at the index+16 position in the array of cells.
 * @param {object} cell4 The cell which is at the index+24 position in the array of cells.
 * @param {string} colour The current player's disc colour
 * @returns {array} The cells that are 4 in a main diagonal(\) line.
 -----------------------------------------------------------------------------*/
function mainDiagonal4Check(index, cell1, cell2, cell3, cell4, colour) {
  if (
    index % NUM_OF_COLUMN < 4 &&
    index < NUM_OF_COLUMN * 3 - 3 &&
    checkCellColour(cell1, cell2, cell3, cell4, colour)
  ) {
    return ([cell1, cell2, cell3, cell4]);
  }
}

/**----------------------------------------------------------------------------
 * Runs after a disc is placed and if other win conditions are not met.
 * @param {number} index 
 * @param {object} cell1 The cell/div element which is at the index position in the array of cells.
 * @param {object} cell2 The cell which is at the index+6 position in the array of cells.
 * @param {object} cell3 The cell which is at the index+12 position in the array of cells.
 * @param {object} cell4 The cell which is at the index+18 position in the array of cells.
 * @param {string} colour The current player's disc colour
 * @returns {array} The cells that are 4 in a off-diagonal(/) line.
 -----------------------------------------------------------------------------*/
function offDiagonal4Check(index, cell1, cell2, cell3, cell4, colour) {
  if (
    index % NUM_OF_COLUMN >= 3 &&
    index < NUM_OF_COLUMN * 3 &&
    checkCellColour(cell1, cell2, cell3, cell4, colour)
  ) {
    return ([cell1, cell2, cell3, cell4]);
  }
}

/**----------------------------------------------------------------------------
 * Runs when checking win conditions.
 * @param {object} cell1 The div element: the first cell in a line.
 * @param {object} cell2 The div element: the second cell in a line.
 * @param {object} cell3 The div element: the third cell in a line.
 * @param {object} cell4 The div element: the fourth cell in a line.
 * @param {string} colour The current player's disc colour
 * @returns {boolean} True if all the target cells have the current player's disc colour.
 -----------------------------------------------------------------------------*/
function checkCellColour(cell1, cell2, cell3, cell4, colour) {
  if (
    cell1.classList.contains(colour) &&
    cell2.classList.contains(colour) &&
    cell3.classList.contains(colour) &&
    cell4.classList.contains(colour)
  ) {
    return true;
  }
}

/**----------------------------------------------------------------------------
 * Runs when the game is over:
 * Displays the game result and the "play again" button.
 * @param {string} result
 * @param {string} player The winner if there is a winner
 * @param {number} point The point if there is a winner
 * @param {array} cells The 4 cells in a line
 -----------------------------------------------------------------------------*/
function displayResult(result, player = null, point = null, cells = null) {
  const overlay = document.createElement('aside');
  let message;

  if (result === 'draw') {
    message = `<h2 class="alert-text">It's a draw!</h2>`;
  }
  if (result === 'winner') {
    message = `
      <h2 class="alert-text">${player} ${player === 'You' ? 'win!' : 'wins!'}</h2>
      <p class="alert-text">${point} points</p>
    `;
    cells.forEach(cell => cell.innerText = '★');
  }

  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="alert-container result">
      ${message}
      <button class="btn btn-primary" id="playAgainBtn">play again</button>
    </div>
  `;
  gameSection.appendChild(overlay);
  boardEl.style.marginTop = '4rem';
  playWinSound();

  elById('playAgainBtn').addEventListener('click', runGame);
}

/**----------------------------------------------------------------------------
 * Runs after dropping a disc and if the game is not over:
 * Updates the current player.
 -----------------------------------------------------------------------------*/
function updatePlayer() {
  player1Turn = player1Turn ? false : true;
  updateName(player1Turn ? playerData.player1Name : playerData.player2Name);
  updateColour(player1Turn ? playerData.player1Colour : playerData.player2Colour);
  computerTurn = false;

  if ((playerData.player1Type === 'computer' && player1Turn) || (playerData.player2Type === 'computer' && !player1Turn)) {
    computerMove();
  }
}

/**----------------------------------------------------------------------------
 * Runs at the beginning of each player's turn:
 * Displays the player's name on the screen.
 * @param {string} currentPlayerName
 -----------------------------------------------------------------------------*/
function updateName(currentPlayerName) {
  const currentPlayerEl = elById('currentPlayer');
  let text;

  if (currentPlayerName === 'You') {
    text = 'Your';
  } else {
    text = `${currentPlayerName}'s`;
  }

  currentPlayerEl.innerText = text;
}

/**----------------------------------------------------------------------------
 * Runs at the beginning of each player's turn:
 * Update the class name of cells that are on top of the first row.
 * @param {string} currentPlayerColour
 -----------------------------------------------------------------------------*/
function updateColour(currentPlayerColour) {
  const topCells = qsa('.cell');
  for (let i = 0; i < NUM_OF_COLUMN; i++) {
    topCells[i].classList.remove('yellow');
    topCells[i].classList.remove('red');
    topCells[i].classList.add(currentPlayerColour);
  }
}

/**----------------------------------------------------------------------------
 * Runs when a player drops a disc and the game is still on.
 -----------------------------------------------------------------------------*/
async function playDropSound() {
  if (isMuted) return;
  soundEffect.src = 'assets/sounds/drop.mp3';
  try {
    await soundEffect.play();
  } catch (e) {
    return;
  }
}

/**----------------------------------------------------------------------------
 * Runs when the game is over.
 -----------------------------------------------------------------------------*/
function playWinSound() {
  if (isMuted) return;
  soundEffect.src = 'assets/sounds/end.mp3';
  soundEffect.play();
}

/**----------------------------------------------------------------------------
 * Runs when a user clicks the sound or mute icon.
 -----------------------------------------------------------------------------*/
function soundBtnToggler() {
  const soundBtns = qsa('.volume-btn');
  isMuted = isMuted ? false : true;

  for (let btn of soundBtns) {
    btn.classList.toggle('active');
  }

  return isMuted;
}

/**----------------------------------------------------------------------------
 * Runs at the beginning of each game.
 -----------------------------------------------------------------------------*/
function createGrid() {
  boardEl.innerHTML = '';
  boardEl.style.marginTop = 'unset';

  for (let i = 0; i < NUM_OF_ROW + 1; i++) {
    for (let j = 0; j < NUM_OF_COLUMN; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      if (i === 0) {
        cell.className += ' invisible';
      } else {
        cell.dataset.coordsCol = j;
      }
      boardEl.appendChild(cell);
    }
  }
}

/**----------------------------------------------------------------------------
 * Runs when the user changes the computer/human or colour option to invalid:
 * Switches the opponent's option to make the settings valid.
 * @param {string} type The settings the player changed.
 -----------------------------------------------------------------------------*/
function invalidChangeHandler(type) {
  if (type === 'player1Computer') {
    player2TypeCheckbox.checked = true;
    return;
  }
  if (type === 'player1Yellow') {
    player2ColourCheckbox.checked = true;
    return;
  }
  if (type === 'player1Red') {
    player2ColourCheckbox.checked = false;
    return;
  }
  if (type === 'player2Computer') {
    player1TypeCheckbox.checked = true;
    return;
  }
  if (type === 'player2Yellow') {
    player1ColourCheckbox.checked = true;
    return;
  }
  if (type === 'player2Red') {
    player1ColourCheckbox.checked = false;
    return;
  }
}

/**----------------------------------------------------------------------------
 * Runs when the user pressed the "start" button on the New Game page:
 * Checks if both players have the same name.
 * @returns {function} Calls the showAlert function if input values are invalid,
 * or else calls the setPlayerName function.
 -----------------------------------------------------------------------------*/
function validatePlayerName() {
  let player1Name = elById('player1Name').value.trim();
  let player2Name = elById('player2Name').value.trim();

  if (player1Name && player2Name && player1Name.toUpperCase() === player2Name.toUpperCase()) {
    return showAlert('newGame');
  } else {
    return setPlayerName();
  }
}

/**----------------------------------------------------------------------------
 * Runs when each player's name is unique:
 * Sets the player's name to the default name if the user doesn't input a name.
 -----------------------------------------------------------------------------*/
function setPlayerName() {
  let player1Type = player1TypeCheckbox.checked ? 'human' : 'computer';
  let player1Colour = player1ColourCheckbox.checked ? 'red' : 'yellow';
  let player1Name = elById('player1Name').value.trim();
  let player2Type = player2TypeCheckbox.checked ? 'human' : 'computer';
  let player2Colour = player2ColourCheckbox.checked ? 'red' : 'yellow';
  let player2Name = elById('player2Name').value.trim();

  if (player1Type === 'computer' && player2Type === 'human') {
    player1Name = player1Name === '' ? 'Computer' : player1Name;
    player2Name = player2Name === '' ? 'You' : player2Name;
  }
  if (player1Type === 'human' && player2Type === 'computer') {
    player1Name = player1Name === '' ? 'You' : player1Name;
    player2Name = player2Name === '' ? 'Computer' : player2Name;
  }
  if (player1Type === 'human' && player2Type === 'human') {
    player1Name = player1Name === '' ? player1Colour : player1Name;
    player2Name = player2Name === '' ? player2Colour : player2Name;
  }

  elById('player1Name').value = '';
  elById('player2Name').value = '';
  configureGame(player1Type, player1Colour, player1Name, player2Type, player2Colour, player2Name);
}

/**----------------------------------------------------------------------------
 * Runs after the input validation of the New Game page is done:
 * Assign the input values to the playerData variable.
 -----------------------------------------------------------------------------*/
function configureGame(player1Type, player1Colour, player1Name, player2Type, player2Colour, player2Name) {
  playerData = {
    player1Type,
    player1Colour,
    player1Name,
    player2Type,
    player2Colour,
    player2Name
  };
  gamePlayed = 0;
  renderPage('game');
  runGame();
}

/**----------------------------------------------------------------------------
 * Runs when a user inputs the same name for both players on the New Game page,
 * or when a user clicks the "delete data" button on the Leaderboard page.
 -----------------------------------------------------------------------------*/
function showAlert(pageName) {
  const overlay = document.createElement('aside');
  let message;
  let btn;
  if (pageName === 'newGame') {
    message = `<p class="alert-text">Please make sure each player's name is unique.</p>`;
    btn = `<button class="btn alert-btn" id="nameAlertCloseBtn">ok</button>`;
  }
  if (pageName === 'leaderboard') {
    message = `
      <p class="alert-text">Are you sure you want to delete your save data?</p>
      <p class="alert-text">It cannot be restored once it's deleted.</p>
    `;
    btn = `
      <ul class="btns">
        <li><button class="btn btn-primary alert-btn" id="deleteScoreBtn">ok</button></li>
        <li><button class="btn alert-btn" id="cancelDeleteBtn">cancel</button></li>
      </ul>
    `;
  }

  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="alert-container">
      ${message}
      ${btn}
    </div>
  `;

  if (pageName === 'newGame') {
    if (settingsSection.lastChild.className === 'overlay') {
      settingsSection.lastChild.remove();
    }
    settingsSection.appendChild(overlay);
  }
  if (pageName === 'leaderboard') {
    if (leaderboardSection.lastChild.className === 'overlay') {
      leaderboardSection.lastChild.remove();
    }
    leaderboardSection.appendChild(overlay);
  }
  closeAlert(pageName);
}

/**----------------------------------------------------------------------------
 * Runs when a user clicks a button on an alert popup.
 -----------------------------------------------------------------------------*/
function closeAlert(pageName) {
  if (pageName === 'newGame') {
    const nameAlertCloseBtn = elById('nameAlertCloseBtn');
    nameAlertCloseBtn.addEventListener('click', (e) => {
      e.target.parentNode.parentNode.remove();
    });
  }
  if (pageName === 'leaderboard') {
    const deleteScoreBtn = elById('deleteScoreBtn');
    const cancelDeleteBtn = elById('cancelDeleteBtn');

    deleteScoreBtn.addEventListener('click', (e) => {
      deleteData();
      e.target.parentNode.parentNode.parentNode.parentNode.remove();
    });
    cancelDeleteBtn.addEventListener('click', (e) => {
      e.target.parentNode.parentNode.parentNode.parentNode.remove();
    });
  }
}

/**----------------------------------------------------------------------------
 * Runs when a user clicks a nav menu toggle icon(≡, ⨉) on mobile.
 -----------------------------------------------------------------------------*/
function toggleNav() {
  const nav = elById('nav');
  const toggleBtns = qsa('.nav-toggle-btn');
  const navBtns = qsa('.nav-btn');

  nav.classList.toggle('active');

  for (let btn of toggleBtns) {
    btn.classList.toggle('active');
  }
  for (let navBtn of navBtns) {
    navBtn.classList.toggle('visible');
  }
}

/**----------------------------------------------------------------------------
 * Runs when a user clicks the main element while the nav menu is open.
 -----------------------------------------------------------------------------*/
function closeNav() {
  const navOpened = navCloseBtn.classList.contains('active');
  if (navOpened) {
    toggleNav();
  }
}

/**----------------------------------------------------------------------------
 * Runs when a user clicks a button to open a page.
 * @param {string} name The page name.
 -----------------------------------------------------------------------------*/
function renderPage(name) {
  const targetSection = elById(`${name}`);
  const nav = elById('nav');
  const toggleBtns = qsa('.nav-toggle-btn');
  const navBtns = qsa('.nav-btn');
  const mainHeading = elById('mainHeading');
  const settingHeading = elById('settingHeading');
  const sectionInNav = elById(`primary${name.charAt(0).toUpperCase()}${name.slice(1)}`);

  // Source: Ganesh Ghalame's answer on Stack Overflow(https://stackoverflow.com/questions/1144805/scroll-to-the-top-of-the-page-using-javascript)
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  mainHeading.style.display = 'none';
  settingHeading.style.display = 'block';

  for (let section of sections) {
    section.classList.remove('active');
  }

  targetSection.classList.add('active');
  nav.classList.remove('active');

  for (let navBtn of navBtns) {
    navBtn.classList.remove('visible');
    navBtn.classList.remove('active');
  }

  toggleBtns[0].classList.add('active');
  toggleBtns[1].classList.remove('active');

  if (name === 'settings' || name === 'game' || name === 'help' || name === 'leaderboard') {
    sectionInNav.classList.add('active');
  }

  if (name === 'game') {
    const gameSectionHeader = elById('gameHeader');
    const noGameText = elById('noGameText');

    // Displays a message if a user hasn't pressed the "start" button on the New Game page.
    // Or else, displays the current player's name, sound icon and game board.
    if (playerData === undefined) {
      gameSectionHeader.style.display = 'none';
      boardEl.style.display = 'none';
      noGameText.style.display = 'block';
      playToNewGameBtn.style.display = 'flex';
    } else {
      gameSectionHeader.style.display = 'grid';
      boardEl.style.display = 'grid';
      noGameText.style.display = 'none';
      playToNewGameBtn.style.display = 'none';
    }
  }
}

/**----------------------------------------------------------------------------
 * Runs when the game is over:
 * Stores the result of the game in local storage.
 * @param {string} name The current player's name.
 * @param {number} point The current player's points, or 0 if it's a draw.
 * @param {number} win 1 if there's a winner, or else 0.
 -----------------------------------------------------------------------------*/
function addToLocalstorage(name, point, win) {
  let opponentName = name === playerData.player1Name ? playerData.player2Name : playerData.player1Name;
  const scores = JSON.parse(localStorage.getItem('scores'));
  const nesScoresArray = [];
  const player = {
    name,
    point,
    win,
    games: 1
  };
  const opponent = {
    name: opponentName,
    point: 0,
    win: 0,
    games: 1
  };

  if (scores) {
    scores.push(player);
    scores.push(opponent);
    localStorage.setItem('scores', JSON.stringify(scores));
  } else {
    nesScoresArray.push(player);
    nesScoresArray.push(opponent);
    localStorage.setItem('scores', JSON.stringify(nesScoresArray));
  }
}

/**----------------------------------------------------------------------------
 * Runs when a user opens the Leaderboard page:
 * Gets the game results data from local storage.
 -----------------------------------------------------------------------------*/
function getFromLocalstorage() {
  const data = JSON.parse(localStorage.getItem('scores'));

  if (!data) {
    return displayNoDataText();
  }

  // Source: CRice's answer on Stack Overflow(https://stackoverflow.com/questions/49020000/reduce-multiple-objects-into-one-adding-values-together)
  const mergedData = data.reduce((newArray, item) => {
    const duplicateName = newArray.find(obj => obj.name === item.name);
    if (duplicateName) {
      duplicateName.point += item.point;
      duplicateName.win += item.win;
      duplicateName.games += item.games;
    } else {
      newArray.push(item);
    }
    return newArray;
  }, []);

  displayLeaderboardScore(mergedData);
}

/**----------------------------------------------------------------------------
 * Runs when there is no game results data in local storage.
 -----------------------------------------------------------------------------*/
function displayNoDataText() {
  const noDataText = elById('noDataText');
  const table = elById('leaderboardTable');

  noDataText.style.display = 'block';
  table.style.opacity = '0';
  leaderboardDeleteBtn.style.display = 'none';
}

/**----------------------------------------------------------------------------
 * Runs when there is game results data in local storage.
 * @param {array} data
 *    Player name, Points, Number of wins, Number of games the player played.
 -----------------------------------------------------------------------------*/
function displayLeaderboardScore(data) {
  const noDataText = elById('noDataText');
  const table = elById('leaderboardTable');
  const tbody = elById('leaderboardTableBody');

  table.style.opacity = '1';
  tbody.innerHTML = '';
  leaderboardDeleteBtn.style.display = 'flex';
  noDataText.style.display = 'none';

  // Source: MDN(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
  data.sort((a, b) => {
    return b.point - a.point;
  });

  if (data.length > 5) {
    for (let i = 0; i < 5; i++) {
      tbody.innerHTML += `
        <tr>
          <td class="leaderboard-table-name">${data[i].name}</td>
          <td>${data[i].point}</td>
          <td>${data[i].win}</td>
          <td>${parseFloat((+data[i].win / +data[i].games) * 100).toFixed(2)}%</td>
        </tr>
      `;
    }
  } else {
    data.forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td class="leaderboard-table-name">${item.name}</td>
          <td>${item.point}</td>
          <td>${item.win}</td>
          <td>${parseFloat((+item.win / +item.games) * 100).toFixed(2)}%</td>
        </tr>
      `;
    });
  }
}

/**----------------------------------------------------------------------------
 * Runs when a user clicks the "ok" button
 * on the leaderboard data deletion alert popup.
 -----------------------------------------------------------------------------*/
function deleteData() {
  const table = elById('leaderboardTable');
  const tbody = elById('leaderboardTableBody');
  const noDataText = elById('noDataText');

  localStorage.clear();
  table.style.opacity = '0';
  tbody.innerHTML = '';
  leaderboardDeleteBtn.style.display = 'none';
  noDataText.style.display = 'block';
}

/**----------------------------------------------------------------------------
 * Runs when a user clicks the "send" button on the contact page.
 -----------------------------------------------------------------------------*/
function sendMessage() {
  const contactSendBtn = elById('contactSendBtn');
  const templateParams = {
    contactName: nameEl.value,
    contactEmail: emailEl.value,
    contactMsg: messageEl.value
  };
  const regexp = /\s{2,}/g;
  const noWhitespace = messageEl.value.replace(regexp, ' ');

  if (nameEl.value.trim() === '') {
    return nameEl.setCustomValidity('Please fill in your name.');
  } else if (messageEl.value.trim().length < 10 || noWhitespace.length < 10) {
    return messageEl.setCustomValidity('Please ensure your message is at least 10 characters.');
  } else {
    contactSendBtn.innerText = 'sending...';

    // Email API library Emailjs(https://www.emailjs.com/)
    emailjs
      .send(
        'service_sy89ugk',
        'template_3440jzv',
        templateParams,
        'SkcIApcdBA67fNkU0'
      )
      .then(
        function () {
          contactSendBtn.innerText = 'send';
          renderPage('success');
          nameEl.value = '';
          emailEl.value = '';
          messageEl.value = '';
        },
        function () {
          contactSendBtn.innerText = 'send';
          renderPage('fail');
        }
      );
  }
}

/**----------------------------------------------------------------------------
 * Runs after the DOM finishes loading:
 * Adds event listeners to the elements.
 -----------------------------------------------------------------------------*/
function init() {
  // Button Click Event listeners
  logoLink.addEventListener('click', () => {
    renderPage('settings');
  });
  navOpenBtn.addEventListener('click', toggleNav);
  navCloseBtn.addEventListener('click', toggleNav);
  navNewGameBtn.addEventListener('click', () => {
    renderPage('settings');
  });
  navGameBtn.addEventListener('click', () => {
    renderPage('game');
  });
  navHelpBtn.addEventListener('click', () => {
    renderPage('help');
  });
  navLeaderboardBtn.addEventListener('click', () => {
    getFromLocalstorage();
    renderPage('leaderboard');
  });
  settingStartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    validatePlayerName();
  });
  settingCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderPage('game');
  });
  playToNewGameBtn.addEventListener('click', () => {
    renderPage('settings');
  });
  soundBtn.addEventListener('click', soundBtnToggler);
  muteBtn.addEventListener('click', soundBtnToggler);
  landscapeOkBtn.addEventListener('click', (e) => {
    e.target.parentNode.parentNode.remove();
  });
  leaderboardDeleteBtn.addEventListener('click', () => {
    showAlert('leaderboard');
  });
  successHomeBtn.addEventListener('click', () => {
    renderPage('settings');
  });
  failContactBtn.addEventListener('click', () => {
    renderPage('contact');
  });
  footerContactBtn.addEventListener('click', () => {
    renderPage('contact');
  });

  // New Game page checkboxes change Event listener
  player1TypeCheckbox.addEventListener('change', () => {
    if (!player1TypeCheckbox.checked && !player2TypeCheckbox.checked) {
      invalidChangeHandler('player1Computer');
    }
  });
  player1ColourCheckbox.addEventListener('change', () => {
    if (!player1ColourCheckbox.checked && !player2ColourCheckbox.checked) {
      invalidChangeHandler('player1Yellow');
    }
    if (player1ColourCheckbox.checked && player2ColourCheckbox.checked) {
      invalidChangeHandler('player1Red');
    }
  });
  player2TypeCheckbox.addEventListener('change', () => {
    if (!player1TypeCheckbox.checked && !player2TypeCheckbox.checked) {
      invalidChangeHandler('player2Computer');
    }
  });
  player2ColourCheckbox.addEventListener('change', () => {
    if (!player2ColourCheckbox.checked && !player1ColourCheckbox.checked) {
      invalidChangeHandler('player2Yellow');
    }
    if (player2ColourCheckbox.checked && player1ColourCheckbox.checked) {
      invalidChangeHandler('player2Red');
    }
  });

  // Resets the contact form custom validation message
  nameEl.addEventListener('input', () => {
    nameEl.setCustomValidity('');
  });
  messageEl.addEventListener('input', () => {
    messageEl.setCustomValidity('');
  });

  // Keyboard controls in the game
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && gameSection.classList.contains('active')) {
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      return keydownHandler(e.key);
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
  });

  elById('mainEl').addEventListener('click', closeNav);
}

// Helper functions
// Source: Web Dev Simplified's "Stop Wasting Your Time - Use These 16 JS Utility Functions Instead"(https://www.youtube.com/watch?v=EoUIS2PxKCs&t=202s)

/**----------------------------------------------------------------------------
 * Helper function of document.getElementById()
 * @param {string} id The element's id
 * @returns The element object that matches the id
 -----------------------------------------------------------------------------*/
function elById(id) {
  return document.getElementById(id);
}

/**----------------------------------------------------------------------------
 * Helper function of document.querySelectorAll()
 * @param {string} selector 
 * @returns {array} An array of node list that matches the selector
 -----------------------------------------------------------------------------*/
function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

document.addEventListener('DOMContentLoaded', init);