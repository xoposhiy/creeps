///<reference path="screeps-extended.d.ts"/>

import roles = require('roles');

var creep = Creep.prototype;

creep.assignNewRole = function (role) {
    return roles.assignNewRole(this, role);
};

creep.getCreepsByRole = roles.getCreepsByRole;

creep.takeEnergyFrom = function (obj:GameObject) {
    if (obj instanceof Energy) return this.pickup(<Energy>obj);
    if (obj instanceof Source) return this.harvest(<Source>obj);
    if (obj['transferEnergy'])
        return obj['transferEnergy'](this);
    else
        throw new Error("Can't take energy from " + obj);
};

creep.bodyScore = function (requiredParts) {
    var creep = this;
    return _.reduce(requiredParts, (score, p) => score * creep.getActiveBodyparts(p), 1);
};

creep.approachAndDo = function (target, work, log) {
    var creep = this;
    if (!target) return false;
    var targetPos = target.pos || target;
    if (!targetPos.assign(creep)) return false;
    if (creep.pos.isNearTo(targetPos)) {
        var res = work();
        return _.isNumber(res) ? res === OK : res;
    }
    else if (creep.fatigue > 0) return true;
    else {
        var moveRes = creep.moveTo(target);
        if (moveRes != OK && log)
            console.log("moveTo " + target + " " + targetPos + " from " + creep.pos + ": " + moveRes);
        return moveRes == OK;
    }
};
export var success = true;