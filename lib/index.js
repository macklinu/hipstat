import dotenv from 'dotenv';
dotenv.config();
import Hipchatter from 'hipchatter';
import { assertValid, assertContains } from './util';

export default function (opts, callback) {

  let options = opts || {};
  validateOptions(options);

  let hipchat = new Hipchatter(process.env.HIPCHAT_API_TOKEN);

  hipchat.view_user(process.env.HIPCHAT_USER_EMAIL, (viewUserErr, user) => {

    if (viewUserErr) {
      callback(viewUserErr, null);
      return;
    }

    validateUserPresence(user);

    modifyUser(user, options);

    hipchat.update_user(user, (updateErr, updateResponse) => {
      callback(updateErr, updateResponse);
    });

  });
}

function validateOptions(options) {
  assertValid(options.status, 'options.status');
  assertValid(options.show, 'options.show');
  assertContains(['chat', 'away', 'dnd', 'xa'], options.show, 'options.show');
}

function validateUserPresence(user) {
  // user.presence may be null, according to HipChat's API docs
  if (!user.presence) {
    user.presence = {};
  }
}

function modifyUser(user, options) {
  user.presence.status = options.status;
  user.presence.show = options.show;
}
