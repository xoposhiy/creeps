import Role = require('Role');

class Cargo extends Role {

    fits(creep:Creep):boolean {
        return creep.carry.energy > 0 &&
            creep.bodyScore([MOVE, CARRY]) > 0 &&
            !creep.room.isSpawningTime() &&
            super.fits(creep);
    }

    isTargetActual(creep:Creep, target:GameObject):boolean {
        var c = <Creep>target;
        return c instanceof Creep && c.memory.role == 'upgrader';
    }

    waitTimeout():number {
        return 0;
    }

    getTarget(creep:Creep):any {
        return creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: c =>
            c.memory.role == 'upgrader' && c.pos.canAssign(creep)
        });
    }

    finished(creep:Creep):boolean {
        return creep.carry.energy == 0 || creep.memory.done;
    }

    interactWithTarget(creep:Creep, target:any):any {
        var result = creep.transferEnergy(target);
        creep.memory.done = result == OK;
        return result;
    }
}

export = Cargo;