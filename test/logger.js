import chai from 'chai';
let expect = chai.expect;
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import Logger from '../lib/logger.js';

/*eslint-disable no-unused-expressions */

describe('Logger', () => {

  beforeEach(() => {
    sinon.stub(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  describe('#log', () => {
    it('logs when enabled', () => {
      var logger = Logger.create(true);
      logger.log('test');
      expect(console.log).to.have.been.calledOnce;
    });
    it('does not log when disabled', () => {
      var logger = Logger.create(false);
      logger.log('test');
      expect(console.log).not.to.have.been.calledOnce;
    });
    it('does not log when undefined', () => {
      var logger = Logger.create(undefined);
      logger.log('test');
      expect(console.log).not.to.have.been.calledOnce;
    });
  });
});

/*eslint-enable no-unused-expressions */
