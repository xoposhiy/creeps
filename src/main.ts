///<reference path="screeps-extended.d.ts"/>

import Profiler = require('profiler');
import ext = require("ext"); ext.extend();
import roles = require('roles');
import debug = require('debug'); debug.populate(global);
import statistics = require('statistics');

global.stats = statistics.stats;

Profiler.start();

export var loop = main;

function main() {
    statistics.stats.onTick();

    _.forEach(Game.spawns, spawn => spawn.controlSpawn ? spawn.controlSpawn() : undefined);

    _.forEach(Game.creeps, (creep, name) => {
        if (!creep){
            console.log('strange creep ' + name);
            return;
        }
        if (creep.spawning) return;
        var roleImpl = roles.impl[creep.memory.role || 'no'];
        if (!roleImpl){
            console.log('strange role ' + creep.memory.role);
            return;
        }
        roleImpl.controlCreep(creep);
        if (Game.time % 4 == 0)
            creep.say(creep.memory.role);
    });
}