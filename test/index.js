var Chai = require('chai');
var ChaiSpies = require('chai-spies');
var Cla6 = require('cla6');
var Cla6Hidden = require('..');

// plugins
Chai.use(ChaiSpies);
Cla6.use(Cla6Hidden);

// tests
require('./hidden');