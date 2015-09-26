///<reference path="screeps-extended.d.ts"/>

import Profiler = require('profiler');
import ext = require("ext");
ext;
import roles = require('roles');

Profiler.start();

export var loop = main;

function main() {
    Memory.stats = {
        creeps: _.values(Game.creeps).length,
        bodyparts: _.reduce(_.values(Game.creeps), (s:number, c:Creep) => s + c.body.length, 0)
    };

    _.forEach(Game.spawns, spawn => spawn.controlSpawn());

    _.forEach(Game.creeps, creep => {
        if (creep.spawning) return;
        var roleImpl = roles.impl[creep.memory.role || 'no'];
        roleImpl.controlCreep(creep);
        if (Game.time % 4 == 0)
            creep.say(creep.memory.role);
    });
}