'use strict';

var dns = require('dns'),
  os = require('os'),
  Promise = require('bluebird');

var lookup = Promise.promisify(dns.lookup);

var Tasks = function () {

};

// discover
// [ { address: '10.0.9.4', family: 4 },
// { address: '10.0.9.3', family: 4 } ]
Tasks.prototype.discover = function () {
  return lookup('google.com', {
    all: true
  }).then(function (stuff) {
    console.log(stuff);
  });
};

Tasks.prototype.hostname = function () {
  return os.hostname();
};

module.exports = Tasks;
