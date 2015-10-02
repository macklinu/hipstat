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
      handleConfigOption(KEY_TOKEN, config, input, callback);
    } else if (flags.config === KEY_EMAIL) {
      handleConfigOption(KEY_EMAIL, config, input, callback);
    } else if (flags.config === 'all') {
      callback(null, config.all);
    } else {
      callback(new Error(`Invalid --config key supplied. Must supply one of [${AVAILABLE_KEYS}].`), null);
    }
    return;
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

function handleConfigOption(key, config, input, callback) {
  if (input[0]) {
    config.set(key, input[0]);
    callback(null, `${key} updated.`);
  } else {
    callback(null, `${config.get(key)}`);
  }
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
  // default to online
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
