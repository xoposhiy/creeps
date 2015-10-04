///<reference path="screeps-extended.d.ts"/>

import roles = require('roles');
import Role = require('Role');

Creep.prototype.assignNewRole = function (finished:boolean) : Role {
    return roles.assignNewRole(this, finished);
};

Creep.prototype.getRole = function () {
    var roleImpl = roles.impl[this.memory.role || 'no'];
    return roleImpl || roles.impl['no'];
};

Creep.prototype.getCreepsByRole = roles.getCreepsByRole;

Creep.prototype.takeEnergyFrom = function (obj:GameObject) {
    if (obj instanceof Energy) return this.pickup(<Energy>obj);
    if (obj instanceof Source) return this.harvest(<Source>obj);
    if (obj['transferEnergy'])
        return obj['transferEnergy'](this);
    else {
        console.log("Can't take energy from " + obj);
        console.log(new Error()['stack']);
        return false;
    }
};

Creep.prototype.log = function (message:string) {
    if (Memory.debug && Memory.debug[this.name])
        console.log(Game.time % 100 + ' ' + this + ' ' + this.pos + ' ' + this.memory.role + '   ' + message);
};

Creep.prototype.isDebug = function () {
    var creep = this;
    var debug = Memory.debug;
    return debug && (debug[creep.id] || debug[creep.name] || debug[creep.memory.role]);
};

Creep.prototype.bodyScore = function (requiredParts: string[]) {
    var creep = <Creep>this;
    return _.reduce(requiredParts, (score, p) => score * creep.getActiveBodyparts(p), 1);
};

function doRetreat(target, creep) {
    var maxRange = target.getRangeTo(creep.pos);
    var maxPos = creep.pos;
    for (var dx = -1; dx <= 1; dx++)
        for (var dy = -1; dy <= 1; dy++) {
            if (dx == 0 && dy == 0) continue;
            var x = creep.pos.x + dx;
            var y = creep.pos.y + dy;
            if (x < 0 || y < 0 || x > 49 || y > 49) continue;
            var pos = creep.room.getPositionAt(x, y);
            if (!creep.room.isPassable(pos)) continue;
            var r = target.getRangeTo(x, y);
            if (r >= maxRange) {
                maxRange = r;
                maxPos = creep.room.getPositionAt(x, y);
            }
        }
    return {maxRange: maxRange, maxPos: maxPos};
}

Creep.prototype.pickEnergy = function(roles?:string[]):boolean{
    var creep:Creep = this;
    var energyNear = creep.pos.getArea<Energy>("energy", 1);
    if (energyNear.length > 0)
        return creep.pickup(energyNear[0]) == OK;
    if (creep.carry.energy < creep.carryCapacity - 20){
        if (roles) {
            var creepsNear = creep.pos.getArea<Creep>("creep", 1, c => c.carry.energy > 0 && roles.indexOf(c.memory.role) >= 0);
            if (creepsNear.length > 0) return creep.takeEnergyFrom(creepsNear[0]) == OK;
        }
    }
    if (creep.carry.energy == 0){
        var extensionNear = creep.pos.getArea<Extension>("structure", 1, s => s.structureType == "extension" && s.energy > 0);
        if (extensionNear.length > 0)
            creep.takeEnergyFrom(extensionNear[0])
    }

    return false;
};

Creep.prototype.approachAndDo = function (target, work, actRange:number, moveCloser:boolean) {
    var creep = this;
    if (!target) {
        this.log('no target!');
        Memory.statsHang++;
        return false;
    }
    var targetPos = target.pos || target;
    if (!targetPos.assign(creep)) {
        this.log('cant be assigned to ' + targetPos);
        Memory.statsHang++;
        return false;
    }
    var range = creep.pos.getRangeTo(targetPos);
    var success = true;
    var acted = false;
    if (range <= actRange) {
        var res = work();
        this.log('ACT ' + targetPos + ' -> ' + res);
        success = acted = _.isNumber(res) ? res === OK : res;
    }
    if (creep.fatigue > 0)
        this.log('REST ' + targetPos);
    if (creep.fatigue == 0){
        if (range > actRange || moveCloser) {
            var moveRes = creep.moveTo(target);
            this.log('MOVE ' + targetPos + ' -> ' + moveRes);
            success = success && moveRes == OK;
        }
        if (range < actRange) {
            var retreatRes = doRetreat(targetPos, creep);
            var moveRes = creep.move(retreatRes.maxPos);
            this.log('MOVE ' + targetPos + ' -> ' + moveRes);
            success = success && moveRes == OK;
        }
    }
    Memory[acted ? 'statsAct' : 'statsHang']++;
    return success;
};

Creep.prototype.control = function control()
{
    var creep = this;
    if (creep.spawning) return;
    if (creep.hits < creep.hitsMax) creep.heal(creep);
    var role = creep.getRole();
    if (role.finished(creep))
        role = creep.assignNewRole(true);
    if (role.finished(creep)) {
        Memory.statsNo++;
        return;
    } // new role is bad :(
    if (creep.memory.role == 'no')
        Memory.statsNo++;
    if (role.run(creep)) {
        creep.memory.startWaitTime = undefined;
    }
    else {
        creep.memory.startWaitTime = creep.memory.startWaitTime || Game.time;
        if (creep.memory.startWaitTime + role.waitTimeout() < Game.time) {
            creep.assignNewRole(false);
        }
    }
};

Creep.makeBody = function(maxEnergy:number, segment:string[], maxSegmentsCount:number = 100500, startSegment:string[] = [], endSegment:string[] = []):string[]{
    var segmentCost = Creep.bodyCost(segment);
    var energyLeft = maxEnergy - Creep.bodyCost(startSegment) - Creep.bodyCost(endSegment);
    var count = Math.min(maxSegmentsCount, Math.floor(energyLeft / segmentCost));
    var mainBody = _.chain(0).range(count).map(i => segment).flatten().value();
    return startSegment.concat(mainBody).concat(endSegment);
};

Creep.bodypartCost = function(bodypart:string) {
    switch (bodypart) {
        case WORK:
            return 100;
        case CARRY:
        case MOVE:
            return 50;
        case ATTACK:
            return 80;
        case RANGED_ATTACK:
            return 150;
        case HEAL:
            return 250;
        case TOUGH:
            return 10;
        default:
            throw new Error("unknown bodypart " + bodypart);
    }
};

Creep.bodyCost = function(bodyparts:string[]){
    return _.sum(bodyparts, p => Creep.bodypartCost(p));
};

export var success = true;