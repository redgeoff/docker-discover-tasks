'use strict';

var Promise = require('bluebird'),
  express = require('express'),
  bodyParser = require('body-parser'),
  Tasks = require('./tasks'),
  log = require('./log');

var Server = function (serviceName, port) {
  this._port = port;
  this._tasks = new Tasks(serviceName, port);
  this._init();
  this._registerRoutes();
};

Server.prototype._init = function () {
  this._app = express();

  // For parsing application/json
  this._app.use(bodyParser.json());
};

Server.prototype._registerRoutes = function () {
  this._app.put('/register', this._register());
};

Server.prototype.start = function () {
  // Start listening for connections
  var self = this;
  self._server = self._app.listen(self._port, function () {
    log.log('Listening on port ' + self._port);
  });
};

Server.prototype.stop = function () {
  this._server.close();
};

Server.prototype._error = function (res, err) {
  res.json({
    error: true,
    reason: err.message
  });
};

Server.prototype._success = function (res) {
  res.json({
    error: false
  });
};

Server.prototype._request = function (res, factory) {
  var self = this;

  // Wrap with Promise.resolve() in case factory doesn't return promise
  return Promise.resolve().then(function () {
    return factory();
  }).then(function () {
    self._success(res);
  }).catch(function (err) {
    self._error(res, err);
  });
};

Server.prototype._register = function () {
  var self = this;
  return function (req, res) {
    self._request(res, function () {
      return self._tasks.registerLocally(req.body.hostname, req.body.address);
    });
  };
};

module.exports = Server;
