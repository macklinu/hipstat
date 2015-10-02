import Configstore from 'configstore';
import Hipchatter from 'hipchatter';
import pkg from '../package.json';

const KEY_TOKEN = 'token';
const KEY_EMAIL = 'email';
const KEY_ALL = 'all';
const AVAILABLE_KEYS = [KEY_TOKEN, KEY_EMAIL, KEY_ALL];

export default function (input, flags, callback) {
  const config = new Configstore(pkg.name);

  if (flags.config) {
    if (flags.config === KEY_TOKEN) {
      if (input[0]) {
        config.set(KEY_TOKEN, input[0]);
        callback(null, 'Token updated.');
        return;
      } else {
        callback(null, `${config.get(KEY_TOKEN)}`);
        return;
      }
    } else if (flags.config === KEY_EMAIL) {
      if (input[0]) {
        config.set(KEY_EMAIL, input[0]);
        callback(null, 'Email updated.');
        return;
      } else {
        callback(null, `${config.get(KEY_EMAIL)}`);
        return;
      }
    } else if (flags.config === 'all') {
      callback(null, config.all);
      return;
    } else {
      callback(new Error(`Invalid --config key supplied. Must supply one of [${AVAILABLE_KEYS}].`), null);
      return;
    }
  }

  const token = config.get(KEY_TOKEN);
  if (!token) {
    callback(new Error('No HipChat API token found. See --help.'), null);
    return;
  }

  const email = config.get(KEY_EMAIL);
  if (!email) {
    callback(new Error('No HipChat email address found. See --help.'), null);
    return;
  }

  const opts = createOptions(input, flags);

  const hipchat = new Hipchatter(token);

  hipchat.view_user(email, (viewUserErr, user) => {
    if (viewUserErr) {
      callback(viewUserErr, null);
      return;
    }

    validateUserPresence(user);
    modifyUser(user, opts);

    hipchat.update_user(user, (updateErr, updateResponse) => {
      callback(updateErr, updateResponse);
    });
  });
}

function createOptions(input, flags) {
  let opts = {};
  opts.show = convertFlags(flags);
  opts.status = input.join(' ');
  return opts;
}

function convertFlags(flags) {
  if (flags.online) {
    return 'chat';
  }
  if (flags.away) {
    return 'away';
  }
  if (flags.busy) {
    return 'dnd';
  }
  return 'chat';
}

function validateUserPresence(user) {
  // user.presence may be null, according to HipChat's API docs
  if (!user.presence) {
    user.presence = {};
  }
}

function modifyUser(user, opts) {
  user.presence.status = opts.status;
  user.presence.show = opts.show;
}
