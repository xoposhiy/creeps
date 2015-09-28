///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class Ranger extends Role {

    actRange = 0;

    fits(creep:Creep):boolean {
        return creep.bodyScore([MOVE, ATTACK]) > 0 &&
            super.fits(creep);
    }

    isTargetActual(creep:Creep, target:Flag):boolean {
        return target.roomName == creep.room.name;
    }

    getTarget(creep:Creep):GameObject|RoomPosition {
        var flags = _.filter(Game.flags, (f:Flag) => f.color == COLOR_WHITE && f.roomName == creep.room.name);
        var flag = creep.pos.findClosestByPath(flags);
        return flag;
    }


    finished(creep:Creep):boolean {
        return creep.bodyScore([ATTACK]) == 0 || !this.getTarget(creep);
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        return true;
    }
}

export = Ranger;
