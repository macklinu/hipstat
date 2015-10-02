import chai from 'chai';
let expect = chai.expect;
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import Hipchatter from 'hipchatter';
import Configstore from 'configstore';
import hipstat from '../lib/';
import pkg from '../package.json';
import userHome from 'user-home';
import fs from 'fs';

/*eslint-disable no-unused-expressions */

describe('hipstat', () => {

  const VALID_TOKEN = 'valid_token';
  const VALID_EMAIL = 'valid@email.com';
  const PKG_NAME = pkg.name;
  const TEST_PKG_NAME = 'hipstat-test';

  let user;
  let viewUser;
  let updateUser;
  let configGet;
  let configSet;
  let callbackSpy;

  before(() => {
    // unable to successfully stub the Configstore constructor with sinon
    // so changing the package name during tests
    // prevents conflicts with an actual hipstat config file
    pkg.name = TEST_PKG_NAME;
  });

  beforeEach(() => {
    user = {};
    viewUser = sinon.stub(Hipchatter.prototype, 'view_user');
    updateUser = sinon.stub(Hipchatter.prototype, 'update_user');
    configGet = sinon.stub(Configstore.prototype, 'get');
    configSet = sinon.spy(Configstore.prototype, 'set');
    callbackSpy = sinon.spy();
    pkg.name = 'hipstat-test';

    configGet.withArgs('token').returns(VALID_TOKEN);
    configGet.withArgs('email').returns(VALID_EMAIL);
  });

  afterEach(() => {
    // delete the test config file
    fs.unlinkSync(`${userHome}/.config/configstore/${TEST_PKG_NAME}.json`);
    Hipchatter.prototype.view_user.restore();
    Hipchatter.prototype.update_user.restore();
    Configstore.prototype.get.restore();
    Configstore.prototype.set.restore();
  });

  after(() => {
    // reset the original package name
    pkg.name = PKG_NAME;
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

  describe('config', () => {
    it('should prompt user to set HipChat API token if none exists', () => {
      configGet.reset();
      configGet.withArgs('token').returns(undefined);
      configGet.withArgs('email').returns(VALID_EMAIL);

      hipstat([], {}, callbackSpy);

      expect(callbackSpy).to.have.been.calledWith(new Error(/No HipChat API token found./), null);
    });
    it('should prompt user to set HipChat email address if none exists', () => {
      configGet.reset();
      configGet.withArgs('token').returns(VALID_TOKEN);
      configGet.withArgs('email').returns(undefined);

      hipstat([], {}, callbackSpy);

      expect(callbackSpy).to.have.been.calledWith(new Error(/No HipChat email address found./), null);
    });
    it('should set the HipChat API token if `hipstat --config token [token]` is called', () => {
      hipstat([VALID_TOKEN], {config: 'token'}, callbackSpy);

      expect(configSet).to.have.been.calledWith('token', VALID_TOKEN);
      expect(callbackSpy).to.have.been.calledWith(null, 'Token updated.');
    });
    it('should set the HipChat user email address if `hipstat --config email [email]` is called', () => {
      hipstat([VALID_EMAIL], {config: 'email'}, callbackSpy);

      expect(configSet).to.have.been.calledWith('email', VALID_EMAIL);
      expect(callbackSpy).to.have.been.calledWith(null, 'Email updated.');
    });
    it('should return the stored HipChat API token if `hipstat --config token` is called', () => {
      hipstat([], {config: 'token'}, callbackSpy);

      expect(configGet).to.have.been.calledWith('token');
      expect(callbackSpy).to.have.been.calledWith(null, `${VALID_TOKEN}`);
    });
    it('should return the stored HipChat user email address if `hipstat --config email` is called', () => {
      hipstat([], {config: 'email'}, callbackSpy);

      expect(configGet).to.have.been.calledWith('email');
      expect(callbackSpy).to.have.been.calledWith(null, `${VALID_EMAIL}`);
    });
    it('should return an error message when `hipstat --config` is called without a key', () => {
      hipstat([], {config: true}, callbackSpy);

      expect(callbackSpy).to.have.been.calledWith(new Error(/Invalid --config key supplied./), null);
    });
    it('should return an error message when `hipstat --config` is called with an invalid key', () => {
      hipstat([], {config: 'hello'}, callbackSpy);

      expect(callbackSpy).to.have.been.calledWith(new Error(/Invalid --config key supplied./), null);
    });
    it('should return the config object when `hipstat --config all` is called', () => {
      hipstat([], {config: 'all'}, callbackSpy);

      expect(callbackSpy).to.have.been.calledOnce;
      let config = callbackSpy.args[0][1];
      expect(config).to.be.an.instanceof(Object);
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
      it('should callback with successful response when retrieving and updating user succeeds', () => {
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
