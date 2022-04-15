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
const failContactBtn = elById('failContactBtn');
const footerContactBtn = elById('footerContactBtn');

// Section elements
const sections = qsa('.section');
const settingsSection = elById('settings');
const gameSection = elById('board');
const helpSection = elById('help');
const leaderboardSection = elById('leaderboard');
const contactSection = elById('contact');
const successSection = elById('success');
const failSection = elById('fail');

const mainEl = elById('mainEl');

// Checkbox input elements in the settings section
const checkboxes = qsa('.setting-checkbox');

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
const dropSound = new Audio('assets/sounds/drop.mp3');
const endGameSound = new Audio('assets/sounds/end.mp3');

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
  getFromLocalstorage();
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
});
settingCloseBtn.addEventListener('click', (e) => {
  e.preventDefault();
  closeSection();
});
soundBtn.addEventListener('click', soundBtnToggler);
muteBtn.addEventListener('click', soundBtnToggler);
helpCloseBtn.addEventListener('click', closeSection);
leaderboardDeleteBtn.addEventListener('click', deleteData);
leaderboardCloseBtn.addEventListener('click', closeSection);
contactSendBtn.addEventListener('click', (e) => {
  e.preventDefault();
  validateForm();
});
contactCloseBtn.addEventListener('click', (e) => {
  e.preventDefault();
  closeSection();
});
successHomeBtn.addEventListener('click', () => {
  openSection('settings');
});
failContactBtn.addEventListener('click', () => {
  openSection('contact');
})
footerContactBtn.addEventListener('click', () => {
  openSection('contact');
});

// Checkbox change EventListener
checkboxes.forEach(checkbox =>
  checkbox.addEventListener('change', invalidChangeHandler));

mainEl.style.minHeight = `${sections[0].offsetHeight}px`

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

  if (player1Name && player2Name && player1Name.toUpperCase() === player2Name.toUpperCase()) {
    const text = 'Please make sure each player name is unique!'
    return alertMessage(text, 'inputName');
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
  }

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
  `
  if (!isMuted) {
    // Source: Dani Amsalem's answer on Stack Overflow(https://stackoverflow.com/questions/54896134/sound-not-always-playing-with-javascript)
    dropSound.currentTime = 0;
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
    cell.addEventListener('mouseout', cellMouseoutHandler);
    cell.addEventListener('click', (e) => {
      const colIndex = cells.indexOf(e.target) % 7;
      cellClickHandler(colIndex);
    });
  }

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowDown':
        keydownHandler(e.key);
      default:
        break;
    }
  })
}

/**
 * Displays the current player's coloured disc
 * in the first row on keydown.
 * @param {string} pressedKey 
 */
function keydownHandler(pressedKey) {
  if (gameOver) return;
  if (computerTurn) return;

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
  }

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
  const overlay = document.createElement('div');
  let message;
  overlay.className = 'overlay';

  if (result === 'draw') {
    message = `<h2>It's a draw!</h2>`
  }

  if (result === 'winner') {
    message = `
      <h2>${player} ${player === 'You' ? 'win!' : 'wins!'}</h2>
      <p>${point} points</p>
    `
    cells.forEach(cell => cell.innerText = '★');
  }

  if (!isMuted) {
    endGameSound.play();
  }

  overlay.innerHTML = `
    <div class="modal">
      ${message}
      <button class="btn" id="playAgainBtn">play again</button>
    </div>
  `
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

/**
 * Checkes invalid game settings:
 * at least one player must be a human and
 * each player must have a different colour.
 * @returns function
 */
function invalidChangeHandler() {
  let text;

  if (!elById('player1Type').checked && !elById('player2Type').checked) {
    text = 'Please select at least one human player.';
    return alertMessage(text, 'player');
  }
  if (elById('player1Colour').checked === elById('player2Colour').checked) {
    text = 'Please select a unique colour for each player.';
    return alertMessage(text, 'colour');
  }
}

/**
 * Opens the section specified by the argument and
 * closes other sections except the game section
 * @param {string} name
 */
function openSection(name) {
  const navBtns = qsa('.nav-btn');
  closeSection();

  if (name === 'settings') {
    sections[0].classList.add('active');
    navBtns[0].classList.add('active');
    mainEl.style.minHeight = `${sections[0].offsetHeight}px`
  } else if (name === 'game') {
    sections[1].classList.add('active');
    mainEl.style.minHeight = `${sections[1].offsetHeight}px`
  } else if (name === 'help') {
    sections[2].classList.add('active');
    navBtns[1].classList.add('active');
    mainEl.style.minHeight = `${sections[2].offsetHeight}px`
  } else if (name === 'leaderboard') {
    sections[3].classList.add('active');
    navBtns[2].classList.add('active');
    mainEl.style.minHeight = `${sections[3].offsetHeight}px`
  } else if (name === 'contact') {
    sections[4].classList.add('active');
    mainEl.style.minHeight = `${sections[4].offsetHeight}px`
  } else if (name === 'success') {
    sections[5].classList.add('active');
    mainEl.style.minHeight = `${sections[5].offsetHeight}px`
  } else if (name === 'fail') {
    sections[6].classList.add('active');
    mainEl.style.minHeight = `${sections[6].offsetHeight}px`
  } else {
    throw `Invalid section name: ${name}. Aborting!`;
  }
}

