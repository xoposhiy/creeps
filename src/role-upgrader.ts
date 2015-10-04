import Role = require('Role');
import Upper = require('role-upper');

class Upgrader extends Role {


    fits(creep:Creep):boolean {
        return creep.carry.energy > 0 &&
            creep.room.controller &&
            creep.room.controller.my &&
            creep.bodyScore([MOVE, CARRY, WORK]) > 0 &&
            //!creep.room.isSpawningTime() &&
            super.fits(creep);
    }

    isTargetActual(creep:Creep, target:GameObject):boolean {
        return (<Structure>target).my;
    }

    getTarget(creep:Creep):any {
        if (!creep.room.controller) return undefined;
        return creep.room.controller.pos.canAssign(creep) ? creep.room.controller : undefined;
    }

    finished(creep:Creep):boolean {
        return creep.carry.energy == 0 || !creep.room.controller || !creep.room.controller.my;
    }

    interactWithTarget(creep:Creep, target:Structure):any {
        var upper = Upper.forRoom(creep.room);
        if (upper && upper.pos.isNearTo(creep.pos) && !upper.pos.isNearTo(target) && target.pos.getAssignedCreeps().length == target.pos.countEmptyTilesAround()){
            creep.assignNewRole(true);
        }
        creep.pickEnergy(['harvester', 'miner', 'reservator', 'builder']);
        return creep.upgradeController(target);
    }
}

export = Upgrader;