import chai from 'chai';
let expect = chai.expect;
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import Hipchatter from 'hipchatter';
import hipstat from '../lib/';

/*eslint-disable no-unused-expressions */

describe('hipstat', () => {

  let user;
  let viewUser;
  let updateUser;
  let callbackSpy;

  beforeEach(() => {
    user = {};
    viewUser = sinon.stub(Hipchatter.prototype, 'view_user');
    updateUser = sinon.stub(Hipchatter.prototype, 'update_user');
    callbackSpy = sinon.spy();
  });

  afterEach(() => {
    Hipchatter.prototype.view_user.restore();
    Hipchatter.prototype.update_user.restore();
  });

  describe('parameters', () => {
    describe('input', () => {
      it('should default to an empty string', () => {
        hipstat([], {}, callbackSpy);
        viewUser.callArgWith(1, null, user);

        expect(user.presence)
          .to.have.property('status')
          .and.to.equal('');
      });
      it('should properly pass through one-word input', () => {
        hipstat(['hello'], {}, callbackSpy);
        viewUser.callArgWith(1, null, user);

        expect(user.presence)
          .to.have.property('status')
          .and.to.equal('hello');
      });
      it('should properly concatenate multiple-word input', () => {
        hipstat(['hello', 'from', 'outer', 'space'], {}, callbackSpy);
        viewUser.callArgWith(1, null, user);

        expect(user.presence)
          .to.have.property('status')
          .and.to.equal('hello from outer space');
      });
    });
    describe('flags', () => {
      it('should default to online', () => {
        hipstat([], {}, callbackSpy);
        viewUser.callArgWith(1, null, user);

        expect(user.presence)
          .to.have.property('show')
          .and.to.equal('chat');
      });
      it('should parse --online as \'chat\'', () => {
        hipstat([], {online: true}, callbackSpy);
        viewUser.callArgWith(1, null, user);

        expect(user.presence)
          .to.have.property('show')
          .and.to.equal('chat');
      });
      it('should parse --away as \'away\'', () => {
        hipstat([], {away: true}, callbackSpy);
        viewUser.callArgWith(1, null, user);

        expect(user.presence)
          .to.have.property('show')
          .and.to.equal('away');
      });
      it('should parse --busy as \'dnd\'', () => {
        hipstat([], {busy: true}, callbackSpy);
        viewUser.callArgWith(1, null, user);

        expect(user.presence)
          .to.have.property('show')
          .and.to.equal('dnd');
      });
      it('should parse multiple flags in order of online status [online, away, busy]', () => {
        hipstat([], {
          online: true,
          away: true,
          busy: true
        }, callbackSpy);
        viewUser.callArgWith(1, null, user);

        expect(user.presence)
          .to.have.property('show')
          .and.to.equal('chat');
      });
    });
  });

  describe('update status', () => {
    describe('failure', () => {
      it('should callback with error when retrieving user fails', () => {
        let error = 'error';

        hipstat([], {}, callbackSpy);
        viewUser.callArgWith(1, error, null);

        expect(callbackSpy).to.have.been.calledWith(error, null);
        expect(updateUser).not.to.have.been.calledOnce;
      });
      it('should callback with error when updating user fails', () => {
        let error = 'error';

        hipstat([], {}, callbackSpy);
        viewUser.callArgWith(1, null, user);
        updateUser.callArgWith(1, error, null);

        expect(callbackSpy).to.have.been.calledWith(error, null);
        expect(viewUser).to.have.been.calledOnce;
        expect(updateUser).to.have.been.calledOnce;
      });
    });
    describe('success', () => {
      it('should callback with successful response when retrieving and updating user succeed', () => {
        let successResponse = 'success';

        hipstat([], {}, callbackSpy);
        viewUser.callArgWith(1, null, user);
        updateUser.callArgWith(1, null, successResponse);

        expect(callbackSpy).to.have.been.calledWith(null, successResponse);
        expect(viewUser).to.have.been.calledOnce;
        expect(updateUser).to.have.been.calledOnce;
      });
      it('should modify user.presence with updated status and availability', () => {
        hipstat(['test'], {}, callbackSpy);
        viewUser.callArgWith(1, null, user);

        expect(user.presence.status).to.equal('test');
        expect(user.presence.show).to.equal('chat');
      });
    });
  });
});

/*eslint-enable no-unused-expressions */
