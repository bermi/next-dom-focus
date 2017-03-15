const getDomElement = require("../lib/"),
  expect = require("expect.js");

const _ = require("lodash");
const getVerticalMovementInfo = require("../lib/vertical_movement_info");

describe("next-dom-focus", function () {

  describe("When passing invalid options", function () {
    it("should provide a useful error message", function () {
      expect(function () {
        getDomElement([], "foo");
      }).to.throwError("Invalid direction foo. " +
        "Valid directions are: left, right, up, down");
    });
  });

  /**
   We are going to create the following grid:
  */
  const multiColumnLayout = "\n" +
    "\n        a1 b1 c1 d1" +
    "\n        a2 b2 c2 d2" +
    "\n        a3 b3\n\n";
  describe("When navigating on the grid" + multiColumnLayout, function () {
    const grid = [];
    const gridHash = {};

    before(function () {
      function mockDomEl(name, offsetTop) {
        const el = {
          name: name,
          offsetTop: offsetTop,
          parentNode: {
            childNodes: grid
          }
        };
        gridHash[name] = el;
        grid.push(el);
      }

      mockDomEl("a1", 0);
      mockDomEl("b1", 0);
      mockDomEl("c1", 0);
      mockDomEl("d1", 0);
      mockDomEl("a2", 15);
      mockDomEl("b2", 15);
      mockDomEl("c2", 15);
      mockDomEl("d2", 15);
      mockDomEl("a3", 30);
      mockDomEl("b3", 30);
    });

    context("element position detection should", function () {
      const gridInfo = {};

      before(function () {
        Object.keys(gridHash).forEach(function (name) {
          gridInfo[name] = getVerticalMovementInfo(gridHash[name]);
        });
      });

      it("should include totalColumns on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalColumns).to.be(4);
        });
      });

      it("should include totalElements on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalElements).to.be(10);
        });
      });

      it("should include totalRows on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalRows).to.be(3);
        });
      });

      it("should include elIndex on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.elIndex).to.be.below(info.totalElements);
          expect(info.elIndex).to.be.above(-1);
        });
      });

      it("should include elRow on info", function () {
        _.forEach(gridInfo, function (info, name) {
          const match = name.match(/(\w+)(\d+)/);
          expect(match[1] + info.elRow).to.be(match[1] + match[2]);
        });
      });

      it("should include leftOffset on info", function () {
        const offsets = {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          e: 4
        };
        _.forEach(gridInfo, function (info, name) {
          const match = name.match(/(\w+)(\d+)/);
          expect(name + "(" + info.leftOffset + ")")
            .to.be(name + "(" + offsets[match[1]] + ")");
        });
      });

      it("should include previousRow on info", function () {
        const previousRows = {
          a1: 3,
          b1: 3,
          c1: 3,
          d1: 3,
          a2: 1,
          b2: 1,
          c2: 1,
          d2: 1,
          a3: 2,
          b3: 2
        };

        _.forEach(gridInfo, function (info, name) {
          expect(name + "(" + info.previousRow + ")")
            .to.be(name + "(" + previousRows[name] + ")");
        });
      });

      it("should include nextRow on info", function () {
        const nextRows = {
          a1: 2,
          b1: 2,
          c1: 2,
          d1: 2,
          a2: 3,
          b2: 3,
          c2: 3,
          d2: 3,
          a3: 1,
          b3: 1
        };

        _.forEach(gridInfo, function (info, name) {
          expect(name + "(" + info.nextRow + ")")
            .to.be(name + "(" + nextRows[name] + ")");
        });
      });

    });

    context("and focus is on \"a1\" it", function () {

      it("should focus \"b3\" when going to the \"left\"", function () {
        expect(getDomElement(gridHash.a1, "left").name).to.eql("b3");
      });

      it("should focus \"b1\" when going to the \"right\"", function () {
        expect(getDomElement(gridHash.a1, "right").name).to.eql("b1");
      });

      it("should focus \"a3\" when going \"up\"", function () {
        expect(getDomElement(gridHash.a1, "up").name).to.eql("a3");
      });

      it("should focus \"a2\" when going \"down\"", function () {
        expect(getDomElement(gridHash.a1, "down").name).to.eql("a2");
      });
    });

    describe("and focus is on \"c2\" it", function () {

      it("should focus \"c2\" when going \"down\"", function () {
        expect(getDomElement(gridHash.c2, "down").name).to.eql("c2");
      });

    });

    describe("and focus is on \"c1\" it", function () {

      it("should focus \"c2\" when going \"up\"", function () {
        expect(getDomElement(gridHash.c1, "up").name).to.eql("c2");
      });

    });

    describe("and focus is on \"b3\" it", function () {

      it("should focus \"b1\" when going \"down\"", function () {
        expect(getDomElement(gridHash.b3, "down").name).to.eql("b1");
      });

      it("should focus \"a1\" when going to the \"right\"", function () {
        expect(getDomElement(gridHash.b3, "right").name).to.eql("a1");
      });

    });



  });

  /**
   We are going to create the following grid:
  */
  const singleColumnLayout = "\n" +
    "\n        a1 b1 c1 d1\n\n";
  describe("When navigating on the grid" + singleColumnLayout, function () {
    const grid = [];
    const gridHash = {};

    before(function () {
      function mockDomEl(name, offsetTop) {
        const el = {
          name: name,
          offsetTop: offsetTop,
          parentNode: {
            childNodes: grid
          }
        };
        gridHash[name] = el;
        grid.push(el);
      }

      mockDomEl("a1", 0);
      mockDomEl("b1", 0);
      mockDomEl("c1", 0);
      mockDomEl("d1", 0);
    });


    context("element position detection should", function () {
      const gridInfo = {};

      before(function () {
        Object.keys(gridHash).forEach(function (name) {
          gridInfo[name] = getVerticalMovementInfo(gridHash[name]);
        });
      });


      it("should include totalColumns on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalColumns).to.be(4);
        });
      });

      it("should include totalElements on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalElements).to.be(4);
        });
      });

      it("should include totalRows on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalRows).to.be(1);
        });
      });


      it("should include elIndex on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.elIndex).to.be.below(info.totalElements);
          expect(info.elIndex).to.be.above(-1);
        });
      });

      it("should include elRow on info", function () {
        _.forEach(gridInfo, function (info, name) {
          const match = name.match(/(\w+)(\d+)/);
          expect(match[1] + info.elRow).to.be(match[1] + match[2]);
        });
      });

      it("should include leftOffset on info", function () {
        const offsets = {
          a: 0,
          b: 1,
          c: 2,
          d: 3
        };
        _.forEach(gridInfo, function (info, name) {
          const match = name.match(/(\w+)(\d+)/);
          expect(name + "(" + info.leftOffset + ")")
            .to.be(name + "(" + offsets[match[1]] + ")");
        });
      });

      it("should include previousRow on info", function () {
        const previousRows = {
          a1: 1,
          b1: 1,
          c1: 1,
          d1: 1
        };

        _.forEach(gridInfo, function (info, name) {
          expect(name + "(" + info.previousRow + ")")
            .to.be(name + "(" + previousRows[name] + ")");
        });
      });

      it("should include nextRow on info", function () {
        const nextRows = {
          a1: 1,
          b1: 1,
          c1: 1,
          d1: 1
        };

        _.forEach(gridInfo, function (info, name) {
          expect(name + "(" + info.nextRow + ")")
            .to.be(name + "(" + nextRows[name] + ")");
        });
      });


    });

    context("and focus is on \"a1\" it", function () {

      it("should focus \"d1\" when going to the \"left\"", function () {
        expect(getDomElement(gridHash.a1, "left").name).to.eql("d1");
      });

      it("should focus \"b1\" when going to the \"right\"", function () {
        expect(getDomElement(gridHash.a1, "right").name).to.eql("b1");
      });

      it("should keep focus on \"a1\" when going \"up\"", function () {
        expect(getDomElement(gridHash.a1, "up").name).to.eql("a1");
      });

      it("should keep focus on \"a1\" when going \"down\"", function () {
        expect(getDomElement(gridHash.a1, "down").name).to.eql("a1");
      });
    });

    context("and focus is on \"d1\" it", function () {

      it("should focus \"d1\" when going \"down\"", function () {
        expect(getDomElement(gridHash.d1, "down").name).to.eql("d1");
      });
    });

  });


  const doubleColumnLayout = "\n" +
    "\n        a1 b1 c1 d1 e1 f1" +
    "\n        a2 b2 c2 d2 e2\n\n";
  describe("When navigating on the grid" + doubleColumnLayout, function () {
    const grid = [];
    const gridHash = {};

    before(function () {
      function mockDomEl(name, offsetTop) {
        const el = {
          name: name,
          offsetTop: offsetTop,
          parentNode: {
            childNodes: grid
          }
        };
        gridHash[name] = el;
        grid.push(el);
      }

      mockDomEl("a1", 0);
      mockDomEl("b1", 0);
      mockDomEl("c1", 0);
      mockDomEl("d1", 0);
      mockDomEl("e1", 0);
      mockDomEl("f1", 0);
      mockDomEl("a2", 30);
      mockDomEl("b2", 30);
      mockDomEl("c2", 30);
      mockDomEl("d2", 30);
      mockDomEl("e2", 30);
    });

    context("element position detection should", function () {
      const gridInfo = {};

      before(function () {
        Object.keys(gridHash).forEach(function (name) {
          gridInfo[name] = getVerticalMovementInfo(gridHash[name]);
        });
      });


      it("should include totalColumns on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalColumns).to.be(6);
        });
      });

      it("should include totalElements on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalElements).to.be(11);
        });
      });

      it("should include totalRows on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalRows).to.be(2);
        });
      });

      it("should include elIndex on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.elIndex).to.be.below(info.totalElements);
          expect(info.elIndex).to.be.above(-1);
        });
      });

      it("should include elRow on info", function () {
        _.forEach(gridInfo, function (info, name) {
          const match = name.match(/(\w+)(\d+)/);
          expect(match[1] + info.elRow).to.be(match[1] + match[2]);
        });
      });

      it("should include leftOffset on info", function () {
        const offsets = {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          e: 4,
          f: 5
        };
        _.forEach(gridInfo, function (info, name) {
          const match = name.match(/(\w+)(\d+)/);
          expect(name + "(" + info.leftOffset + ")")
            .to.be(name + "(" + offsets[match[1]] + ")");
        });
      });

      it("should include previousRow on info", function () {
        const previousRows = {
          a1: 2,
          b1: 2,
          c1: 2,
          d1: 2,
          e1: 2,
          f1: 2,
          a2: 1,
          b2: 1,
          c2: 1,
          d2: 1,
          e2: 1
        };

        _.forEach(gridInfo, function (info, name) {
          expect(name + "(" + info.previousRow + ")")
            .to.be(name + "(" + previousRows[name] + ")");
        });
      });

      it("should include nextRow on info", function () {
        const nextRows = {
          a1: 2,
          b1: 2,
          c1: 2,
          d1: 2,
          e1: 2,
          f1: 2,
          a2: 1,
          b2: 1,
          c2: 1,
          d2: 1,
          e2: 1
        };

        _.forEach(gridInfo, function (info, name) {
          expect(name + "(" + info.nextRow + ")")
            .to.be(name + "(" + nextRows[name] + ")");
        });
      });

    });

    context("and focus is on \"c1\" it", function () {

      it("should focus \"c2\" when going \"up\"", function () {
        expect(getDomElement(gridHash.c1, "up").name).to.eql("c2");
      });

    });

    context("and focus is on \"c2\" it", function () {

      it("should focus \"c1\" when going \"down\"", function () {
        expect(getDomElement(gridHash.c2, "down").name).to.eql("c1");
      });

    });

  });


  /**
   We are going to create the following grid:
  */
  const singleEntryLayout = "\n" +
    "\n        a1\n\n";
  describe("When navigating on the grid" + singleEntryLayout, function () {
    const grid = [];
    const gridHash = {};

    before(function () {
      function mockDomEl(name, offsetTop) {
        const el = {
          name: name,
          offsetTop: offsetTop,
          parentNode: {
            childNodes: grid
          }
        };
        gridHash[name] = el;
        grid.push(el);
      }

      mockDomEl("a1", 0);
    });


    context("element position detection should", function () {
      const gridInfo = {};

      before(function () {
        Object.keys(gridHash).forEach(function (name) {
          gridInfo[name] = getVerticalMovementInfo(gridHash[name]);
        });
      });


      it("should include totalColumns on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalColumns).to.be(1);
        });
      });

      it("should include totalElements on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalElements).to.be(1);
        });
      });

      it("should include totalRows on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.totalRows).to.be(1);
        });
      });

      it("should include elIndex on info", function () {
        _.forEach(gridInfo, function (info) {
          expect(info.elIndex).to.be.below(info.totalElements);
          expect(info.elIndex).to.be.above(-1);
        });
      });

      it("should include elRow on info", function () {
        _.forEach(gridInfo, function (info, name) {
          const match = name.match(/(\w+)(\d+)/);
          expect(match[1] + info.elRow).to.be(match[1] + match[2]);
        });
      });

      it("should include leftOffset on info", function () {
        const offsets = {
          a: 0
        };
        _.forEach(gridInfo, function (info, name) {
          const match = name.match(/(\w+)(\d+)/);
          expect(name + "(" + info.leftOffset + ")")
            .to.be(name + "(" + offsets[match[1]] + ")");
        });
      });

      it("should include previousRow on info", function () {
        const previousRows = {
          a1: 1
        };

        _.forEach(gridInfo, function (info, name) {
          expect(name + "(" + info.previousRow + ")")
            .to.be(name + "(" + previousRows[name] + ")");
        });
      });

      it("should include nextRow on info", function () {
        const nextRows = {
          a1: 1
        };

        _.forEach(gridInfo, function (info, name) {
          expect(name + "(" + info.nextRow + ")")
            .to.be(name + "(" + nextRows[name] + ")");
        });
      });

    });


    context("and focus is on \"a1\" it", function () {

      it("should focus \"a1\" when going to the \"left\"", function () {
        expect(getDomElement(gridHash.a1, "left").name).to.eql("a1");
      });

      it("should focus \"a1\" when going to the \"right\"", function () {
        expect(getDomElement(gridHash.a1, "right").name).to.eql("a1");
      });

      it("should focus \"a1\" when going \"up\"", function () {
        expect(getDomElement(gridHash.a1, "up").name).to.eql("a1");
      });

      it("should focus \"a1\" when going \"down\"", function () {
        expect(getDomElement(gridHash.a1, "down").name).to.eql("a1");
      });
    });


  });


});