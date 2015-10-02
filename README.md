# hipstat [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> Update your HipChat status from the command line

## Install

```sh
$ npm install --g hipstat
```

## Usage

```
$ hipstat [config] KEY VALUE
$ hipstat [options] MESSAGE
```

## Options

```
[config]
-c, --config the entry point for handling hipstat config variables.

KEY (required)
  when provided by itself, returns config value.
  when provided with VALUE, sets config value.
  possible values:
    token  HipChat API token
    email  HipChat email address
    all    prints config file (to be used without VALUE)
VALUE (optional)
  when provided, sets the VALUE for KEY.

[options]
-o, --online sets availability to 'Available'.
-a, --away   sets availability to 'Away'.
-b, --busy   sets availability to 'Do Not Disturb'.
No option defaults to --online.

MESSAGE (optional)
  when supplied, the status message to post to HipChat.
  if blank, clears the current HipChat status message.
```

## Examples

```sh
$ hipstat --config token [token]
[ sets HipChat API token ]

$ hipstat --config email [email]
[ sets HipChat email address ]

$ hipstat --config token
[ prints HipChat API token ]

$ hipstat --config email
[ prints HipChat email address ]

$ hipstat --config all
[ prints config data ]

$ hipstat
[ sets availability to 'Available' ]
[ clears status ]

$ hipstat --online WFH
[ sets availability to 'Available' ]
[ sets status to 'WFH' ]

$ hipstat -a Back in 5
[ sets availability to 'Away' ]
[ sets status to 'Back in 5' ]

$ hipstat --busy Hacking too much time
[ sets availability to 'Do Not Disturb' ]
[ sets status to 'Hacking too much time' ]
```

## License

```
Copyright 2015 Macklin Underdown

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

[npm-image]: https://badge.fury.io/js/hipstat.svg
[npm-url]: https://npmjs.org/package/hipstat
[travis-image]: https://travis-ci.org/macklinu/hipstat.svg?branch=master
[travis-url]: https://travis-ci.org/macklinu/hipstat
[daviddm-image]: https://david-dm.org/macklinu/hipstat.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/macklinu/hipstat
[coveralls-image]: https://coveralls.io/repos/macklinu/hipstat/badge.svg
[coveralls-url]: https://coveralls.io/r/macklinu/hipstat
