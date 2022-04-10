// Get button elements
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

// Get section elements
const sections = qsa('.section');
const settingsSection = elById('settings');
const gameSection = elById('board');
const helpSection = elById('help');
const leaderboardSection = elById('leaderboard');
const contactSection = elById('contact');
const successSection = elById('success');

// Get checkbox input elements in the settings section
const checkboxes = qsa('.setting-checkbox');

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
  openSection('leaderboard');
})
settingStartBtn.addEventListener('click', (e) => {
  e.preventDefault();
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
 * Checkes invalid game settings:
 * at least one player must be a human and
 * each player must have a different colour.
 */
 function invalidChangeHandler() {
  // checkboxes[0] and checkboxes[2] are for the player type. If unchecked, it's a computer.
  if ( !checkboxes[0].checked && !checkboxes[2].checked ) {
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

  // checkboxes[1] and checkboxes[3] are for the player colour. If unchecked, it's yellow.
  if ( !checkboxes[1].checked && !checkboxes[3].checked || checkboxes[1].checked && checkboxes[3].checked ) {
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

  if ( type === 'player' ) {
    checkboxes[0].checked = false;
    checkboxes[2].checked = true;
  }
  if ( type === 'colour' ) {
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

  for ( i = 0; i < sections.length; i++ ) {
    if ( i === 1 ) { continue; }
    sections[i].classList.remove('active');
  }

  if ( name === 'settings' ) {
    sections[0].classList.add('active');
  } else if ( name === 'game' ) {
    sections[1].classList.add('active');
  } else if ( name === 'help' ) {
    sections[2].classList.add('active');
  } else if ( name === 'leaderboard' ) {
    sections[3].classList.add('active');
  } else if ( name === 'contact' ) {
    sections[4].classList.add('active');
  } else {
    throw `Invalid section name: ${name}. Aborting!`;
  }
}

/**
 * Closes all the sections except the game section
 */
function closeSection() {
  for ( i = 0; i < sections.length; i++ ) {
    if ( i === 1 ) { continue; }
    sections[i].classList.remove('active');
  }
}

// Sound button click handler
function soundBtnHander() {

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