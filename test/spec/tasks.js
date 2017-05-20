'use strict';

var Server = require('../../scripts/server'),
  Promise = require('bluebird');

describe('tasks', function () {

  var server = null,
    port = 3001,
    localAddress = '127.0.0.1';

  beforeEach(function () {
    server = new Server('service-name', port);

    // Fake
    server._tasks._hosts._lookup = function () {
      return '127.0.0.1';
    };

    return server.start();
  });

  afterEach(function () {
    return server.stop();
  });

  it('should broadcast', function () {
    var localHostname = server._tasks._hostname();

    // Fake as we aren't actually running on docker for our tests
    server._tasks._lookup = function (name) {
      name.should.eql('tasks.service-name');

      // Simulate a DNS reponse that just describes our local task
      return Promise.resolve([{
        address: localAddress
      }]);
    };

    // Fake as we don't want to modify /etc/hosts when testing and can't even modify it unless we
    // have root access
    server._tasks._hosts.upsert = function (hostname, address) {
      hostname.should.eql(localHostname);
      address.should.eql(localAddress);
      return Promise.resolve();
    };

    return server._tasks.broadcast();
  });

});
