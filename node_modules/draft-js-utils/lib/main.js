"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Constants: true,
  getEntityRanges: true,
  getSelectedBlocks: true,
  selectionContainsEntity: true,
  callModifierForSelectedBlocks: true
};
Object.defineProperty(exports, "Constants", {
  enumerable: true,
  get: function get() {
    return _Constants["default"];
  }
});
Object.defineProperty(exports, "getEntityRanges", {
  enumerable: true,
  get: function get() {
    return _getEntityRanges["default"];
  }
});
Object.defineProperty(exports, "getSelectedBlocks", {
  enumerable: true,
  get: function get() {
    return _getSelectedBlocks["default"];
  }
});
Object.defineProperty(exports, "selectionContainsEntity", {
  enumerable: true,
  get: function get() {
    return _selectionContainsEntity["default"];
  }
});
Object.defineProperty(exports, "callModifierForSelectedBlocks", {
  enumerable: true,
  get: function get() {
    return _callModifierForSelectedBlocks["default"];
  }
});

var _Constants = _interopRequireWildcard(require("./Constants"));

Object.keys(_Constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Constants[key];
    }
  });
});

var _getEntityRanges = _interopRequireDefault(require("./getEntityRanges"));

var _getSelectedBlocks = _interopRequireDefault(require("./getSelectedBlocks"));

var _selectionContainsEntity = _interopRequireDefault(require("./selectionContainsEntity"));

var _callModifierForSelectedBlocks = _interopRequireDefault(require("./callModifierForSelectedBlocks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }