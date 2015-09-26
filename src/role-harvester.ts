import Role = require('Role');

class Harvester extends Role {

    fits(creep: Creep): boolean {
        return creep.carry.energy < 10 &&
            creep.bodyScore([WORK, WORK, CARRY, MOVE]) > 0 &&
            super.fits(creep);
    }

    finished(creep: Creep): boolean {
        return creep.carry.energy == creep.carryCapacity;
    }

    getTarget(creep:Creep): Source {
        return <Source>creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (s:GameObject) => this.isTargetActual(creep, <Source>s) && s.pos.canAssign(creep)
        });
    }

    isTargetActual(creep:Creep, target:Source):boolean {
        return target && target.energy && (target.energy > 0 || target.ticksToRegeneration < 10);
    }

    interactWithTarget(creep:Creep, target:Source) {
        return creep.harvest(target);
    }
}

export = Harvester;