# next-dom-focus

Helper library to compute how equally sized DOM siblings are stacked on a grid.

[![Build Status](https://api.travis-ci.org/bermi/next-dom-focus.svg)](http://travis-ci.org/bermi/next-dom-focus)  [![Dependency Status](https://david-dm.org/bermi/next-dom-focus.svg)](https://david-dm.org/bermi/next-dom-focus) [![](http://img.shields.io/npm/v/next-dom-focus.svg) ![](http://img.shields.io/npm/dm/next-dom-focus.svg)](https://www.npmjs.org/package/next-dom-focus)

Given a grid of DOM elements and a currently focused element this function will allow us to find out what elements can be found on the following positions: left, right, down and up.

This can be used to allow keyboard navigation on collection of DOM elements for improving accessibility.

For Example:

     [
       a1, b1, c1, d1,
       a2, b2, c2, d2,
       a3, b3
     ]

When navigating on this grid, the following behaviors are expected:

- When focus is on a1:
 - pressing left will move focus to b3
 - pressing right will move focus to b1
 - pressing up will move focus to a3
 - pressing down will move focus to a2

- When focus is on c2:
  - Pressing down will move focus to b3

- When focus is on c1:
  - Pressing up will move focus to b3

- When focus is on b3:
  - Pressing down will move focus to b1
  - Pressing right will move focus to a1

In order to know how many elements can exist on a row the width of the parent container of the focused element and it's own width will be used.

## Installation

### As an npm module

    $ npm install next-dom-focus

### From the browser

window.getNextDomFocus will be exposed when including dist/next-dom-focus.min.js

    <script src="https://raw.github.com/bermi/next-dom-focus/master/dist/next-dom-focus.min.js" type="text/javascript"></script>


## Usage

    const getNextDomFocus = require("next-dom-focus");

    const directionString = "up"; // left, right, up, down

    const elementToFocus = getNextDomFocus(
      focusedElement,
      directionString
    );

    // Now you can change the focused element
    elementToFocus.focus();


## Running tests

    npm run test

## Building

    npm run build

## License

(The MIT License)

Copyright (c) 2017 Fluid, Inc, Bermi Ferrer &lt;bferrer@fluid.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.