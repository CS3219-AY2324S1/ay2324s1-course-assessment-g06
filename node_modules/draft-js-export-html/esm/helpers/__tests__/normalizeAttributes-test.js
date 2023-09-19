var _global = global,
    describe = _global.describe,
    it = _global.it;
import normalizeAttributes from '../normalizeAttributes';
import expect from 'expect';
describe('normalizeAttributes', function () {
  it('should not do anything with an empty set of attributes', function () {
    var attributes = {};
    var normalized = normalizeAttributes(attributes);
    expect(normalized).toBe(attributes);
    expect(normalized).toEqual({});
  });
  it('should not do anything if no attributes need to be normalized', function () {
    var attributes = {
      id: 'foo',
      "class": 'bar'
    };
    var normalized = normalizeAttributes(attributes);
    expect(normalized).toBe(attributes);
    expect(normalized).toEqual({
      id: 'foo',
      "class": 'bar'
    });
  });
  it('should normalize attributes without mutating', function () {
    var attributes = {
      id: 'foo',
      className: 'bar'
    };
    var normalized = normalizeAttributes(attributes);
    expect(attributes).toEqual({
      id: 'foo',
      className: 'bar'
    });
    expect(normalized).toEqual({
      id: 'foo',
      "class": 'bar'
    });
  });
});