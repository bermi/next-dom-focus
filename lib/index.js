module.exports = getNextDomFocus;

const getVerticalMovementInfo = require("./vertical_movement_info");

const handlers = {
  left,
  right,
  up,
  down
};

/**
 * Given a grid of DOM elements and a currently focused element
 * this function will allow us to find out what elements can be found on the
 * following positions: left, right, down and up.
 *
 * This will be used to allow keyboard navigation on collection of swatches
 * like attribute values and facets. Keyboard navigation is a requirement
 * for being ADA compliant CD-3225
 *
 * For Example:
 *
 *      [
 *        a1, b1, c1, d1,
 *        a2, b2, c2, d2,
 *        a3, b3
 *      ]
 *
 * When navigating on this grid, the following behaviors are expected:
 *
 *  - When focus is on a1:
 *    - pressing left will move focus to b3
 *    - pressing right will move focus to b1
 *    - pressing up will move focus to a3
 *    - pressing down will move focus to a2
 *   - When focus is on c2:
 *     - Pressing down will move focus to b3
 *   - When focus is on c1:
 *     - Pressing up will move focus to b3
 *   - When focus is on b3:
 *     - Pressing down will move focus to b1
 *     - Pressing right will move focus to a1
 *
 * In order to know how many elements can exist on a row the width of the parent
 * container of the focused element and it's own width will be used.
 *
 * Usage:
 *
 *      const getNextDomFocus = require("next-dom-focus");
 *
 *      const directionString = "up"; // left, right, up, down
 *      const elementToFocus = getNextDomFocus(
 *        focusedElement,
 *        directionString
 *       );
 *
 *      // Now you can change the focused element
 *      elementToFocus.focus();
 */
function getNextDomFocus(el, direction) {
  return (handlers[direction] || fail(direction))(el);
}

// Using handlers instead of switch cases because we only need to run
// expensive style calculations when moving up and down the grid

function left(el) {
  const nodeList = el.parentNode.childNodes;
  const totalElements = nodeList.length;
  const elIndex = indexOf(nodeList, el);

  return nodeList[elIndex - 1 < 0 ? totalElements - 1 : elIndex - 1];
}

function right(el) {
  const nodeList = el.parentNode.childNodes;
  const totalElements = nodeList.length;
  const elIndex = indexOf(nodeList, el);
  return nodeList[elIndex + 1 >= totalElements ? 0 : elIndex + 1];
};

function up(el) {
  const info = getVerticalMovementInfo(el);

  const newPos = (info.previousRow * info.totalColumns) -
    info.totalColumns + info.leftOffset;

  // The element is out of reach so we'll move to the same leftOffset
  // on the previous row.
  //
  //  a1 b1 (c1) d1
  //  a2 b2 [c2] d2
  //  a3 b3
  //
  //  For example when the user is on (c1) and up takes them to [c2]
  if (newPos >= info.totalElements) {
    return info.nodeList[newPos - info.totalColumns];
  }

  return info.nodeList[newPos];
}

function down(el) {
  const info = getVerticalMovementInfo(el);

  const newPos = (info.nextRow * info.totalColumns) -
    info.totalColumns + info.leftOffset;

  // The element is out of reach so we'll move to the same leftOffset
  // on the previous row.
  //
  //  a1 b1 (c1) d1
  //  a2 b2 [c2] d2
  //  a3 b3
  //
  //  For example when the user is on (c1) and up takes them to [c2]
  if (newPos >= info.totalElements) {
    return info.nodeList[newPos - info.totalColumns];
  }

  return info.nodeList[newPos];
}


function fail(direction) {
  const valid = Object.keys(handlers).join(", ");
  throw new Error(
    `Invalid direction ${direction}. Valid directions are: ${valid}`
  );
}


function indexOf(pseudoArray, target) {
  return Array.prototype.indexOf.call(pseudoArray, target);
}