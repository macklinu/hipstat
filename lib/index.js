import dotenv from 'dotenv';
dotenv.config();
import Hipchatter from 'hipchatter';
import { assertValid, assertContains } from './util';

export default function (opts, callback) {
  let options = opts || {};

  assertValid(options.status, 'options.status');
  assertValid(options.show, 'options.show');
  assertContains(['chat', 'away', 'dnd', 'xa'], options.show, 'options.show');

  let hipchat = new Hipchatter(process.env.HIPCHAT_API_TOKEN);

  hipchat.view_user(process.env.HIPCHAT_USER_EMAIL, (err, user) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (!user.presence) {
      callback('No user.presence object', null);
      return;
    }
    callback(null, user);
    // this.hipchat.update_user(process.env.HIPCHAT_USER_EMAIL, (err, json) => {

    // })
  });
}
