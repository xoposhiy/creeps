///<reference path="screeps-extended.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Role = require('Role');
var Builder = (function (_super) {
    __extends(Builder, _super);
    function Builder() {
        _super.apply(this, arguments);
    }
    Builder.prototype.fits = function (creep) {
        return creep.carry.energy == creep.carryCapacity && creep.bodyScore([MOVE, CARRY, WORK]) > 0 && !creep.room.isSpawningTime() && _super.prototype.fits.call(this, creep);
    };
    Builder.prototype.finished = function (creep) {
        return creep.carry.energy == 0;
    };
    Builder.prototype.isTargetActual = function (creep, target) {
        return target['progressTotal'] || target['hits'] < target['hitsMax'];
    };
    Builder.prototype.interactWithTarget = function (creep, target) {
        if (target['progressTotal'])
            return creep.build(target);
        else
            return creep.repair(target);
    };
    Builder.prototype.scoreBuildTarget = function (creep, t) {
        var hits = t.hits || 0;
        var maxHits = Math.min(150000, t.hitsMax || 1);
        var repairBonus = 20.0 * hits / maxHits;
        var buildingBonus = t.progressTotal ? -20 - (20.0 * t.progress || 0) / (t.progressTotal || 1) : 0;
        var range = t.pos.getRangeTo(creep.pos);
        var rangeBonus = range <= 1 ? -5 : 0;
        return range + rangeBonus + repairBonus + buildingBonus;
    };
    Builder.prototype.getTarget = function (creep) {
        var _this = this;
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES).concat(creep.room.find(FIND_STRUCTURES, { filter: function (s) { return s.hits < Math.min(150000, 2 * s.hitsMax / 3.0) && s.pos.canAssign(creep); } }));
        targets = _.sortBy(targets, function (t) { return _this.scoreBuildTarget(creep, t); });
        return targets[0];
    };
    return Builder;
})(Role);
module.exports = Builder;
//# sourceMappingURL=role-builder.js.map