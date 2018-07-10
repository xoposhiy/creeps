///<reference path="screeps-extended.d.ts"/>

import Tank = require("role-tank");
import Soldier = require("role-soldier");
import Healer = require("role-healer");
import Upper = require("role-upper");
import Transport = require("role-transport");

Spawn.prototype.controlSpawn = function (){
    var spawn = this;
    var roomCreeps = _.filter(Game.creeps, c => c.longMemory().roomName == spawn.room.name);
    spawn.memory.wantToSpawn = wantToSpawn(spawn, roomCreeps);
    if (!spawn.memory.wantToSpawn) return;
    var maxEnergy = getTotalEnergyCapacity(this);
    var body = getNextCreepBody(spawn, maxEnergy, roomCreeps);
    var creepsCount = spawn.room.find(FIND_MY_CREEPS).length;
    var canCreate = this.canCreateCreep(body);
    if (canCreate == OK){
        spawn.memory.queue.shift();
        clearDeadCreepsMemory();
        var isUpper = spawn.memory['want'] == "upper";
        var creepIndex = Memory['creepIndex'] || 0;
        var name = isUpper ? spawn.room.name : spawn.memory['want'][0] + creepIndex++;
        Memory['creepIndex'] = creepIndex % 1000;
        console.log(Game.time + " SPAWN " + spawn.name +
            " creating " + name + " size " + body.length +
            " #creeps " +creepsCount +
            " #WORK " + spawn.memory['workCount'] +
            " maxE " + maxEnergy);
        spawn.createCreep(body, name, {role: spawn.memory['wantRole'] || "no"});
    }
};

Spawn.prototype.schedule = function(name: string){
    if (!this.memory.queue) this.memory.queue = [];
    this.memory.queue.push(name);
};

function wantToSpawn(spawn:Spawn, roomCreeps:Creep[]){
    if (spawn.spawning) return false;
    if (roomCreeps.length > 20) return false;
    return roomCreeps.length < 10 || spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable;
}

function getTotalEnergyCapacity(spawn){
    var spawnOrExtensions = spawn.room.find(FIND_STRUCTURES,
        {filter: s => s.structureType == STRUCTURE_EXTENSION || s.structureType == 'spawn'});
    return _.reduce(spawnOrExtensions, (total, s:Extension|Spawn) => total + s.energyCapacity, 0);
}

function getNextCreepBody(spawn:Spawn, maxEnergy:number, roomCreeps:Creep[]){
    spawn.memory['wantRole'] = undefined;
    var workCount = _.sum(roomCreeps, c => c.getActiveBodyparts(WORK));
    var workCreeps = _.filter(roomCreeps, c => c.getActiveBodyparts(WORK) > 0).length;
    spawn.memory['workCount'] = workCount;
    if (workCount > 16) {
        var q = spawn.memory.queue || (spawn.memory.queue = []);
        if (q.length > 0){
            var order = q[0];
            console.log('received order ' + order);
            spawn.memory['want'] = order;
            spawn.memory['wantRole'] = 'ranger';
            if (order == "tank")
                return Tank.getBody(maxEnergy);
            else if (order == "healer")
                return Healer.getBody(maxEnergy);
            else if (order == "soldier")
                return Soldier.getBody(maxEnergy);
            else if (order == "worker")
                return Creep.makeBody(maxEnergy, [MOVE, CARRY, WORK], 6, [CARRY, MOVE]);
            else {
                console.log("ignored unknown order " + order);
                q.shift();
            }
        }
        else{
            if (Healer.wantHealer(spawn)) {
                spawn.memory['want'] = "healer";
                return Healer.getBody(maxEnergy);
            }
            if (Soldier.wantSoldier(spawn)) {
                spawn.memory['want'] = "soldier";
                return Soldier.getBody(maxEnergy);
            }
            if (Upper.wantUpper(maxEnergy, spawn.room)) {
                spawn.memory['want'] = "upper";
                spawn.memory['wantRole'] = "upper";
                return Upper.getBody(maxEnergy);
            }
            if (workCreeps > 0.7*roomCreeps.length && Transport.wantTransport(maxEnergy, spawn.room)) {
                spawn.memory['want'] = "carrier";
                return Creep.makeBody(maxEnergy, [MOVE, CARRY, CARRY], Math.min(12, workCount+1));
            }
        }
    }
    spawn.memory['want'] = "worker";
    return Creep.makeBody(maxEnergy, [MOVE, CARRY, WORK], Math.min(5, workCount+1), [CARRY, MOVE]);
}

function clearDeadCreepsMemory(){
    for(var c in Memory.creeps){
        if (!Game.creeps[c]) {
            delete Memory.creeps[c];
        }
    }
    for(var creepId in Memory.creepLongMemory){
        if (!Game.getObjectById(creepId)) {
            delete Memory.creepLongMemory[creepId];
        }
    }
}

export var success = true;