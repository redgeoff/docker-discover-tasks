'use strict';

var Discover = require('../../scripts/discover');

describe('discover', function () {

  var discover = new Discover();

  it('should discover tasks', function () {
    return discover.discoverTasks();
  });

});
