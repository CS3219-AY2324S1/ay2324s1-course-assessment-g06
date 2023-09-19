import { EditorState, SelectionState } from 'draft-js';
import getSelectedBlocks from './getSelectedBlocks';
/**
 * Calls a provided `modifier` function with a selection for each
 * selected block in the current editor selection. Passes through additional
 * arguments to the modifier.
 *
 * Note: At the moment it will retain the original selection and override
 * possible selection changes from modifiers
 *
 * @param  {object} editorState The current draft.js editor state object
 *
 * @param  {function} modifier  A modifier function to be executed.
 *                              Must have the signature (editorState, selection, ...)
 *
 * @param  {mixed} ...args      Additional arguments to be passed through to the modifier
 *
 * @return {object} The new editor state
 */

export default (function (editorState, modifier) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var contentState = editorState.getCurrentContent();
  var currentSelection = editorState.getSelection();
  var startKey = currentSelection.getStartKey();
  var endKey = currentSelection.getEndKey();
  var startOffset = currentSelection.getStartOffset();
  var endOffset = currentSelection.getEndOffset();
  var isSameBlock = startKey === endKey;
  var selectedBlocks = getSelectedBlocks(contentState, startKey, endKey);
  var finalEditorState = editorState;
  selectedBlocks.forEach(function (block) {
    var currentBlockKey = block.getKey();
    var selectionStart = startOffset;
    var selectionEnd = endOffset;

    if (currentBlockKey === startKey) {
      selectionStart = startOffset;
      selectionEnd = isSameBlock ? endOffset : block.getText().length;
    } else if (currentBlockKey === endKey) {
      selectionStart = isSameBlock ? startOffset : 0;
      selectionEnd = endOffset;
    } else {
      selectionStart = 0;
      selectionEnd = block.getText().length;
    }

    var selection = new SelectionState({
      anchorKey: currentBlockKey,
      anchorOffset: selectionStart,
      focusKey: currentBlockKey,
      focusOffset: selectionEnd
    });
    finalEditorState = modifier.apply(void 0, [finalEditorState, selection].concat(args));
  });
  return EditorState.forceSelection(finalEditorState, currentSelection);
});