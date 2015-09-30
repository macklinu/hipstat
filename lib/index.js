import dotenv from 'dotenv';
dotenv.config();
import Hipchatter from 'hipchatter';

export default function (input, flags, callback) {
  let opts = {};
  opts.show = convertFlags(flags);
  opts.status = input.join(' ');

  let hipchat = new Hipchatter(process.env.HIPCHAT_API_TOKEN);

  hipchat.view_user(process.env.HIPCHAT_USER_EMAIL, (viewUserErr, user) => {
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
