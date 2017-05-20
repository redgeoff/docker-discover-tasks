'use strict';

var dns = require('dns'),
  os = require('os'),
  Promise = require('bluebird'),
  Hosts = require('./hosts'),
  log = require('./log'),
  requestLie = require('requestretry');

var lookup = Promise.promisify(dns.lookup);
var request = Promise.promisify(requestLie);

var Tasks = function (serviceName, port) {
  this._serviceName = serviceName;
  this._port = port;
  this._hosts = new Hosts();
};

// Max retries allowed when trying to contact another task
Tasks.prototype.retries = 20;

// Discover all tasks using the special DNS query for <tasks.SERVICE-NAME>. See
// https://docs.docker.com/engine/swarm/networking/#use-swarm-mode-service-discovery
Tasks.prototype._discover = function () {
  return lookup('tasks.' + this._serviceName, {
    all: true
  }).then(function (addresses) {
    // e.g. addresses =
    //   [ { address: '10.0.9.4', family: 4 },
    //     { address: '10.0.9.3', family: 4 } ]
    return addresses;
  });
};

// Get out hostname
Tasks.prototype._hostname = function () {
  return os.hostname();
};

// Modify our /etc/hosts file to add the hostname => address mapping
Tasks.prototype.registerLocally = function (hostname, address) {
  log.log('Registering ' + hostname + ' => ' + address);
  return this._hosts.upsert(hostname, address);
};

// Register our hostname and address with the task on target host
Tasks.prototype._registerRemotely = function (hostname) {
  var self = this,
    myHostname = self._hostname();

  return self._hosts.get(myHostname).then(function (address) {
    log.log('Registering my hostname of ' + myHostname + ' (' + address + ') with ' +
      hostname);

    return request({
      uri: 'http://' + hostname + ':' + self._port + '/register',
      method: 'PUT',
      json: {
        hostname: myHostname,
        address: address
      },
      maxAttempts: self.retries
    });
  });
};

// Discover all tasks and then register our hostname and address with each task
Tasks.prototype.broadcast = function () {
  var self = this;
  return self._discover().then(function (addresses) {
    var promises = [];
    addresses.forEach(function (address) {
      promises.push(self._registerRemotely(address.address));
    });
    return Promise.all(promises);
  });
};

module.exports = Tasks;
