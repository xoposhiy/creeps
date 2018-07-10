///<reference path="screeps-extended.d.ts"/>

import Profiler = require('profiler');
import ext = require("ext"); ext.extend();
import roles = require('roles');
import cli = require('cli'); cli.populate(global);
import statistics = require('statistics');
import EnergyMine = require('EnergyMine');
import Transport = require('role-transport');
import Harvester = require('role-harvester');

global.stats = statistics.stats;
global.prof = Profiler;

if (!Memory.debug) Memory.debug = {};

export var loop = main;

function main() {
    statistics.stats.onTick();
    EnergyMine.initializeMinesMemory();

    _.forEach(Game.spawns, spawn => spawn.controlSpawn());

    var creeps:Creep[] = _.sortBy(<Creep[]>_.values(Game.creeps), c => c.memory.role);
    var prevRole = undefined;
    var time = undefined;
    var printRolePerformance = false;
    if (printRolePerformance)
        console.log('---');
    for(var name in creeps){
        var creep = creeps[name];
        if (!creep) continue;
        if (Game.getUsedCpu() > Game.cpuLimit*0.9) {
            console.log('stop execution!');
            break;
        }
        if (printRolePerformance && prevRole && prevRole != creep.memory.role)
            console.log('role ' + prevRole + ' ' + Game.getUsedCpu() + " next role " + creep.memory.role);
        prevRole = creep.memory.role;
        if (Game.time % 4 == 0)
            {
                var phrase = creepPhrase(creep);
                //if (phrase) creep.say(phrase);
            }
        creep.control();
    }
    for(var name in Game.rooms){
        var room = Game.rooms[name];
        var links: Link[] = <Link[]>room.find(FIND_MY_STRUCTURES, {filter: (s:Structure) => s.structureType == STRUCTURE_LINK});
        if (links.length == 0) continue;
        //console.log(links[0].pos);
        var targetLink:Link = _.filter(links, (l:Link) => l.pos.lookFor<Flag>("flag").length > 0)[0];
        if (!targetLink) {
            console.log("WARNING in " + name + " no target link! Place flag on target link!");
            continue;
        }
        if (targetLink.energy == targetLink.energyCapacity) continue;
        _.forEach(links, (l:Link) => {
           if (l.id != targetLink.id && l.cooldown == 0 && l.energy > 0){
               l.transferEnergy(targetLink, Math.min(l.energy, targetLink.energyCapacity - targetLink.energy));
           }
        });

    }
}

function creepPhrase(creep:Creep){
    if (!creep.memory.role) return null;
    var phrase = creep.memory.role[0] + ' ';
    if (creep.memory['minePos']) {
        var minerPos = creep.memory['minePos'];
        phrase += minerPos.replace(']', '').split(' ')[3];
    }
    else if (creep.memory.targetPosition)
        phrase += creep.memory.targetPosition.x + creep.memory.targetPosition.y;
    return phrase;
}