/**
 * Closes all the sections except the game section and
 * resets the highlighted menu item.
 */
function closeSection() {
  const navBtns = qsa('.nav-btn');

  for (i = 0; i < sections.length; i++) {
    if (i === 1) {
      continue;
    }
    sections[i].classList.remove('active');
  }

  for (const navBtn of navBtns) {
    navBtn.classList.remove('active');
  }

  mainEl.style.minHeight = 'unset';
}

/**
 * Toggles between the volume and mute icon, and
 * the isMuted variable value.
 */
function soundBtnToggler() {
  const soundBtns = qsa('.volume-btn');

  for (const btn of soundBtns) {
    btn.classList.toggle('active');
  }

  return isMuted = isMuted ? false : true;
}

/**
 * Gets data from local storage
 */
function getFromLocalstorage() {
  const noDataText = elById('noDataText');
  const table = elById('leaderboardTableBody');
  const data = JSON.parse(localStorage.getItem('scores'));

  if (!data) {
    return noDataText.style.display = 'block';
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
    return newArray
  }, []);

  table.innerHTML = '';

  // Source: MDN(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
  mergedData.sort((a, b) => {
    return b.point - a.point;
  })

  if (mergedData.length > 5) {
    noDataText.style.display = 'none';
    for (let i = 0; i < 5; i++) {
      table.innerHTML += `
        <tr>
          <td class="leaderboard-table-name">${mergedData[i].name}</td>
          <td>${mergedData[i].point}</td>
          <td>${mergedData[i].win}</td>
          <td>${parseFloat(mergedData[i].win / mergedData[i].games).toFixed(2) * 100}%</td>
        </tr>
      `
    }
  } else {
    noDataText.style.display = 'none';
    mergedData.forEach(item => {
      table.innerHTML += `
        <tr>
          <td class="leaderboard-table-name">${item.name}</td>
          <td>${item.point}</td>
          <td>${item.win}</td>
          <td>${parseFloat(item.win / item.games).toFixed(2) * 100}%</td>
        </tr>
      `
    })
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
 * Validate contact form input:
 * if empty, calls a function that displays an alert modal, 
 * if filled, calls a function that sends the message.
 * @returns function
 */
function validateForm() {
  const nameEl = elById('name').value.trim();
  const emailEl = elById('email').value.trim();
  const messageEl = elById('message').value.trim();
  const templateParams = {
    nameEl,
    emailEl,
    messageEl,
  };
  let text;

  if (!nameEl) {
    text = 'please fill in your name!';
    return alertMessage(text);
  }
  if (!emailEl) {
    text = 'please fill in your email address!';
    return alertMessage(text);
  }
  if (!messageEl || messageEl.length < 10) {
    text = 'please write your message at least 10 characters!';
    return alertMessage(text);
  }

  return sendMessage(templateParams);
}

/**
 * Displays an alert modal and a button
 * @param {string} message
 * @param {string} type
 */
function alertMessage(message, type = null) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="alert-container">
      <p class="alert-text">${message}</p>
      <button class="btn" id="confirmBtn">OK</button>
    </div>
  `

  if (type === null) {
    contactSection.appendChild(overlay);
  } else if (type === 'inputName' || type === 'player' || type === 'colour') {
    settingsSection.appendChild(overlay);
  } else {
    throw `Invalid type: ${type}. Aborting!`;
  }

  elById('confirmBtn').addEventListener('click', () => {
    confirmAlert(type)
  })
}

/**
 * Removes alert modal overlay and
 * change the checkbox value to default.
 * @param {string} type
 */
function confirmAlert(type = null) {
  const overlays = qsa('.overlay');
  overlays.forEach((overlay) => overlay.remove());

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
 * Sends the user's message
 * @param {object} templateParams 
 */
function sendMessage(templateParams) {
  const nameEl = elById('name').value;
  const emailEl = elById('email').value;
  const messageEl = elById('message').value;

  emailjs
    .send(
      'service_sy89ugk',
      'template_3440jzv',
      templateParams,
      'SkcIApcdBA67fNkU0'
    )
    .then(
      function () {
        openSection('success');
        nameEl = '';
        emailEl = '';
        messageEl = '';
      },
      function () {
        openSection('fail');
      }
    );
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