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

    getTarget(creep:Creep): Source|Energy {
        var energy = <Energy>creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
            filter: (e:Energy) => e.energy >= 50 && e.pos.canAssign(creep)
        });
        if (energy)
            return energy;
        var source = <Source>creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (s:Source) => this.isTargetActual(creep, s) && s.pos.canAssign(creep)
        });
        return source;
    }

    isTargetActual(creep:Creep, target:Source|Energy):boolean {
        return target && target.energy && target.energy > 0;
    }

    interactWithTarget(creep:Creep, target:Source|Energy) {
        return creep.takeEnergyFrom(target);
    }
}

export = Harvester;