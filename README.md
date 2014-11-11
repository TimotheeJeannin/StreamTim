# StreamTim [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url] [![Code Climate][codeclimate-image]][codeclimate-url]

[travis-url]: http://travis-ci.org/TimotheeJeannin/StreamTim
[travis-image]: https://travis-ci.org/TimotheeJeannin/StreamTim.svg?branch=master

[depstat-url]: https://david-dm.org/timotheejeannin/streamtim
[depstat-image]: https://david-dm.org/timotheejeannin/streamtim.png

[codeclimate-url]: https://codeclimate.com/github/TimotheeJeannin/StreamTim
[codeclimate-image]: https://codeclimate.com/github/TimotheeJeannin/StreamTim/badges/gpa.svg


### Make a release

* Bump the version in both `bower.json` and `package.json`.
* Make sure all tests are passing.
* Make an `npm dedupe` to avoid packaging unnecessary dependencies.
* Make a tag and push it.
* Make a `grunt deploy` to build packages and push them to amazon S3.