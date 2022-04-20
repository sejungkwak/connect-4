// Button elements
const logoLink = elById('logoLink');
const navOpenBtn = elById('navOpenBtn');
const navCloseBtn = elById('navCloseBtn');
const navNewGameBtn = elById('primarySettings');
const navGameBtn = elById('primaryGame');
const navHelpBtn = elById('primaryHelp');
const navLeaderboardBtn = elById('primaryLeaderboard');
const settingStartBtn = elById('settingStartBtn');
const settingCloseBtn = elById('settingCloseBtn');
const soundBtn = elById('soundBtn');
const muteBtn = elById('muteBtn');
const landscapeOkBtn = elById('landscapeOkBtn');
const leaderboardDeleteBtn = elById('leaderboardDeleteBtn');
const successHomeBtn = elById('successHomeBtn');
const failContactBtn = elById('failContactBtn');
const footerContactBtn = elById('footerContactBtn');

// Section elements
const sections = qsa('.section');
const settingsSection = elById('settings');
const gameSection = elById('game');
const contactSection = elById('contact');

// Checkbox input elements in the settings section
const checkboxes = qsa('.setting-checkbox');

// Contact form elements
const contactForm = elById('contactForm');
let nameEl = elById('name');
let emailEl = elById('email');
let messageEl = elById('message');

// Constant values for the game board grid
const NUM_OF_COLUMN = 7;
const NUM_OF_ROW = 6;

// Total available cell. The number decreases after a player places a disc.
let freeCellCounter;

// The game status. The game loop is running while the value is false.
let gameOver;

// The number of games the user played without resetting.
let gamePlayed = 0;

// Current player. The value changes after a player makes a move.
let player1Turn;

// Stores input values from the settings section form
let playerData;

let computerTurn;

let isMuted = true;

// Button Click EventListeners
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
soundBtn.addEventListener('click', soundBtnToggler);
muteBtn.addEventListener('click', soundBtnToggler);
landscapeOkBtn.addEventListener('click', (e) => {
  e.target.parentNode.parentNode.remove();
})
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

