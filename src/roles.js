var allRoles = ['harvester', 'upgrader', 'builder', 'guard', 'scout', 'cargo', 'hungry', 'no'];

var roles = {};

allRoles.forEach(function(r){ roles[r] = require("role-" + r); });

module.exports = roles;