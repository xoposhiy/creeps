import Role = require('Role');

class Warrior extends Role {

    fits(creep: Creep): boolean {
        return creep.bodyScore([ATTACK, MOVE]) > 0 &&
            super.fits(creep);
    }

    finished(creep: Creep): boolean {
        return false;
    }

    getTarget(creep:Creep): GameObject {
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: (c:Creep) => c.pos.canAssign(creep)
        });
        var structures = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: (s:Structure) => s.structureType != 'controller' && s.pos.canAssign(creep)
        });
        return creep.pos.findClosestByPath(enemies.concat(structures));
    }

    isTargetActual(creep:Creep, target:Source|Energy):boolean {
        return true;
    }

    interactWithTarget(creep:Creep, target:Creep|Structure) {
        return creep.attack(target);
    }
}

export = Warrior;