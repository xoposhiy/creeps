///<reference path="screeps-extended.d.ts"/>
var roomPos = RoomPosition.prototype;
roomPos.countEmptyTilesAround = function () {
    var xMin = Math.max(0, this.x - 1);
    var xMax = Math.min(49, this.x + 1);
    var yMin = Math.max(0, this.y - 1);
    var yMax = Math.min(49, this.y + 1);
    var tiles = Game.rooms[this.roomName].lookAtArea(yMin, xMin, yMax, xMax);
    var spaces = 0;
    for (var x = xMin; x <= xMax; x++)
        for (var y = yMin; y <= yMax; y++)
            if (isPassable(tiles[y][x]) && (x != this.x || y != this.y))
                spaces++;
    return spaces;
};
roomPos.getAssignedCreeps = function () {
    var pos = this;
    Memory.assignedCreeps = Memory.assignedCreeps || {};
    var creeps = Memory.assignedCreeps[pos] || [];
    Memory.assignedCreeps[pos] = _.filter(creeps, function (id) { return isAssigned(id, pos); });
    return Memory.assignedCreeps[pos];
};
roomPos.canAssign = function (creep) {
    var pos = this;
    var creeps = pos.getAssignedCreeps();
    return creeps.indexOf(creep.id) >= 0 || creeps.length < pos.countEmptyTilesAround();
};
/** @param {Creep} creep */
roomPos.assign = function (creep) {
    var pos = this;
    var creeps = pos.getAssignedCreeps();
    if (creeps.indexOf(creep.id) < 0) {
        if (creeps.length >= pos.countEmptyTilesAround())
            return false;
        creeps.push(creep.id);
    }
    creep.memory.targetPos = pos.toString();
    return true;
};
function isAssigned(creepId, pos) {
    var creep = Game.getObjectById(creepId);
    return creep && creep.memory.targetPos == pos.toString();
}
function isPassable(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].type === "terrain" && (list[i].terrain === "wall" || list[i].terrain === "lava"))
            return false;
        if (list[i].type === "structure") {
            switch (list[i].structure.structureType) {
                case STRUCTURE_CONTROLLER:
                case STRUCTURE_EXTENSION:
                case STRUCTURE_KEEPER_LAIR:
                case STRUCTURE_LINK:
                case STRUCTURE_PORTAL:
                case STRUCTURE_WALL:
                case STRUCTURE_STORAGE:
                case STRUCTURE_SPAWN:
                    return false;
                case STRUCTURE_RAMPART:
                    return list[i].structure.my;
                case STRUCTURE_ROAD:
                    return true;
                default:
                    throw Error('Unknown structure type ' + list[i].structure.structureType);
            }
        }
    }
    return true;
}
exports.success = true;
//# sourceMappingURL=ext-RoomPosition.js.map