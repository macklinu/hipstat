import chai from 'chai';
let expect = chai.expect;
import { assertValid, assertContains } from '../lib/util';

describe('util', () => {

  describe('#assertValid', () => {

    it('should throw when object is null', () => {
      expect(() => {
        assertValid(null, 'myVar');
      }).to.throw(/'myVar' must not be null/);
    });

    it('should throw when object is undefined', () => {
      expect(() => {
        assertValid(undefined, 'test');
      }).to.throw(/'test' must not be undefined/);
    });

    it('should not throw when object is non-null and defined', () => {
      expect(() => {
        let variable = 0;
        assertValid(variable, 'variable');
      }).not.to.throw();
    });

  });

  describe('#assertContains', () => {

    let collection = [1, 2, 3];

    it('should throw when collection does not contain object', () => {
      expect(() => {
        assertContains(collection, 5, 'variable');
      }).to.throw(/Collection does not contain '5' for 'variable'. Must be one of [1, 2, 3]./);
    });

    it('should not throw when collection contains object', () => {
      expect(() => {
        assertContains(collection, 1, 'variable');
      }).not.to.throw();
    });

  });

});
