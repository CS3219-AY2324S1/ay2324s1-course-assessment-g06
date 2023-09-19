function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _global = global,
    describe = _global.describe,
    it = _global.it;
import expect from 'expect';
import getSelectedBlocks from '../getSelectedBlocks';
import { EditorState, Modifier } from 'draft-js';

var splitLastBlock = function splitLastBlock(editorState) {
  var newContentState = Modifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection());
  var newEditorState = EditorState.push(editorState, newContentState, 'split-block');
  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};

var editorState = _toConsumableArray(Array(3)).reduce(function (state) {
  return splitLastBlock(state);
}, EditorState.createEmpty());

var contentState = editorState.getCurrentContent();
var blockKeys = contentState.getBlockMap().keySeq().toArray();
describe('getSelectedBlocks', function () {
  it('should return the blocks between two blocks, inclusive', function () {
    var anchorKey = blockKeys[0];
    var focusKey = blockKeys[3];
    var allBlocks = blockKeys.map(function (key) {
      return contentState.getBlockForKey(key);
    });
    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual(allBlocks);
  });
  it('should return a single block if anchor and focus key are the same', function () {
    var anchorKey = blockKeys[0];
    var focusKey = blockKeys[0];
    var block = [contentState.getBlockForKey(anchorKey)];
    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual(block);
    anchorKey = blockKeys[2];
    focusKey = blockKeys[2];
    block = [contentState.getBlockForKey(anchorKey)];
    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual(block);
  });
  it('should return an empty array, if anchor and focus key are backwards', function () {
    var anchorKey = blockKeys[3];
    var focusKey = blockKeys[0];
    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual([]);
  });
  it('should return an empty array, if anchor or focus key are invalid', function () {
    var anchorKey = blockKeys[0];
    var focusKey = 'INVALID';
    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual([]);
    anchorKey = 'INVALID';
    focusKey = blockKeys[2];
    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual([]);
    anchorKey = 'INVALID';
    focusKey = 'INVALID_TOO';
    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual([]);
    anchorKey = 'INVALID';
    focusKey = 'INVALID';
    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual([]);
  });
});