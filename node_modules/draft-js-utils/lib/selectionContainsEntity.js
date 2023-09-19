"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getSelectedBlocks = _interopRequireDefault(require("./getSelectedBlocks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(strategy) {
  return function (editorState, selection) {
    var contentState = editorState.getCurrentContent();
    var currentSelection = selection || editorState.getSelection();
    var startKey = currentSelection.getStartKey();
    var endKey = currentSelection.getEndKey();
    var startOffset = currentSelection.getStartOffset();
    var endOffset = currentSelection.getEndOffset();
    var isSameBlock = startKey === endKey;
    var selectedBlocks = (0, _getSelectedBlocks["default"])(contentState, startKey, endKey);
    var entityFound = false; // We have to shift the offset to not get false positives when selecting
    // a character just before or after an entity

    var finalStartOffset = startOffset + 1;
    var finalEndOffset = endOffset - 1;
    selectedBlocks.forEach(function (block) {
      strategy(block, function (start, end) {
        if (entityFound) {
          return;
        }

        var blockKey = block.getKey();

        if (isSameBlock && (end < finalStartOffset || start > finalEndOffset)) {
          return;
        } else if (blockKey === startKey && end < finalStartOffset) {
          return;
        } else if (blockKey === endKey && start > finalEndOffset) {
          return;
        }

        entityFound = true;
      }, contentState);
    });
    return entityFound;
  };
};

exports["default"] = _default;