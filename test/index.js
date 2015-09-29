import chai from 'chai';
let expect = chai.expect;
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import Hipchatter from 'hipchatter';
import HipStat from '../lib/';

describe('HipStat', () => {

  var viewUserStub;
  var updateUserStub;

  beforeEach(() => {
    viewUserStub = sinon.stub(Hipchatter.prototype, 'view_user');
    updateUserStub = sinon.stub(Hipchatter.prototype, 'update_user');
  });

  afterEach(() => {
    viewUserStub.restore();
    updateUserStub.restore();
  });

  describe('options', () => {

    it('should throw when options are undefined', () => {
      expect(() => {
        new HipStat().user(null, () => {});
      }).to.throw(/Must pass in options.status but was undefined/);
    });

    describe('.status', () => {

      it('should throw when undefined', () => {
        expect(() => {
          new HipStat().user({}, () => {});
        }).to.throw(/Must pass in options.status but was undefined/);
      });

      it('should not throw when status is an empty String', () => {
        expect(() => {
          new HipStat().user({status: '', show: 'chat'}, () => {});
        }).not.to.throw();
      });

    });

    describe('.show', () => {

      it('should throw when undefined', () => {
        expect(() => {
          new HipStat().user({ status: 'test status' }, () => {});
        }).to.throw(/Must pass in options.show but was undefined/);
      });

      it('should throw when invalid', () => {
        let options = {
          status: 'test status',
          show: 'back'
        };
        expect(() => {
          new HipStat().user(options, () => {});
        }).to.throw(/Invalid option 'back' for options.show/);
      });

      ['chat', 'away', 'dnd', 'xa'].forEach((item) => {
        it(`${item} should be a valid value`, () => {
          let options = {
            status: 'test',
            show: item
          };
          expect(() => {
            new HipStat().user(options, () => {});
          }).not.to.throw();
        });
      });

    });
  });

});
