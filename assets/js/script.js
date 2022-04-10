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