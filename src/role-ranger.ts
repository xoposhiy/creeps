///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class Ranger extends Role {

    moveOnTarget = true;

    fits(creep:Creep):boolean {
        return super.fits(creep);
    }

    isTargetActual(creep:Creep, target:Flag):boolean {
        return target.roomName == creep.room.name;
    }

    getTarget(creep:Creep):GameObject|RoomPosition {
        var flags = _.filter(Game.flags, (f:Flag) => f.name.substring(0, 3) == "go-" && f.roomName == creep.room.name);
        var flag = creep.pos.findClosestByPath(flags);
        return flag;
    }


    finished(creep:Creep):boolean {
        return !this.getTarget(creep);
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        return true;
    }
}

export = Ranger;
