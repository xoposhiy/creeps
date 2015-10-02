import Role = require('Role');

class Warrior extends Role {
    /* TODO:
     лечить себя по ходу
     убивать сначала аттакеров.
     охотиться за хилерами
     бить по тем, кто вне укреплений.
     отходить, если поплохело
     */

    fits(creep:Creep):boolean {
        return creep.bodyScore([ATTACK, MOVE]) > 0 &&
            super.fits(creep);
    }

    finished(creep:Creep):boolean {
        return creep.hits < 2*creep.hitsMax / 3;
    }

    actRange = 3;

    moveCLoser = true;

    getTarget(creep:Creep):GameObject {
        if (creep.bodyScore([RANGED_ATTACK]) > 0) {
            var enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            if (enemies.length)
                return <Creep>_.sortBy(enemies, (e:Creep) => e.hits)[0];
            enemies = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3, {filter: (s:Structure) => s.my == false && s.structureType != 'controller'});
            if (enemies.length) {
                var structure = <Structure>_.sortBy(enemies, (e:Structure) => e.hits)[0];
                return structure;
            }
        }
        var enemy = <Creep>creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: (c:Creep) => c.pos.canAssign(creep)
        });
        var structure = <Structure>creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (s:Structure) => s.my == false && s.structureType != 'controller' && s.structureType != 'keeperLair' && s.pos.canAssign(creep)
        });
        if (enemy && (!structure || creep.pos.getRangeTo(enemy) <= creep.pos.getRangeTo(structure) + 1))
            return enemy;
        else
            return structure;
    }

    isTargetActual(creep:Creep, target:Source|Energy):boolean {
        return false;
    }

    interactWithTarget(creep:Creep, target:Creep|Structure) {
        return creep.rangedAttack(target) | creep.attack(target);
    }
}

export = Warrior;