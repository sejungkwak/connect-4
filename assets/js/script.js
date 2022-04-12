// Button elements
const logoLink = elById('logoLink');
const navNewGameBtn = elById('primaryNewGame');
const navHelpBtn = elById('primaryHelp');
const navLeaderboardBtn = elById('primaryLeaderboard');
const menuNewGameBtn = elById('newGameBtn');
const menuHelpBtn = elById('helpBtn');
const menuLeaderboardBtn = elById('leaderboardBtn');
const settingStartBtn = elById('settingStartBtn');
const settingCloseBtn = elById('settingCloseBtn');
const soundBtn = elById('soundBtn');
const muteBtn = elById('muteBtn');
const helpCloseBtn = elById('helpCloseBtn');
const leaderboardDeleteBtn = elById('leaderboardDeleteBtn');
const leaderboardCloseBtn = elById('leaderboardCloseBtn');
const contactSendBtn = elById('contactSendBtn');
const contactCloseBtn = elById('contactCloseBtn');
const successHomeBtn = elById('successHomeBtn');
const footerContactBtn = elById('footerContactBtn');

// Section elements
const sections = qsa('.section');
const settingsSection = elById('settings');
const gameSection = elById('board');
const helpSection = elById('help');
const leaderboardSection = elById('leaderboard');
const contactSection = elById('contact');
const successSection = elById('success');

// Checkbox input elements in the settings section
const checkboxes = qsa('.setting-checkbox');

// Constant values for the game board grid
const NUM_OF_COLUMN = 7;
const NUM_OF_ROW = 6;

// Total available cell. The number decreases after a player places a disc.
let freeCellCounter = 42;

// The game status. The game loop is running while the value is false.
let gameOver = false;

// The number of games the user played without resetting.
let gamePlayed;

// Current player. The value changes after a player makes a move.
let player1Turn;

// Stores input values from the settings section form
let playerData;

// Button Click EventListeners
logoLink.addEventListener('click', () => {
  openSection('settings');
});
navNewGameBtn.addEventListener('click', () => {
  openSection('settings');
});
navHelpBtn.addEventListener('click', () => {
  openSection('help');
});
navLeaderboardBtn.addEventListener('click', () => {
  openSection('leaderboard');
});
menuNewGameBtn.addEventListener('click', () => {
  openSection('settings');
});
menuHelpBtn.addEventListener('click', () => {
  openSection('help');
});
menuLeaderboardBtn.addEventListener('click', () => {
  getFromLocalstorage();
  openSection('leaderboard');
})
settingStartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  startBtnHandler();
  openSection('game');
});
settingCloseBtn.addEventListener('click', (e) => {
  e.preventDefault();
  closeSection();
});

// soundBtn => turns on sound effects
soundBtn.addEventListener('click', soundBtnHander);

// muteBtn => turns off sound effects
muteBtn.addEventListener('click', soundBtnHander);

helpCloseBtn.addEventListener('click', closeSection);

// leaderboardDeleteBtn => deletes local storage data
leaderboardDeleteBtn.addEventListener('click', deleteData);

leaderboardCloseBtn.addEventListener('click', closeSection);

// contactSendBtn => sends message, opens successSection, closes contact section
contactSendBtn.addEventListener('click', (e) => {
  e.preventDefault();
  sendMessage();
  openSection('success');
});

contactCloseBtn.addEventListener('click', (e) => {
  e.preventDefault();
  closeSection();
});

successHomeBtn.addEventListener('click', () => {
  openSection('settings');
});

footerContactBtn.addEventListener('click', () => {
  openSection('contact');
});

// Checkbox change EventListener
checkboxes.forEach(checkbox =>
  checkbox.addEventListener('change', invalidChangeHandler));

/**
 * Checks input values from the settings section form,
 * sets player's name if empty and
 * assigns the values to the playerData object.
 */
function startBtnHandler() {
  let player1Type = elById('player1Type').checked ? 'human' : 'computer';
  let player1Colour = elById('player1Colour').checked ? 'red' : 'yellow';
  let player1Name = elById('player1Name').value.trim();
  let player2Type = elById('player2Type').checked ? 'human' : 'computer';
  let player2Colour = elById('player2Colour').checked ? 'red' : 'yellow';
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

  playerData = {
    player1Type,
    player1Colour,
    player1Name,
    player2Type,
    player2Colour,
    player2Name
  }

  gamePlayed = 1;

  runGame();
}

/**
 * Creates and configures a new game.
 */
function runGame() {

  if ( !gamePlayed % 2 === 0 ) {
    player1Turn = true;
  }
  
  createGrid();

  updateName(player1Turn ? playerData.player1Name : playerData.player2Name);
  updateColour(player1Turn ? playerData.player1Colour : playerData.player2Colour);

  if (playerData.player1Type === 'human' && playerData.player2Type === 'human') {
    multiPlayerGame();
  } else {
    singlePlayerGame();
  }
}

