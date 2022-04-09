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
const settingsSection = elById('settings');
const gameSection = elById('board');
const helpSection = elById('help');
const leaderboardSection = elById('leaderboard');
const contactSection = elById('contact');
const successSection = elById('success');

// Button Click EventListeners

// logoLink => opens settingsSection, closes other sections
logoLink.addEventListener('click', () => {
  openSection('settings');
  closeSection();
});

// navNewGameBtn => opens settingsSection, closes other sections except gameSection if active
navNewGameBtn.addEventListener('click', () => {
  openSection('settings');
  closeSection();
});

// navHelpBtn => opens helpSection, closes other sections except gameSection if active
navHelpBtn.addEventListener('click', () => {
  openSection('help');
  closeSection();
});

// navLeaderboardBtn => opens leaderboardSection, closes other sections except gameSection if active
navLeaderboardBtn.addEventListener('click', () => {
  openSection('leaderboard');
  closeSection();
});

// settingStartBtn => oepns gameSection, closes other sections
settingStartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openSection('game');
  closeSection();
});

// settingCloseBtn => closes settingsSection
settingCloseBtn.addEventListener('click', (e) => {
  e.preventDefault();
  closeSection();
});

// soundBtn => turns on sound effects
soundBtn.addEventListener('click', soundBtnHander);

// muteBtn => turns off sound effects
muteBtn.addEventListener('click', soundBtnHander);

// helpCloseBtn => closes helpSection
helpCloseBtn.addEventListener('click', closeSection);

// leaderboardDeleteBtn => deletes local storage data
leaderboardDeleteBtn.addEventListener('click', deleteData);

// leaderboardCloseBtn => closes leaderboardSection
leaderboardCloseBtn.addEventListener('click', closeSection);

// contactSendBtn => sends message, opens successSection, closes contact section
contactSendBtn.addEventListener('click', (e) => {
  e.preventDefault();
  sendMessage();
  openSection('success');
  closeSection();
});

// contactCloseBtn => closes contactSection
contactCloseBtn.addEventListener('click', (e) => {
  e.preventDefault();
  closeSection();
});

// successHomeBtn => closes successSection, opens settingsSection
successHomeBtn.addEventListener('click', () => {
  openSection('settings');
  closeSection();
});

// footerContactBtn => opens contactSection, closes other sections except gameSection if active
footerContactBtn.addEventListener('click', () => {
  openSection('contact');
  closeSection();
});

// Opens a section
function openSection(name) {

}

// closes all section except game board section
function closeSection() {

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