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
    else
        throw new Error("Can't take energy from " + obj);
};

Creep.prototype.log = function (message:string) {
    if (Memory.debug && Memory.debug[this.name])
        console.log(Game.time % 100 + ' ' + this + ' ' + this.pos + ' ' + this.memory.role + '   ' + message);
};

Creep.prototype.bodyScore = function (requiredParts: string[]) {
    var creep = <Creep>this;
    return _.reduce(requiredParts, (score, p) => score * creep.getActiveBodyparts(p), 1);
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
    if (creep.fatigue == 0 && (range > actRange || moveCloser) && !targetPos.isEqualTo(creep.pos)) {
        var moveRes = creep.moveTo(target);
        this.log('MOVE ' + targetPos + ' -> ' + moveRes);
        success = success && moveRes == OK;
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

export var success = true;