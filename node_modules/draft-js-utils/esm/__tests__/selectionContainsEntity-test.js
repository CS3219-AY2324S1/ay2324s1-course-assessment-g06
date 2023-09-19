var _global = global,
    describe = _global.describe,
    it = _global.it;
import expect from 'expect';
import selectionContainsEntity from '../selectionContainsEntity';
import { EditorState, Modifier, SelectionState } from 'draft-js';
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

  return EditorState.push(editorState, Modifier.insertText(contentState, editorState.getSelection(), text ? text : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', undefined, entityKey), 'insert-characters');
};

var editorState = insertDummyText(EditorState.createEmpty());
editorState = EditorState.push(editorState, Modifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection()), 'split-block');
editorState = insertDummyText(editorState);
editorState = insertDummyText(editorState, 'this contains an entity', true);
var blockMap = editorState.getCurrentContent().getBlockMap();
var first = blockMap.first();
var last = blockMap.last();
editorState = EditorState.forceSelection(editorState, new SelectionState({
  anchorKey: first.getKey(),
  anchorOffset: 0,
  focusKey: last.getKey(),
  focusOffset: last.getLength()
}));
describe('selectionContainsEntity', function () {
  it('should call return a new function when passing in a strategy', function () {
    expect(selectionContainsEntity(strategy)).toBeA('function');
  });
  it('should return true, if an entity which matches the strategy has been found', function () {
    expect(selectionContainsEntity(strategy)(editorState)).toEqual(true);
  });
  it('should return false, if no entity which matches the strategy has been found', function () {
    editorState = EditorState.forceSelection(editorState, new SelectionState({
      anchorKey: first.getKey(),
      anchorOffset: 0,
      focusKey: first.getKey(),
      focusOffset: first.getLength()
    }));
    expect(selectionContainsEntity(strategy)(editorState)).toEqual(false);
  });
  it('should allow passing in a custom selection', function () {
    var lastBlockWithEntity = new SelectionState({
      anchorKey: last.getKey(),
      anchorOffset: 0,
      focusKey: last.getKey(),
      focusOffset: last.getLength()
    });
    expect(selectionContainsEntity(strategy)(editorState, lastBlockWithEntity)).toEqual(true);
    var lastBlockWithoutEntity = new SelectionState({
      anchorKey: last.getKey(),
      anchorOffset: 0,
      focusKey: last.getKey(),
      focusOffset: 10
    });
    expect(selectionContainsEntity(strategy)(editorState, lastBlockWithoutEntity)).toEqual(false);
    var firstBlockWithoutEntity = new SelectionState({
      anchorKey: first.getKey(),
      anchorOffset: 0,
      focusKey: first.getKey(),
      focusOffset: first.getLength()
    });
    expect(selectionContainsEntity(strategy)(editorState, firstBlockWithoutEntity)).toEqual(false);
  });
});