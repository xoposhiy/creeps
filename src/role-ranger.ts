///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class Ranger extends Role {

    actRange = 0;

    fits(creep:Creep):boolean {
        return this.flag() && Game.flags['go'] && Game.flags['go'].roomName == creep.room.name &&
            creep.bodyScore([MOVE, ATTACK]) > 0 &&
            super.fits(creep);
    }

    isTargetActual(creep:Creep, target:Flag):boolean {
        return target.roomName == creep.room.name;
    }

    getTarget(creep:Creep):GameObject|RoomPosition {
        var flag = this.flag();
        if (!flag) return undefined;
        var dir = Game.map.findExit(creep.room.name, flag.roomName);
        if (dir < 0) return undefined;
        return creep.pos.findClosestByPath(dir);
    }

    flag() : Flag{
        return Game.flags['ranger'];
    }


    finished(creep:Creep):boolean {
        return creep.bodyScore([ATTACK]) == 0 || !this.flag() || this.flag().roomName == creep.room.name;
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        return true;
    }
}

export = Ranger;
