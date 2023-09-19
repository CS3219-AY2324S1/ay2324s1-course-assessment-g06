"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.INLINE_STYLE = exports.ENTITY_TYPE = exports.BLOCK_TYPE = void 0;
var BLOCK_TYPE = {
  // This is used to represent a normal text block (paragraph).
  UNSTYLED: 'unstyled',
  HEADER_ONE: 'header-one',
  HEADER_TWO: 'header-two',
  HEADER_THREE: 'header-three',
  HEADER_FOUR: 'header-four',
  HEADER_FIVE: 'header-five',
  HEADER_SIX: 'header-six',
  UNORDERED_LIST_ITEM: 'unordered-list-item',
  ORDERED_LIST_ITEM: 'ordered-list-item',
  BLOCKQUOTE: 'blockquote',
  PULLQUOTE: 'pullquote',
  CODE: 'code-block',
  ATOMIC: 'atomic'
};
exports.BLOCK_TYPE = BLOCK_TYPE;
var ENTITY_TYPE = {
  LINK: 'LINK',
  IMAGE: 'IMAGE',
  EMBED: 'embed'
};
exports.ENTITY_TYPE = ENTITY_TYPE;
var INLINE_STYLE = {
  BOLD: 'BOLD',
  CODE: 'CODE',
  ITALIC: 'ITALIC',
  STRIKETHROUGH: 'STRIKETHROUGH',
  UNDERLINE: 'UNDERLINE'
};
exports.INLINE_STYLE = INLINE_STYLE;
var _default = {
  BLOCK_TYPE: BLOCK_TYPE,
  ENTITY_TYPE: ENTITY_TYPE,
  INLINE_STYLE: INLINE_STYLE
};
exports["default"] = _default;