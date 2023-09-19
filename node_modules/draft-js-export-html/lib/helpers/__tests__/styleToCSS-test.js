"use strict";

var _styleToCSS = _interopRequireDefault(require("../styleToCSS"));

var _expect = _interopRequireDefault(require("expect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _global = global,
    describe = _global.describe,
    it = _global.it;
describe('styleToCSS', function () {
  it('should accept an empty set of rules', function () {
    (0, _expect["default"])((0, _styleToCSS["default"])({})).toBe('');
  });
  it('should stringify a single rule', function () {
    (0, _expect["default"])((0, _styleToCSS["default"])({
      color: 'red'
    })).toBe('color: red');
  });
  it('should stringify multiple rules', function () {
    var styles = {
      color: 'red',
      padding: '2px'
    };
    (0, _expect["default"])((0, _styleToCSS["default"])(styles)).toBe('color: red; padding: 2px');
  });
  it('should convert camelCase to hyphenated', function () {
    var styles = {
      fontWeight: 'bold',
      msGridColumn: 'auto',
      webkitAppearance: 'none'
    };
    (0, _expect["default"])((0, _styleToCSS["default"])(styles)).toBe('font-weight: bold; -ms-grid-column: auto; -webkit-appearance: none');
  });
  it('should add units on certain rules', function () {
    var styles = {
      lineHeight: 1,
      fontSize: 12
    };
    (0, _expect["default"])((0, _styleToCSS["default"])(styles)).toBe('line-height: 1; font-size: 12px');
  });
});