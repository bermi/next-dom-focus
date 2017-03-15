(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.domFocus = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = getNextDomFocus;

var getVerticalMovementInfo = require("./vertical_movement_info");

var handlers = {
  left: left,
  right: right,
  up: up,
  down: down
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
  var nodeList = el.parentNode.childNodes;
  var totalElements = nodeList.length;
  var elIndex = indexOf(nodeList, el);

  return nodeList[elIndex - 1 < 0 ? totalElements - 1 : elIndex - 1];
}

function right(el) {
  var nodeList = el.parentNode.childNodes;
  var totalElements = nodeList.length;
  var elIndex = indexOf(nodeList, el);
  return nodeList[elIndex + 1 >= totalElements ? 0 : elIndex + 1];
};

function up(el) {
  var info = getVerticalMovementInfo(el);

  var newPos = info.previousRow * info.totalColumns - info.totalColumns + info.leftOffset;

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
  var info = getVerticalMovementInfo(el);

  var newPos = info.nextRow * info.totalColumns - info.totalColumns + info.leftOffset;

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
  var valid = Object.keys(handlers).join(", ");
  throw new Error("Invalid direction " + direction + ". Valid directions are: " + valid);
}

function indexOf(pseudoArray, target) {
  return Array.prototype.indexOf.call(pseudoArray, target);
}
},{"./vertical_movement_info":2}],2:[function(require,module,exports){
"use strict";

module.exports = getVerticalMovementInfo;

// The elements might have some minor offsetTop difference caused by
// selected state styling such as outline borders,
// we'll consider there was a row change when the top offset is 5px larger
var OFFSET_TOLERANCE = 5;

function getVerticalMovementInfo(el) {
  var nodeList = el.parentNode.childNodes;
  var totalColumns = countColumns(nodeList);
  var totalElements = nodeList.length;
  var elIndex = indexOf(nodeList, el);
  var elRow = Math.floor(elIndex / totalColumns) + 1;
  var leftOffset = elIndex % totalColumns;
  var totalRows = Math.ceil(totalElements / totalColumns);

  return {
    nodeList: nodeList,
    totalColumns: totalColumns,
    totalElements: totalElements,
    elIndex: elIndex,
    elRow: elRow,
    leftOffset: leftOffset,
    previousRow: elRow > 1 ? elRow - 1 : totalRows,
    nextRow: elRow === totalRows ? 1 : elRow + 1,
    totalRows: totalRows
  };
}

// Gets the total number of elements that fit within a single row.
// It uses the slow offsetTop instead of the even slower getComputedStyle
// https://gist.github.com/paulirish/5d52fb081b3570c81e3a#getcomputedstyle
// Using getComputedStyle is the only way to know what's the real space
// taken by each element, since .clientWidth will not include margins.
function countColumns(nodeList) {
  // The elements might have some minor offsetTop difference caused by
  // selected state styling such as outline borders,
  // we'll consider there was a row change when the top offset is 5px larger
  var topOffset = nodeList[0].offsetTop + OFFSET_TOLERANCE;
  var length = nodeList.length;
  var i = void 0;

  for (i = 1; length > i; i = i + 1) {
    if (nodeList[i].offsetTop > topOffset) {
      return i;
    }
  }
  return length;
}

function indexOf(pseudoArray, target) {
  return Array.prototype.indexOf.call(pseudoArray, target);
}
},{}]},{},[1])(1)
});