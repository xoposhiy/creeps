var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Role = require('Role');
var Cargo = (function (_super) {
    __extends(Cargo, _super);
    function Cargo() {
        _super.apply(this, arguments);
    }
    Cargo.prototype.fits = function (creep) {
        return creep.carry.energy == creep.carryCapacity && creep.bodyScore([MOVE, CARRY]) > 0 && !creep.room.isSpawningTime() && _super.prototype.fits.call(this, creep);
    };
    Cargo.prototype.isTargetActual = function (creep, target) {
        var c = target;
        return c.memory.role == 'upgrader' && c.carry.energy < c.carryCapacity;
    };
    Cargo.prototype.waitTimeout = function () {
        return 0;
    };
    Cargo.prototype.getTarget = function (creep) {
        return creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: function (c) { return c.memory.role == 'upgrader' && c.carry.energy < c.carryCapacity - 5 && c.pos.canAssign(creep); }
        });
    };
    Cargo.prototype.finished = function (creep) {
        return creep.carry.energy == 0;
    };
    Cargo.prototype.interactWithTarget = function (creep, target) {
        return creep.transferEnergy(target);
    };
    return Cargo;
})(Role);
module.exports = Cargo;
//# sourceMappingURL=role-cargo.js.map