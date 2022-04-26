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
const checkboxes = qsa('.setting-checkbox');
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

/* 
Fix for iOS audio issue
Source: user2415116 and AndrewL's answer on Stack Overflow(https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari)
*/
const dropSound = new Audio();
dropSound.autoplay = true;
dropSound.src =
  'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

// Button Click Event listeners
logoLink.addEventListener('click', () => {
  openSection('settings');
});
navOpenBtn.addEventListener('click', toggleNav);
navCloseBtn.addEventListener('click', toggleNav);
navNewGameBtn.addEventListener('click', () => {
  openSection('settings');
});
navGameBtn.addEventListener('click', () => {
  openSection('game');
});
navHelpBtn.addEventListener('click', () => {
  openSection('help');
});
navLeaderboardBtn.addEventListener('click', () => {
  getFromLocalstorage();
  openSection('leaderboard');
});
settingStartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  startBtnHandler();
});
settingCloseBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openSection('game');
});
playToNewGameBtn.addEventListener('click', () => {
  openSection('settings');
});
soundBtn.addEventListener('click', soundBtnToggler);
muteBtn.addEventListener('click', soundBtnToggler);
landscapeOkBtn.addEventListener('click', (e) => {
  e.target.parentNode.parentNode.remove();
});
leaderboardDeleteBtn.addEventListener('click', deleteData);
successHomeBtn.addEventListener('click', () => {
  openSection('settings');
});
failContactBtn.addEventListener('click', () => {
  openSection('contact');
});
footerContactBtn.addEventListener('click', () => {
  openSection('contact');
});

// Checkbox change Event listener
checkboxes.forEach(checkbox =>
  checkbox.addEventListener('change', (e) => {
    if (settingsSection.lastChild.className === 'overlay') {
      settingsSection.lastChild.remove();
    }

    if (
      (e.target === checkboxes[0] || e.target === checkboxes[2]) &&
      !elById('player1Type').checked &&
      !elById('player2Type').checked
    ) {
      invalidChangeHandler('player');
    } else if (
      (e.target === checkboxes[1] || e.target === checkboxes[3]) &&
      elById('player1Colour').checked === elById('player2Colour').checked
    ) {
      invalidChangeHandler('colour');
    }
  }));

// Keyboard control in the game
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

// Resets custom validation message
nameEl.addEventListener('change', () => {
  nameEl.setCustomValidity('');
});
messageEl.addEventListener('change', () => {
  messageEl.setCustomValidity('');
});

/**
 * Runs when the user pressed
 * the start button on the New Game page.
 * Validates the form input values.
 */
function startBtnHandler() {
  let player1Type = elById('player1Type').checked ? 'human' : 'computer';
  let player1Colour = elById('player1Colour').checked ? 'red' : 'yellow';
  let player1Name = elById('player1Name').value.trim();
  let player2Type = elById('player2Type').checked ? 'human' : 'computer';
  let player2Colour = elById('player2Colour').checked ? 'red' : 'yellow';
  let player2Name = elById('player2Name').value.trim();

  if (player1Type === 'computer' && player2Type === 'computer') {
    return invalidChangeHandler('player');
  }
  if (player1Colour === player2Colour) {
    return invalidChangeHandler('colour');
  }
  if (player1Name && player2Name && player1Name.toUpperCase() === player2Name.toUpperCase()) {
    let text = 'Please make sure each player name is unique.';
    return showAlert(text);
  }

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

  playerData = {
    player1Type,
    player1Colour,
    player1Name,
    player2Type,
    player2Colour,
    player2Name
  };

  gamePlayed = 0;
  openSection('game');
  runGame();
}

/**
 * Runs when the New Game form input values are valid.
 * Creates and configures a new game.
 */