// Checkbox change EventListener
checkboxes.forEach(checkbox =>
  checkbox.addEventListener('change', (e) => {
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
document.addEventListener('keydown', e => {
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

  if (player1Type === 'computer' && player2Type === 'computer') {
    return invalidChangeHandler('player');
  }
  if (player1Colour === player2Colour) {
    return invalidChangeHandler('colour');
  }
  if (player1Name && player2Name && player1Name.toUpperCase() === player2Name.toUpperCase()) {
    let text = 'Please make sure each player name is unique.';
    return showAlert(text, 'inputName');
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
 * Creates and configures a new game.
 */
function runGame() {
  const overlays = qsa('.overlay');
  overlays.forEach(overlay => overlay.remove());

  freeCellCounter = 42;
  gameOver = false;
  computerTurn = false;
  gamePlayed++;

  if (gamePlayed % 2 === 0) {
    player1Turn = false;
  } else {
    player1Turn = true;
  }

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
 * Runs when it's a computer's turn:
 * picks a cell and
 * places a disc into the cell.
 */
function computerMove() {
  if (gameOver) return;

  const randomNumber = Math.floor(Math.random() * NUM_OF_COLUMN);
  const freeCell = findFreeCell(randomNumber);
  computerTurn = true;

  if (!freeCell) {
    return computerMove();
  }

  setTimeout(() => {
    placeDisc(freeCell);
  }, 500);
}

/**
 * Places a disc into the cell.
 * @param {object} cell 
 */
function placeDisc(cell) {

  cell.classList.add(player1Turn ? playerData.player1Colour : playerData.player2Colour);
  cell.textContent = `
    ${player1Turn ? playerData.player1Colour.charAt(0) : playerData.player2Colour.charAt(0)}
  `;
  if (!isMuted) {
    const dropSound = new Audio('assets/sounds/drop.mp3');
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

  player1Turn = player1Turn = true ? !player1Turn : player1Turn;

  updateName(player1Turn ? playerData.player1Name : playerData.player2Name);
  updateColour(player1Turn ? playerData.player1Colour : playerData.player2Colour);
  computerTurn = false;

  if ((playerData.player1Type === 'computer' && player1Turn) || (playerData.player2Type === 'computer' && !player1Turn)) {
    computerMove();
  }
}

/**
 * Runs when it's a human player's turn:
 * handles mouse events on each cell.
 */
function playerMove() {
  const cells = qsa('.cell');

  for (let cell of cells) {
    cell.addEventListener('mouseover', cellMouseoverHandler);
    cell.addEventListener('click', calculateColIndex);
  }
}

function calculateColIndex(event) {
  const cells = qsa('.cell');
  const colIndex = cells.indexOf(event.target) % 7;
  cellClickHandler(colIndex);
}

/**
 * Displays the current player's coloured disc
 * in the first row on keydown.
 * @param {string} pressedKey
 */
function keydownHandler(pressedKey) {
  if (gameOver || gameOver === undefined) return;
  if (computerTurn || computerTurn === undefined) return;

  const cells = qsa('.cell');
  const invisibleCells = qsa('.cell.invisible');
  let visibleCellIndex;

  for (let i = 0; i < NUM_OF_COLUMN; i++) {
    if (!cells[i].classList.contains('invisible')) {
      cells[i].classList.add('invisible');
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
 * Displays the current player's coloured disc
 * in the first row on mouseover.
 * @param {object} event 
 */
function cellMouseoverHandler(event) {
  if (gameOver) return;
  if (computerTurn) return;

  const cells = qsa('.cell');
  const colIndex = cells.indexOf(event.target) % 7;

  for (let i = 0; i < NUM_OF_COLUMN; i++) {
    cells[i].classList.add('invisible');
  }

  cells[colIndex].classList.remove('invisible');
}

/**
 * Checks if there is an available cell
 * in the target column and
 * places the disc into the cell.
 * @param {number} colIndex
 */
function cellClickHandler(colIndex) {
  if (gameOver) return;
  if (computerTurn) return;

  const freeCell = findFreeCell(colIndex);

  if (!freeCell) return;
  placeDisc(freeCell);
}

/**
 * Checks if there is an available cell in the column the player clicks on.
 * @param {number} colIndex 
 * @returns 
 */
function findFreeCell(colIndex) {
  const cells = qsa(`[data-coords-col="${colIndex}"]`);

  for (let i = cells.length - 1; i >= 0; i--) {
    if (!cells[i].classList.contains('red') && !cells[i].classList.contains('yellow')) {
      return cells[i];
    }
  }
}

// Source: Tom Campbell's "Coding Connect 4 with JavaScript"(https://www.youtube.com/watch?v=kA9OOeUXXSU)
/**
 * Checks if there's 4 in a line horizonally, vertically and diagonally.
 * @param {string} playerColour 
 * @returns array
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
 * Stores the result of the game in local storage.
 * @param {string} name 
 * @param {number} point 
 * @param {number} win 
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
 * Displays the result of the game and the "play again" button
 * @param {string} result
 * @param {string} player
 * @param {array} cells
 */
function displayResult(result, player, point, cells) {
  const overlay = document.createElement('aside');
  let message;
  overlay.className = 'overlay';

  if (result === 'draw') {
    message = `<h2>It's a draw!</h2>`;
  }

  if (result === 'winner') {
    message = `
      <h2>${player} ${player === 'You' ? 'win!' : 'wins!'}</h2>
      <p>${point} points</p>
    `;
    cells.forEach(cell => cell.innerText = '★');
  }

  if (!isMuted) {
    const endGameSound = new Audio('assets/sounds/end.mp3');
    endGameSound.play();
  }

  overlay.innerHTML = `
    <div class="modal">
      ${message}
      <button class="btn btn-primary" id="playAgainBtn">play again</button>
    </div>
  `;
  gameSection.appendChild(overlay);

  elById('playAgainBtn').addEventListener('click', runGame);
}

/**
 * Displays the current player's name on the screen
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
        cell.className += ' invisible';
      } else {
        cell.dataset.coordsCol = j;
      }
      boardEl.appendChild(cell);
    }
  }
}

/**
 * Checkes invalid game settings:
 * at least one player must be a human and
 * each player must have a different colour.
 * @returns function
 */
function invalidChangeHandler(type) {
  let text;

  if (type === 'player') {
    text = 'Please select at least one human player.';
    return showAlert(text, type);
  }
  if (type === 'colour') {
    text = 'Please select a unique colour for each player.';
    return showAlert(text, type);
  }
}

/**
 * Opens the section specified by the argument and
 * closes other sections except the game section
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

  closeSection();
  targetSection.classList.add('active');
  nav.classList.remove('active');

  for (let navBtn of navBtns) {
    navBtn.classList.remove('visible');
  }

  if (name === 'settings' || name === 'game' || name === 'help' || name === 'leaderboard') {
    sectionInNav.classList.add('active');
    toggleBtns[0].classList.add('active');
    toggleBtns[1].classList.remove('active');
  }

  if (name === 'game') {
    const gameSectionHeader = elById('gameHeader');
    const boardGrid = elById('boardGrid');
    const noGameText = elById('noGameText');

    if (playerData === undefined) {
      gameSectionHeader.style.display = 'none';
      boardGrid.style.display = 'none';
      noGameText.style.display = 'block';
    } else {
      gameSectionHeader.style.display = 'flex';
      boardGrid.style.display = 'grid';
      noGameText.style.display = 'none';
    }
  }
}

/**
 * Closes all the sections and
 * resets the highlighted menu item.
 */
function closeSection() {
  const navBtns = qsa('.nav-btn');

  for (let section of sections) {
    section.classList.remove('active');
  }

  for (let navBtn of navBtns) {
    navBtn.classList.remove('active');
  }
}

/**
 * Toggles between the volume and mute icon, and
 * the isMuted variable value.
 */
function soundBtnToggler() {
  const soundBtns = qsa('.volume-btn');

  for (let btn of soundBtns) {
    btn.classList.toggle('active');
  }

  isMuted = isMuted ? false : true;
  return isMuted;
}

/**
 * Gets data from local storage
 */
function getFromLocalstorage() {
  const noDataText = elById('noDataText');
  const table = elById('leaderboardTableBody');
  const data = JSON.parse(localStorage.getItem('scores'));

  if (!data) {
    noDataText.style.display = 'block';
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

  table.innerHTML = '';
  noDataText.style.display = 'none';

  // Source: MDN(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
  mergedData.sort((a, b) => {
    return b.point - a.point;
  });

  if (mergedData.length > 5) {
    for (let i = 0; i < 5; i++) {
      table.innerHTML += `
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
      table.innerHTML += `
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
 * clear local storage data and 
 * delete it in the leaderboard section
 */
function deleteData() {
  const table = elById('leaderboardTableBody');
  const noDataText = elById('noDataText');

  localStorage.clear();
  table.innerHTML = '';
  noDataText.style.display = 'block';
}

/**
 * Displays an alert modal and a button
 * @param {string} message
 * @param {string} type
 */
function showAlert(message, type = null) {
  const overlay = document.createElement('aside');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="alert-container">
      <p class="alert-text">${message}</p>
      <button class="btn alert-btn">OK</button>
    </div>
  `;

  if (type === null) {
    contactSection.appendChild(overlay);
  } else if (type === 'player' || type === 'colour' || type === 'inputName') {
    settingsSection.appendChild(overlay);
  } else {
    throw `Invalid type: ${type}. Aborting!`;
  }

  closeAlert();
}

function closeAlert() {
  const okBtns = qsa('.alert-btn');
  for (let btn of okBtns) {
    btn.addEventListener('click', (e) => {
      e.target.parentNode.parentNode.remove();
    });
  }
}

function sendMessage() {
  const contactSendBtn = elById('contactSendBtn');
  const templateParams = {
    contactName: nameEl.value,
    contactEmail: emailEl.value,
    contactMsg: messageEl.value
  };

  if (nameEl.value.trim() === '') {
    return nameEl.setCustomValidity('Please fill in your name.');
  } else if (messageEl.value.trim() === '') {
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