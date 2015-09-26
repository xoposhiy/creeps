import Role = require('Role');

class Returner extends Role {

    fits(creep:Creep):boolean {
        return (!creep.room.controller || !creep.room.controller.my) && creep.bodyScore([MOVE]) > 0;
    }

    isTargetActual():boolean {
        return true;
    }

    getTarget(creep:Creep):any {
        return creep.pos.findClosestByPath(FIND_EXIT_BOTTOM); //TODO fix!
    }

    finished(creep:Creep):boolean {
        return creep.room.controller && creep.room.controller.my;
    }

    interactWithTarget(creep:Creep, target:any):any {
        return creep.moveTo(target);
    }
}

export = Returner;