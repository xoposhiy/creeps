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
        return <RoomPosition>creep.pos.findClosestByPath(FIND_EXIT_TOP, {filter: pos => pos.canAssign(creep)});  //TODO fix!
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