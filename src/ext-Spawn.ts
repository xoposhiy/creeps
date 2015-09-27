///<reference path="screeps-extended.d.ts"/>

var bodyPriority = [WORK, MOVE, CARRY];
var bodyWarriorPriority = [ATTACK, MOVE];

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
    if (Game.time % 5 == 0)
        console.log(Game.time + " SPAWN " + spawn.name + " #creeps " + spawn.room.find(FIND_MY_CREEPS).length + (spawn.memory['wantWarrior'] ? " want Warrior!" : ""));
    var maxEnergy = getTotalEnergyCapacity(this);
    var body = getNextCreepBody(spawn, maxEnergy);
    var canCreate = this.canCreateCreep(body);
    if (canCreate == OK){
        spawn.memory['wantWarrior'] = undefined;
        console.log("SPAWN creep #" + (Memory.stats.creeps+1) + " body: " + body);
        spawn.memory.nextSpawnTime = Game.time + 50;
        clearDeadCreepsMemory();
        spawn.createCreep(body, 'c' + body.length + '_' + Game.time, {role: 'no'});
    }
};

function wantToSpawn(spawn){
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
    var bp = bodyPriority;
    spawn.memory['wantWarrior'] = spawn.memory['wantWarrior'] || spawn.room.find(FIND_CREEPS, {filter: c => c.getActiveBodyparts(ATTACK) > 0}).length == 0;
    if (spawn.memory['wantWarrior']){
        bp = bodyWarriorPriority;
    }
    var workCount = _.reduce(Game.creeps, (res, c) => res + c.getActiveBodyparts(WORK), 0);
    var i = 0;
    var bodyWork = 0;
    var body = [];
    var cost = 0;
    while (true){
        var nextPart = bp[i++ % bp.length];
        cost += price[nextPart];
        if (cost > maxEnergy - 50) return body;
        if (nextPart == WORK) bodyWork++;
        if (bodyWork > workCount+1) return body;
        body.push(nextPart);
    }
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