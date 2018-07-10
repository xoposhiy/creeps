import Role = require('Role');
import Movements = require('movements');

class Healer extends Role {
    fits(creep: Creep): boolean {
        return creep.bodyScore([HEAL, MOVE]) > 0;
    }

    finished(creep: Creep): boolean {
        return false;
    }

    run(creep:Creep):boolean {
        var healPower = creep.getActiveBodyparts(HEAL) * 12;
        var enemies = creep.pos.findInRange<Creep>(FIND_HOSTILE_CREEPS, 4, {filter: (c:Creep) => c.isWarrior()});
        var healTarget = creep.hits <= creep.hitsMax - healPower ? creep : undefined;
        healTarget = healTarget ||
                <Creep>creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (c:Creep) => c.hits <= c.hitsMax - healPower && c.id != creep.id }) ||
                <Creep>creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (c:Creep) => c.id != creep.id });
        if (healTarget){
            if (creep.pos.getRangeTo(healTarget) <= 1)
                creep.heal(healTarget);
            else
                creep.rangedHeal(healTarget);
        }
        if (enemies.length) {
            var kitePos = Movements.getKitePosition(creep.pos, enemies);
            console.log(kitePos);
            creep.moveTo(kitePos);
        }
        else if (healTarget)
            creep.moveTo(healTarget);
        return !!healTarget || enemies.length > 0;
    }

    static getBody(maxEnergy:number){
        return Creep.makeBody(maxEnergy, [HEAL, MOVE]);
    }

    static wantHealer(spawn) {
        var sick = spawn.room.find(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax}).length;
        var healParts = _.sum(<Creep[]>spawn.room.find(FIND_MY_CREEPS), c => c.getActiveBodyparts(HEAL));
        return healParts == 0 && sick > 0;
    }
}

export = Healer;