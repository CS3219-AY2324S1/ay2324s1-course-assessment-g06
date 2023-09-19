"use strict";

var _expect = _interopRequireDefault(require("expect"));

var _callModifierForSelectedBlocks = _interopRequireDefault(require("../callModifierForSelectedBlocks"));

var _draftJs = require("draft-js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _global = global,
    describe = _global.describe,
    it = _global.it,
    beforeEach = _global.beforeEach;

var insertText = function insertText(editorState, selection, text) {
  var currentContentState = editorState.getCurrentContent();
  var targetRange = selection || editorState.getSelection();

  var contentStateWithAddedText = _draftJs.Modifier.insertText(currentContentState, targetRange, text);

  var newEditorState = _draftJs.EditorState.push(editorState, contentStateWithAddedText, 'insert-characters');

  return _draftJs.EditorState.forceSelection(newEditorState, contentStateWithAddedText.getSelectionAfter());
};

var splitLastBlock = function splitLastBlock(editorState) {
  var newContentState = _draftJs.Modifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection());

  return _draftJs.EditorState.push(editorState, newContentState, 'split-block');
};

var emptyEditorState = _draftJs.EditorState.createEmpty();

var editorState = insertText(emptyEditorState, undefined, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.');
var block = editorState.getCurrentContent().getBlockMap().first();
var blockKey = block.getKey();
editorState = _draftJs.EditorState.forceSelection(editorState, new _draftJs.SelectionState({
  anchorKey: blockKey,
  anchorOffset: 0,
  focusKey: blockKey,
  focusOffset: block.getLength()
}));
describe('callModifierForSelectedBlocks', function () {
  var splitState;
  var first;
  var last;
  beforeEach(function () {
    splitState = splitLastBlock(editorState);
    var blockMap = splitState.getCurrentContent().getBlockMap();
    first = blockMap.first();
    last = blockMap.last();
    splitState = _draftJs.EditorState.forceSelection(splitState, new _draftJs.SelectionState({
      anchorKey: first.getKey(),
      anchorOffset: 0,
      focusKey: last.getKey(),
      focusOffset: last.getLength()
    }));
  });
  it('should call the modifier function for each selected block', function () {
    var spy = _expect["default"].createSpy(function (editorState) {
      return editorState;
    }).andCallThrough();

    (0, _callModifierForSelectedBlocks["default"])(splitState, spy);
    (0, _expect["default"])(spy.calls.length).toEqual(2);
  });
  it('should call the modifier function with editorState, a selection object and all additional arguments', function () {
    var spy = _expect["default"].createSpy(function (editorState) {
      return editorState;
    }).andCallThrough();

    var anObject = {
      some: 'prop'
    };
    var anArray = [1, 2, 3];
    (0, _callModifierForSelectedBlocks["default"])(splitState, spy, anObject, anArray, true);

    var _spy$calls$0$argument = _toArray(spy.calls[0].arguments),
        state = _spy$calls$0$argument[0],
        selection = _spy$calls$0$argument[1],
        rest = _spy$calls$0$argument.slice(2);

    var anchorKey = selection.getStartKey();
    var focusKey = selection.getEndKey();
    var anchorOffset = selection.getStartOffset();
    var focusOffset = selection.getEndOffset();
    (0, _expect["default"])(state).toBe(splitState);
    (0, _expect["default"])(anchorKey).toBe(first.getKey());
    (0, _expect["default"])(focusKey).toBe(first.getKey());
    (0, _expect["default"])(anchorOffset).toBe(0);
    (0, _expect["default"])(focusOffset).toBe(first.getLength());
    (0, _expect["default"])(rest).toEqual([anObject, anArray, true]);
  });
  it('should pass the previously returned editor state the to then next modifier', function () {
    var newState = _draftJs.EditorState.createEmpty();

    var spy = _expect["default"].createSpy(function () {
      return newState;
    }).andCallThrough();

    (0, _callModifierForSelectedBlocks["default"])(splitState, spy);

    var _spy$calls$1$argument = _slicedToArray(spy.calls[1].arguments, 1),
        state = _spy$calls$1$argument[0];

    (0, _expect["default"])(state).toBe(newState);
  });
  it('should return the modified editor state', function () {
    var spy = _expect["default"].createSpy(function (editorState, selection) {
      return insertText(editorState, selection, 'TEST');
    }).andCallThrough();

    var finalState = (0, _callModifierForSelectedBlocks["default"])(splitState, spy);
    var blockMap = finalState.getCurrentContent().getBlockMap();
    (0, _expect["default"])(finalState).toNotBe(splitState);
    (0, _expect["default"])(blockMap.first().getText().endsWith('TEST')).toBe(true);
    (0, _expect["default"])(blockMap.last().getText().endsWith('TEST')).toBe(true);
  });
  it('should override any custom selection done within the modifier', function () {
    var spy = _expect["default"].createSpy(function (editorState, selection) {
      return _draftJs.EditorState.forceSelection(editorState, selection);
    }).andCallThrough();

    var finalState = (0, _callModifierForSelectedBlocks["default"])(splitState, spy);
    (0, _expect["default"])(finalState.getSelection()).toBe(splitState.getSelection());
  });
  it('should pass in the proper selections for start and end blocks if they are partially selected', function () {
    splitState = _draftJs.EditorState.forceSelection(splitState, new _draftJs.SelectionState({
      anchorKey: last.getKey(),
      anchorOffset: Math.round(last.getLength() / 2),
      focusKey: last.getKey(),
      focusOffset: Math.round(last.getLength() / 2)
    }));
    splitState = splitLastBlock(splitState);
    var contentState = splitState.getCurrentContent();
    var blockMap = contentState.getBlockMap();
    var firstBlock = blockMap.first();
    var middleBlock = contentState.getBlockAfter(firstBlock.getKey());
    var lastBlock = blockMap.last();
    splitState = _draftJs.EditorState.forceSelection(splitState, new _draftJs.SelectionState({
      anchorKey: firstBlock.getKey(),
      anchorOffset: 10,
      focusKey: lastBlock.getKey(),
      focusOffset: last.getLength() - 10
    }));

    var spy = _expect["default"].createSpy(function (state) {
      return state;
    }).andCallThrough();

    (0, _callModifierForSelectedBlocks["default"])(splitState, spy);
    var selections = spy.calls.map(function (obj) {
      return obj.arguments[1];
    });
    var expected = [{
      anchorKey: firstBlock.getKey(),
      focusKey: firstBlock.getKey(),
      anchorOffset: 10,
      focusOffset: firstBlock.getLength()
    }, {
      anchorKey: middleBlock.getKey(),
      focusKey: middleBlock.getKey(),
      anchorOffset: 0,
      focusOffset: middleBlock.getLength()
    }, {
      anchorKey: lastBlock.getKey(),
      focusKey: lastBlock.getKey(),
      anchorOffset: 0,
      focusOffset: lastBlock.getLength() - 10
    }];
    selections.forEach(function (selection, index) {
      var _expected$index = expected[index],
          anchorKey = _expected$index.anchorKey,
          focusKey = _expected$index.focusKey,
          anchorOffset = _expected$index.anchorOffset,
          focusOffset = _expected$index.focusOffset;
      (0, _expect["default"])(anchorKey).toBe(selection.getStartKey());
      (0, _expect["default"])(focusKey).toBe(selection.getEndKey());
      (0, _expect["default"])(anchorOffset).toBe(selection.getStartOffset());
      (0, _expect["default"])(focusOffset).toBe(selection.getEndOffset());
    });
  });
});