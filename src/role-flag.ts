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
        if (!flag)
            console.log("no flags.here found!");
        else if (!flag.room)
            console.log("flags.here.room is unknown yet");
        else if (flag.roomName != creep.room.name)
            console.log("flags.here.room is " + flag.roomName + ' while should be ' + creep.room.name);
        else
            return flag.pos;
        return undefined;
    }

    finished(creep:Creep):boolean {
        return !Game.flags['here'] || creep.pos.isNearTo(Game.flags['here'].pos);
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        console.log('flag came to ' + target);
        return creep.say('Im here!');
    }
}

export = Flag;
