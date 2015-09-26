///<reference path="screeps-extended.d.ts"/>

Room.prototype.isSpawningTime = function isSpawningTime() {
    var spawns = this.find(FIND_MY_SPAWNS);
    return spawns && _.some(spawns, (s:Spawn) => s.memory.wantToSpawn);
};

export var success = true;

