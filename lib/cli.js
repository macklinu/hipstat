#!/usr/bin/env node
const meow = require('meow');
const hipstat = require('./');
const pkg = require('../package.json');
const updateNotifier = require('update-notifier');
const emoji = require('node-emoji').emoji;

updateNotifier({pkg}).notify();

const meowOptions = {
  pkg: pkg,
  help: [
    'Usage',
    '',
    `  $ ${pkg.name} [config] KEY VALUE`,
    `  $ ${pkg.name} [options] MESSAGE`,
    '',
    'Options',
    '',
    '  [config]',
    `  -c, --config the entry point for handling ${pkg.name} config variables.`,
    '',
    '  KEY (required)',
    '    when provided by itself, returns config value.',
    '    when provided with VALUE, sets config value.',
    '    possible values:',
    '      token  HipChat API token',
    '      email  HipChat email address',
    '      all    prints config file (to be used without VALUE)',
    '  VALUE (optional)',
    '    when provided, sets the VALUE for KEY.',
    '',
    '  [options]',
    '  -o, --online sets availability to \'Available\'.',
    '  -a, --away   sets availability to \'Away\'.',
    '  -b, --busy   sets availability to \'Do Not Disturb\'.',
    '  No option defaults to --online.',
    '',
    '  MESSAGE (optional)',
    '    when supplied, the status message to post to HipChat.',
    '    if blank, clears the current HipChat status message.',
    '',
    '  [other]',
    '  -v, --verbose runs in verbose mode',
    `  --version     prints the version of ${pkg.name}`,
    '',
    'Examples',
    '',
    `  $ ${pkg.name} --config token [token]`,
    '  [ sets HipChat API token ]',
    '',
    `  $ ${pkg.name} --config email [email]`,
    '  [ sets HipChat email address ]',
    '',
    `  $ ${pkg.name} --config token`,
    '  [ prints HipChat API token ]',
    '',
    `  $ ${pkg.name} --config email`,
    '  [ prints HipChat email address ]',
    '',
    `  $ ${pkg.name} --config all`,
    '  [ prints config data ]',
    '',
    `  $ ${pkg.name}`,
    '  [ sets availability to \'Available\' ]',
    '  [ clears status ]',
    '',
    `  $ ${pkg.name} --online WFH`,
    '  [ sets availability to \'Available\' ]',
    '  [ sets status to \'WFH\' ]',
    '',
    `  $ ${pkg.name} -a Back in 5`,
    '  [ sets availability to \'Away\' ]',
    '  [ sets status to \'Back in 5\' ]',
    '',
    `  $ ${pkg.name} --busy Hacking too much time`,
    '  [ sets availability to \'Do Not Disturb\' ]',
    '  [ sets status to \'Hacking too much time\' ]'
  ]
};
const minimistOptions = {
  boolean: ['online', 'away', 'busy', 'verbose'],
  alias: {
    o: 'online',
    a: 'away',
    b: 'busy',
    c: 'config',
    v: 'verbose'
  }
};

const cli = meow(meowOptions, minimistOptions);

hipstat(cli.input, cli.flags, (err, res) => {
  if (err) {
    console.error(`${emoji.sos} ${err.message}`);
    process.exit(1);
  } else {
    console.log(`${emoji.ok}`);
    process.exit(0);
  }
});
