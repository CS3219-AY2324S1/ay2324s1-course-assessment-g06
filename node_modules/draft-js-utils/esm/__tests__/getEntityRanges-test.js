var _global = global,
    describe = _global.describe,
    it = _global.it,
    xit = _global.xit;
import expect from 'expect';
import { INLINE_STYLE } from '../Constants';
import getEntityRanges, { EMPTY_SET } from '../getEntityRanges';
import { List, Repeat } from 'immutable';
import { CharacterMetadata } from 'draft-js';
var EMPTY_META = CharacterMetadata.EMPTY;
var BOLD = INLINE_STYLE.BOLD,
    ITALIC = INLINE_STYLE.ITALIC;
var BOLD_CHAR = CharacterMetadata.applyStyle(EMPTY_META, BOLD);
var ITALIC_CHAR = CharacterMetadata.applyStyle(EMPTY_META, ITALIC);
describe('getEntityRanges', function () {
  it('should accept empty input', function () {
    var emptyCharMeta = List();
    var emptyStyleRange = ['', EMPTY_SET];
    var emptyEntityRange = [null, [emptyStyleRange]];
    expect(getEntityRanges('', emptyCharMeta)).toEqual([emptyEntityRange]);
  }); // TODO: Fix this test.

  xit('should parse string of plain text', function () {
    var text = 'hello';
    var charMeta = List(Repeat(EMPTY_META, text.length));
    var styleRange = [text, EMPTY_SET];
    var entityRange = [null, [styleRange]];
    expect(getEntityRanges(text, charMeta)).toEqual([entityRange]);
  }); // TODO: Fix this test.

  xit('should parse a string with styled characters', function () {
    var text = 'hello';
    var charMeta = List.of(EMPTY_META, BOLD_CHAR, EMPTY_META, EMPTY_META, ITALIC_CHAR);
    var styleRanges = [['h', EMPTY_SET], ['e', EMPTY_SET.add(BOLD)], ['ll', EMPTY_SET], ['o', EMPTY_SET.add(ITALIC)]];
    var entityRange = [null, styleRanges];
    expect(getEntityRanges(text, charMeta)).toEqual([entityRange]);
  }); // TODO: Fix this test.

  xit('should parse a string with entity and styled characters', function () {
    var text = 'hello';
    var entKey = 'cv70al'; // Here the first three chars are bold but the entity spans "ell".

    var charMeta = List.of(BOLD_CHAR, CharacterMetadata.applyEntity(BOLD_CHAR, entKey), CharacterMetadata.applyEntity(BOLD_CHAR, entKey), CharacterMetadata.applyEntity(EMPTY_META, entKey), EMPTY_META);
    var entityRange1 = [null, [['h', EMPTY_SET.add(BOLD)]]];
    var entityRange2 = [entKey, [['el', EMPTY_SET.add(BOLD)], ['l', EMPTY_SET]]];
    var entityRange3 = [null, [['o', EMPTY_SET]]];
    expect(getEntityRanges(text, charMeta)).toEqual([entityRange1, entityRange2, entityRange3]);
  });
});