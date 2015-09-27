///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class Ranger extends Role {

    moveOnTarget = true;

    fits(creep:Creep):boolean {
        return super.fits(creep);
    }

    isTargetActual():boolean {
        return true;
    }

    getTarget(creep:Creep):GameObject|RoomPosition {
        return _.filter(Game.flags, (f:Flag) => f.name.substring(0, 3) == "go-" && f.roomName == creep.room.name)[0];
    }


    finished(creep:Creep):boolean {
        return !this.getTarget(creep);
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        return true;
    }
}

export = Ranger;
