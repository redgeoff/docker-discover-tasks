'use strict';

var dns = require('dns'),
  os = require('os'),
  Promise = require('bluebird');

var lookup = Promise.promisify(dns.lookup);

var Tasks = function (serviceName) {
  this._serviceName = serviceName;
};

// [ { address: '10.0.9.4', family: 4 },
// { address: '10.0.9.3', family: 4 } ]
Tasks.prototype.discover = function () {
  return lookup('tasks.' + this._serviceName, {
    all: true
  }).then(function (addresses) {
    // TODO: get hostnames
  });
};

Tasks.prototype.hostname = function () {
  return os.hostname();
};

module.exports = Tasks;
