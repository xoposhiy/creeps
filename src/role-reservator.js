///<reference path="lodash.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Role = require('Role');
var Reservator = (function (_super) {
    __extends(Reservator, _super);
    function Reservator() {
        _super.apply(this, arguments);
    }
    Reservator.prototype.fits = function (creep) {
        return creep.carry.energy > 0 && creep.bodyScore([CARRY, MOVE]) > 0 && _super.prototype.fits.call(this, creep);
    };
    Reservator.prototype.isTargetActual = function (creep, target) {
        return !isFull(target) && target.my;
    };
    Reservator.prototype.finished = function (creep) {
        return creep.carry.energy == 0;
    };
    Reservator.prototype.interactWithTarget = function (creep, target) {
        return creep.transferEnergy(target);
    };
    Reservator.prototype.getTarget = function (creep) {
        var _this = this;
        var spawnOrExtension = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: function (s) { return (s.structureType == STRUCTURE_EXTENSION || s.structureType == 'spawn') && _this.isTargetActual(creep, s); } });
        if (spawnOrExtension)
            return spawnOrExtension; //better than storage!
        var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_STORAGE && _this.isTargetActual(creep, s); } });
        if (storage)
            return storage;
        return undefined;
    };
    return Reservator;
})(Role);
function isFull(s) {
    if (s.energy !== undefined)
        return s.energy == s.energyCapacity;
    else if (s.store !== undefined)
        return s.store.energy == s.storeCapacity;
    else
        throw Error("unknown storage " + s);
}
module.exports = Reservator;
//# sourceMappingURL=role-reservator.js.map