///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class FlagCatcher extends Role {

    fits(creep:Creep):boolean {
        return super.fits(creep);
    }

    isTargetActual():boolean {
        return false;
    }

    actRange = 0;

    getTarget(creep:Creep):GameObject|RoomPosition {
        var flag = this.flag(creep);
        if (flag && flag.room && flag.room.name == creep.room.name) return flag.pos;
        return undefined;
    }
    private flag(creep:Creep):Flag{
        return Game.flags['CTF'] || Game.flags[creep.name];
    }

    finished(creep:Creep):boolean {
        return !this.flag(creep);
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        var flag = this.flag(creep);
        return flag && (flag.color == COLOR_BLUE || flag.remove() == OK);
    }
}

export = FlagCatcher;
