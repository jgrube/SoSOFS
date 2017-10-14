// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: Global hooks for Mocha tests
"use strict";

// Node Modules
const fs   = require("fs");
const path = require("path");

// Dependency Modules

// Dev Dependency Modules

// Local Modules
const config = require("../config.json");

const dataDir = (config && config.common && config.common.dataRoot) ?
    config.common.dataRoot :
    "data";

before("global", function (done) {
    done();
});

after("global", function (done) {
    done();
});
