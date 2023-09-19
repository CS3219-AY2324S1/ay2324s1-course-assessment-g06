"use strict";

var _expect = _interopRequireDefault(require("expect"));

var _main = require("../main");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _global = global,
    describe = _global.describe,
    it = _global.it;
describe('main exports', function () {
  it('two ways to import constants', function () {
    (0, _expect["default"])(_main.Constants.BLOCK_TYPE).toBe(_main.BLOCK_TYPE);
  });
});