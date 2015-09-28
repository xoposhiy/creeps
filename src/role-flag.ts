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
        var flag = this.flag();
        if (flag && flag.room && flag.room.name == creep.room.name) return flag.pos;
        return undefined;
    }
    private flag(){
        return Game.flags['CTF'];
    }

    finished():boolean {
        var flag = this.flag();
        return !flag;
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        console.log('flag-creep came to ' + target);
        return this.flag() && (this.flag().remove() == OK);
    }
}

export = FlagCatcher;
