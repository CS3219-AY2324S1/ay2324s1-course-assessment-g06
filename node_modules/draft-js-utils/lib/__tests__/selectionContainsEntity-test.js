"use strict";

var _expect = _interopRequireDefault(require("expect"));

var _selectionContainsEntity = _interopRequireDefault(require("../selectionContainsEntity"));

var _draftJs = require("draft-js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _global = global,
    describe = _global.describe,
    it = _global.it;
var DUMMY_ENTITY = 'DUMMY_ENTITY';

var strategy = function strategy(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey != null && contentState.getEntity(entityKey).getType() === 'DUMMY_ENTITY';
  }, callback);
};

var insertDummyText = function insertDummyText(editorState, text, withEntity) {
  var contentState = editorState.getCurrentContent();
  var entityKey;

  if (withEntity) {
    contentState = contentState.createEntity(DUMMY_ENTITY, 'MUTABLE');
    entityKey = contentState.getLastCreatedEntityKey();
  }

  return _draftJs.EditorState.push(editorState, _draftJs.Modifier.insertText(contentState, editorState.getSelection(), text ? text : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', undefined, entityKey), 'insert-characters');
};

var editorState = insertDummyText(_draftJs.EditorState.createEmpty());
editorState = _draftJs.EditorState.push(editorState, _draftJs.Modifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection()), 'split-block');
editorState = insertDummyText(editorState);
editorState = insertDummyText(editorState, 'this contains an entity', true);
var blockMap = editorState.getCurrentContent().getBlockMap();
var first = blockMap.first();
var last = blockMap.last();
editorState = _draftJs.EditorState.forceSelection(editorState, new _draftJs.SelectionState({
  anchorKey: first.getKey(),
  anchorOffset: 0,
  focusKey: last.getKey(),
  focusOffset: last.getLength()
}));
describe('selectionContainsEntity', function () {
  it('should call return a new function when passing in a strategy', function () {
    (0, _expect["default"])((0, _selectionContainsEntity["default"])(strategy)).toBeA('function');
  });
  it('should return true, if an entity which matches the strategy has been found', function () {
    (0, _expect["default"])((0, _selectionContainsEntity["default"])(strategy)(editorState)).toEqual(true);
  });
  it('should return false, if no entity which matches the strategy has been found', function () {
    editorState = _draftJs.EditorState.forceSelection(editorState, new _draftJs.SelectionState({
      anchorKey: first.getKey(),
      anchorOffset: 0,
      focusKey: first.getKey(),
      focusOffset: first.getLength()
    }));
    (0, _expect["default"])((0, _selectionContainsEntity["default"])(strategy)(editorState)).toEqual(false);
  });
  it('should allow passing in a custom selection', function () {
    var lastBlockWithEntity = new _draftJs.SelectionState({
      anchorKey: last.getKey(),
      anchorOffset: 0,
      focusKey: last.getKey(),
      focusOffset: last.getLength()
    });
    (0, _expect["default"])((0, _selectionContainsEntity["default"])(strategy)(editorState, lastBlockWithEntity)).toEqual(true);
    var lastBlockWithoutEntity = new _draftJs.SelectionState({
      anchorKey: last.getKey(),
      anchorOffset: 0,
      focusKey: last.getKey(),
      focusOffset: 10
    });
    (0, _expect["default"])((0, _selectionContainsEntity["default"])(strategy)(editorState, lastBlockWithoutEntity)).toEqual(false);
    var firstBlockWithoutEntity = new _draftJs.SelectionState({
      anchorKey: first.getKey(),
      anchorOffset: 0,
      focusKey: first.getKey(),
      focusOffset: first.getLength()
    });
    (0, _expect["default"])((0, _selectionContainsEntity["default"])(strategy)(editorState, firstBlockWithoutEntity)).toEqual(false);
  });
});