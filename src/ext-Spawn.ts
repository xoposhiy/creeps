///<reference path="screeps-extended.d.ts"/>

import Miner = require("role-miner");

var bodyPriority = [MOVE, CARRY, WORK];
var bodyWarriorPriority = [ATTACK, RANGED_ATTACK, MOVE, MOVE];

var price = {};
price[WORK]= 100;
price[CARRY]= 50;
price[MOVE]= 50;
price[ATTACK]= 80;
price[RANGED_ATTACK]= 150;
price[HEAL]= 250;
price[TOUGH]= 10;

Spawn.prototype.controlSpawn = function (){
    var spawn = this;
    spawn.memory.wantToSpawn = wantToSpawn(spawn);
    if (!spawn.memory.wantToSpawn) return;
    var creepsCount = spawn.room.find(FIND_MY_CREEPS).length
    if (Game.time % 10 == 0)
        console.log(Game.time + " SPAWN " + spawn.name + " #creeps " + creepsCount + (spawn.memory['wantWarrior'] ? " want Warrior!" : ""));
    var maxEnergy = getTotalEnergyCapacity(this);
    var body = getNextCreepBody(spawn, maxEnergy);
    var canCreate = this.canCreateCreep(body);
    if (canCreate == OK){
        spawn.memory['wantWarrior'] = undefined;
        console.log("SPAWN creep #" + (creepsCount+1) + " body: " + body);
        spawn.memory.nextSpawnTime = Game.time + 60;
        clearDeadCreepsMemory();
        spawn.createCreep(body, 'c' + body.length + '_' + Game.time, {role: 'no'});
    }
};

function wantToSpawn(spawn:Spawn){
    if (spawn.spawning) return false;
    var creepsCount = spawn.room.find(FIND_MY_CREEPS).length;
    if (creepsCount >= 20) {
        return false;
    }
    return spawn.memory.nextSpawnTime == undefined ||
        creepsCount < 5 || Game.time > spawn.memory.nextSpawnTime;
}

function getTotalEnergyCapacity(spawn){
    var spawnOrExtensions = spawn.room.find(FIND_STRUCTURES,
        {filter: s => s.structureType == STRUCTURE_EXTENSION || s.structureType == 'spawn'});
    return _.reduce(spawnOrExtensions, (total, s:Extension|Spawn) => total + s.energyCapacity, 0);
}

function getNextCreepBody(spawn:Spawn, maxEnergy:number){
    var workCount = _.reduce(Game.creeps, (res, c) => res + c.getActiveBodyparts(WORK), 0);
    if (wantWarrior(spawn, workCount))
        return getWarriorBody(maxEnergy);
    if (Miner.wantMiner(spawn, maxEnergy, workCount))
    {
        console.log(spawn + ' want miner!')
        return Miner.getBody();
    }
    return getWorkerBody(spawn, maxEnergy, workCount);
}

function getWorkerBody(spawn:Spawn, maxEnergy:number, workCount:number) {
    var i = 0;
    var bodyWork = 0;
    var body = [];
    var cost = 0;
    var healParts = _.reduce(spawn.room.find(FIND_MY_CREEPS), (t:number, c:Creep) => t + c.getActiveBodyparts(HEAL), 0);
    var wantHealer = maxEnergy > 700 && healParts < 2;
    var reserve = wantHealer ? 300 : 0;
    while (true) {
        var nextPart = bodyPriority[i++ % bodyPriority.length];
        cost += price[nextPart];
        if (cost > maxEnergy - reserve) break;
        if (nextPart == WORK) bodyWork++;
        if (bodyWork > workCount + 1) break;
        body.push(nextPart);
    }
    if (wantHealer) {
        body.push(MOVE);
        body.push(HEAL);
    }
    return body;
}


var wantWarrior = function (spawn, workCount) {
    return spawn.memory.wantWarrior ||
        spawn.room.find(FIND_MY_CREEPS, {filter: c => c.getActiveBodyparts(ATTACK) > 0}).length == 0 && workCount > 1 ||
        spawn.room.find(FIND_HOSTILE_CREEPS, {filter: c => c.getActiveBodyparts(ATTACK) > 0}).length > 0;
};

function getWarriorBody(maxEnergy){
    var segmentPrice = 2*price[MOVE] + price[ATTACK] + price[RANGED_ATTACK];
    if (maxEnergy < segmentPrice) return getSmallWarriorBody(maxEnergy);

    var regEnergy = maxEnergy;
    var healSegmentPrice = price[HEAL] + price[MOVE];
    if (maxEnergy >= segmentPrice + healSegmentPrice)
        regEnergy -= healSegmentPrice;
    var n = Math.floor(regEnergy / segmentPrice);
    var body = [];
    for(var i=0; i<n; i++)
    {
        body.push(ATTACK);
        body.push(RANGED_ATTACK);
    }
    for(var i=0; i<n; i++)
    {
        body.push(MOVE);
        body.push(MOVE);
    }
    if (maxEnergy >= segmentPrice + healSegmentPrice) {
        body.push(MOVE);
        body.push(HEAL);
    }
    return body;
}

function getSmallWarriorBody(maxEnergy){
    var regEnergy = maxEnergy;
    var segmentPrice = price[MOVE] + price[ATTACK];
    var n = Math.floor(regEnergy / segmentPrice);
    var body = [];
    for(var i=0; i<n; i++)
    {
        body.push(ATTACK);
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