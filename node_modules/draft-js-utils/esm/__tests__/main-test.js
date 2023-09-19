var _global = global,
    describe = _global.describe,
    it = _global.it;
import expect from 'expect';
import { Constants, BLOCK_TYPE } from '../main';
describe('main exports', function () {
  it('two ways to import constants', function () {
    expect(Constants.BLOCK_TYPE).toBe(BLOCK_TYPE);
  });
});