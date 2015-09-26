import Role = require('Role');

class Upgrader extends Role {


    fits(creep:Creep):boolean {
        return creep.carry.energy == creep.carryCapacity &&
            creep.room.controller.my &&
            creep.bodyScore([MOVE, CARRY, WORK]) > 0 &&
            !creep.room.isSpawningTime() &&
            super.fits(creep);
    }

    isTargetActual(creep:Creep, target:GameObject):boolean {
        return (<Structure>target).my;
    }

    getTarget(creep:Creep):any {
        return creep.room.controller.pos.canAssign(creep) ? creep.room.controller : undefined;
    }

    finished(creep:Creep):boolean {
        return creep.carry.energy == 0 || !creep.room.controller.my;
    }

    interactWithTarget(creep:Creep, target:any):any {
        return creep.upgradeController(target);
    }
}

export = Upgrader;