/**
 * Calls when both players are human.
 */
function multiPlayerGame() {
  const cells = qsa('.cell');

  for ( let cell of cells ) {
    cell.addEventListener('mouseover', e => cellMouseoverHandler(e));
    cell.addEventListener('mouseout', e => cellMouseoutHandler(e));
    cell.addEventListener('click', e => placeDisc(e));
  }
}

/**
 * Calls when one of players is a computer.
 */
function singlePlayerGame() {

}

/**
 * Displays the current player's coloured disc
 * in the first row on mouseover.
 * @param {object} event 
 */
 function cellMouseoverHandler(event) {
  if (gameOver) return;

  const cells = qsa('.cell');
  const colIndex = cells.indexOf(event.target) % 7;

  cells[colIndex].classList.remove('invisible');
}

/**
 * Hides the current player's coloured disc on mouseout.
 * @param {object} event
 */
 function cellMouseoutHandler(event) {
  const cells = qsa('.cell');
  const colIndex = cells.indexOf(event.target) % 7;

  cells[colIndex].classList.add('invisible');
}

// place the disc in the lowest available cell of the column the player clicks on.
function placeDisc(event) {
}

// checks if there's 4 in a row: horizonal, vertical, main diagonal or off diagonal.
function checkWinner() {
}

// stores the result in the local storage.
function addToLocalstorage() {
}

// displays the game result and the play again button
function displayResult() { 
}

/**
 * Displays the current player's name on the screen
 * @param {string} currentPlayerName
 */
function updateName(currentPlayerName) {
  const currentPlayerEl = elById('currentPlayer');
  let text;

  if (currentPlayerName === 'You') {
    text = 'Your'
  } else {
    text = `${currentPlayerName}'s`
  }

  currentPlayerEl.innerText = text;
}

/**
 * Displays the current player's colour
 * in the first row of the grid on mouseover
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
 * Creates a 6-row by 7-column game board grid
 * with 1 extra row for showing the mouse-over state.
 */
function createGrid() {
  const boardEl = elById('boardGrid');
  boardEl.innerHTML = '';

  for (let i = 0; i < NUM_OF_ROW + 1; i++) {
    for (let j = 0; j < NUM_OF_COLUMN; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      if (i === 0) {
        cell.setAttribute('tabindex', 0);
        cell.className += ' invisible';
      } else {
        cell.dataset.coordsRow = i - 1;
        cell.dataset.coordsCol = j;
      }
      boardEl.appendChild(cell);
    }
  }
}

function clearGrid() {

}

/**
 * Checkes invalid game settings:
 * at least one player must be a human and
 * each player must have a different colour.
 */
function invalidChangeHandler() {

  if (!elById('player1Type').checked && !elById('player2Type').checked) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
    <div class="alert-container">
      <p class="alert-text">Please select at least one human player.</p>
      <button class="btn" onclick="confirmSetting('player')">OK</button>
    </div>
    `
    settingsSection.appendChild(overlay);
  }

  if (elById('player1Colour').checked === elById('player2Colour').checked) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
    <div class="alert-container">
      <p class="alert-text">Please select a unique colour for each player.</p>
      <button class="btn" onclick="confirmSetting('colour')">OK</button>
    </div>
    `
    settingsSection.appendChild(overlay);
  }
}

/**
 * Removes alert modal overlay and
 * change the checkbox value to default.
 * @param {string} type 
 */
function confirmSetting(type) {
  const overlays = qsa('.overlay');
  overlays.forEach(overlay => overlay.remove());

  if (type === 'player') {
    checkboxes[0].checked = false;
    checkboxes[2].checked = true;
  }
  if (type === 'colour') {
    checkboxes[1].checked = false;
    checkboxes[3].checked = true;
  }
}

/**
 * Opens the section specified by the argument and
 * closes other sections except the game section
 * @param {string} name
 */
function openSection(name) {

  for (i = 0; i < sections.length; i++) {
    if (i === 1) {
      continue;
    }
    sections[i].classList.remove('active');
  }

  if (name === 'settings') {
    sections[0].classList.add('active');
  } else if (name === 'game') {
    sections[1].classList.add('active');
  } else if (name === 'help') {
    sections[2].classList.add('active');
  } else if (name === 'leaderboard') {
    sections[3].classList.add('active');
  } else if (name === 'contact') {
    sections[4].classList.add('active');
  } else {
    throw `Invalid section name: ${name}. Aborting!`;
  }
}

/**
 * Closes all the sections except the game section
 */
function closeSection() {
  for (i = 0; i < sections.length; i++) {
    if (i === 1) {
      continue;
    }
    sections[i].classList.remove('active');
  }
}

// Sound button click handler
function soundBtnHander() {

}

// pulls data from the local storage
function getFromLocalstorage() {

}

// Deletes Local storage data
function deleteData() {

}

// Sends user message
function sendMessage() {

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