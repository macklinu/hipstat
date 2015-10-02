#!/usr/bin/env node
const meow = require('meow');
const hipstat = require('./');
const pkg = require('../package.json');

const meowOptions = {
  pkg: pkg,
  help: [
    'Usage',
    '',
    '  $ hipstat [options]',
    '',
    'Options',
    '',
    '  [config]',
    `  -c, --config the entry point for handling ${pkg.name} config variables.`,
    '',
    '  [availability] (optional)',
    '  -o, --online sets availability to \'Available\'.',
    '  -a, --away   sets availability to \'Away\'.',
    '  -b, --busy   sets availability to \'Do Not Disturb\'.',
    '  No option defaults to --online.',
    '',
    '  [status]',
    '  The status message to post to HipChat.',
    '  Not supplying a message clears your HipChat status.',
    '',
    'Examples',
    '',
    '  $ hipstat --config token [token]',
    '  [ sets HipChat API token ]',
    '',
    '  $ hipstat --config email [email]',
    '  [ sets HipChat email address ]',
    '',
    '  $ hipstat --config token',
    '  [ prints HipChat API token ]',
    '',
    '  $ hipstat --config email',
    '  [ prints HipChat email address ]',
    '',
    '  $ hipstat --config all',
    '  [ prints config data ]',
    '',
    '  $ hipstat',
    '  [ sets availability to \'Available\' ]',
    '  [ clears status ]',
    '',
    '  $ hipstat --online WFH',
    '  [ sets availability to \'Available\' ]',
    '  [ sets status to \'WFH\' ]',
    '',
    '  $ hipstat -a Back in 5',
    '  [ sets availability to \'Away\' ]',
    '  [ sets status to \'Back in 5\' ]',
    '',
    '  $ hipstat --busy Hacking too much time',
    '  [ sets availability to \'Do Not Disturb\' ]',
    '  [ sets status to \'Hacking too much time\' ]'
  ]
};
const minimistOptions = {
  boolean: ['online', 'away', 'busy'],
  alias: {
    o: 'online',
    a: 'away',
    b: 'busy',
    c: 'config'
  }
};

const cli = meow(meowOptions, minimistOptions);

hipstat(cli.input, cli.flags, (err, res) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  } else {
    if (res) {
      console.log(res);
    }
    process.exit(0);
  }
});
