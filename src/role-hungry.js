var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Role = require('Role');
var Hungry = (function (_super) {
    __extends(Hungry, _super);
    function Hungry() {
        _super.apply(this, arguments);
    }
    Hungry.prototype.fits = function (creep) {
        return creep.carry.energy == 0 && creep.bodyScore([MOVE, CARRY]) > 0 && !creep.room.isSpawningTime() && _super.prototype.fits.call(this, creep);
    };
    Hungry.prototype.waitTimeout = function () {
        return 5;
    };
    Hungry.prototype.isTargetActual = function (creep, target) {
        return canObjectBeTarget(target);
    };
    Hungry.prototype.getTarget = function (creep) {
        return creep.pos.findClosestByPath(findEnergySources(creep));
    };
    Hungry.prototype.finished = function (creep) {
        return creep.carry.energy == creep.carryCapacity || creep.room.isSpawningTime();
    };
    Hungry.prototype.interactWithTarget = function (creep, target) {
        return creep.takeEnergyFrom(target);
    };
    return Hungry;
})(Role);
function findEnergySources(creep) {
    var mates = creep.room.find(FIND_MY_CREEPS, { filter: canCreepBeTarget });
    var storages = creep.room.find(FIND_MY_STRUCTURES, { filter: canObjectBeTarget });
    var droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
    return mates.concat(storages).concat(droppedEnergy);
}
function canCreepBeTarget(creep) {
    return ['harvester', 'reservator', 'no', 'cargo', 'scout'].indexOf(creep.memory.role) >= 0 && creep.carry.energy > 30;
}
function canObjectBeTarget(obj) {
    if (obj['carry'])
        return canCreepBeTarget(obj);
    return (obj['store'] ? obj['store']['energy'] : obj['energy']) > 20;
}
module.exports = Hungry;
//# sourceMappingURL=role-hungry.js.map