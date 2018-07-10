///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class Builder extends Role {

    moveCloser = false;

    fits(creep:Creep):boolean {
        return creep.carry.energy > 0 &&
            creep.bodyScore([MOVE, CARRY, WORK]) > 0 &&
                //!creep.room.isSpawningTime() &&
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

    scoreBuildTarget(creep:Creep, t:GameObject) {
        var range = t.pos.getRangeTo(creep.pos) * 200;
        if (t['progressTotal']) {
            var construction = <ConstructionSite>t;
            return (construction.progressTotal - construction.progress) + range;
        }
        else {
            var structure = <Structure>t;
            var decayBonus = 0;
            if (structure.structureType == STRUCTURE_ROAD) decayBonus += 2000;
            if (structure.structureType == STRUCTURE_RAMPART) decayBonus += 20000;
            return this.shouldRepair(structure) ? structure.hits + range - decayBonus : Number.MAX_VALUE
        }
    }

    private shouldRepair(structure:Structure) {
        var isMy = structure.room && structure.room.isMy();
        if (structure.structureType == STRUCTURE_WALL && !isMy) return false;
        if (structure.owner && !structure.my) return false;
        var repairThreshold = Math.max(0.5 * structure.hitsMax, structure.hitsMax - 10000);
        return structure.hits < repairThreshold;
    }

    getTarget(creep:Creep):GameObject {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (s:ConstructionSite) => s.my && s.pos.canAssign(creep)}).
            concat(creep.room.find(FIND_STRUCTURES, {filter: s => this.shouldRepair(s) && s.pos.canAssign(creep)}));
        targets = _.sortBy(targets, t => this.scoreBuildTarget(creep, t));
        var target = <GameObject>targets[0];
        // console.log("BUILD Target " + target + ' at ' + target.pos + ' cost ' + this.scoreBuildTarget(creep, target));
        return target;
    }
}

export = Builder;