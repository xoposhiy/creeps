import Role = require('Role');

class Returner extends Role {

    fits(creep:Creep):boolean {
        return (!creep.room.controller || !creep.room.controller.my) && creep.bodyScore([MOVE]) > 0;
    }

    isTargetActual(creep:Creep, target:RoomPosition):boolean {
        return target.roomName == creep.room.name;
    }

    actRange = 0;

    getTarget(creep:Creep):Flag {
        var flags = creep.room.find(FIND_FLAGS, {filter: f => f.color == COLOR_GREEN});
        var flag = <Flag>creep.pos.findClosestByPath(flags);
        return flag;
    }

    finished(creep:Creep):boolean {
        return creep.room.controller && creep.room.controller.my;
    }

    interactWithTarget(creep:Creep, target:any):any {
        return true;
    }
}

export = Returner;