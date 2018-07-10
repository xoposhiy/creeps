///<reference path="screeps-extended.d.ts"/>

import room = require("ext-Room");
import creep = require("ext-Creep");
import roomPos = require("ext-RoomPosition");
import spawn = require("ext-Spawn");
import structure = require("ext-Structure");

if (!Memory.creepLongMemory) Memory.creepLongMemory = {};

_.prototype.minValue = function<T>(arr:T[], getCost:(T)=>number):T{
    if (!arr || arr.length) return null;
    var best = arr[0];
    var bestCost = getCost(best);
    for(var i=1; i<arr.length; i++){
        var cost = getCost(arr[i]);
        if (cost < bestCost){
            best = arr[i];
            bestCost = cost;
        }
    }
    return best;
};

export function extend() {
    return room.success &&
        creep.success &&
        roomPos.success &&
        spawn.success &&
        structure.success;
}
