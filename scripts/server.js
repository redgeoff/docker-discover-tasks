'use strict';

var express = require('express'),
  bodyParser = require('body-parser'),
  Tasks = require('./tasks'),
  log = require('./log');

var Server = function (serviceName, port) {
  this._port = port;
  this._tasks = new Tasks(serviceName);
  this._init();
  this._registerRoutes();
};

Server.prototype._init = function () {
  this._app = express();

  // For parsing application/json
  this._app.use(bodyParser.json());
};

Server.prototype._registerRoutes = function () {
  var self = this;

  // TODO: remove
  // self._app.get('/discover', function (req, res) {
  //   self._discover(req, res);
  // });

  // TODO: remove
  // self._app.get('/hostname', function (req, res) {
  //   self._hostname(req, res);
  // });

  self._app.put('/register', function (req, res) {
    self._register(req, res);
  });
};

Server.prototype.start = function () {
  // Start listening for connections
  var self = this;
  self._server = self._app.listen(self._port, function () {
    log('Listening on port ' + self._port);
  });
};

Server.prototype.stop = function () {
  this._server.close();
};

Server.prototype._success = function (res) {
  res.json({ error: false });
};

// TODO: remove
// Server.prototype._discover = function (req, res) {
//   // TODO
//   res.send('Hello World!');
// };

// TODO: remove?
// Server.prototype._hostname = function (req, res) {
//   res.send(this._tasks.hostname());
// };

Server.prototype._register = function (req, res) {
  this._tasks.registerLocally(req.body.hostname, req.body.address);
  this._success(res);
};

module.exports = Server;
