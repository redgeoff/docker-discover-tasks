#!/usr/bin/env node

'use strict';

var Server = require('../scripts/server'),
  Tasks = require('../scripts/tasks'),
  argv = require('minimist')(process.argv.slice(2));

if (!argv.s || !argv.p) {
  console.log('Usage: docker-discover-tasks -s service-name -p port');
} else {
  var server = new Server(argv.s, argv.p);
  var tasks = new Tasks(argv.s, argv.p);
  server.start();
  tasks.broadcast();
}
