import Role = require('Role');

class Hungry extends Role {

    fits(creep:Creep):boolean {
        return creep.carry.energy == 0 &&
            creep.bodyScore([MOVE, CARRY]) > 0 &&
            super.fits(creep);
    }

    waitTimeout():number {
        return 5;
    }

    isTargetActual(creep:Creep, target:GameObject):boolean {
        return target['energy'] > 20 || target['carry'] && target['carry']['energy'] > 20;
    }

    getTarget(creep:Creep):GameObject {
        return <Energy>creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {filter: (e:Energy) => e.energy > 20}) ||
            <Creep>creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: canCreepBeTarget});
    }

    finished(creep:Creep):boolean {
        return creep.carry.energy == creep.carryCapacity;
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        return creep.takeEnergyFrom(target);
    }
}

function canCreepBeTarget(creep: Creep){
    return ['harvester', 'miner', 'no', 'cargo', 'scout'].indexOf(creep.memory.role) >= 0 && creep.carry.energy > 50;
}


export = Hungry;