'use strict';

var hostsLookup = require('hosts-lookup'),
  hostile = require('hostile'),
  Promise = require('bluebird');

var set = Promise.promisify(hostile.set),
  remove = Promise.promisify(hostile.set);

var Hosts = function () {
  // Synchronize access to the /etc/hosts file as the upsert is otherwise not atomic
  this._synchronizer = Promise.resolve();
};

Hosts.prototype.get = function (hostname) {
  this._synchronizer = this._synchronizer.then(function () {
    return hostsLookup(hostname);
  });
  return this._synchronizer;
};

Hosts.prototype._removeIfExists = function (hostname) {
  return this.get(hostname).then(function (existingAddress) {
    return remove(existingAddress, hostname);
  }).catch(function (err) {
    if (err !== 'No such host!') {
      throw err;
    }
  });
};

Hosts.prototype.upsert = function (hostname, address) {
  var self = this;
  self._synchronizer = self._synchronizer.then(function () {
    return self._removeIfExists(hostname, address).then(function () {
      return set(address, hostname);
    });
  });
  return this._synchronizer;
};

module.exports = Hosts;
