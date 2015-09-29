import dotenv from 'dotenv';
dotenv.config();
import Hipchatter from 'hipchatter';

export default class HipStat {

  constructor() {
    this.hipchat = new Hipchatter(process.env.HIPCHAT_API_TOKEN);
    this.showTypes = ['chat', 'away', 'dnd', 'xa'];
  }

  user(opts, callback) {
    let options = opts || {};
    if (options.status == null) {
      throw new Error(`Must pass in options.status but was ${options.status}`);
    }
    if (!options.show) {
      throw new Error(`Must pass in options.show but was ${options.show}`);
    }
    if (this.showTypes.indexOf(options.show) === -1) {
      throw new Error(`Invalid option '${options.show}' for options.show`);
    }
    this.hipchat.view_user(process.env.HIPCHAT_USER_EMAIL, (err, user) => {
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
}
