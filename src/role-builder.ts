///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class Builder extends Role{

    fits(creep:Creep):boolean {
        return creep.carry.energy == creep.carryCapacity &&
            creep.bodyScore([MOVE, CARRY, WORK]) > 0 && !creep.room.isSpawningTime() &&
            super.fits(creep);
    }

    finished(creep:Creep):boolean {
        return creep.carry.energy == 0;
    }

    isTargetActual(creep:Creep, target:GameObject):boolean {
        return target['progressTotal'] || target['hits'] < target['hitsMax'];
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        if (target['progressTotal']) //ConstructionSite
            return creep.build(<ConstructionSite>target);
        else //Structure
            return creep.repair(<Structure>target);
    }

    scoreBuildTarget(creep: Creep, t:any) {
        var hits = t.hits || 0;
        var maxHits = Math.min(150000, t.hitsMax || 1);
        var repairBonus = 20.0 * hits / maxHits;
        var buildingBonus = t.progressTotal ? -20 - (20.0 * t.progress || 0) / (t.progressTotal || 1) : 0;
        var range = t.pos.getRangeTo(creep.pos);
        var rangeBonus = range <= 1 ? -5 : 0;
        return range + rangeBonus + repairBonus + buildingBonus;
    }
    getTarget(creep:Creep):GameObject {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES).
            concat(creep.room.find(FIND_STRUCTURES, {filter: s => s.hits <  Math.min(150000, 2*s.hitsMax/3.0) && s.pos.canAssign(creep)}));
        targets = _.sortBy(targets, t => this.scoreBuildTarget(creep, t));
        return <GameObject>targets[0];
    }
}

export = Builder;