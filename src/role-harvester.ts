import Role = require('Role');

class Harvester extends Role {

    fits(creep: Creep): boolean {
        return creep.carry.energy < 10 &&
            creep.bodyScore([WORK, WORK, CARRY, MOVE]) > 0 &&
            (!creep.room.controller || !creep.room.controller.my)
            super.fits(creep);
    }

    finished(creep: Creep): boolean {
        return creep.carry.energy == creep.carryCapacity;
    }

    getTarget(creep:Creep): Source|Energy {
        var energy = <Energy>creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
            filter: (e:Energy) => this.needHelpToHarvest(creep, e) && e.pos.canAssign(creep)
        });
        if (energy) return energy;
        var source = <Source>creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (s:Source) => this.isTargetActual(creep, s) && s.pos.canAssign(creep)
        });
        return source;
    }

    private needHelpToHarvest(creep:Creep, e:Source|Energy):boolean {
        var harvesters = <Creep[]>_.map(e.pos.getAssignedCreeps(), (id:string) => <Creep>Game.getObjectById(id));
        var willHarvest = _.reduce(harvesters, (total, h:Creep) => h.id == creep.id ? 0 : h.carryCapacity - h.carry.energy, 0);
        return e.energy > willHarvest;
    }

    isTargetActual(creep:Creep, target:Source|Energy):boolean {
        return target && target.energy && this.needHelpToHarvest(creep, target);
    }

    interactWithTarget(creep:Creep, target:Source|Energy) {
        return creep.takeEnergyFrom(target);
    }
}

export = Harvester;