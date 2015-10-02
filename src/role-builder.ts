///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class Builder extends Role{

    fits(creep:Creep):boolean {
        return creep.carry.energy > 0 &&
            creep.bodyScore([MOVE, CARRY, WORK]) > 0 &&
            !creep.room.isSpawningTime() &&
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

    scoreBuildTarget(creep: Creep, t:GameObject) {
        var range = t.pos.getRangeTo(creep.pos) * 200;
        if (t['progressTotal']){
            var construction = <ConstructionSite>t;
            var cost = (construction.progressTotal - construction.progress) + range;
            return cost;
        }
        else{
            var structure = <Structure>t;
            return this.shouldRepair(structure) ? structure.hits + range : Number.MAX_VALUE
        }
    }

    private shouldRepair(structure: Structure){
        var repairThreshold = Math.max(0.25 * structure.hitsMax, structure.hitsMax - 10000);
        return structure.hits < repairThreshold;
    }

    getTarget(creep:Creep):GameObject {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES).
            concat(creep.room.find(FIND_STRUCTURES, {filter: s => this.shouldRepair(s) && s.pos.canAssign(creep)}));
        targets = _.sortBy(targets, t => this.scoreBuildTarget(creep, t));
        var target = <GameObject>targets[0];
        if (target && Memory.debug && Memory.debug[creep.name])
            console.log("BUILD Target " + target + ' at ' + target.pos + ' cost ' + this.scoreBuildTarget(creep, target));
        return target;
    }
}

export = Builder;