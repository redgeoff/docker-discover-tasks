'use strict';

var express = require('express'),
  bodyParser = require('body-parser');

var Server = function (port) {
  this._port = port;
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

  self._app.get('/', function (req, res) {
    self._discover(req, res);
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

module.exports = Server;
