///<reference path="screeps-extended.d.ts"/>
/*eslint no-unused-vars: 0*/
var Role = (function () {
    function Role() {
    }
    Role.prototype.fits = function (creep) {
        return !!this.getTarget(creep);
    };
    Role.prototype.waitTimeout = function () {
        return 10;
    };
    Role.prototype.isTargetActual = function (creep, target) {
        throw new TypeError();
    };
    Role.prototype.getTarget = function (creep) {
        throw new TypeError();
    };
    Role.prototype.finished = function (creep) {
        throw new TypeError();
    };
    Role.prototype.interactWithTarget = function (creep, target) {
        throw new TypeError();
    };
    Role.prototype.getCachedTarget = function (creep) {
        var cachedTarget = creep.memory.targetId ? Game.getObjectById(creep.memory.targetId) : undefined;
        if (cachedTarget && this.isTargetActual(creep, cachedTarget)) {
            return cachedTarget;
        }
        else if (creep.memory.targetPosition) {
            var p = creep.memory.targetPosition;
            var room = Game.rooms[p.roomName];
            if (!room) {
                console.log('unknown room ' + p.roomName);
                return this.getTarget(creep);
            }
            return room.getPositionAt(p.x, p.y);
        }
        else {
            return this.getTarget(creep);
        }
    };
    Role.prototype.run = function (creep) {
        var _this = this;
        var target = this.getCachedTarget(creep);
        var res = creep.approachAndDo(target, function () { return _this.interactWithTarget(creep, target); }, true);
        creep.memory.rawTarget = target;
        creep.memory.targetId = undefined;
        creep.memory.targetPosition = undefined;
        if (res && target) {
            if (target['id'])
                creep.memory.targetId = target.id;
            else
                creep.memory.targetPosition = target;
        }
        return res;
    };
    Role.prototype.controlCreep = function (creep) {
        if (this.finished(creep)) {
            creep.assignNewRole(true);
        }
        else if (this.run(creep)) {
            creep.memory.startWaitTime = undefined;
        }
        else {
            creep.memory.startWaitTime = creep.memory.startWaitTime || Game.time;
            var t = this.waitTimeout;
            var waitTimeout = t === undefined ? 10 : _.isNumber(t) ? t : t();
            if (creep.memory.startWaitTime + waitTimeout < Game.time) {
                creep.assignNewRole(false);
            }
        }
    };
    return Role;
})();
module.exports = Role;
//# sourceMappingURL=Role.js.map