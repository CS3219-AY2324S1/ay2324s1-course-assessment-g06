var _global = global,
    describe = _global.describe,
    it = _global.it;
import styleToCSS from '../styleToCSS';
import expect from 'expect';
describe('styleToCSS', function () {
  it('should accept an empty set of rules', function () {
    expect(styleToCSS({})).toBe('');
  });
  it('should stringify a single rule', function () {
    expect(styleToCSS({
      color: 'red'
    })).toBe('color: red');
  });
  it('should stringify multiple rules', function () {
    var styles = {
      color: 'red',
      padding: '2px'
    };
    expect(styleToCSS(styles)).toBe('color: red; padding: 2px');
  });
  it('should convert camelCase to hyphenated', function () {
    var styles = {
      fontWeight: 'bold',
      msGridColumn: 'auto',
      webkitAppearance: 'none'
    };
    expect(styleToCSS(styles)).toBe('font-weight: bold; -ms-grid-column: auto; -webkit-appearance: none');
  });
  it('should add units on certain rules', function () {
    var styles = {
      lineHeight: 1,
      fontSize: 12
    };
    expect(styleToCSS(styles)).toBe('line-height: 1; font-size: 12px');
  });
});