'use strict';

var dns = require('dns'),
  os = require('os'),
  Promise = require('bluebird'),
  hosts = require('./hosts'),
  log = require('./log');

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
    return addresses;
  });
};

Tasks.prototype.hostname = function () {
  return os.hostname();
};

Tasks.prototype.registerLocally = function (hostname, address) {
  log('Registering ' + hostname + ' => ' + address);
  return hosts.upsert(hostname, address);
};

module.exports = Tasks;
