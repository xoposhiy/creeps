///<reference path="screeps-extended.d.ts"/>

import Miner = require("role-miner");
import Healer = require("role-healer");
import Upper = require("role-upper");

Spawn.prototype.controlSpawn = function (){
    var spawn = this;
    spawn.memory.wantToSpawn = wantToSpawn(spawn);
    if (!spawn.memory.wantToSpawn) return;
    var creepsCount = spawn.room.find(FIND_MY_CREEPS).length;
    var maxEnergy = getTotalEnergyCapacity(this);
    var body = getNextCreepBody(spawn, maxEnergy);
    if (Game.time % 10 == 0)
        console.log(Game.time + " SPAWN " + spawn.name +
            " want " + spawn.memory['want'] + " size " + body.length +
            " #creeps " +creepsCount +
            " #WORK " + spawn.memory['workCount'] +
            " maxE " + maxEnergy);
    var canCreate = this.canCreateCreep(body);
    if (canCreate == OK){
        console.log(Game.time + " SPAWN " + spawn.name + " creating: " + body);
        spawn.memory.nextSpawnTime = Game.time + 60;
        clearDeadCreepsMemory();
        var isUpper = spawn.memory['want'] == "upper";
        var name = isUpper ? spawn.room.name : spawn.memory['want'][0] + body.length +'_' + Game.time % 1000;
        spawn.createCreep(body, name, {role: isUpper ? 'upper' : 'no'});
    }
};

function wantToSpawn(spawn:Spawn){
    if (spawn.spawning) return false;
    var creepsCount = spawn.room.find(FIND_MY_CREEPS).length;
    if (creepsCount >= 15) return false;
    return creepsCount < 10 || spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable;
}

function getTotalEnergyCapacity(spawn){
    var spawnOrExtensions = spawn.room.find(FIND_STRUCTURES,
        {filter: s => s.structureType == STRUCTURE_EXTENSION || s.structureType == 'spawn'});
    return _.reduce(spawnOrExtensions, (total, s:Extension|Spawn) => total + s.energyCapacity, 0);
}

function getNextCreepBody(spawn:Spawn, maxEnergy:number){
    var workCount = _.sum(<Creep[]>spawn.room.find(FIND_MY_CREEPS), c => c.getActiveBodyparts(WORK));
    spawn.memory['workCount'] = workCount;
    if (Healer.wantHealer(workCount, spawn)) {
        spawn.memory['want'] = "healer";
        return Healer.healerBody(maxEnergy);
    }
    if (wantWarrior(spawn, workCount)) {
        spawn.memory['want'] = "soldier";
        return getWarriorBody(maxEnergy);
    }
    if (Miner.wantMiner(spawn, maxEnergy) && workCount > 2){
        spawn.memory['want'] = "miner";
        return Miner.getBody();
    }
    if (Upper.wantUpper(maxEnergy, spawn.room)){
        spawn.memory['want'] = "upper";
        return Upper.getBody(maxEnergy);
    }
    spawn.memory['want'] = "worker";
    return Creep.makeBody(maxEnergy, [MOVE, CARRY, WORK], workCount+1, [CARRY, MOVE]);
}

var wantWarrior = function (spawn, workCount) {
    if (workCount < 32) return false;
    var opts = {filter: c => c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(ATTACK)};
    var warriors = spawn.room.find(FIND_MY_CREEPS, opts).length;
    var enemies = spawn.room.find(FIND_HOSTILE_CREEPS, opts).length;
    return (enemies > 0 || Game.flags['ranger'] && Game.flags['ranger'].color == COLOR_WHITE) && warriors < 2;
};

function getWarriorBody(maxEnergy){
    var segmentPrice = Creep.bodyCost([MOVE, RANGED_ATTACK]);
    var frontSegmentPrice = Creep.bodyCost([TOUGH, MOVE]);
    if (maxEnergy < segmentPrice + frontSegmentPrice) return getSmallWarriorBody(maxEnergy);
    var regEnergy = maxEnergy - frontSegmentPrice;
    var n = Math.floor(regEnergy / segmentPrice);
    var body = [TOUGH];
    for(var i=0; i<n; i++)
        body.push(RANGED_ATTACK);
    for(var i=0; i<n+1; i++)
        body.push(MOVE);
    return body;
}

function getSmallWarriorBody(maxEnergy){
    var regEnergy = maxEnergy;
    var segmentPrice = Creep.bodyCost([MOVE, RANGED_ATTACK]);
    var n = Math.floor(regEnergy / segmentPrice);
    var body = [];
    for(var i=0; i<n; i++)
    {
        body.push(RANGED_ATTACK);
    }
    for(var i=0; i<n; i++)
    {
        body.push(MOVE);
    }
    console.log(body);
    return body;
}

function clearDeadCreepsMemory(){
    for(var c in Memory.creeps){
        //noinspection JSUnfilteredForInLoop
        if (!Game.creeps[c])
        //noinspection JSUnfilteredForInLoop
            delete Memory.creeps[c];
    }
}

export var success = true;