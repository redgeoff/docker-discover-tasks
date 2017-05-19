'use strict';

var hostsLookup = require('hosts-lookup'),
  hostile = require('hostile'),
  Promise = require('bluebird');

var set = Promise.promisify(hostile.set),
  remove = Promise.promisify(hostile.set);

var Hosts = function () {};

Hosts.prototype.get = function (hostname) {
  return hostsLookup(hostname);
};

Hosts.prototype._removeIfExists = function (hostname, address) {
  return this.get(hostname).then(function (existingAddress) {
    return remove(existingAddress, hostname);
  }).catch(function (err) {
    if (err !== 'No such host!') {
      throw err;
    }
  });
};

Hosts.prototype.upsert = function (hostname, address) {
  return this._removeIfExists(hostname, address).then(function () {
    return set(address, hostname);
  });
};

module.exports = new Hosts();
