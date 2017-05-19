'use strict';

var dns = require('dns'),
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

module.exports = Tasks;
