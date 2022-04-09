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