'use strict';

var log = require('../../scripts/log');

describe('log', function () {

  var muted = false;

  before(function () {
    muted = log._muted;
    log.mute(false);

    // Mock
    log._console = {
      log: function () {}
    };
  });

  after(function () {
    // Restore
    log._console = console;
    log.mute(muted);
  });

  it('should log to console', function () {
    log.log('foo');
  });

});
