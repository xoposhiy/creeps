var roles = require('roles');
require('spawn');

global.p = function (x, y) {
    return Game.rooms["W12S28"].getPositionAt(x, y);
};

global.scout = function (creepName) {
    Game.creeps[creepName].memory = {'role': 'scout'};
};

RoomPosition.prototype.getFreeNeighboursCount = function () {
    var room = Game.rooms[this.roomName];
    if (!room) return 1;
    var count = 0;
    for (var dx = -1; dx <= 1; dx++)
        for (var dy = -1; dy <= 1; dy++) {
            var x = this.x + dx;
            var y = this.y + dy;
            if (dx == 0 && dy == 0 || x < 0 || y < 0 || x > 49 || y > 49) continue;
            var pos = room.getPositionAt(x, y);
            var isFree = room.lookForAt('terrain', pos)[0] != 'wall' &&
                _.every(room.lookForAt('structure', pos), s => s.isPassable());
            if (isFree) count++;
        }
    return count;
};

Room.prototype.isSpawningTime = function () {
    return _.some(this.find(FIND_MY_SPAWNS), s => s.memory.wantToSpawn);
};

/**
 *
 * @returns {Array}
 */
RoomPosition.prototype.getAssignedCreeps = function () {
    var pos = this;
    Memory.assignedCreeps = Memory.assignedCreeps || {};
    var creeps = Memory.assignedCreeps[pos] || [];
    Memory.assignedCreeps[pos] = _.filter(creeps, id => Game.getObjectById(id) && Game.getObjectById(id).memory.target == pos.toString());
    return Memory.assignedCreeps[pos];
};

RoomPosition.prototype.canAssign = function (creep) {
    var pos = this;
    var creeps = pos.getAssignedCreeps();
    return creeps.indexOf(creep.id) >= 0 || creeps.length < pos.getFreeNeighboursCount();
};

/** @param {Creep} creep */
RoomPosition.prototype.assign = function (creep) {
    var pos = this;
    var creeps = pos.getAssignedCreeps();
    if (creeps.indexOf(creep.id) < 0) {
        if (creeps.length >= pos.getFreeNeighboursCount()) return false;
        creeps.push(creep.id);
    }
    creep.memory.target = pos.toString();
    return true;
};

Spawn.prototype.getStoredEnergy = function () {
    return this.energy;
};


Creep.prototype.assignNewRole = function (role) {
    return roles.assignNewRole(this, role);
};
Creep.prototype.getCreepsByRole = roles.getCreepsByRole;
Creep.prototype.takeEnergyFrom = function (obj) {
    if (obj.transferEnergy !== undefined) return obj.transferEnergy(this);
    else return this.pickup(obj);
};

Creep.prototype.bodyScore = function (requiredParts) {
    var creep = this;
    return _.reduce(requiredParts, (score, p) => score * creep.getActiveBodyparts(p), 1);
};

Creep.prototype.approachAndDo = function (target, work, log) {
    var creep = this;
    if (!target) return false;
    var targetPos = target.pos || target;
    if (!targetPos.assign(creep)) return false;
    if (creep.pos.isNearTo(targetPos)) {
        var res = work();
        return Number.isInteger(res) ? res === OK : res;
    }
    else if (creep.fatigue > 0) return true;
    else {
        var moveRes = creep.moveTo(target);
        if (moveRes != OK && log)
            console.log("moveTo " + target + " " + targetPos + " from " + creep.pos + ": " + moveRes);
        return moveRes == OK;
    }
};

Structure.prototype.getStoredEnergy = function () {
    if (this.store !== undefined) return this.store.energy;
    else return this.energy;
};

Structure.prototype.isPassable = function () {
    return [STRUCTURE_RAMPART, STRUCTURE_ROAD].indexOf(this.structureType) >= 0;
};

Structure.prototype.isPassable = function () {
    return [STRUCTURE_RAMPART, STRUCTURE_ROAD].indexOf(this.structureType) >= 0;
};

Spawn.prototype.isPassable = function () {
    return false;
};

//noinspection JSUnusedGlobalSymbols
Structure.prototype.getEnergyCapacity = function () {
    if (this.store != undefined) return this.storeCapacity;
    else return this.energyCapacity;
};
