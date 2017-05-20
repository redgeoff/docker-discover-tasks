'use strict';

var Server = require('../../scripts/server'),
  Promise = require('bluebird'),
  requestLie = require('request');

var request = Promise.promisify(requestLie);

describe('server', function () {

  var server = null,
    port = 3001;

  beforeEach(function () {
    server = new Server('service-name', port);
    return server.start();
  });

  afterEach(function () {
    return server.stop();
  });

  var register = function () {
    return request({
      uri: 'http://localhost:' + port + '/register',
      method: 'PUT',
      json: {
        hostname: 'myhostname',
        address: 'address'
      }
    });
  };

  it('should register', function () {
    var hosts = [];

    // Fake and spy
    server._tasks._hosts.upsert = function (hostname, address) {
      hosts.push({
        hostname: hostname,
        address: address
      });
      return Promise.resolve();
    };

    return register().then(function (response) {
      response.body.should.eql({
        error: false,
        payload: {
          hostname: server._tasks._hostname()
        }
      });

      hosts.should.eql([{
        hostname: 'myhostname',
        address: 'address'
      }]);
    });
  });

  it('should process error', function () {
    // Fake
    server._tasks._registerLocally = function () {
      return Promise.reject(new Error('myerror'));
    };

    return register().then(function (response) {
      response.body.should.eql({
        error: true,
        reason: 'myerror'
      });
    });
  });

});
