#!/usr/bin/env node

// TODO: use minimist to get params from CL

var Tasks = require('../scripts/tasks');

var tasks = new Tasks('myservice', 3000);

tasks.broadcast();
