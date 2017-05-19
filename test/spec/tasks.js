'use strict';

var Tasks = require('../../scripts/tasks');

describe('tasks', function () {

  var tasks = new Tasks();

  it('should discover tasks', function () {
    return tasks.discover();
  });

});
