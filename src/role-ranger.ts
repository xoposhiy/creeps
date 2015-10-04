///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class Ranger extends Role {

    actRange = 0;

    fits(creep:Creep):boolean {
        return this.flag() && Game.flags['go'] && Game.flags['go'].roomName == creep.room.name &&
            creep.bodyScore([MOVE, RANGED_ATTACK]) > 0 &&
            super.fits(creep);
    }

    isTargetActual(creep:Creep, target:RoomPosition):boolean {
        return target.roomName == creep.room.name && Game.time % 11 != 2;
    }

    getTarget(creep:Creep):RoomPosition {
        var flag = this.flag();
        if (!flag) return undefined;
        if (flag.roomName != creep.room.name){
            var dir = Game.map.findExit(creep.room.name, flag.roomName);
            if (dir < 0) return undefined;
            return <RoomPosition>creep.pos.findClosestByPath(dir);
        }
        else{
            return flag.pos;
        }
    }

    flag() : Flag{
        return Game.flags['ranger'];
    }


    finished(creep:Creep):boolean {
        return !this.flag() || this.flag().pos.inRangeTo(creep.pos, 2);
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        return true;
    }
}

export = Ranger;
