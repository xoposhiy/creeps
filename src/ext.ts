import room = require("ext-Room");
import creep = require("ext-Creep");
import roomPos = require("ext-RoomPosition");
import spawn = require("ext-Spawn");
import structure = require("ext-Structure");

export function extend() {
    return room.success &&
        creep.success &&
        roomPos.success &&
        spawn.success &&
        structure.success;
}
