#!/usr/bin/env node
var meow = require('meow');
var hipstat = require('./');
var pkg = require('../package.json');

var meowOptions = {
  pkg: pkg,
  help: [
    'Usage',
    '  $ hipstat --[availability] [status]',
    '',
    'Examples',
    '  $ hipstat',
    '  # sets availability to online',
    '  # clears status',
    '',
    '  $ hipstat Working from bed',
    '  # sets availability to online',
    '  # sets status to \'Working from bed\'',
    '',
    '  $ hipstat -a Back in 5',
    '  # sets availability to away',
    '  # sets status to \'Back in 5\'',
    '',
    'Options',
    '  -o, --online set availability to online.',
    '  -a, --away set availability to away.',
    '  -b, --busy set availability to busy.',
    '  No option defaults to --online.'
  ]
};
var minimistOptions = {
  boolean: ['online', 'away', 'busy'],
  alias: {
    o: 'online',
    a: 'away',
    b: 'busy'
  }
};

var cli = meow(meowOptions, minimistOptions);

hipstat(cli.input, cli.flags, function(err, res) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    process.exit(0);
  }
});
