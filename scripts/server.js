'use strict';

var express = require('express'),
  bodyParser = require('body-parser'),
  Tasks = require('./tasks');

var Server = function (port) {
  this._port = port;
  this._tasks = new Tasks();
  this._init();
  this._registerRoutes();
};

Server.prototype._log = function (str) {
  console.log(str);
};

Server.prototype._init = function () {
  this._app = express();

  // For parsing application/json
  this._app.use(bodyParser.json());
};

Server.prototype._registerRoutes = function () {
  var self = this;

  self._app.get('/discover', function (req, res) {
    self._discover(req, res);
  });

  self._app.get('/hostname', function (req, res) {
    self._hostname(req, res);
  });
};

Server.prototype.start = function () {
  // Start listening for connections
  var self = this;
  self._server = self._app.listen(self._port, function () {
    self._log('Listening on port ' + self._port);
  });
};

Server.prototype.stop = function () {
  this._server.close();
};

Server.prototype._discover = function (req, res) {
  // TODO
  res.send('Hello World!');
};

Server.prototype._hostname = function (req, res) {
  res.send(this._tasks.hostname());
};

module.exports = Server;
