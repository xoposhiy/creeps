///<reference path="screeps-extended.d.ts"/>

Room.prototype.isSpawningTime = function isSpawningTime() {
    var spawns = this.find(FIND_MY_SPAWNS);
    return spawns && _.some(spawns, (s:Spawn) => s.memory.wantToSpawn);
};

Room.prototype.isPassable = function(pos:RoomPosition){
    return isPassableTile(this.lookAt(pos));
};

function isPassableTile(list){
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

