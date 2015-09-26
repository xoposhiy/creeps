import Role = require('Role');

class Hungry extends Role {

    fits(creep:Creep):boolean {
        return creep.carry.energy == 0 &&
            creep.bodyScore([MOVE, CARRY]) > 0 &&
            !creep.room.isSpawningTime() &&
            super.fits(creep);
    }

    waitTimeout():number {
        return 5;
    }

    isTargetActual(creep:Creep, target:GameObject):boolean {
        return canObjectBeTarget(target);
    }

    getTarget(creep:Creep):GameObject {
        return creep.pos.findClosestByPath(findEnergySources(creep));
    }

    finished(creep:Creep):boolean {
        return creep.carry.energy == creep.carryCapacity || creep.room.isSpawningTime();
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        return creep.takeEnergyFrom(target);
    }
}

function findEnergySources(creep: Creep): GameObject[]{
    var mates = creep.room.find(FIND_MY_CREEPS,
        {filter: canCreepBeTarget});
    var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: canObjectBeTarget});
    var droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
    return mates.concat(storages).concat(droppedEnergy);
}

function canCreepBeTarget(creep: Creep){
    return ['harvester', 'reservator', 'no', 'cargo', 'scout'].indexOf(creep.memory.role) >= 0 && creep.carry.energy > 30;
}

function canObjectBeTarget(obj: GameObject){
    if (obj['carry'])
        return canCreepBeTarget(<Creep>obj);
    return (obj['store'] ? obj['store']['energy'] : obj['energy']) > 20;
}

export = Hungry;