import Role = require('Role');

class Returner extends Role {

    fits(creep:Creep):boolean {
        return (!creep.room.controller || !creep.room.controller.my) &&
            creep.bodyScore([MOVE]) > 0 &&
            super.fits(creep);
    }

    isTargetActual(creep:Creep, target:RoomPosition):boolean {
        return target.roomName == creep.room.name;
    }

    actRange = 0;

    getTarget(creep:Creep):Flag {
        creep.memory.scoutStartRoom = creep.room.name;
        var flags = creep.room.find(FIND_FLAGS, {filter: f => f.color == COLOR_GREEN});
        return <Flag>creep.pos.findClosestByPath(flags);
    }

    finished(creep:Creep):boolean {
        var leaveRoom = creep.memory.scoutStartRoom !== undefined && creep.room.name != creep.memory.scoutStartRoom;
        return leaveRoom || creep.room.controller && creep.room.controller.my;
    }

    interactWithTarget(creep:Creep, target:any):any {
        return true;
    }
}

export = Returner;