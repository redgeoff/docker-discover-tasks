'use strict';

var Log = function () {
  this._console = console;
  this._muted = false;
};

Log.prototype.log = function (str) {
  if (!this._muted) {
    this._console.log((new Date()) + ': ' + str);
  }
};

Log.prototype.mute = function (muted) {
  if (typeof muted === 'undefined') {
    muted = true;
  }
  this._muted = muted;
};

module.exports = new Log();
