///<reference path="screeps-extended.d.ts"/>

//import Profiler = require('profiler');
import ext = require("ext"); ext.extend();
import roles = require('roles');
import debug = require('debug'); debug.populate(global);
import statistics = require('statistics');

global.stats = statistics.stats;

//Profiler.start();

if (!Memory.debug) Memory.debug = {};

export var loop = main;

function main() {
    statistics.stats.onTick();

    _.forEach(Game.spawns, spawn => spawn.controlSpawn());

    _.forEach(Game.creeps, creep => {
        creep.control();
        if (Game.time % 4 == 0)
            creep.say(creep.memory.role);
    });
}