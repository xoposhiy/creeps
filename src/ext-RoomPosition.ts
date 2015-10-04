///<reference path="screeps-extended.d.ts"/>

RoomPosition.prototype.countEmptyTilesAround = function() {
    var xMin = Math.max(0, this.x - 1);
    var xMax = Math.min(49, this.x + 1);
    var yMin = Math.max(0, this.y - 1);
    var yMax = Math.min(49, this.y + 1);
    var tiles = Game.rooms[this.roomName].lookAtArea(yMin, xMin, yMax, xMax);
    var spaces = 0;
    for(var x=xMin; x<=xMax; x++)
        for(var y=yMin; y<=yMax; y++)
            if (isPassable(tiles[y][x]) && (x != this.x || y != this.y)) spaces++;
    return spaces;
};

RoomPosition.prototype.getAssignedCreeps = function (): string[] {
    var pos = this;
    Memory.assignedCreeps = Memory.assignedCreeps || {};
    var creeps = Memory.assignedCreeps[pos] || [];
    Memory.assignedCreeps[pos] = _.filter(creeps, id => isAssigned(id, pos));
    return Memory.assignedCreeps[pos];
};

RoomPosition.prototype.canAssign = function (creep:Creep) {
    var pos = this;
    var creeps = pos.getAssignedCreeps();
    return creeps.indexOf(creep.id) >= 0 || creeps.length < pos.countEmptyTilesAround();
};

RoomPosition.prototype.getArea = function<T>(type:string, radius:number, filter?: (obj:T)=>boolean): T[]{
    var pos = this;
    var matrix = Game.rooms[pos.roomName]
        .lookForAtArea(
            type,
            Math.max(0, pos.y-radius), Math.max(0, pos.x-radius),
            Math.min(49, pos.y+radius), Math.min(49, pos.x+radius));
    var res = _.chain(matrix).values().map(d => _.values(d)).flatten().flatten();
    if (filter)
        res = res.filter(filter);
    return res.value();
};

RoomPosition.prototype.assign = function (creep:Creep, force?:boolean) {
    var pos = this;
    var creeps = pos.getAssignedCreeps();
    if (creeps.indexOf(creep.id) < 0) {
        var hasRoom = creeps.length < pos.countEmptyTilesAround();
        if (hasRoom || force) {
            if (!hasRoom) creeps[0] = creep.id;
            else creeps.push(creep.id);
        }
        else
            return false;
    }
    creep.memory.targetPos = pos.toString();
    return true;
};

function isAssigned(creepId, pos){
    var creep = <Creep>Game.getObjectById(creepId);
    return creep && creep.memory.targetPos == pos.toString();
}

function isPassable(list){
    for (var i = 0; i < list.length; i++) {
        if (list[i].type === "terrain" && (
                list[i].terrain === "wall" || list[i].terrain === "lava"
            ))
            return false;

        if (list[i].type === "structure") {
            switch(list[i].structure.structureType) {
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

export var success = true;