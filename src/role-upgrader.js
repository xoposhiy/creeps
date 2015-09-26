var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Role = require('Role');
var Upgrader = (function (_super) {
    __extends(Upgrader, _super);
    function Upgrader() {
        _super.apply(this, arguments);
    }
    Upgrader.prototype.fits = function (creep) {
        return creep.carry.energy == creep.carryCapacity && creep.room.controller.my && creep.bodyScore([MOVE, CARRY, WORK]) > 0 && !creep.room.isSpawningTime() && _super.prototype.fits.call(this, creep);
    };
    Upgrader.prototype.isTargetActual = function (creep, target) {
        return target.my;
    };
    Upgrader.prototype.getTarget = function (creep) {
        return creep.room.controller.pos.canAssign(creep) ? creep.room.controller : undefined;
    };
    Upgrader.prototype.finished = function (creep) {
        return creep.carry.energy == 0 || !creep.room.controller.my;
    };
    Upgrader.prototype.interactWithTarget = function (creep, target) {
        return creep.upgradeController(target);
    };
    return Upgrader;
})(Role);
module.exports = Upgrader;
//# sourceMappingURL=role-upgrader.js.map