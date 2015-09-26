var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Role = require('Role');
var Harvester = (function (_super) {
    __extends(Harvester, _super);
    function Harvester() {
        _super.apply(this, arguments);
    }
    Harvester.prototype.fits = function (creep) {
        return creep.carry.energy < 10 && creep.bodyScore([WORK, WORK, CARRY, MOVE]) > 0 && _super.prototype.fits.call(this, creep);
    };
    Harvester.prototype.finished = function (creep) {
        return creep.carry.energy == creep.carryCapacity;
    };
    Harvester.prototype.getTarget = function (creep) {
        var _this = this;
        return creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: function (s) { return _this.isTargetActual(creep, s) && s.pos.canAssign(creep); }
        });
    };
    Harvester.prototype.isTargetActual = function (creep, target) {
        return target && target.energy && (target.energy > 0 || target.ticksToRegeneration < 10);
    };
    Harvester.prototype.interactWithTarget = function (creep, target) {
        return creep.harvest(target);
    };
    return Harvester;
})(Role);
module.exports = Harvester;
//# sourceMappingURL=role-harvester.js.map