var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Role = require('Role');
var NoRole = (function (_super) {
    __extends(NoRole, _super);
    function NoRole() {
        _super.apply(this, arguments);
    }
    NoRole.prototype.fits = function () {
        return false;
    };
    NoRole.prototype.waitTimeout = function () {
        return 0;
    };
    NoRole.prototype.isTargetActual = function () {
        return false;
    };
    NoRole.prototype.getTarget = function () {
        return undefined;
    };
    NoRole.prototype.finished = function () {
        return true;
    };
    NoRole.prototype.interactWithTarget = function () {
        return false;
    };
    return NoRole;
})(Role);
module.exports = NoRole;
//# sourceMappingURL=role-no.js.map