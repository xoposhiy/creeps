///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class Flag extends Role {

    fits(creep:Creep):boolean {
        return super.fits(creep);
    }

    isTargetActual():boolean {
        return false;
    }

    getTarget(creep:Creep):GameObject|RoomPosition {
        var flag = Game.flags['here'];
        if (flag && flag.room && flag.room.name == creep.room.name) return flag.pos;
        return undefined;
    }

    finished(creep:Creep):boolean {
        return !Game.flags['here'] || creep.pos.isNearTo(Game.flags['here'].pos);
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        console.log('flag-creep came to ' + target);
        return creep.say('Im here!');
    }
}

export = Flag;
