function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _global = global,
    describe = _global.describe,
    it = _global.it;
import combineOrderedStyles from '../combineOrderedStyles';
import expect from 'expect';
describe('combineOrderedStyles', function () {
  it('should return defaults when customStyleMap is null', function () {
    var defaultStyleMap = {};
    var defaultStyleOrder = [];
    var defaults = [defaultStyleMap, defaultStyleOrder];
    var result = combineOrderedStyles(null, defaults);
    expect(result).toBe(defaults);
    expect(result).toEqual([{}, []]);
  });
  it('should return copies of defaults when customStyleMap is empty', function () {
    var defaultStyleMap = {
      foo: {},
      bar: {}
    };
    var defaultStyleOrder = ['foo', 'bar'];
    var customStyleMap = {};

    var _combineOrderedStyles = combineOrderedStyles(customStyleMap, [defaultStyleMap, defaultStyleOrder]),
        _combineOrderedStyles2 = _slicedToArray(_combineOrderedStyles, 2),
        styleMap = _combineOrderedStyles2[0],
        styleOrder = _combineOrderedStyles2[1];

    expect(styleMap).toEqual({
      foo: {},
      bar: {}
    });
    expect(styleMap).toNotBe(defaultStyleMap);
    expect(styleOrder).toEqual(['foo', 'bar']);
    expect(styleOrder).toNotBe(defaultStyleOrder);
  });
  it('should combine styles and preserve default order', function () {
    var defaultStyleMap = {
      foo: {},
      bar: {}
    };
    var defaultStyleOrder = ['foo', 'bar'];
    var customStyleMap = {
      baz: {}
    };

    var _combineOrderedStyles3 = combineOrderedStyles(customStyleMap, [defaultStyleMap, defaultStyleOrder]),
        _combineOrderedStyles4 = _slicedToArray(_combineOrderedStyles3, 2),
        styleMap = _combineOrderedStyles4[0],
        styleOrder = _combineOrderedStyles4[1];

    expect(styleMap).toEqual({
      foo: {},
      bar: {},
      baz: {}
    });
    expect(styleMap).toNotBe(defaultStyleMap);
    expect(styleMap).toNotBe(customStyleMap);
    expect(styleOrder).toEqual(['foo', 'bar', 'baz']);
    expect(styleOrder).toNotBe(defaultStyleOrder);
  });
  it('should merge individual styles', function () {
    var defaultStyleMap = {
      BOLD: {
        element: 'strong'
      },
      ITALIC: {
        element: 'em'
      }
    };
    var defaultStyleOrder = ['BOLD', 'ITALIC'];
    var customStyleMap = {
      BOLD: {
        element: 'span',
        style: {
          fontWeight: 'bold'
        }
      },
      ITALIC: {
        style: {
          textDecoration: 'underline'
        }
      }
    };

    var _combineOrderedStyles5 = combineOrderedStyles(customStyleMap, [defaultStyleMap, defaultStyleOrder]),
        _combineOrderedStyles6 = _slicedToArray(_combineOrderedStyles5, 2),
        styleMap = _combineOrderedStyles6[0],
        styleOrder = _combineOrderedStyles6[1];

    expect(styleMap).toEqual({
      BOLD: {
        element: 'span',
        style: {
          fontWeight: 'bold'
        }
      },
      ITALIC: {
        element: 'em',
        style: {
          textDecoration: 'underline'
        }
      }
    });
    expect(styleMap).toNotBe(defaultStyleMap);
    expect(styleMap).toNotBe(customStyleMap);
    expect(styleOrder).toEqual(['BOLD', 'ITALIC']);
    expect(styleOrder).toNotBe(defaultStyleOrder);
  });
});