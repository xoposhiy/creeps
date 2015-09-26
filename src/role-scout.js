///<reference path="lodash.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Role = require('Role');
var Scout = (function (_super) {
    __extends(Scout, _super);
    function Scout() {
        _super.apply(this, arguments);
    }
    Scout.prototype.fits = function (creep) {
        return creep.carry.energy == 0 && creep.ticksToLive > 200 && creep.bodyScore([WORK, CARRY, MOVE, MOVE]) && _super.prototype.fits.call(this, creep);
    };
    Scout.prototype.isTargetActual = function (creep, target) {
        console.log('WAT ' + target);
        return true;
    };
    Scout.prototype.getTarget = function (creep) {
        return creep.pos.findClosestByPath(FIND_EXIT_TOP, { filter: function (pos) { return pos.canAssign(creep); } }); //TODO fix!
    };
    Scout.prototype.finished = function (creep) {
        return creep.memory.done;
    };
    Scout.prototype.interactWithTarget = function (creep, target) {
        if (creep.moveTo(target) == OK)
            creep.memory.done = true;
        return true;
    };
    return Scout;
})(Role);
module.exports = Scout;
//# sourceMappingURL=role-scout.js.map