function runGame() {
  const overlays = qsa('.overlay');
  freeCellCounter = 42;
  gameOver = false;
  computerTurn = false;
  gamePlayed++;

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

/**
 * Runs when it's the computer's turn.
 */
function computerMove() {
  const randomNumber = Math.floor(Math.random() * NUM_OF_COLUMN);
  const freeCell = findFreeCell(randomNumber);
  computerTurn = true;

  if (gameOver) return;
  if (!freeCell) {
    return computerMove();
  }

  setTimeout(() => {
    placeDisc(freeCell);
  }, 1000);
}

/**
 * Runs when it's a human player's turn.
 * Adds mouse event listeners.
 */
function playerMove() {
  const cells = qsa('.cell');

  /* 
  Detect touch device
  Source: KaMeHb's answer on Stack Overflow(https://stackoverflow.com/questions/56324813/how-to-detect-touch-device-in-2019)
  */
  const isMobile = window.matchMedia('(hover: none)').matches;

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

/**
 * Runs when a human player presses
 * one of the arrow keys.
 * @param {string} pressedKey
 */
function keydownHandler(pressedKey) {
  const cells = qsa('.cell');
  const invisibleCells = qsa('.cell.invisible');
  let visibleCellIndex;

  if (gameOver || gameOver === undefined) return;
  if (computerTurn || computerTurn === undefined) return;

  for (let i = 0; i < NUM_OF_COLUMN; i++) {
    if (!cells[i].classList.contains('invisible')) {
      if (pressedKey === 'ArrowLeft' || pressedKey === 'ArrowRight') {
        cells[i].classList.add('invisible');
      }
      visibleCellIndex = i;
    }
  }

  if (pressedKey === 'ArrowLeft') {
    if (invisibleCells.length === NUM_OF_COLUMN - 1 && visibleCellIndex !== 0) {
      return cells[visibleCellIndex - 1].classList.remove('invisible');
    } else {
      return cells[NUM_OF_COLUMN - 1].classList.remove('invisible');
    }
  }
  if (pressedKey === 'ArrowRight') {
    if (invisibleCells.length === NUM_OF_COLUMN - 1 && visibleCellIndex !== NUM_OF_COLUMN - 1) {
      return cells[visibleCellIndex + 1].classList.remove('invisible');
    } else {
      return cells[0].classList.remove('invisible');
    }
  }
  if (pressedKey === 'ArrowDown') {
    if (invisibleCells.length === NUM_OF_COLUMN) {
      return;
    } else {
      return cellClickHandler(visibleCellIndex);
    }
  }
}

/**
 * Runs when a human player moves the mouse on the board.
 * @param {object} event
 */
function cellMouseoverHandler(event) {
  const cells = qsa('.cell');
  const colIndex = cells.indexOf(event.target) % 7;

  if (gameOver || computerTurn) return;

  for (let i = 0; i < NUM_OF_COLUMN; i++) {
    cells[i].classList.add('invisible');
  }
  cells[colIndex].classList.remove('invisible');
}

/**
 * Runs when a human player clicks on the board.
 * @param {object} event Mouse click event
 */
function calculateColIndex(event) {
  const cells = qsa('.cell');
  const colIndex = cells.indexOf(event.target) % 7;
  cellClickHandler(colIndex);
}

/**
 * Runs when a human player clicks on the board or
 * presses the down arrow key.
 * @param {number} colIndex
 */
function cellClickHandler(colIndex) {
  const cells = qsa('.cell');
  const freeCell = findFreeCell(colIndex);

  if (gameOver || computerTurn || !freeCell) return;

  cells[colIndex].classList.add('invisible');
  placeDisc(freeCell);
}

/**
 * Runs after the computer picks a column or
 * a human player's target column is calculated.
 * @param {number} colIndex The index of the column
 * @returns {object} cell An empty cell
 */
function findFreeCell(colIndex) {
  const cells = qsa(`[data-coords-col="${colIndex}"]`);

  for (let i = cells.length - 1; i >= 0; i--) {
    if (!cells[i].classList.contains('red') && !cells[i].classList.contains('yellow')) {
      return cells[i];
    }
  }
}

/**
 * Runs when there's an empty cell in the column.
 * Places a disc into the target cell.
 * @param {object} cell
 */
function placeDisc(cell) {
  cell.classList.add(player1Turn ? playerData.player1Colour : playerData.player2Colour);
  cell.textContent = `
    ${player1Turn ? playerData.player1Colour.charAt(0) : playerData.player2Colour.charAt(0)}
  `;
  if (!isMuted) {
    dropSound.src = 'assets/sounds/drop.mp3';
    dropSound.play();
  }

  freeCellCounter--;

  if (freeCellCounter === 0) {
    gameOver = true;
    addToLocalstorage(player1Turn ? playerData.player1Name : playerData.player2Name, 0, 0);
    return displayResult('draw');
  } else {
    const connected = checkWinner(player1Turn ? playerData.player1Colour : playerData.player2Colour);
    if (connected) {
      const player1Point = 42 - qsa(`.${playerData.player1Colour}`).length + NUM_OF_COLUMN;
      const player2Point = 42 - qsa(`.${playerData.player2Colour}`).length + NUM_OF_COLUMN;
      gameOver = true;
      addToLocalstorage(player1Turn ? playerData.player1Name : playerData.player2Name, player1Turn ? player1Point : player2Point, 1);
      return displayResult('winner', player1Turn ? playerData.player1Name : playerData.player2Name, player1Turn ? player1Point : player2Point, connected);
    }
  }

  player1Turn = player1Turn ? false : true;
  updateName(player1Turn ? playerData.player1Name : playerData.player2Name);
  updateColour(player1Turn ? playerData.player1Colour : playerData.player2Colour);
  computerTurn = false;

  if ((playerData.player1Type === 'computer' && player1Turn) || (playerData.player2Type === 'computer' && !player1Turn)) {
    computerMove();
  }
}

// Source: Tom Campbell's "Coding Connect 4 with JavaScript"(https://www.youtube.com/watch?v=kA9OOeUXXSU)
/**
 * Runs after the computer or human player places a disc.
 * @param {string} playerColour 
 * @returns {array} The 4 cells that are in a line
 */
function checkWinner(playerColour) {
  const cells = qsa('.cell').splice(NUM_OF_COLUMN);

  for (let index = 0; index < NUM_OF_ROW * NUM_OF_COLUMN; index++) {
    // horizontal line
    if (
      index % NUM_OF_COLUMN < 4 &&
      cells[index].classList.contains(playerColour) &&
      cells[index + 1].classList.contains(playerColour) &&
      cells[index + 2].classList.contains(playerColour) &&
      cells[index + 3].classList.contains(playerColour)
    ) {
      return ([cells[index], cells[index + 1], cells[index + 2], cells[index + 3]]);
    }

    // vertical line
    if (
      index < NUM_OF_COLUMN * 3 &&
      cells[index].classList.contains(playerColour) &&
      cells[index + NUM_OF_COLUMN].classList.contains(playerColour) &&
      cells[index + NUM_OF_COLUMN * 2].classList.contains(playerColour) &&
      cells[index + NUM_OF_COLUMN * 3].classList.contains(playerColour)
    ) {
      return ([cells[index], cells[index + NUM_OF_COLUMN], cells[index + NUM_OF_COLUMN * 2], cells[index + NUM_OF_COLUMN * 3]]);
    }

    // main diagonal(\) line
    if (
      index % NUM_OF_COLUMN < 4 &&
      index < NUM_OF_COLUMN * 3 - 3 &&
      cells[index].classList.contains(playerColour) &&
      cells[index + NUM_OF_COLUMN + 1].classList.contains(playerColour) &&
      cells[index + NUM_OF_COLUMN * 2 + 2].classList.contains(playerColour) &&
      cells[index + NUM_OF_COLUMN * 3 + 3].classList.contains(playerColour)
    ) {
      return ([cells[index], cells[index + NUM_OF_COLUMN + 1], cells[index + NUM_OF_COLUMN * 2 + 2], cells[index + NUM_OF_COLUMN * 3 + 3]]);
    }

    // off-diagonal(/) line
    if (
      index % NUM_OF_COLUMN >= 3 &&
      index < NUM_OF_COLUMN * 3 &&
      cells[index].classList.contains(playerColour) &&
      cells[index + NUM_OF_COLUMN - 1].classList.contains(playerColour) &&
      cells[index + NUM_OF_COLUMN * 2 - 2].classList.contains(playerColour) &&
      cells[index + NUM_OF_COLUMN * 3 - 3].classList.contains(playerColour)
    ) {
      return ([cells[index], cells[index + NUM_OF_COLUMN - 1], cells[index + NUM_OF_COLUMN * 2 - 2], cells[index + NUM_OF_COLUMN * 3 - 3]]);
    }
  }
}

/**
 * Runs when the game is over.
 * Displays the result of the game and the "play again" button.
 * @param {string} result
 * @param {string} player The winner if there is a winner
 * @param {number} point The point if there is a winner
 * @param {array} cells The 4 cells in a line
 */
function displayResult(result, player = null, point = null, cells = null) {
  const overlay = document.createElement('aside');
  let message;
  overlay.className = 'overlay';

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

  if (!isMuted) {
    const endGameSound = new Audio('assets/sounds/end.mp3');
    endGameSound.play();
  }

  overlay.innerHTML = `
    <div class="alert-container result">
      ${message}
      <button class="btn btn-primary" id="playAgainBtn">play again</button>
    </div>
  `;
  gameSection.appendChild(overlay);
  boardEl.style.marginTop = '4rem';

  elById('playAgainBtn').addEventListener('click', runGame);
}

/**
 * Runs at the beginning of each player's turn.
 * Displays the player's name on the screen.
 * @param {string} currentPlayerName
 */
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

/**
 * Runs at the beginning of each player's turn.
 * Update the class name of the first row cells.
 * @param {string} currentPlayerColour
 */
function updateColour(currentPlayerColour) {
  const topCells = qsa('.cell');
  for (let i = 0; i < NUM_OF_COLUMN; i++) {
    topCells[i].classList.remove('yellow');
    topCells[i].classList.remove('red');
    topCells[i].classList.add(currentPlayerColour);
  }
}

/**
 * Runs when the user clicks
 * the sound/mute icon.
 */
function soundBtnToggler() {
  const soundBtns = qsa('.volume-btn');
  isMuted = isMuted ? false : true;

  for (let btn of soundBtns) {
    btn.classList.toggle('active');
  }

  return isMuted;
}

/**
 * Runs when input values are invalid
 * on the New Game page.
 * @returns function
 */
function invalidChangeHandler(type) {
  let text;

  if (type === 'player') {
    text = 'Please select at least one human player.';
    return showAlert(text);
  }
  if (type === 'colour') {
    text = 'Please select a unique colour for each player.';
    return showAlert(text);
  }
}

/**
 * Runs when the user inputs invalid value
 * or clicks the "start" button with invalid value
 * on the New Game page.
 * @param {string} message
 */
function showAlert(message) {
  const overlay = document.createElement('aside');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="alert-container">
      <p class="alert-text">${message}</p>
      <button class="btn alert-btn">OK</button>
    </div>
  `;

  if (settingsSection.lastChild.className === 'overlay') {
    settingsSection.lastChild.remove();
  }

  settingsSection.appendChild(overlay);
  closeAlert();
}

/**
 * Runs when the user clicks
 * the "ok" button in the modal.
 */
function closeAlert() {
  const okBtns = qsa('.alert-btn');
  for (let btn of okBtns) {
    btn.addEventListener('click', (e) => {
      e.target.parentNode.parentNode.remove();
    });
  }
}

/**
 * Runs at the beginning of each game.
 */
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

/**
 * Runs when the user clicks one of the toggle icons
 * in the header on mobile.
 */
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

/**
 * Runs when the user clicks a button to open a page.
 * @param {string} name
 */
function openSection(name) {
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

  if (name === 'settings' || name === 'game' || name === 'help' || name === 'leaderboard') {
    sectionInNav.classList.add('active');
    toggleBtns[0].classList.add('active');
    toggleBtns[1].classList.remove('active');
  }

  if (name === 'game') {
    const gameSectionHeader = elById('gameHeader');
    const noGameText = elById('noGameText');

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

/**
 * Runs when the game is over.
 * Stores the result of the game in local storage.
 * @param {string} name The current player's name
 * @param {number} point The current player's points or 0 if it's a draw
 * @param {number} win 1 if there's a winner otherwise 0
 */
function addToLocalstorage(name, point, win) {
  let opponentName = name === playerData.player1Name ? playerData.player2Name : playerData.player1Name;
  const scores = JSON.parse(localStorage.getItem('scores'));
  const array = [];
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
    array.push(player);
    array.push(opponent);
    localStorage.setItem('scores', JSON.stringify(array));
  }
}

/**
 * Runs when the Leaderboard page opens.
 */
function getFromLocalstorage() {
  const noDataText = elById('noDataText');
  const table = elById('leaderboardTable');
  const tbody = elById('leaderboardTableBody');
  const data = JSON.parse(localStorage.getItem('scores'));

  if (!data) {
    noDataText.style.display = 'block';
    table.style.opacity = '0';
    leaderboardDeleteBtn.style.display = 'none';
    return;
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

  table.style.opacity = '1';
  tbody.innerHTML = '';
  leaderboardDeleteBtn.style.display = 'flex';
  noDataText.style.display = 'none';

  // Source: MDN(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
  mergedData.sort((a, b) => {
    return b.point - a.point;
  });

  if (mergedData.length > 5) {
    for (let i = 0; i < 5; i++) {
      tbody.innerHTML += `
        <tr>
          <td class="leaderboard-table-name">${mergedData[i].name}</td>
          <td>${mergedData[i].point}</td>
          <td>${mergedData[i].win}</td>
          <td>${parseFloat((+mergedData[i].win / +mergedData[i].games) * 100).toFixed(2)}%</td>
        </tr>
      `;
    }
  } else {
    mergedData.forEach(item => {
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

/**
 * Runs when the user clicks
 * the "delete data" button
 * on the leaderboard page.
 */
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

/**
 * Runs when the user clicks the "send" button
 * on the contact page.
 */
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
          openSection('success');
          nameEl.value = '';
          emailEl.value = '';
          messageEl.value = '';
        },
        function () {
          contactSendBtn.innerText = 'send';
          openSection('fail');
        }
      );
  }
}

/* 
Helper functions
Source: Web Dev Simplified's "Stop Wasting Your Time - Use These 16 JS Utility Functions Instead"(https://www.youtube.com/watch?v=EoUIS2PxKCs&t=202s)
*/

/**
 * Helper function of document.getElementById()
 * @param {string} id The element's id
 * @returns The element object that matches the id
 */
function elById(id) {
  return document.getElementById(id);
}

/**
 * Helper function of document.querySelectorAll()
 * @param {string} selector 
 * @returns {array} An array of node list that matches the selector
 */
function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}