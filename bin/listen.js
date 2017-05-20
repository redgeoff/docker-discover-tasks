#!/usr/bin/env node

// TODO: use minimist to get params from CL

'use strict';

var Server = require('../scripts/server');

var server = new Server('myservice', 3000);

server.start();
