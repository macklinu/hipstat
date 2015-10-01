# hipstat [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> Update your HipChat status from the command line

## Install

```sh
$ npm install --g hipstat
```

## Usage

```
$ hipstat [availability] [status]

[availability] (optional)
-o, --online sets availability to 'Available'.
-a, --away   sets availability to 'Away'.
-b, --busy   sets availability to 'Do Not Disturb'.
No option defaults to --online.

[status]
The status message to post to HipChat.
Not supplying a message clears your HipChat status.
```

## Examples

```sh
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
