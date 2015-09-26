///<reference path="lodash.d.ts"/>

import Role = require('Role');

class Scout extends Role {

    fits(creep:Creep):boolean {
        return creep.carry.energy == 0 && creep.ticksToLive > 200 &&
            creep.bodyScore([WORK, CARRY, MOVE, MOVE]) &&
            super.fits(creep);
    }

    isTargetActual(creep:Creep, target:GameObject):boolean {
        console.log('WAT ' + target);
        return true;
    }

    getTarget(creep:Creep):RoomPosition {
        //var dir = creep.memory.scoutExitDirection || [FIND_EXIT_TOP, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT, FIND_EXIT_RIGHT][Game.time%4];
        var dir = creep.memory.scoutExitDirection || FIND_EXIT_TOP;
        creep.memory.scoutExitDirection = dir;
        return <RoomPosition>creep.pos.findClosestByPath(dir, {filter: pos => pos.canAssign(creep)});
    }

    finished(creep:Creep):boolean {
        return creep.memory.done;
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        if (creep.moveTo(target) == OK)
            creep.memory.done = true;
        return true;
    }
}

export = Scout;