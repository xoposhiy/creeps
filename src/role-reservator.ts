///<reference path="lodash.d.ts"/>

import Role = require('Role');

class Reservator extends Role {

    fits(creep:Creep):boolean {
        return creep.carry.energy > 0 &&
            creep.bodyScore([CARRY, MOVE]) > 0 &&
            super.fits(creep);
    }

    isTargetActual(creep:Creep, target:Creep|Spawn|Structure):boolean {
        return !isFull(target) && target.my;
    }

    finished(creep:Creep):boolean {
        return creep.carry.energy == 0;
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        return creep.transferEnergy(<Creep|Spawn|Structure>target);
    }

    getTarget(creep:Creep):GameObject {
        var spawnOrExtension = <GameObject>creep.pos.findClosestByPath(FIND_STRUCTURES,
            {filter: s => (s.structureType == STRUCTURE_EXTENSION || s.structureType == 'spawn') &&
            this.isTargetActual(creep, s)
            });
        if (spawnOrExtension) return spawnOrExtension; //better than storage!
        var storage = <GameObject>creep.pos.findClosestByPath(FIND_STRUCTURES,
            {filter: s => s.structureType == STRUCTURE_STORAGE
            && this.isTargetActual(creep, s)});
        if (storage) return storage;
        return undefined;
    }
}

function isFull(s){
    if (s.energy !== undefined)
        return s.energy == s.energyCapacity;
    else if (s.store !== undefined)
        return s.store.energy == s.storeCapacity;
    else
        throw Error("unknown storage " + s);
}

export = Reservator;