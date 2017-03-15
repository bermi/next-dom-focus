module.exports = getVerticalMovementInfo;

// The elements might have some minor offsetTop difference caused by
// selected state styling such as outline borders,
// we'll consider there was a row change when the top offset is 5px larger
const OFFSET_TOLERANCE = 5;

function getVerticalMovementInfo(el) {
  var nodeList = el.parentNode.childNodes;
  var totalColumns = countColumns(nodeList);
  var totalElements = nodeList.length;
  var elIndex = indexOf(nodeList, el);
  var elRow = Math.floor(elIndex / totalColumns) + 1;
  var leftOffset = (elIndex % totalColumns);
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
  const topOffset = nodeList[0].offsetTop + OFFSET_TOLERANCE;
  const length = nodeList.length;
  let i;

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