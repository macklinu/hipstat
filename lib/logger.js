class Logger {
  log(message) {
    console.log(message);
  }
}

class NoopLogger {
  log(message) { // eslint-disable-line no-unused-vars
    // no-op
  }
}

export default class {
  static create(enabled) {
    if (enabled) {
      return new Logger();
    } else {
      return new NoopLogger();
    }
  }
}
