var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Role = require('Role');
var Returner = (function (_super) {
    __extends(Returner, _super);
    function Returner() {
        _super.apply(this, arguments);
    }
    Returner.prototype.fits = function (creep) {
        return !creep.room.controller.my && creep.bodyScore([MOVE]) > 0;
    };
    Returner.prototype.isTargetActual = function () {
        return true;
    };
    Returner.prototype.getTarget = function (creep) {
        return creep.pos.findClosestByPath(FIND_EXIT_BOTTOM); //TODO fix!
    };
    Returner.prototype.finished = function (creep) {
        return creep.room.controller.my;
    };
    Returner.prototype.interactWithTarget = function (creep, target) {
        return creep.moveTo(target);
    };
    return Returner;
})(Role);
module.exports = Returner;
//# sourceMappingURL=role-returner.js.map