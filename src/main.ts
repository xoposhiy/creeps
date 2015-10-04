///<reference path="screeps-extended.d.ts"/>

import Profiler = require('profiler');
import ext = require("ext"); ext.extend();
import roles = require('roles');
import debug = require('debug'); debug.populate(global);
import statistics = require('statistics');

global.stats = statistics.stats;
global.prof = Profiler;

//Profiler.start();

//console.log(global.s(Game.creeps));

if (!Memory.debug) Memory.debug = {};

export var loop = main;

function main() {
    statistics.stats.onTick();

    _.forEach(Game.spawns, spawn => spawn.controlSpawn());

    _.values(Game.creeps).forEach((creep:Creep) => {
        if (!creep) return;
        if (Game.time % 4 == 0)
            creep.say(creep.memory.role || "WTF!");
        creep.control();
    });
}