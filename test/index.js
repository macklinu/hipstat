import chai from 'chai';
let expect = chai.expect;
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import Hipchatter from 'hipchatter';
import hipstat from '../lib/';

/*eslint-disable no-unused-expressions */

describe('hipstat', () => {

  const STATUS = 'test';
  const SHOW = 'chat';
  const OPTIONS = {
    status: STATUS,
    show: SHOW
  };

  let viewUser;
  let updateUser;
  let callbackSpy;

  beforeEach(() => {
    viewUser = sinon.stub(Hipchatter.prototype, 'view_user');
    updateUser = sinon.stub(Hipchatter.prototype, 'update_user');
    callbackSpy = sinon.spy();
  });

  afterEach(() => {
    Hipchatter.prototype.view_user.restore();
    Hipchatter.prototype.update_user.restore();
  });

  describe('options', () => {

    it('should throw when options are undefined', () => {
      expect(() => {
        hipstat(null, callbackSpy);
      }).to.throw(/'options.status' must not be undefined/);
      expect(callbackSpy).not.to.have.been.calledOnce;
    });

    describe('.status', () => {

      it('should throw when undefined', () => {
        expect(() => {
          hipstat({}, () => {});
        }).to.throw(/'options.status' must not be undefined/);
      });

      it('should not throw when status is an empty String', () => {
        expect(() => {
          hipstat({status: '', show: 'chat'}, callbackSpy);
        }).not.to.throw();
        expect(callbackSpy).not.to.have.been.calledOnce;
      });

    });

    describe('.show', () => {

      it('should throw when undefined', () => {
        let options = {
          status: 'test'
        };

        expect(() => {
          hipstat(options, callbackSpy);
        }).to.throw(/'options.show' must not be undefined/);
        expect(callbackSpy).not.to.have.been.calledOnce;
      });

      it('should throw when invalid', () => {
        let invalidOptions = {
          status: 'test',
          show: 'back'
        };

        expect(() => {
          hipstat(invalidOptions, callbackSpy);
        }).to.throw(/Collection does not contain 'back' for 'options.show'.*/);
        expect(callbackSpy).not.to.have.been.calledOnce;
      });

      ['chat', 'away', 'dnd', 'xa'].forEach((item) => {
        it(`${item} should be a valid value`, () => {
          let options = {
            status: 'test',
            show: item
          };

          expect(() => {
            hipstat(options, callbackSpy);
          }).not.to.throw();
          expect(viewUser).to.have.been.calledOnce;
        });
      });

    });

  });

  describe('update status', () => {

    describe('failure', () => {

      it('should callback with error when retrieving user fails', () => {
        let error = 'error';

        hipstat(OPTIONS, callbackSpy);
        viewUser.callArgWith(1, error, null);

        expect(callbackSpy).to.have.been.calledWith(error, null);
        expect(updateUser).not.to.have.been.calledOnce;
      });

      it('should callback with error when updating user fails', () => {
        let error = 'error';
        let user = {
          presence: null
        };

        hipstat(OPTIONS, callbackSpy);
        viewUser.callArgWith(1, null, user);
        updateUser.callArgWith(1, error, null);

        expect(callbackSpy).to.have.been.calledWith(error, null);
        expect(viewUser).to.have.been.calledOnce;
        expect(updateUser).to.have.been.calledOnce;
      });

    });

    describe('success', () => {

      it('should callback with successful response when retrieving and updating user succeed', () => {
        let user = {};
        let successResponse = 'success';

        hipstat(OPTIONS, callbackSpy);
        viewUser.callArgWith(1, null, user);
        updateUser.callArgWith(1, null, successResponse);

        expect(callbackSpy).to.have.been.calledWith(null, successResponse);
        expect(viewUser).to.have.been.calledOnce;
        expect(updateUser).to.have.been.calledOnce;
      });

      it('should modify user.presence with updated status and availability', () => {
        let user = {};

        hipstat(OPTIONS, callbackSpy);
        viewUser.callArgWith(1, null, user);

        expect(user.presence.status).to.equal(STATUS);
        expect(user.presence.show).to.equal(SHOW);
      });

    });

  });

});

/*eslint-enable no-unused-expressions */
