"use strict";

var _expect = _interopRequireDefault(require("expect"));

var _Constants = require("../Constants");

var _getEntityRanges = _interopRequireWildcard(require("../getEntityRanges"));

var _immutable = require("immutable");

var _draftJs = require("draft-js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _global = global,
    describe = _global.describe,
    it = _global.it,
    xit = _global.xit;
var EMPTY_META = _draftJs.CharacterMetadata.EMPTY;
var BOLD = _Constants.INLINE_STYLE.BOLD,
    ITALIC = _Constants.INLINE_STYLE.ITALIC;

var BOLD_CHAR = _draftJs.CharacterMetadata.applyStyle(EMPTY_META, BOLD);

var ITALIC_CHAR = _draftJs.CharacterMetadata.applyStyle(EMPTY_META, ITALIC);

describe('getEntityRanges', function () {
  it('should accept empty input', function () {
    var emptyCharMeta = (0, _immutable.List)();
    var emptyStyleRange = ['', _getEntityRanges.EMPTY_SET];
    var emptyEntityRange = [null, [emptyStyleRange]];
    (0, _expect["default"])((0, _getEntityRanges["default"])('', emptyCharMeta)).toEqual([emptyEntityRange]);
  }); // TODO: Fix this test.

  xit('should parse string of plain text', function () {
    var text = 'hello';
    var charMeta = (0, _immutable.List)((0, _immutable.Repeat)(EMPTY_META, text.length));
    var styleRange = [text, _getEntityRanges.EMPTY_SET];
    var entityRange = [null, [styleRange]];
    (0, _expect["default"])((0, _getEntityRanges["default"])(text, charMeta)).toEqual([entityRange]);
  }); // TODO: Fix this test.

  xit('should parse a string with styled characters', function () {
    var text = 'hello';

    var charMeta = _immutable.List.of(EMPTY_META, BOLD_CHAR, EMPTY_META, EMPTY_META, ITALIC_CHAR);

    var styleRanges = [['h', _getEntityRanges.EMPTY_SET], ['e', _getEntityRanges.EMPTY_SET.add(BOLD)], ['ll', _getEntityRanges.EMPTY_SET], ['o', _getEntityRanges.EMPTY_SET.add(ITALIC)]];
    var entityRange = [null, styleRanges];
    (0, _expect["default"])((0, _getEntityRanges["default"])(text, charMeta)).toEqual([entityRange]);
  }); // TODO: Fix this test.

  xit('should parse a string with entity and styled characters', function () {
    var text = 'hello';
    var entKey = 'cv70al'; // Here the first three chars are bold but the entity spans "ell".

    var charMeta = _immutable.List.of(BOLD_CHAR, _draftJs.CharacterMetadata.applyEntity(BOLD_CHAR, entKey), _draftJs.CharacterMetadata.applyEntity(BOLD_CHAR, entKey), _draftJs.CharacterMetadata.applyEntity(EMPTY_META, entKey), EMPTY_META);

    var entityRange1 = [null, [['h', _getEntityRanges.EMPTY_SET.add(BOLD)]]];
    var entityRange2 = [entKey, [['el', _getEntityRanges.EMPTY_SET.add(BOLD)], ['l', _getEntityRanges.EMPTY_SET]]];
    var entityRange3 = [null, [['o', _getEntityRanges.EMPTY_SET]]];
    (0, _expect["default"])((0, _getEntityRanges["default"])(text, charMeta)).toEqual([entityRange1, entityRange2, entityRange3]);
  });
});