///<reference path="screeps-extended.d.ts"/>
var Profiler = require('profiler');
var ext = require("ext");
ext;
var roles = require('roles');
Profiler.start();
exports.loop = main;
function main() {
    Memory.stats = {
        creeps: _.values(Game.creeps).length,
        bodyparts: _.reduce(_.values(Game.creeps), function (s, c) { return s + c.body.length; }, 0)
    };
    _.forEach(Game.spawns, function (spawn) { return spawn.controlSpawn(); });
    _.forEach(Game.creeps, function (creep) {
        if (creep.spawning)
            return;
        var roleImpl = roles.impl[creep.memory.role || 'no'];
        roleImpl.controlCreep(creep);
        if (Game.time % 4 == 0)
            creep.say(creep.memory.role);
    });
}
//# sourceMappingURL=main.js.map