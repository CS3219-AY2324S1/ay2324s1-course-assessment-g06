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
import expect from 'expect';
import callModifierForSelectedBlocks from '../callModifierForSelectedBlocks';
import { EditorState, Modifier, SelectionState } from 'draft-js';

var insertText = function insertText(editorState, selection, text) {
  var currentContentState = editorState.getCurrentContent();
  var targetRange = selection || editorState.getSelection();
  var contentStateWithAddedText = Modifier.insertText(currentContentState, targetRange, text);
  var newEditorState = EditorState.push(editorState, contentStateWithAddedText, 'insert-characters');
  return EditorState.forceSelection(newEditorState, contentStateWithAddedText.getSelectionAfter());
};

var splitLastBlock = function splitLastBlock(editorState) {
  var newContentState = Modifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection());
  return EditorState.push(editorState, newContentState, 'split-block');
};

var emptyEditorState = EditorState.createEmpty();
var editorState = insertText(emptyEditorState, undefined, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.');
var block = editorState.getCurrentContent().getBlockMap().first();
var blockKey = block.getKey();
editorState = EditorState.forceSelection(editorState, new SelectionState({
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
    splitState = EditorState.forceSelection(splitState, new SelectionState({
      anchorKey: first.getKey(),
      anchorOffset: 0,
      focusKey: last.getKey(),
      focusOffset: last.getLength()
    }));
  });
  it('should call the modifier function for each selected block', function () {
    var spy = expect.createSpy(function (editorState) {
      return editorState;
    }).andCallThrough();
    callModifierForSelectedBlocks(splitState, spy);
    expect(spy.calls.length).toEqual(2);
  });
  it('should call the modifier function with editorState, a selection object and all additional arguments', function () {
    var spy = expect.createSpy(function (editorState) {
      return editorState;
    }).andCallThrough();
    var anObject = {
      some: 'prop'
    };
    var anArray = [1, 2, 3];
    callModifierForSelectedBlocks(splitState, spy, anObject, anArray, true);

    var _spy$calls$0$argument = _toArray(spy.calls[0].arguments),
        state = _spy$calls$0$argument[0],
        selection = _spy$calls$0$argument[1],
        rest = _spy$calls$0$argument.slice(2);

    var anchorKey = selection.getStartKey();
    var focusKey = selection.getEndKey();
    var anchorOffset = selection.getStartOffset();
    var focusOffset = selection.getEndOffset();
    expect(state).toBe(splitState);
    expect(anchorKey).toBe(first.getKey());
    expect(focusKey).toBe(first.getKey());
    expect(anchorOffset).toBe(0);
    expect(focusOffset).toBe(first.getLength());
    expect(rest).toEqual([anObject, anArray, true]);
  });
  it('should pass the previously returned editor state the to then next modifier', function () {
    var newState = EditorState.createEmpty();
    var spy = expect.createSpy(function () {
      return newState;
    }).andCallThrough();
    callModifierForSelectedBlocks(splitState, spy);

    var _spy$calls$1$argument = _slicedToArray(spy.calls[1].arguments, 1),
        state = _spy$calls$1$argument[0];

    expect(state).toBe(newState);
  });
  it('should return the modified editor state', function () {
    var spy = expect.createSpy(function (editorState, selection) {
      return insertText(editorState, selection, 'TEST');
    }).andCallThrough();
    var finalState = callModifierForSelectedBlocks(splitState, spy);
    var blockMap = finalState.getCurrentContent().getBlockMap();
    expect(finalState).toNotBe(splitState);
    expect(blockMap.first().getText().endsWith('TEST')).toBe(true);
    expect(blockMap.last().getText().endsWith('TEST')).toBe(true);
  });
  it('should override any custom selection done within the modifier', function () {
    var spy = expect.createSpy(function (editorState, selection) {
      return EditorState.forceSelection(editorState, selection);
    }).andCallThrough();
    var finalState = callModifierForSelectedBlocks(splitState, spy);
    expect(finalState.getSelection()).toBe(splitState.getSelection());
  });
  it('should pass in the proper selections for start and end blocks if they are partially selected', function () {
    splitState = EditorState.forceSelection(splitState, new SelectionState({
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
    splitState = EditorState.forceSelection(splitState, new SelectionState({
      anchorKey: firstBlock.getKey(),
      anchorOffset: 10,
      focusKey: lastBlock.getKey(),
      focusOffset: last.getLength() - 10
    }));
    var spy = expect.createSpy(function (state) {
      return state;
    }).andCallThrough();
    callModifierForSelectedBlocks(splitState, spy);
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
      expect(anchorKey).toBe(selection.getStartKey());
      expect(focusKey).toBe(selection.getEndKey());
      expect(anchorOffset).toBe(selection.getStartOffset());
      expect(focusOffset).toBe(selection.getEndOffset());
    });
  });
});