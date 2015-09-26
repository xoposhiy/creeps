///<reference path="screeps-extended.d.ts"/>
Room.prototype.isSpawningTime = function isSpawningTime() {
    var spawns = this.find(FIND_MY_SPAWNS);
    return spawns && _.some(spawns, function (s) { return s.memory.wantToSpawn; });
};
exports.success = true;
//# sourceMappingURL=ext-Room.js.map