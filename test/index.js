import chai from 'chai';
let expect = chai.expect;
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import Hipchatter from 'hipchatter';
import hipstat from '../lib/';

describe('hipstat', () => {

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
        hipstat(null, () => {});
      }).to.throw(/'options.status' must not be undefined/);
    });

    describe('.status', () => {

      it('should throw when undefined', () => {
        expect(() => {
          hipstat({}, () => {});
        }).to.throw(/'options.status' must not be undefined/);
      });

      it('should not throw when status is an empty String', () => {
        expect(() => {
          hipstat({status: '', show: 'chat'}, () => {});
        }).not.to.throw();
      });

    });

    describe('.show', () => {

      it('should throw when undefined', () => {
        expect(() => {
          hipstat({ status: 'test status' }, () => {});
        }).to.throw(/'options.show' must not be undefined/);
      });

      it('should throw when invalid', () => {
        let options = {
          status: 'test status',
          show: 'back'
        };
        expect(() => {
          hipstat(options, () => {});
        }).to.throw(/Invalid option 'back' for options.show/);
      });

      ['chat', 'away', 'dnd', 'xa'].forEach((item) => {
        it(`${item} should be a valid value`, () => {
          let options = {
            status: 'test',
            show: item
          };
          expect(() => {
            hipstat(options, () => {});
          }).not.to.throw();
        });
      });

    });

  });

});
