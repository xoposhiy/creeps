///<reference path="screeps-extended.d.ts"/>
var roles = require('roles');
var creep = Creep.prototype;
creep.assignNewRole = function (role) {
    return roles.assignNewRole(this, role);
};
creep.getCreepsByRole = roles.getCreepsByRole;
creep.takeEnergyFrom = function (obj) {
    if (obj.transferEnergy !== undefined)
        return obj.transferEnergy(this);
    else
        return this.pickup(obj);
};
creep.bodyScore = function (requiredParts) {
    var creep = this;
    return _.reduce(requiredParts, function (score, p) { return score * creep.getActiveBodyparts(p); }, 1);
};
creep.approachAndDo = function (target, work, log) {
    var creep = this;
    if (!target)
        return false;
    var targetPos = target.pos || target;
    if (!targetPos.assign(creep))
        return false;
    if (creep.pos.isNearTo(targetPos)) {
        var res = work();
        return _.isNumber(res) ? res === OK : res;
    }
    else if (creep.fatigue > 0)
        return true;
    else {
        var moveRes = creep.moveTo(target);
        if (moveRes != OK && log)
            console.log("moveTo " + target + " " + targetPos + " from " + creep.pos + ": " + moveRes);
        return moveRes == OK;
    }
};
exports.success = true;
//# sourceMappingURL=ext-Creep.js.map