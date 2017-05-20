'use strict';

var dns = require('dns'),
  os = require('os'),
  Promise = require('bluebird'),
  Hosts = require('./hosts'),
  log = require('./log'),
  requestLie = require('requestretry');

var request = Promise.promisify(requestLie);

var Tasks = function (serviceName, port) {
  this._serviceName = serviceName;
  this._port = port;
  this._hosts = new Hosts();
  this._lookup = Promise.promisify(dns.lookup);
};

// Max retries allowed when trying to contact another task
Tasks.prototype.retries = 20;

// Discover all tasks using the special DNS query for <tasks.SERVICE-NAME>. See
// https://docs.docker.com/engine/swarm/networking/#use-swarm-mode-service-discovery
Tasks.prototype._discover = function () {
  return this._lookup('tasks.' + this._serviceName, {
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
Tasks.prototype._registerLocally = function (hostname, address) {
  log.log('Registering ' + hostname + ' => ' + address);
  return this._hosts.upsert(hostname, address);
};

Tasks.prototype.registerLocallyAndGetHostname = function (hostname, address) {
  var self = this;
  return self._registerLocally(hostname, address).then(function () {
    return self._hostname();
  });
};

Tasks.prototype._requestRegistration = function (remoteAddress, localHostname, localAddress) {
  log.log('Registering local hostname of ' + localHostname + ' (' + localAddress + ') with ' +
    remoteAddress);

  return request({
    uri: 'http://' + remoteAddress + ':' + this._port + '/register',
    method: 'PUT',
    json: {
      hostname: localHostname,
      address: localAddress
    },
    maxAttempts: this.retries
  });
};

// Register the local hostname and address with the task on the remote host. Then locally register
// the returned remote hostname.
Tasks.prototype._registerRemotely = function (address) {
  var self = this,
    localHostname = self._hostname();

  return self._hosts.get(localHostname).then(function (localAddress) {
    return self._requestRegistration(address, localHostname, localAddress);
  }).then(function (response) {
    return self._registerLocally(response.body.payload.hostname, address);
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
