'use strict';

var dns = require('dns'),
  Promise = require('bluebird');

var lookup = Promise.promisify(dns.lookup);

var Discover = function () {

};

Discover.prototype.discoverTasks = function () {
  // dns.lookup('google.com', { all: true }, function (err, address, family) {
  //   console.log('address: %j family: IPv%s', address, family);
  // });
  return lookup('google.com', {
    all: true
  }).then(function (stuff) {
    console.log(stuff);
  });
};

module.exports = Discover;
