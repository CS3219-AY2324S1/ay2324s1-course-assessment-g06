"use strict";

var _normalizeAttributes = _interopRequireDefault(require("../normalizeAttributes"));

var _expect = _interopRequireDefault(require("expect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _global = global,
    describe = _global.describe,
    it = _global.it;
describe('normalizeAttributes', function () {
  it('should not do anything with an empty set of attributes', function () {
    var attributes = {};
    var normalized = (0, _normalizeAttributes["default"])(attributes);
    (0, _expect["default"])(normalized).toBe(attributes);
    (0, _expect["default"])(normalized).toEqual({});
  });
  it('should not do anything if no attributes need to be normalized', function () {
    var attributes = {
      id: 'foo',
      "class": 'bar'
    };
    var normalized = (0, _normalizeAttributes["default"])(attributes);
    (0, _expect["default"])(normalized).toBe(attributes);
    (0, _expect["default"])(normalized).toEqual({
      id: 'foo',
      "class": 'bar'
    });
  });
  it('should normalize attributes without mutating', function () {
    var attributes = {
      id: 'foo',
      className: 'bar'
    };
    var normalized = (0, _normalizeAttributes["default"])(attributes);
    (0, _expect["default"])(attributes).toEqual({
      id: 'foo',
      className: 'bar'
    });
    (0, _expect["default"])(normalized).toEqual({
      id: 'foo',
      "class": 'bar'
    });
  });
});