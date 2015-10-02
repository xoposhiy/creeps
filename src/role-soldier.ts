import Role = require('Role');

var damageByRange = {
    1: 10,
    2: 4,
    3: 1
};

var structureFilter = {filter: (s:Structure) => s.my == false && s.structureType != 'controller' && s.structureType != 'keeperLair' };

class Soldier extends Role {
    /* TODO:
     убивать сначала аттакеров.
     охотиться за хилерами
     бить по тем, кто вне укреплений.
     */

    fits(creep:Creep):boolean {
        return creep.bodyScore([ATTACK, MOVE]) > 0 &&
            this.getEnemy(creep);
    }

    finished(creep:Creep):boolean {
        return creep.hits < 2 * creep.hitsMax / 3;
    }

    run(creep:Creep):boolean {
        var rangedAttack =
            this.doRangedAttack(creep, <Creep[]>creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3)) ||
            this.doRangedAttack(creep, <Structure[]>creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3, structureFilter));
        var closeAttack =
            this.doCloseAttackCreeps(creep, <Creep[]>creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)) ||
            this.doCloseAttackCreeps(creep, <Structure[]>creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1, structureFilter));
        var moved = this.moveSomewhere(creep);
        return rangedAttack || closeAttack || moved;
    }

    private moveSomewhere(creep:Creep):boolean {
        if (creep.fatigue > 0) return true;
        var target = this.getEnemy(creep);
        if (target) {
            var res = creep.moveTo(target);
            return res == OK;
        }
        return false;
    }

    private getEnemy(creep) {
        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS) ||
            creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, structureFilter);
        return target;
    }

    private doRangedAttack(creep:Creep, targets:Structure[]|Creep[]):boolean {
        if (!targets.length) return false;
        var massDamage = _.reduce(targets, (t, e:GameObject) => t + damageByRange[e.pos.getRangeTo(creep.pos)], 0);
        console.log("mass damage: " + massDamage);
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
        console.log(e);
        if (e['getActiveBodyPart']) {
            var c = <Creep>e;
            var attack = c.getActiveBodyparts(ATTACK);
            var rangedAttack = c.getActiveBodyparts(RANGED_ATTACK);
            var heal = c.getActiveBodyparts(HEAL);
            var ramparts = c.room ? _.filter(c.room.lookAt(c.pos), (r:LookAtResult) => r.type == "structure" && r.structure.structureType == "rampart") : [];
            console.log('rs ' + ramparts.length);
            var defence = _.reduce(ramparts, (t, r) => t + r.structure.hits, 0);
            var score = hits + defence - 30 * attack - 10 * rangedAttack - 12 * heal;
            console.log(score + ' ' + e.pos);
            return score;
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