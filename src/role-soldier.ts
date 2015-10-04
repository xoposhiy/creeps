import Role = require('Role');
import Movements = require('movements');

var damageByRange = {
    1: 10,
    2: 4,
    3: 1
};

var structureFilter = {filter: (s:Structure) => s.my == false && s.structureType != 'controller' && s.structureType != 'keeperLair' };

class Soldier extends Role {
    fits(creep:Creep):boolean {
        return creep.bodyScore([RANGED_ATTACK, MOVE]) > 0 &&
            this.getEnemy(creep);
    }

    finished(creep:Creep):boolean {
        return creep.hits < 2 * creep.hitsMax / 3;
    }

    run(creep:Creep):boolean {
        var rangedAttack =
            this.doRangedAttack(creep, <Creep[]>creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3)) ||
            this.doRangedAttack(creep, <Structure[]>creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3, structureFilter));
        //var closeAttack =
        //    this.doCloseAttackCreeps(creep, <Creep[]>creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)) ||
        //    this.doCloseAttackCreeps(creep, <Structure[]>creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1, structureFilter));
        var moved = this.moveSomewhere(creep);
        return rangedAttack || moved;
    }

    private moveSomewhere(creep:Creep):boolean {
        if (creep.fatigue > 0) return true;
        var enemy = this.getEnemy(creep);
        if (!enemy)return false;
        var targetPos = enemy.pos;
        var r = targetPos.getRangeTo(creep.pos);
        if (r == 3) return true;
        if (r < 3)
        {
            targetPos = Movements.kite(creep.pos, targetPos);
            creep.log("r = " + r+ " kite to " + targetPos);
        }
        if (!targetPos) return false;
        return creep.moveTo(targetPos) == OK;
    }

    private getEnemy(creep) {
        return creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS) ||
            creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, structureFilter);
    }

    private doRangedAttack(creep:Creep, targets:Structure[]|Creep[]):boolean {
        if (!targets.length) return false;
        var massDamage = _.reduce(targets, (t, e:GameObject) => t + damageByRange[e.pos.getRangeTo(creep.pos)], 0);
        creep.log("mass damage: " + massDamage);
        if (massDamage > 10) {
            creep.rangedMassAttack();
        }
        else {
            var rangedAttackTarget = _.sortBy(targets, (e:Structure|Creep) => this.attackCost(e))[0];
            creep.rangedAttack(rangedAttackTarget);
        }
        return true;

    }

    private attackCost(e:Creep|Structure):number {
        var hits = e.hits;
        if (e['getActiveBodyparts']) {
            var c = <Creep>e;
            var attack = c.getActiveBodyparts(ATTACK);
            var rangedAttack = c.getActiveBodyparts(RANGED_ATTACK);
            var heal = c.getActiveBodyparts(HEAL);
            var ramparts = c.room ? _.filter(c.room.lookAt(c.pos), (r:LookAtResult) => r.type == "structure" && r.structure.structureType == "rampart") : [];
            var defence = _.reduce(ramparts, (t, r) => t + r.structure.hits, 0);
            return hits + defence - 5 * attack - 10 * rangedAttack - 12 * heal;
        }
        else
            return hits;
    }

    private doCloseAttackCreeps(creep:Creep, targets:Creep[] | Structure[]):boolean {
        var target = _.sortBy(targets, (e:Creep|Structure) => this.attackCost(e))[0];
        return target && creep.attack(target) == OK;
    }
}

export = Soldier;