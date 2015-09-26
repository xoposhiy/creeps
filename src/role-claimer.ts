///<reference path="screeps-extended.d.ts"/>


import Role = require('Role');

class Claimer extends Role {

    fits():boolean {
        return false;
    }

    isTargetActual():boolean {
        return false;
    }

    getTarget():GameObject|RoomPosition {
        var flag = Game.flags['claim'];
        if (!flag || !flag.room) return undefined;
        return flag.room.controller;
    }

    finished():boolean {
        return false;
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        return creep.claimController(<Structure>target);
    }
}

export = Claimer;