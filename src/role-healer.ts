import Role = require('Role');

class Healer extends Role {
    waitTimeout():number {
        return 0;
    }

    fits(creep: Creep): boolean {
        return creep.bodyScore([HEAL, MOVE]) > 0 &&
            super.fits(creep);
    }

    finished(creep: Creep): boolean {
        return false;
    }

    getTarget(creep:Creep): GameObject {
        if (creep.hits < creep.hitsMax) return creep;
        return <Creep>creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (c:Creep) => c.hits < c.hitsMax });
    }

    isTargetActual(creep:Creep, target:Creep):boolean {
        return target instanceof Creep && target.hits < target.hitsMax;
    }

    interactWithTarget(creep:Creep, target:Creep) {
        return creep.heal(target);
    }
}

export = Healer;